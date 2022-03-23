/* eslint-disable ember/no-observers */
import Helper from '@ember/component/helper';
import { set } from '@ember/object';
import { addObserver, removeObserver } from '@ember/object/observers';

/**
 * Provides a way to check whether a value resides within an array. The helper
 * will recompute as needed when items are added to / removed from the array.
 *
 * ```ts
 *
 * const locations = ['District of Columbia', 'Maryland', 'Virginia'];
 *
 * ```
 *
 * ```handlebars
 * {{#if (in-array this.locations "Maryland")}}
 *   <p>This content will be rendered</p>
 * {{/if}}
 *
 * {{#if (in-array this.locations "Delaware")}}
 *   <p>This content will not</p>
 * {{/if}}
 * ```
 *
 * ```ts
 *
 * locations.pushObject('Delaware');
 *
 * ```
 *
 * ```handlebars
 * {{#if (in-array this.locations "Delaware")}}
 *   <p>But now it will</p>
 * {{/if}}
 * ```
 */
export default class InArrayHelper extends Helper {
  protected readonly observerKey = 'targetArray.[]' as keyof this;

  /** @protected */
  targetArray?: unknown[];

  /** @protected */
  listenerAttached = false;

  /** @protected */
  compute([array, value]: [unknown[], unknown]): boolean {
    if (this.targetArray !== array) {
      this.updateTargetArray(array);
    }

    return Array.isArray(array) ? array.includes(value) : false;
  }

  protected updateTargetArray(newArray: unknown[]) {
    if (this.listenerAttached) {
      removeObserver(this, this.observerKey, this.recompute);
    }

    set(this, 'targetArray', newArray);
    addObserver(this, this.observerKey, this.recompute);
    set(this, 'listenerAttached', true);
  }
}
