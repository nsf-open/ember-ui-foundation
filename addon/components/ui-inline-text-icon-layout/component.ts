import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import { isPresent } from '@ember/utils';
import { Directions, DirectionsX } from '../../constants';
import template from './template';

/**
 * Provides standardized layout for icon + text components, e.g., buttons, anchors, and
 * their many variants.
 */
@tagName('')
@layout(template)
export default class UiInlineTextIconLayout extends Component {
  /**
   * The text to display.
   */
  public text?: string;

  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required. Alias for
   * `UiIcon.name`.
   */
  public icon?: string;

  /**
   * The placement of the icon, either "left" or "right", relative to the text.
   */
  public iconPlacement: DirectionsX = Directions.Left;

  /**
   * If true, text will be made screen-reader only at the small breakpoint. This will
   * only apply if an icon has been provided for display.
   */
  public responsive = false;

  /**
   * Whether to apply the fixed width modifier to the icon. Alias for `UiIcon.fw`.
   */
  public fw = false;

  /**
   * Alias for `UiIcon.spin`.
   */
  public spin = false;

  /**
   * For convenience, when set to true the icon will take on the NSF standard "loading/pending"
   * animation.
   */
  public pending = false;

  /**
   * Tooltip text content. If provided, the standard tooltip icon will be applied. This
   * does not actually generate a UiTooltip instance, just the icon. It's a string instead
   * of a boolean because that is what usually gets thrown around when dealing with tooltips.
   */
  public tooltip?: string;

  /**
   * So this is a pretty wild kind of confusing. This allows an implementing component to
   * tell this one whether it should behave as though it has block content for the sake
   * of laying out text. You can see this at work in the template, where it has the ability
   * to falsify (has-block) if it is true.
   *
   * It's used by UiButton to support the icon-only scenario.
   */
  protected doesParentHaveBlockContent = true;

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

    // Only collapse down to an icon if said icon is actually available, and it isn't
    // the generic tooltip icon, which wouldn't give any visual cues to what the
    // button does.
    if (this.responsive && this.renderIcon && !isPresent(this.tooltip)) {
      names.push('hidden-sm-down');
    }

    if (this.renderIconLeft) {
      names.push('ml-5px');
    }

    if (this.renderIconRight) {
      names.push('mr-5px');
    }

    return names.join(' ');
  }
}
