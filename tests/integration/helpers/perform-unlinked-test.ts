import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import { performUnlinkedHelper } from '@nsf/ui-foundation/helpers/perform-unlinked';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

module('Integration | Helpers | perform-unlinked', function (hooks) {
  setupTest(hooks);

  class TaskSandbox {
    @task
    *parentTask(assert: Assert) {
      yield performUnlinkedHelper([taskFor(this.childTask), assert])();
      yield taskFor(this.childTask).perform(assert);
    }

    @task
    *childTask(assert: Assert) {
      yield timeout(20);
      assert.step('task');
    }
  }

  test('it creates a closure that runs a concurrency task that not linked to its parent', async function (assert) {
    assert.expect(2);

    const sandbox = new TaskSandbox();

    // Start parentTask but don't await its completion.
    const task = taskFor(sandbox.parentTask).perform(assert);

    // Wait until we are well into the execution of childTask, but before step() is asserted.
    await timeout(10);

    // Cancel parentTask. The running childTask instance should continue on.
    await task.cancel();

    // Wait for everything to finish.
    await settled();

    assert.verifySteps(['task']);
  });

  test('it only accepts concurrency tasks', function (assert) {
    assert.throws(function () {
      // @ts-expect-error - purposefully passing in the wrong type of argument for testing
      performUnlinkedHelper(['foo'])();
    });
  });
});
