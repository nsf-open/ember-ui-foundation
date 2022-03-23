import { computed } from '@ember/object';
import { attribute, className, classNames, tagName } from '@ember-decorators/component';
import { buildFaClassNameString } from '@nsf/ui-foundation/utils';
import UiContextualContainer, {
  SelectorStrategies,
} from '../-internals/contextual-container/component';

/**
 * The UiTooltip component generates an icon that when hovered over with the mouse
 * cursor will display some text context in a styled flyout.
 *
 * ```handlebars
 * <UiTooltip>
 *   This is some description text content.
 * </UiTooltip>
 * ```
 *
 * > __NOTE:__ It is very easy to use this component inappropriately and break accessibility
 * guidelines. Please proceed with caution.
 *
 * Many interactive controls within this library provide built-in support for a tooltip
 * that is correctly accessible, typically via a `tooltip` attribute. You can look at
 * the documentation for UiButton to see an example.
 */
@classNames('fa')
@tagName('span')
export default class UiTooltipContextContainer extends UiContextualContainer {
  public readonly overlayComponent = 'ui-tooltip/element';

  /**
   * The icon to be displayed.
   */
  public icon = 'question-circle';

  /**
   * The amount of time, in milliseconds, between the triggering interaction
   * and when the tooltip is displayed.
   */
  public delay = 200;

  /**
   * The ARIA attribute that will be used to associate the tooltip
   * with the `ariaSelector` element.
   */
  public ariaAttachAs = 'aria-labelledby';

  /**
   * @protected
   */
  triggerSelector = SelectorStrategies.SELF;

  /**
   * The `aria-label` attribute of the icon element.
   */
  @attribute('aria-label')
  public ariaLabel?: string;

  /**
   * The `aria-hidden` attribute of the icon element.
   */
  @attribute('aria-hidden')
  public ariaHidden?: 'true' | 'false';

  /**
   * The `data-test-id` of both the icon element, and the tooltip container.
   */
  @attribute('data-test-id')
  public testId?: string;

  @className()
  @computed('icon')
  get iconClassName() {
    return buildFaClassNameString(this.icon);
  }
}
