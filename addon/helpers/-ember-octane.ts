import Helper from '@ember/component/helper';
import { gte } from 'ember-compatibility-helpers';

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
    return gte('3.15.0');
  }
}
