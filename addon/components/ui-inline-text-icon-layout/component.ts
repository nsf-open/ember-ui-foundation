import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import { isPresent } from '@ember/utils';
import { Directions, DirectionsX } from '../../constants';
// @ts-expect-error - template is available at runtime
import template from './template';

/**
 * Provides standardized layout for icon + text components, e.g., buttons, anchors, and
 * their many variants.
 *
 * @class UiInlineTextIconLayout
 */
@tagName('')
@layout(template)
export default class UiInlineTextIconLayout extends Component {
  /**
   * @argument text
   * @type {string}
   */
  text?: string;

  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   *
   * @argument icon
   * @type {string}
   */
  icon?: string;

  /**
   * The placement of the icon, either "left" or "right", relative to the text.
   *
   * @argument iconPlacement
   * @type {"left" | "right"}
   */
  iconPlacement: DirectionsX = Directions.Left;

  /**
   * If true, text will be made screen-reader only at the small breakpoint. This will only apply if
   * an icon has been provided for display.
   *
   * @argument responsive
   * @type {boolean}
   */
  responsive = false;

  /**
   * Whether or not to apply the fixed width modifier to the icon.
   *
   * @argument fw
   * @type {boolean}
   */
  fw = false;

  /**
   * Alias for `UiIcon.spin`.
   *
   * @argument spin
   * @type {boolean}
   */
  spin = false;

  /**
   * For convenience, when set to true the icon will take on the MyNSF standard "loading/pending"
   * animation.
   *
   * @argument pending
   * @type {boolean}
   */
  pending = false;

  /**
   * Tooltip text content. If provided, the standard tooltip icon will be applied.
   *
   * @argument tooltip
   * @type {string}
   */
  tooltip?: string;

  @computed('iconPlacement', 'tooltip')
  get actualIconPlacement() {
    return isPresent(this.tooltip) ? Directions.Right : this.iconPlacement;
  }

  @computed('icon', 'pending', 'tooltip')
  get iconClassName() {
    if (isPresent(this.tooltip)) {
      return 'question-circle';
    }

    return this.pending ? 'spinner' : this.icon;
  }

  @computed('iconClassName')
  get renderIcon() {
    return typeof this.iconClassName === 'string';
  }

  @computed('renderIcon', 'actualIconPlacement')
  get renderIconLeft() {
    return this.renderIcon && this.actualIconPlacement === Directions.Left;
  }

  @computed('renderIcon', 'actualIconPlacement')
  get renderIconRight() {
    return this.renderIcon && this.actualIconPlacement === Directions.Right;
  }

  @computed('responsive', 'renderIcon', 'tooltip', 'renderIconLeft', 'renderIconRight')
  get textClassName() {
    const names = [];

    // Only collapse down to an icon if said icon is actually available and it isn't
    // the generic tooltip icon, which wouldn't give any visual cues to what the
    // button does.
    if (this.responsive && this.renderIcon && !isPresent(this.tooltip)) {
      names.push('hidden-sm-down');
    }

    if (this.renderIconLeft) {
      names.push('fine-ml-5');
    }

    if (this.renderIconRight) {
      names.push('fine-mr-5');
    }

    return names.join(' ');
  }
}
