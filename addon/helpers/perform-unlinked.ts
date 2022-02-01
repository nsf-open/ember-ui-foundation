import type { Task } from 'ember-concurrency';
import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { bind } from '@ember/runloop';

// This mimics the ember-concurrency "perform" helper with a lone difference
// being that it runs `.unlinked().perform()` instead of just `.perform()`.

/**
 *
 */
export default helper(performUnlinkedHelper);

export function performUnlinkedHelper([task, ...outerArgs]: [
  Task<unknown, unknown[]>,
  ...unknown[]
]) {
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
