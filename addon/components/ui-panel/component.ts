import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
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
  public uiAsyncBlock: typeof UiAsyncBlock = UiAsyncBlock;

  /**
   * A PromiseLike that will be provided to the UiAsyncBlock component.
   */
  public promise?: PromiseLike<unknown>;

  /**
   * A name for the UiAsyncBlock component. If not provided then the panel heading
   * will be used.
   */
  public name?: string;

  @computed('heading')
  public get hasHeading(): boolean {
    return typeof this.heading === 'string' && this.heading !== '';
  }

  @computed('variant')
  protected get variantClassName() {
    return this.variant ? `panel-${this.variant}` : undefined;
  }
}
