import Component from '@ember/component';
import classic from 'ember-classic-decorator';
import { set } from '@ember/object';
import { layout, tagName, classNames, attribute } from '@ember-decorators/component';
// @ts-expect-error - template is available at runtime
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
 */
@classic
@tagName('ul')
@classNames('nav', 'nav-tabs')
@layout(template)
export default class UiTabs extends Component {
  /**
   * @argument ariaRole
   * @type string
   * @default "tablist"
   */
  @attribute('aria-role')
  public ariaRole = 'tablist';

  /**
   * @argument onChange
   * @type (newTabValue: any) => void
   */
  public onChange?: (newTabValue: unknown) => void;

  /**
   * @argument selected
   * @type any
   */
  public selected?: unknown;

  /**
   * The value of the `data-test-id` attribute.
   *
   * @argument testId
   * @type string
   * @default "tab-control"
   */
  @attribute('data-test-id')
  public testId = 'tab-control';

  /**
   * The value of the `aria-label` attribute.
   *
   * @argument ariaLabel
   * @type string
   */
  @attribute('aria-label')
  public ariaLabel?: string;

  /**
   * @argument headingLevel
   * @type "1" | "2" | "3" | "4" | "5" | "6"
   */
  public headingLevel?: '1' | '2' | '3' | '4' | '5' | '6';

  currentSelection?: unknown;

  previousSelection?: unknown;

  init() {
    super.init();

    set(this, 'currentSelection', this.selected);
    set(this, 'previousSelection', this.selected);

    // eslint-disable-next-line ember/no-observers
    // addObserver(this, 'selected', this, this.watchSelectedValue);
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

  handleTabSelect(selectedTabValue: unknown) {
    set(this, 'previousSelection', this.currentSelection);
    set(this, 'currentSelection', selectedTabValue);
    set(this, 'selected', selectedTabValue);

    this.maybeTriggerOnChange();
  }

  maybeTriggerOnChange() {
    if (this.currentSelection !== this.previousSelection) {
      this.onChange?.(this.currentSelection);
    }
  }
}
