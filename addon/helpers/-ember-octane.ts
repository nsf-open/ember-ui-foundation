import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';

let isOctane: boolean | undefined = undefined;

/**
 * This is a private helper to distinguish between pre- and post-Ember Octane
 * versions for the sake of the bits of template that require different
 * patterns. LinkTo is a particular problem child here. Once support for
 * Ember < 3.15 is dropped this can be removed.
 *
 * @private
 */
export default class EmberOctaneEdition extends Helper {
  compute() {
    if (typeof isOctane === 'boolean') {
      return isOctane;
    }

    const config = getOwner(this).resolveRegistration('config:environment');
    const octane = config?.['ui-foundation']?.isEmberOctaneEdition === true;

    return (isOctane = octane);
  }
}
