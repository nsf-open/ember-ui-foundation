import type ComputedProperty from '@ember/object/computed';
import type Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

/**
 * A computed macro that can be used to lazily inject a service and
 * won't throw an exception if the service doesn't exist.
 */
export default function optionalService(name?: string): ComputedProperty<Service | undefined> {
  return computed({
    get(this: unknown, propertyName: string) {
      return getOwner(this).lookup(`service:${name || propertyName}`);
    },
  });
}
