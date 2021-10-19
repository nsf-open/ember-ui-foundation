import Component from '@ember/component';
import { computed } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { buildFaClassNameString } from '../../utils';

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
   * For convenience, when set to true the icon will take on the MyNSF standard
   * "loading/pending" animation.
   *
   * @argument pending
   * @type {boolean}
   */
  pending = false;

  @computed('name', 'fw', 'spin', 'pending')
  get iconClassName() {
    const values = [this.pending ? 'spinner' : this.name];

    if (this.fw) {
      values.push('fa-fw');
    }

    if (this.spin || this.pending) {
      values.push('fa-spin');
    }

    return buildFaClassNameString(values);
  }
}
