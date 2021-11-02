import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import { buildFaClassNameString } from '../../utils';
import template from './template';

/**
 * A FontAwesome icon.
 *
 * ```handlebars
 * <UiIcon @name="superpowers" />
 * {{!-- Outputs: <span class="fa fa-superpowers" aria-hidden="true"></span> --}}
 * ```
 *
 * @class UiIcon
 */
@tagName('')
@layout(template)
export default class UiIcon extends Component {
  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   *
   * @argument name
   * @type {string}
   * @required
   */
  name!: string;

  /**
   * Whether or not to apply the fixed width modifier to the icon.
   *
   * @argument fw
   * @type {boolean}
   */
  fw = false;

  /**
   * Whether or not to apply a rotation animation to the icon.
   *
   * @argument spin
   * @type {boolean}
   */
  spin = false;

  /**
   * Whether or not to apply a pulsing animation to the icon.
   *
   * @argument pulse
   * @type {boolean}
   */
  pulse = false;

  /**
   * The type of animation to be applied to the icon when pending = true.
   *
   * @argument pendingAnimation
   * @type {"spin" | "pulse"}
   */
  pendingAnimation: 'spin' | 'pulse' = 'spin';

  /**
   * For convenience, when set to true the icon will take on the MyNSF standard
   * "loading/pending" animation.
   *
   * @argument pending
   * @type {boolean}
   */
  pending = false;

  /**
   * The icon size modifier.
   *
   * @argument size
   * @type {"2x" | "3x" | "4x"}
   */
  size?: '2x' | '3x' | '4x' = undefined;

  @computed('name', 'fw', 'spin', 'pending', 'size', 'pulse', 'pendingAnimation')
  get iconClassName() {
    const values = [this.pending ? 'spinner' : this.name];

    if (this.fw) {
      values.push('fa-fw');
    }

    if (this.pending) {
      values.push(this.pendingAnimation);
    } else if (this.spin) {
      values.push('fa-spin');
    } else if (this.pulse) {
      values.push('fa-pulse');
    }

    if (this.size) {
      values.push(`fa-${this.size}`);
    }

    return buildFaClassNameString(values);
  }
}
