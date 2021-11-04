import type { DirectionsX } from '@nsf/ui-foundation/constants';
import AsyncAwareComponent from '@nsf/ui-foundation/components/-internals/async-aware-component';
import { computed, set } from '@ember/object';
import { not, or, reads } from '@ember/object/computed';
import { attribute, className, layout, tagName } from '@ember-decorators/component';
import { ButtonVariants, Directions, SizeVariants } from '@nsf/ui-foundation/constants';
import template from './template';

/**
 * An HTML button element with MyNSF specific styling and functionality.
 *
 *
 * ## The Basics
 * You'll want to provide content to `text` and a Bootstrap `variant` for styling.
 * These can also be set as the first and second positional parameters of the
 * component.
 *
 * ```handlebars
 * {{ui-button "Hello World" "primary" onClick=(action this.doSomething) disabled=false}}
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
 *
 * @class UiButton
 * @extends AsyncAwareComponent
 * @public
 */
@tagName('button')
@layout(template)
export default class UiButton extends AsyncAwareComponent {
  public static readonly positionalParams = ['text', 'variant'];

  /**
   * The text content of the button. This may also be set as the first positional
   * parameter of the component.
   *
   * @argument text
   * @type {string}
   * @required
   */
  @reads('_defaultText')
  public text?: string;

  /**
   * The style variant of the button is any valid Bootstrap type that you would add after
   * `btn-` in it's class attribute (e.g. `primary` for "btn-primary", `success` for "btn-success"
   * and so on). This may also be set as the second positional parameter of the component.
   *
   * @argument variant
   * @type {ButtonVariants}
   * @required
   */
  @reads('_defaultVariant')
  public variant?: ButtonVariants;

  /**
   * May be either "sm" or "lg" corresponding to Bootstrap's size variants.
   *
   * @argument size
   * @type {SizeVariants}
   */
  public size?: SizeVariants;

  /**
   * A boolean that toggles the Bootstrap "block" style variant of the element.
   *
   * @argument block
   * @type {boolean}
   * @default false
   */
  @className('btn-block')
  public block = false;

  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   *
   * @argument icon
   * @type {string}
   */
  public icon?: string;

  /**
   * The placement of the icon, either "left" or "right", relative to the
   * text.
   *
   * @argument iconPlacement
   * @type {"left" | "right"}
   * @default "left"
   */
  public iconPlacement: DirectionsX = Directions.Left;

  /**
   * A boolean that toggles the element's "active" class.
   *
   * @argument active
   * @type {boolean}
   * @default false
   */
  @className('active')
  public active = false;

  /**
   * Disables the element.
   *
   * @argument disabled
   * @type {boolean}
   * @default false
   */
  public disabled = false;

  /**
   * The value of the element's `title` attribute.
   *
   * @argument title
   * @type {string}
   */
  @attribute
  public title?: string;

  /**
   * The value of the element's `type` attribute. May be either "button" or "submit".
   *
   * @argument type
   * @type {"button" | "submit"}
   * @default "button"
   */
  @attribute
  public type = 'button';

  /**
   * The value of the element's `data-test-id` attribute, if required.
   *
   * @argument testId
   * @type {string}
   */
  @attribute('data-test-id')
  public testId?: string;

  /**
   * If true, text will be made screen-reader only at the small breakpoint. This
   * will only apply if an icon has been provided for display.
   *
   * @argument responsive
   * @type {boolean}
   * @default true
   */
  public responsive = true;

  /**
   * The value of the element's `aria-expanded` attribute. A string "true" or "false".
   *
   * @argument ariaExpanded
   * @type {string}
   */
  @attribute('aria-expanded')
  public ariaExpanded?: string;

  /**
   * The value of the element's `aria-label` attribute.
   *
   * @argument ariaLabel
   * @type {string}
   * @default undefined
   */
  @attribute('aria-label')
  public ariaLabel?: string;

  /**
   * The value of the element's `aria-labelledby` attribute.
   *
   * @argument ariaLabelledBy
   * @type {string}
   */
  @attribute('aria-labelledby')
  public ariaLabelledBy?: string;

  /**
   * The value of the element's `aria-describedby` attribute.
   *
   * @argument ariaDescribedBy
   * @type {string}
   */
  @attribute('aria-describedby')
  public ariaDescribedBy?: string;

  /**
   * The value of the element's `aria-controls` attribute.
   *
   * @argument ariaControls
   * @type {string}
   */
  @attribute('aria-controls')
  public ariaControls?: string;

  /**
   * The value of the element's `aria-selected` attribute.
   *
   * @argument ariaSelected
   * @type {string}
   */
  @attribute('aria-selected')
  public ariaSelected?: string;

  /**
   * The value of the element's `aria-haspopup` attribute.
   *
   * @argument ariaHasPopup
   * @type {string}
   */
  @attribute('aria-haspopup')
  public ariaHasPopup?: string;

  /**
   * The value of the element's `tabindex` attribute.
   *
   * @argument tabIndex
   * @type {string}
   */
  @attribute('tabindex')
  public tabIndex?: string;

  /**
   * You can use `onClick` in place of `click` to return a promise to the button
   * instance. Doing so will cause the button to go into an indeterminate "processing"
   * state until the promise settles.
   *
   * @argument onClick
   * @type {(event: Event) => any}
   * @default undefined
   */
  public onClick?: (event: Event) => void | Promise<unknown>;

  @className
  btnClassName = 'btn';

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
    this._libraryOnClick?.();
    set(this, 'promise', this.onClick?.(event) ?? undefined);
  }

  /**
   * A private method for use by the MyNSF component libraries so that this button
   * component may be reused as needed without effecting how the consumer uses it.
   *
   * @argument _libraryOnClick
   * @type function
   * @private
   */
  _libraryOnClick?: () => void;
}
