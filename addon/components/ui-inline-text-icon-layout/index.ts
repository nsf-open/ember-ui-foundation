import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';
import { Directions, DirectionsX } from '../../constants';

interface Args {
  text?: string;
  icon?: string;
  iconPlacement?: DirectionsX;
  responsive?: boolean;
  fw?: boolean;
  spin?: boolean;
  pending?: boolean;
  tooltip?: string;
}

/**
 * Provides standardized layout for icon + text components, e.g., buttons, anchors, and
 * their many variants.
 *
 * @class UiInlineTextIconLayout
 */
export default class UiInlineTextIconLayout extends Component<Args> {
  /**
   * @argument text
   * @type {string}
   */

  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   *
   * @argument icon
   * @type {string}
   */

  /**
   * The placement of the icon, either "left" or "right", relative to the text.
   *
   * @argument iconPlacement
   * @type {"left" | "right"}
   */

  /**
   * If true, text will be made screen-reader only at the small breakpoint. This will only apply if
   * an icon has been provided for display.
   *
   * @argument responsive
   * @type {boolean}
   */

  /**
   * Whether or not to apply the fixed width modifier to the icon.
   *
   * @argument fw
   * @type {boolean}
   */

  /**
   * Alias for `UiIcon.spin`.
   *
   * @argument spin
   * @type {boolean}
   */

  /**
   * For convenience, when set to true the icon will take on the MyNSF standard "loading/pending"
   * animation.
   *
   * @argument pending
   * @type {boolean}
   */

  /**
   * Tooltip text content. If provided, the standard tooltip icon will be applied.
   *
   * @argument tooltip
   * @type {string}
   */

  get actualIconPlacement() {
    return isPresent(this.args.tooltip)
      ? Directions.Right
      : this.args.iconPlacement ?? Directions.Left;
  }

  get iconClassName() {
    if (isPresent(this.args.tooltip)) {
      return 'question-circle';
    }

    return this.args.pending ? 'spinner' : this.args.icon;
  }

  get renderIcon() {
    return typeof this.iconClassName === 'string';
  }

  get renderIconLeft() {
    return this.renderIcon && this.actualIconPlacement === Directions.Left;
  }

  get renderIconRight() {
    return this.renderIcon && this.actualIconPlacement === Directions.Right;
  }

  get textClassName() {
    const names = [];

    // Only collapse down to an icon if said icon is actually available and it isn't
    // the generic tooltip icon, which wouldn't give any visual cues to what the
    // button does.
    if (
      this.args.responsive &&
      this.renderIcon &&
      !isPresent(this.args.tooltip)
    ) {
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
