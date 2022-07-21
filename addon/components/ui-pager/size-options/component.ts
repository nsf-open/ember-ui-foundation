import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * The UiPagerSizeOptions component is a simple HTML select that reports its selected
 * value back to its parent UiPager instance.
 */
@tagName('')
@layout(template)
export default class UiPagerSizeOptions extends Component {
  /**
   * The value of the select element's `aria-label` attribute.
   */
  public ariaLabel?: string = 'Items to show per page';

  /**
   * The value of the select element's `aria-controls` attribute.
   */
  public ariaControls?: string;

  /**
   * Whether interaction with the select is allowed.
   */
  public disabled = false;

  /**
   * An array of objects that will be used to populate the select element's options.
   * Each much contain `label` and `value` strings.
   */
  public options?: { label: string; value: string };

  /**
   * The value of the options that will be marked as selected. Numbers will be cast
   * to their string representation.
   */
  public selected?: string | number;

  /**
   * A callback that will receive the newly selected value whenever it changes.
   */
  public onSelection?: (newValue: number) => void;

  /**
   * The value of the select element's `data-test-id` attribute.
   */
  public testId?: string;

  @computed('selected')
  protected get stringSelected() {
    return String(this.selected ?? '').trim();
  }

  @action
  protected handleInput(event: InputEvent) {
    const value = (event.target as HTMLSelectElement).value;
    this.onSelection?.(parseInt(value, 10));
  }
}
