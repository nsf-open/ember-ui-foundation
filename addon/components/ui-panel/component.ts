import type MessageManager from '@nsf/ui-foundation/lib/MessageManager';
import type { ButtonVariants } from '../../constants';
import Component from '@ember/component';
import { computed, set, action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { layout, tagName } from '@ember-decorators/component';
import { isPromiseLike } from '@nsf-open/ember-general-utils';
import { HeadingLevels, PanelVariants } from '../../constants';
import template from './template';
import UiAsyncBlock from '@nsf/ui-foundation/components/ui-async-block/component';

/**
 * Panels are stylized content blocks with a heading and associated content.
 *
 * ```hbs
 * <UiPanel @heading="Panel Heading">
 * 	<p>Whatever panel body content is required.</p>
 * </UiPanel>
 * ```
 *
 *
 * ## Variants
 * You're not going to need this day-to-day because panel usage is so uniform, but it is possible
 * to alter the Bootstrap variant by setting the second positional parameter, or the `variant`
 * argument. By default, this is "default".
 *
 * ```hbs
 * <UiPanel @heading="Panel Heading" @variant="primary">
 * 	<p>Whatever panel body content is required.</p>
 * </UiPanel>
 * ```
 *
 * ## Headless Panels
 * Sometimes you just want a panel with only a body and no heading.
 * Simply leave off the heading argument.
 *
 * ```hbs
 * <UiPanel>
 * 	<p>Whatever panel body content is required.</p>
 * </UiPanel>
 * ```
 *
 *
 * ## Async Aware Panels
 * The UiPanel will render a UiAsyncBlock instance if provided a promise. A name can also be
 * provided for the AsyncBlock. If a name is not given, but a heading string is available then
 * that will be used instead.
 *
 * ```hbs
 * <UiPanel @name="Albums" @promise={{this.someAlbumLoadingPromise}} as |albums|>
 *   <p>This will render when the promise resolves.</p>
 * </UiPanel>
 * ```
 *
 * If you really need some customization in how the AsyncBlock behaves then you can swap out
 * the default one with your own.
 *
 * > Note that passing the component class directly is only supported in Ember 3.26 and up. In
 * earlier versions, you'll need to supply the string name of the component instead.
 *
 * ```typescript
 * import UiAsyncBlock from '@nsf/ui-foundation/components/ui-async-block/component';
 *
 * class SomeCustomAsyncBlockClass extends UiAsyncBlock {
 *   pendingMessage = () => {
 *     return "Look at me, I'm totally custom!";
 *   };
 * }
 * ```
 *
 * ```hbs
 * <UiPanel
 *   @promise={{this.someAlbumLoadingPromise}}
 *   @uiAsyncBlock={{this.SomeCustomAsyncBlockClass}}
 * as |albums|>
 *   <p>This will render when the promise resolves.</p>
 * </UiPanel>
 * ```
 *
 * The UiAsyncBlock will also take a PromiseLike return value of a collapsable panel's `onOpen`,
 * read more on that in the "Collapsable Panels" section below.
 *
 *
 * ## Messaging Block
 * If needed, UiPanel will provide a UiAlertBlock instance for you - all you need to do is provide
 * the MessageManager.
 *
 * ```handlebars
 * <UiPanel @heading="Hello World" @messageManager={{this.panelMessages}}>
 *   <p>Here is some content</p>
 * </UiModal>
 * ```
 *
 * ```ts
 * import type { MessageManager } from '@nsf/ui-foundation';
 * import { messageManager } from '@nsf/ui-foundation';
 * // ...
 * @messageManager()
 * declare readonly panelMessages: MessageManager;
 * ```
 *
 *
 * ## Collapsable Panels
 *
 * Panels can have their body content shown/hidden via a user controlled toggled when the `collapsed` or
 * `startCollapsed` property is set to a boolean value. Note that there is a subtle difference in how each
 * should be used.
 *
 * ```handlebars
 * {{!-- Use the `collapsed` property when you want programmatic control of the panel's "openness". --}}
 * <UiPanel @heading="Hello World" @collapsed={{this.isPanelCollapsed}}>
 *   <p>Here is some content</p>
 * </UiPanel>
 * ```
 *
 * ```handlebars
 * {{!--
 *   Use the `startCollapsed` property when you want to set the starting position of the toggle when the
 *   panel first renders with a boolean literal.
 * --}}
 * <UiPanel @heading="Hello World" @startCollapsed={{true}}>
 *   <p>Here is some content</p>
 * </UiPanel>
 * ```
 *
 * Two callbacks, `onShow` and `onHidden`, can be provided to the UiPanel. These behave like the UiCollapse
 * component's callbacks of the same name, with `onShow` being run before the opening animation starts, and
 * `onCloses` being run after the closing animation ends.
 *
 * If the `onShow` callback returns a PromiseLike then it will be given to the panel's UiAsyncBlock instance.
 * This makes it really easy to do things like deferred loading of content in collapsed panels that might
 * never be opened. Neat.
 *
 * ```handlebars
 * <UiPanel
 *   @heading="Hello World"
 *   @startCollapsed={{true}}
 *   @onShow={{action this.somePromiseReturningMethod}}
 * as |loadedData|>
 *   <p>{{loadedData}}</p>
 * </UiPanel>
 * ```
 */
@tagName('')
@layout(template)
export default class UiPanel extends Component {
  public static readonly positionalParams = ['heading', 'variant'];

  /**
   * The title text of the panel.
   *
   * This can also be set as the first positional parameter of the component.
   */
  public heading?: string;

  /**
   * The heading level to use, if text is provided.
   */
  public headingLevel = HeadingLevels.H2;

  /**
   * The style variant of the panel is any valid Bootstrap type that you would add after
   * `panel-` in its class attribute (e.g. `primary` for "panel-primary", `success` for
   * "panel-success" and so on).
   *
   * This can also be set as the second positional parameter of the component.
   */
  public variant? = PanelVariants.Default;

  /**
   * Optional CSS class names for the panel heading. This is in addition to "panel-heading"
   * which is always applied.
   */
  public headingClass?: string;

  /**
   * Believe it or not, there are certain times when it is desirable for a panel to not
   * be a panel. When `false`, the "panel-*" wrapping elements will be removed from
   * around the yielded content.
   */
  public renderPanel = true;

  /**
   * The value of the element's `data-test-id` attribute, if required.
   */
  public testId?: string;

  /**
   * A UiAsyncBlock component can be provided if there is a need to really customize
   * the experience.
   */
  public uiAsyncBlock: string | typeof UiAsyncBlock = 'ui-async-block';

  /**
   * A PromiseLike that will be provided to the UiAsyncBlock component.
   */
  public promise?: PromiseLike<unknown>;

  /**
   * A name for the UiAsyncBlock component. If not provided then the panel heading
   * will be used.
   */
  public name?: string;

  /**
   * The ui-modal will conveniently provide you with an ui-alert-block if you give it
   * a message manager instance to control the alert-block with.
   */
  public messageManager?: MessageManager;

  /**
   * If set to a boolean, the panel will be configured as "collapsible" with the boolean
   * being used to toggle it's collapsed/expanded state.
   */
  public collapsed?: boolean;

  /**
   * This is an alias for "collapse" that is safe to be set as a boolean literal directly
   * in the template.
   */
  public startCollapsed?: boolean;

  /**
   * For a collapsing panel, this callback will run when the panel is first toggled to be
   * open, before any animation has begun. If a PromiseLike is returned from the callback
   * it will be given to the panel's UiAsyncBlock instance.
   */
  public onShow?: () => void | PromiseLike<unknown>;

  /**
   * For a collapsing panel, this callback will run once the panel has finished closing.
   */
  public onHidden?: () => void;

  /**
   * Add one or more buttons to the right edge of the panel header.
   *
   * ```handlebars
   * <UiPanel
   *   @heading="User Information"
   *   @headerButtons={{array (hash text="Edit" variant="info" onClick=this.navigateToEdit)}}
   * >
   *   ...
   * </UiPanel>
   * ```
   */
  public headerButtons?: {
    text: string;
    variant: ButtonVariants;
    onClick: () => void;
    disabled?: boolean;
    icon?: string;
    class?: string;
  }[];

  @computed('headerButtons.[]', 'isCollapsible')
  public get hasHeaderButtons() {
    return (this.headerButtons?.length ?? 0) > 0 || this.isCollapsible;
  }

  /**
   * @protected
   */
  declare collapseTargetId: string;

  @computed('heading', 'hasHeaderButtons')
  public get hasHeading(): boolean {
    return (typeof this.heading === 'string' && this.heading !== '') || this.hasHeaderButtons;
  }

  @computed('variant')
  protected get variantClassName() {
    return this.variant ? `panel-${this.variant}` : undefined;
  }

  @computed('collapsed')
  protected get isCollapsible() {
    return typeof this.collapsed === 'boolean';
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    set(this, 'collapseTargetId', `${guidFor(this)}-content`);

    if (typeof this.collapsed !== 'boolean') {
      set(this, 'collapsed', this.startCollapsed);
    }
  }

  @action
  protected toggleCollapsedState() {
    set(this, 'collapsed', !this.collapsed);
  }

  @action
  protected handleCollapsablePanelOpen() {
    const result = this.onShow?.();

    if (isPromiseLike(result)) {
      set(this, 'promise', result);
    }
  }
}
