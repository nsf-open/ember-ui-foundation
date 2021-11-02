import Component from '@ember/component';
import { attribute, layout } from '@ember-decorators/component';
import template from './template';

/**
 * A simple indeterminate "pending" indicator to be used inside of block
 * containers.
 *
 * ```handlebars
 * {{ui-load-indicator "Heavy lifting in progress, one moment please..."}}
 * ```
 *
 * @class UiLoadIndicator
 */
@layout(template)
export default class UiLoadIndicator extends Component {
  public static readonly positionalParams = ['text'];

  /**
   * A descriptive string to be displayed with the indicator. This can also
   * be provided as the first positional parameter.
   *
   * @argument text
   * @type {string}
   * @default "Loading..."
   */
  public text = 'Loading...';

  /**
   * The style of animation to apply to the loading icon.
   *
   * @argument animation
   * @type {"spin" | "pulse"}
   * @default "spin"
   */
  public animation: 'spin' | 'pulse' = 'spin';

  /**
   * The value of the element's `data-test-id` attribute.
   *
   * @argument testId
   * @type {string}
   * @default "load-indicator"
   */
  @attribute('data-test-id')
  public testId?: string = 'load-indicator';
}
