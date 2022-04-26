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
   * Value of the tab's `aria-controls` attribute. If set, it should equal the
   * id the of the `role="tabpanel"` element whose content it makes visible.
   */
  public ariaControls?: string;

  /**
   * If true, then the tab's `aria-controls` attribute will be automatically
   * set. Its value will be made available via the `onReady` and `onChange`
   * callbacks and will need to be set as the `id` of the `role="tabpanel"`
   * element whose content it is controlling.
   */
  public fullAriaSupport = false;

  /**
   * Value of the tab's `id` attribute. If not provided, one will be generated.
   */
  public declare id: string;

  /**
   * Called when the tab has rendered and is ready for interaction.
   */
  public onReady?: (value: unknown, tabId: string, controlsId?: string) => void;

  /**
   * Called when the tab is made active.
   */
  public onSelect?: (value: unknown, tabId: string, controlsId?: string) => void;

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
  declare handleTabSelect: (value: unknown, tabId: string, controlsId?: string) => void;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    if (!this.id) {
      set(this, 'id', guidFor(this));
    }

    if (this.fullAriaSupport) {
      set(this, 'ariaControls', `${this.id}-panel`);
    }
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  public didInsertElement() {
    super.didInsertElement();
    this.onReady?.(this.value, this.id, this.ariaControls);
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

    if (!(this.disabled || this.isActiveTab)) {
      this.handleTabSelect(this.value, this.id, this.ariaControls);
      this.onSelect?.(this.value, this.id, this.ariaControls);
    }
  }
}
