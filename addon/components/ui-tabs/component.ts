import Component from '@ember/component';
import { set } from '@ember/object';
import { layout, tagName, classNames, attribute } from '@ember-decorators/component';
import { HeadingLevels } from '@nsf/ui-foundation/constants';
import template from './template';

/**
 * The `{{ui-tabs}}` component generates a generic tab bar.
 *
 * The `Option` contextual creates generic tabs that will execute `onChange`
 * when interacted with. The first positional is the tab text, and the second
 * is an arbitrary value (primitive or complex, doesn't matter) that will
 * be provided as an argument to `onChange`.
 *
 * ```handlebars
 * {{#ui-tabs onChange=(action this.handleTabChange) as |tabs|}}
 *   {{tabs.Option "Tab A" "Value A"}}
 *   {{tabs.Option "Tab B" "Value B"}}
 * {{/ui-tabs}}
 * ```
 *
 * @class UiTabs
 *
 * @yields {UiTabsOption} Tabs.Option Here is some extra long text that is intentionally being wrapped to
 * the next line in order to see what happens to it. Does it remain with the yields tag above?
 * Let's find out!
 */
@tagName('ul')
@classNames('nav', 'nav-tabs')
@layout(template)
export default class UiTabs extends Component {
  @attribute('aria-role')
  public ariaRole = 'tablist';

  public onChange?: (newTabValue: unknown) => void;

  public selected?: unknown;

  /** The value of the `data-test-id` attribute. */
  @attribute('data-test-id')
  public testId = 'tab-control';

  /** The value of the `aria-label` attribute. */
  @attribute('aria-label')
  public ariaLabel?: string;

  public headingLevel?: HeadingLevels;

  /** @private */
  currentSelection?: unknown;

  /** @private */
  previousSelection?: unknown;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    set(this, 'currentSelection', this.selected);
    set(this, 'previousSelection', this.selected);
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

  protected handleTabSelect(selectedTabValue: unknown) {
    set(this, 'previousSelection', this.currentSelection);
    set(this, 'currentSelection', selectedTabValue);
    set(this, 'selected', selectedTabValue);

    this.maybeTriggerOnChange();
  }

  protected maybeTriggerOnChange() {
    if (this.currentSelection !== this.previousSelection) {
      this.onChange?.(this.currentSelection);
    }
  }
}
