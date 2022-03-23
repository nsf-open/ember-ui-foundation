import UiContextualContainer, {
  SelectorStrategies,
} from '@nsf/ui-foundation/components/-internals/contextual-container/component';

/**
 * The UiTooltipAttachment component is a specialized version of UiTooltip that does
 * not provide any of its own UI (typically, an icon of some sort) but instead
 * associates itself with whatever parent element it is contained within.
 *
 * ```handlebars
 * <button onclick={{this.handleButtonClick}}>
 *  Click Here <UiIcon @name="question-circle" />
 *
 *  <UiTooltipAttachment>
 *    Here is some more information about what happens when you click this button.
 *    The tooltip created is properly associated with the button via ARIA attributes.
 *  </UiTooltipAttachment>
 * </button>
 * ```
 *
 * By default, the ARIA attribute used is `aria-labelledby`, which may or may not make
 * sense for your specific application. If you need to change it you can do so using the
 * `ariaAttachAs` attribute.
 *
 * ```handlebars
 * <button onclick={{this.handleButtonClick}}>
 *  Click Here <UiIcon @name="question-circle" />
 *
 *  <UiTooltipAttachment @ariaAttachAs="aria-describedby">
 *    Here is some more information about what happens when you click this button.
 *  </UiTooltipAttachment>
 * </button>
 * ```
 */
export default class UiAttachedTooltipContextualContainer extends UiContextualContainer {
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
   * @hidden
   */
  public triggerSelector = SelectorStrategies.PARENT;

  /**
   * @hidden
   */
  public readonly overlayComponent = 'ui-tooltip/element';
}
