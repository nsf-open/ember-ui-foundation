import { attribute, tagName } from '@ember-decorators/component';
import UiContextualContainer, {
  SelectorStrategies,
} from '@nsf/ui-foundation/components/-internals/contextual-container/component';

/**
 * @class UiTooltip
 * @extends UiContextualContainer
 */
@tagName('span')
export default class UiTooltipContextContainer extends UiContextualContainer {
  public classNames = ['fa', 'fa-question-circle'];

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
  public triggerSelector = SelectorStrategies.SELF;

  /**
   * @argument ariaLabel
   * @type {string}
   * @default undefined
   * @public
   */
  @attribute('aria-label')
  public ariaLabel?: string;

  /**
   * @argument ariaHidden
   * @type {"true" | "false"}
   * @default undefined
   * @public
   */
  @attribute('aria-hidden')
  public ariaHidden?: 'true' | 'false';

  /**
   * @argument testId
   * @type {string}
   * @default undefined
   * @public
   */
  @attribute('data-test-id')
  public testId?: string;

  /**
   * @argument overlayComponent
   * @type {string}
   * @default "ui-tooltip/element"
   * @public
   * @readonly
   */
  public readonly overlayComponent = 'ui-tooltip/element';
}
