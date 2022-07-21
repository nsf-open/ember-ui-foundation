import type { DirectionsX } from '@nsf-open/ember-ui-foundation/constants';
import AsyncAwareComponent from '@nsf-open/ember-ui-foundation/components/-internals/async-aware-component';
import { computed, set } from '@ember/object';
import { not, or, reads } from '@ember/object/computed';
import { attribute, className, layout, tagName } from '@ember-decorators/component';
import { ButtonVariants, Directions, SizeVariants } from '@nsf-open/ember-ui-foundation/constants';
import template from './template';

/**
 * An HTML button element with NSF specific styling and functionality.
 *
 *
 * ## The Basics
 * You'll want to provide content to `text` and a Bootstrap `variant` for styling.
 * These can also be set as the first and second positional parameters of the
 * component if you're using moustache syntax.
 *
 * ```handlebars
 * {{ui-button "Hello World" "primary" onClick=(action this.doSomething) disabled=false}}
 *
 * <UiButton
 *   @text="Hello World"
 *   @variant="primary"
 *   @onClick={{action this.doSomething}}
 *   @disabled={{false}}
 * />
 * ```
 *
 * You'll probably want to do something when the button is clicked, so go ahead and
 * provide an action to `onClick`. Another useful argument is `disabled` which sounds
 * exactly like what it does.
 *
 *
 * ## Icons
 * This library uses Font Awesome 4, so any icon in that library can be displayed in a button.
 * Note that you do not need to pass the `fa-` prefix along with the icon name. It won't
 * hurt anything if you do, but the button can take care of it so let it. By default, icons
 * will be displayed _before_ - to the left of - provided text. It shouldn't come up often,
 * but if you need the icon to be shown _after_ then you'll need to set `iconPlacement="right"`.
 *
 * ```handlebars
 *
 * {{ui-button "Search" "primary" icon="search" iconPlacement="left"}}
 * ```
 *
 *
 * ## Conveying "Action"
 * Buttons can show a loading spinner for you if you give them the right info. There are two ways:
 *
 * 1. You can return a promise-like from the `onClick` action.
 * 2. You can set the `promise` argument manually when needed.
 *
 * In either case, the button will disable and present a loading spinner until the promise settles.
 */
@tagName('button')
@layout(template)
export default class UiButton extends AsyncAwareComponent {
  public static readonly positionalParams = ['text', 'variant'];

  /**
   * The text content of the button. This may also be set as the first positional
   * parameter of the component.
   */
  @reads('_defaultText')
  public text?: string;

  /**
   * The style variant of the button is any valid Bootstrap type that you would add after
   * `btn-` in its class attribute (e.g. `primary` for "btn-primary", `success` for "btn-success"
   * and so on). This may also be set as the second positional parameter of the component.
   */
  @reads('_defaultVariant')
  public variant?: ButtonVariants;

  /**
   * May either be "sm" or "lg" corresponding to Bootstrap's size variants.
   */
  public size?: SizeVariants;

  /**
   * A boolean that toggles the Bootstrap "block" style variant of the element.
   */
  @className('btn-block')
  public block = false;

  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   */
  public icon?: string;

  /**
   * The placement of the icon, either "left" or "right", relative to the
   * text.
   */
  public iconPlacement: DirectionsX = Directions.Left;

  /**
   * A boolean that toggles the element's "active" class.
   */
  @className('active')
  public active = false;

  /**
   * Disables the element.
   */
  public disabled = false;

  /**
   * The value of the element's `title` attribute.
   */
  @attribute
  public title?: string;

  /**
   * The value of the element's `type` attribute.
   */
  @attribute
  public type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * The value of the element's `data-test-id` attribute, if required.
   */
  @attribute('data-test-id')
  public testId?: string;

  /**
   * If true, text will be made screen-reader only at the small breakpoint. This
   * will only apply if an icon has been provided for display.
   */
  public responsive = true;

  /**
   * The value of the element's `aria-expanded` attribute. A string "true" or "false".
   */
  @attribute('aria-expanded')
  public ariaExpanded?: string;

  /**
   * The value of the element's `aria-label` attribute.
   */
  @attribute('aria-label')
  public ariaLabel?: string;

  /**
   * The value of the element's `aria-labelledby` attribute.
   */
  @attribute('aria-labelledby')
  public ariaLabelledBy?: string;

  /**
   * The value of the element's `aria-describedby` attribute.
   */
  @attribute('aria-describedby')
  public ariaDescribedBy?: string;

  /**
   * The value of the element's `aria-controls` attribute.
   */
  @attribute('aria-controls')
  public ariaControls?: string;

  /**
   * The value of the element's `aria-selected` attribute.
   */
  @attribute('aria-selected')
  public ariaSelected?: string;

  /**
   * The value of the element's `aria-haspopup` attribute.
   */
  @attribute('aria-haspopup')
  public ariaHasPopup?: string;

  /**
   * The value of the element's `tabindex` attribute.
   */
  @attribute('tabindex')
  public tabIndex?: string;

  /**
   * You can use `onClick` in place of `click` to return a promise to the button
   * instance. Doing so will cause the button to go into an indeterminate "processing"
   * state until the promise settles.
   */
  public onClick?: (event: Event) => void | Promise<unknown>;

  @className
  protected btnClassName = 'btn';

  @not('disableButton')
  declare readonly enabled: boolean;

  @className('disabled')
  @attribute('disabled')
  @or('disabled', 'isPending')
  declare readonly disableButton: boolean;

  @className
  @computed('size')
  get sizeClassName() {
    return this.size ? `btn-${this.size}` : undefined;
  }

  @className
  @computed('variant')
  get variantClassName() {
    return this.variant ? `btn-${this.variant}` : undefined;
  }

  click(event: Event) {
    if (!this.disableButton) {
      this._libraryOnClick?.();
      set(this, 'promise', this.onClick?.(event) ?? undefined);
    }
  }

  /**
   * A private method for use by component libraries so that this button
   * component may be reused as needed without effecting how the consumer uses it.
   *
   * @private
   */
  _libraryOnClick?: () => void;
}
