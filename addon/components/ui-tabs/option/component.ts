import Component from '@ember/component';
import { layout, tagName, attribute, className } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
// @ts-expect-error - template is available at runtime
import template from './template';

/**
 * A single tab option.
 *
 * ```handlebars
 * {{tabs.option "Tab A" "valueA" disabled=false}}
 * ```
 *
 * @class UiTabsTab
 */
@tagName('li')
@layout(template)
export default class UiTabsOption extends Component {
  static readonly positionalParams = ['text', 'value'];

  /**
   * The text to be displayed in the tab. This can also be set as the
   * first positional parameter of the component.
   *
   * @argument text
   * @type string
   * @required
   */
  public text!: string;

  /**
   * An arbitrary value (primitive or complex, doesn't matter) that goes
   * along with the tab and will be provided via `onChange` callback. This
   * can also be set as the second positional parameter of the component.
   *
   * If not provided, the tab text will be used.
   *
   * @argument value
   * @type any
   */
  @reads('text')
  declare value: unknown;

  /**
   * Whether the tab can be interacted with.
   *
   * @argument disabled
   * @type boolean
   * @default false
   */
  @className
  public disabled = false;

  public headingLevel = null;

  @attribute('aria-role')
  public ariaRole = 'presentation';

  @attribute('data-test-id')
  public testId = 'tabs-option';

  selectedValue: unknown;

  handleTabSelect?: (value: unknown) => void;

  @computed('value', 'selectedValue')
  get isActiveTab() {
    return (
      this.selectedValue !== null &&
      this.selectedValue !== undefined &&
      this.selectedValue === this.value
    );
  }

  handleAnchorClick(event: Event) {
    event.preventDefault();
    this.handleTabSelect?.(this.value);
  }
}
