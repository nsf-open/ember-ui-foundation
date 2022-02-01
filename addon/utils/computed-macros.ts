import type ComputedProperty from '@ember/object/computed';
import { computed, get } from '@ember/object';

/**
 * A computed property macro that listens to dependent (external) property, but allows
 * overriding it locally without violating DDAU. By using a simple setter it will still
 * trigger on changes of the dependent property even when being set before.
 *
 * Kudos to @fsmanuel for coming up with this solution.
 */
export function listenTo<V>(dependentKey: string, defaultValue = null): ComputedProperty<V> {
  return computed(dependentKey, {
    get() {
      const value = get(this, dependentKey);
      return value === undefined ? defaultValue : value;
    },

    set(_, value: V) {
      return value;
    },
  });
}
