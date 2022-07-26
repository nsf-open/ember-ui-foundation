import type ComputedProperty from '@ember/object/computed';
import type Service from '@ember/service';
import getOwner from './get-owner';
import { computed } from '@ember/object';

/**
 * A computed macro that can be used to lazily inject a service and
 * won't throw an exception if the service doesn't exist.
 */
export default function optionalService(name?: string): ComputedProperty<Service | undefined> {
  return computed({
    get(this: unknown, propertyName: string) {
      return getOwner(this)?.lookup<Service | undefined>(`service:${name || propertyName}`);
    },
  });
}
