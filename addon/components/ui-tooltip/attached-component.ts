import UiContextualContainer, {
  SelectorStrategies,
} from '@nsf/ui-foundation/components/-internals/contextual-container/component';

/**
 * The UiTooltipAttachment component is a specialized version of UiTooltip that does
 * not provide any of its own UI (typically, a circled question mark icon) but instead
 * attaches its triggers to whatever parent element it is contained within.
 *
 * @class UiAttachedTooltipContextualContainer
 * @extends UiContextualContainer
 */
export default class UiAttachedTooltipContextualContainer extends UiContextualContainer {
  /**
   * The amount of time, in milliseconds, between the triggering interaction
   * and when the tooltip is displayed.
   *
   * @argument delay
   * @type {number}
   * @default 200
   * @public
   */
  public delay = 200;

  /**
   * The ARIA attribute that will be used to associate the tooltip
   * with the `ariaSelector` element.
   *
   * @argument ariaAttachAs
   * @type {string}
   * @default "aria-labelledby"
   * @public
   */
  public ariaAttachAs = 'aria-labelledby';

  /**
   * @argument triggerSelector
   * @type {SelectorStrategies}
   * @default "self"
   * @public
   */
  public triggerSelector = SelectorStrategies.PARENT;

  /**
   * @argument overlayComponent
   * @type {string}
   * @default "ui-tooltip/element"
   * @public
   * @readonly
   */
  public readonly overlayComponent = 'ui-tooltip/element';
}
