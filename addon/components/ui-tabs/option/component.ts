import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { computed, action, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import template from './template';

/**
 * A single tab option. See UiTabs for implementation details.
 */
@tagName('')
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

  /**
   * If disabled, the tab cannot be interacted with.
   */
  public disabled = false;

  /**
   * Value of the `data-test-id` attribute of the tab, if needed.
   */
  public testId = 'tabs-option';

  /**
   * The `role` of the element. If the parent UiTabs component has a role of
   * `tablist` (the default), then this will always be "presentation".
   */
  public role = 'presentation';

  /**
   *
   */
  public ariaControls?: string;

  /**
   *
   */
  public declare id: string;

  /**
   * @private
   */
  selectedValue: unknown;

  /**
   * @private
   */
  isTabList = true;

  /**
   * @private
   */
  handleTabSelect?: (value: unknown, tabId: string) => void;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    if (!this.id) {
      set(this, 'id', guidFor(this));
    }
  }

  /**
   * A thorough check of whether this tab is the active tab.
   */
  @computed('value', 'selectedValue')
  protected get isActiveTab() {
    return (
      this.selectedValue !== null &&
      this.selectedValue !== undefined &&
      this.selectedValue === this.value
    );
  }

  /**
   * Click event listener for the anchor acting as the tab.
   */
  @action
  protected handleAnchorClick(event: Event) {
    event.preventDefault();

    if (!this.disabled) {
      this.handleTabSelect?.(this.value, this.id);
    }
  }
}
