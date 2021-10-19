import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { buildFaClassNameString } from '../../utils';

interface Args {
  name: string;
  fw?: boolean;
  spin?: boolean;
  pending?: boolean;
}

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
export default class UiIcon extends Component<Args> {
  /**
   * The icon name. Providing the `fa-` prefix is allowed, but not required.
   *
   * @argument name
   * @type {string}
   */

  /**
   * Whether or not to apply the fixed width modifier to the icon.
   *
   * @argument fw
   * @type {boolean}
   */

  /**
   * Whether or not to apply a rotation animation to the icon.
   *
   * @argument spin
   * @type {boolean}
   */

  /**
   * For convenience, when set to true the icon will take on the MyNSF standard
   * "loading/pending" animation.
   *
   * @argument pending
   * @type {boolean}
   */

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    assert('An icon name must be provided', typeof args.name === 'string');
  }

  protected get iconClassName() {
    const values = [this.args.pending ? 'spinner' : this.args.name];

    if (this.args.fw) {
      values.push('fa-fw');
    }

    if (this.args.spin || this.args.pending) {
      values.push('fa-spin');
    }

    return buildFaClassNameString(values);
  }
}
