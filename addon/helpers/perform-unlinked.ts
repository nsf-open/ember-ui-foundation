import type { Task } from 'ember-concurrency';
import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { bind } from '@ember/runloop';

// This mimics the ember-concurrency "perform" helper with a lone difference
// being that it runs `.unlinked().perform()` instead of `.perform()`.

type PositionalArgs = [Task<unknown, unknown[]>, ...unknown[]];

/**
 * This wonderful little helper provides a way to sidestep the even more wonderfully
 * named ___"sinister self-cascade-cancel footgun / megatroll"___ issue that exists within
 * Ember Concurrency.
 * [You can read all the details here](https://github.com/machty/ember-concurrency/issues/161).
 * To call it a bug would be more than a bit of a stretch. Most of the time, the fact that
 * Ember Concurrency tasks cancel descendent tasks is really useful... most of the time.
 *
 * If you've worked with Ember Concurrency before then you're undoubtedly familiar with the
 * `{{perform}}` helper. This does the exact same thing, only it calls `.unlinked().perform()`
 * on the task, instead of simply `.perform()`.
 *
 * ```handlebars
 * {{#if this.showAThing}}
 *   <UiSomeComponent @onAnEvent={{perform-unlinked this.hereIsAConcurrencyTask}} />
 * {{/if}}
 * ```
 *
 * In the previous snippet, assume for a moment that we used `{{perform}}` instead of
 * `{{perform-unlinked}}` to create a closure around our task. At some point, `UiSomeComponent`
 * is going to execute the method that has been provided.
 *
 * If the thing doing the executing was itself a Concurrency Task, and if `showAThing` was made
 * false a little prematurely for whatever reason then the destruction of the component would cause
 * the running task to abort wherever it was, which would in turn cause any descendant tasks to do
 * the same. Generator functions are cool like that, but if you were relying on any logic nestled
 * after the hard stop in your `hereIsAConcurrencyTask` then you'd be out of luck.
 *
 * By using `{{perform-unlinked}}` instead, all you're doing is telling Ember Concurrency to not
 * stop your task even if that parent task that is running it does stop.
 */
export default class PerformUnlinkedHelper extends Helper {
  /**
   * @protected
   */
  compute(args: PositionalArgs) {
    return performUnlinkedHelper(args);
  }
}

export function performUnlinkedHelper([task, ...outerArgs]: PositionalArgs) {
  return bind(null, function (...innerArgs: unknown[]) {
    if (!task || typeof task.unlinked !== 'function') {
      assert(
        'The first argument passed to the perform-unlinked helper' +
          ` should be a Task object (without quotes); you passed ${task}`,
        false
      );

      // istanbul ignore next
      return;
    }

    return task.unlinked().perform(...outerArgs, ...innerArgs);
  });
}
