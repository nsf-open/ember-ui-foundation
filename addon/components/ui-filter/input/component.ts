import { className, classNames, layout } from '@ember-decorators/component';
import { action } from '@ember/object';
import { empty, or } from '@ember/object/computed';
import Component from '@ember/component';
import template from './template';

/**
 * The UiFilterInput component
 */
@classNames('ui-filter ui-filter-input')
@layout(template)
export default class UiFilterInput extends Component {
  /**
   * The aria-label of the text input.
   */
  public label?: string = 'Filter Input Field';

  /**
   * The text input's title text.
   */
  public title?: string;

  /**
   * The text input's placeholder text.
   */
  public placeholder?: string;

  /**
   * Whether the text input can be interacted with.
   */
  public disabled = false;

  /**
   * Whether to display a clear button to the right of the text input.
   */
  public showClearButton = false;

  /**
   * The name of the icon to use with the close button.
   */
  public clearButtonIcon = 'times';

  /**
   * An array that will be used to populate a menu of options that can
   * be selected to auto-populate the text input.
   */
  public filters?: { label: string; value: string }[];

  protected onValueChange?: (newValue: string, pauseForMore?: boolean) => void;

  protected readonly value?: string;

  protected readonly errorMessage?: string;

  @className('has-error')
  protected readonly showErrorMessage = false;

  @empty('value')
  protected readonly noValue!: boolean;

  @className('input-group')
  @or('showClearButton', 'filters.length')
  protected isInputGroup!: boolean;

  @action
  protected handleInputChange(event: InputEvent): void {
    if (typeof this.onValueChange === 'function') {
      const input = event.target as HTMLInputElement;
      this.onValueChange(input.value || '');
    }
  }

  @action
  protected handleQuerySelection(value: string): void {
    if (typeof this.onValueChange === 'function') {
      this.onValueChange(value || '', false);

      const input = this.element.querySelector('input[type="text"]') as HTMLInputElement;
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }

  @action
  protected handleInputReset(): void {
    if (typeof this.onValueChange === 'function') {
      this.onValueChange('', false);
      (this.element.querySelector('input[type="text"]') as HTMLInputElement).focus();
    }
  }
}
