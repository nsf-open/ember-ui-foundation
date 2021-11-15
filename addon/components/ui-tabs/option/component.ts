import Component from '@ember/component';
import { layout, tagName, attribute, className } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import template from './template';

/**
 * A single tab option. See UiTabs for implementation details.
 *
 * @class UiTabsOption
 */
@tagName('li')
@layout(template)
export default class UiTabsOption extends Component {
  static readonly positionalParams = ['text', 'value'];

  /**
   * The text to be displayed in the tab. This can also be set as the
   * first positional parameter of the component.
   */
  public text!: string;

  /**
   * An arbitrary value (primitive or complex, doesn't matter) that goes
   * along with the tab and will be provided via `onChange` callback. This
   * can also be set as the second positional parameter of the component.
   *
   * If not provided, the tab text will be used.
   */
  @reads('text')
  declare value: unknown;

  /** If disabled, the tab cannot be interacted with. */
  @className
  public disabled = false;

  /**
   * Value of the `data-test-id` attribute of the tab, if needed.
   */
  @attribute('data-test-id')
  public testId = 'tabs-option';

  @attribute('aria-role')
  public ariaRole = 'presentation';

  /** @private */
  headingLevel = null;

  /** @private */
  selectedValue: unknown;

  /** @private */
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
