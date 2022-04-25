import Component from '@ember/component';
import { set, action } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import { guidFor } from '@ember/object/internals';
import { keyNavigator } from '@nsf/ui-foundation/utils';
import template from './template';

/**
 * The `{{ui-tabs}}` component generates a generic tab bar that conforms to the recommendations
 * of [MDN tablists](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role).
 * See further down for alternate usage.
 *
 * The `Option` contextual creates generic tabs that will execute `onChange` when interacted with. Each
 * tab's `text` can be provided as either an argument, or as the yielded body of the component. Each
 * tab should also have a `value` set. The value can be either primitive or complex, it doesn't matter,
 * and it will be provided as an argument to `onChange`.
 *
 * ```handlebars
 * <UiTabs @onChange={{action this.handleTabChange}} as |Tabs|>
 *   <Tabs.Option @text="Tab A" @value="Value A" />
 *   <Tabs.Option @text="Tab B" @value="Value B" />
 * </UiTabs>
 * ```
 *
 * ## Default Selection
 *
 * The "active" tab is determined by matching the current value of the tab list with the value of an
 * individual tab (_it's the same concept as radio buttons within a group_). So, while generally speaking
 * the type of `value` of a tab does not matter - it can be whatever you need it to be - in order for a
 * tab to be "active" it must be something that plays nice with strict equality
 * (_steer clear of proxies, for example_).
 *
 * ```handlebars
 * <UiTabs @selected="B" @onChange={{action this.handleTabChange}} as |Tabs|>
 *   <Tabs.Option @text="Tab A" @value="Value A" />
 *   <Tabs.Option @text="Tab B" @value="Value B" />
 * </UiTabs>
 * ```
 *
 * ## Alternate Usage
 *
 * The default rules of a tablist are pretty specific, and all other things being equal this component
 * tries to cater to those requirements as much as possible. Many times, however, there is a want for
 * some UI to look like a list of tabs, but not actually behave like a tablist - that is where this section
 * comes in.
 *
 * In any case, if you want to disable the tablist behavior then you want to set the `role` of the component
 * to something other than "tablist". By far, the most common alternate usage is to create a navigation bar
 * that looks like a tablist but is not semantically such. For example:
 *
 * ```handlebars
 * <UiTabs @role="navigation" as |Tabs|>
 *   <Tabs.Option>
 *     <LinkTo @route="index">Home</LinkTo>
 *   </Tabs.Option>
 *
 *   <Tabs.Option>
 *     <LinkTo @route="about">About Us</LinkTo>
 *   </Tabs.Option>
 * </UiTabs>
 * ```
 *
 * With the component's role set as "navigation" it is up to the developer to fill in the content of each
 * tab. This is less difficult than it seems, as anchor elements are being used in both cases, as is the
 * "active" class name which the Ember `LinkTo` element also provides (almost as though it were planned...).
 *
 * @yields {UiTabsOption} Tabs.Option
 */
@tagName('')
@layout(template)
export default class UiTabs extends Component {
  /**
   * The `role` attribute of the component.
   */
  public role = 'tablist';

  /**
   *
   */
  public onChange?: (newTabValue: unknown, tabId?: string) => void;

  /**
   *
   */
  public selected?: unknown;

  /**
   * The value of the `data-test-id` attribute.
   */
  public testId = 'tab-control';

  /**
   * The value of the `aria-label` attribute.
   */
  public ariaLabel?: string;

  /**
   * The value of the `value` property of the currently selected tab.
   *
   * @private
   */
  currentSelection?: unknown;

  /**
   * The value of the previously selected tab. This is used
   * along with `currentSelection` to determine if a change
   * actually occurred.
   *
   * @private
   */
  previousSelection?: unknown;

  /**
   * @private
   */
  declare id: string;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    set(this, 'currentSelection', this.selected);
    set(this, 'previousSelection', this.selected);
    set(this, 'id', guidFor(this));
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didUpdateAttrs() {
    super.didUpdateAttrs();

    // currentSelection is updated by handleTabSelect. If these two
    // differ it means that there is a combination of click interactions
    // and set() being used.
    if (this.selected !== this.currentSelection) {
      set(this, 'previousSelection', this.currentSelection);
      set(this, 'currentSelection', this.selected);

      this.maybeTriggerOnChange();
    }
  }

  @action
  protected handleTabSelect(selectedTabValue: unknown, tabId?: string) {
    set(this, 'previousSelection', this.currentSelection);
    set(this, 'currentSelection', selectedTabValue);
    set(this, 'selected', selectedTabValue);

    this.maybeTriggerOnChange(tabId);
  }

  protected maybeTriggerOnChange(tabId?: string) {
    if (this.currentSelection !== this.previousSelection) {
      this.onChange?.(this.currentSelection, tabId);
    }
  }

  @action
  protected handleKeyUp(event: KeyboardEvent) {
    if (this.role === 'tablist') {
      const current = document.activeElement as HTMLElement | undefined;
      const nextTab = keyNavigator(current, `#${this.id} li a`, event.key);

      if (nextTab) {
        nextTab.focus();
      }
    }
  }
}
