import { module, test } from 'qunit';
import StepFlowManager, { stepFlowManager } from '@nsf/ui-foundation/lib/stepflow/StepFlowManager';
import StepFlowItem from '@nsf/ui-foundation/lib/stepflow/StepFlowItem';

class TestClass {
  @stepFlowManager([{ label: 'Step A', component: 'test-component-a' }])
  public declare readonly decoratorBuiltManager: StepFlowManager<unknown>;
}

module('Unit | Lib | StepFlow', function () {
  test('@stepFlowManager decorator', function (assert) {
    assert.true(new TestClass().decoratorBuiltManager instanceof StepFlowManager);
  });

  test('the manager creates StepFlowItem instances from basic definitions', function (assert) {
    const manager = new StepFlowManager([
      { label: 'Step A', component: 'test-component-a' },
      { label: 'Step B', component: 'test-component-b', title: 'Step 2' },
      { label: 'Step C', component: 'test-component-c', title: 'Step 3', indeterminate: true },
      { label: 'Step D', component: 'test-component-d', title: 'Step 4', complete: true },
    ]);

    const stepA = manager.getStepAt(0);
    const stepB = manager.getStepAt(1);
    const stepC = manager.getStepAt(2);
    const stepD = manager.getStepAt(3);

    assert.strictEqual(manager.totalStepCount, 4);

    assert.strictEqual(stepA?.label, 'Step A');
    assert.strictEqual(stepA?.component, 'test-component-a');

    assert.strictEqual(stepB?.label, 'Step B');
    assert.strictEqual(stepB?.component, 'test-component-b');
    assert.strictEqual(stepB?.title, 'Step 2');

    assert.strictEqual(stepC?.label, 'Step C');
    assert.strictEqual(stepC?.component, 'test-component-c');
    assert.strictEqual(stepC?.title, 'Step 3');
    assert.true(stepC?.indeterminate);

    assert.strictEqual(stepD?.label, 'Step D');
    assert.strictEqual(stepD?.component, 'test-component-d');
    assert.strictEqual(stepD?.title, 'Step 4');
    assert.true(stepD?.complete);
  });

  test('additional steps can be added to the manager', function (assert) {
    const manager = new StepFlowManager([{ label: 'Step A', component: 'test-component-a' }]);

    assert.strictEqual(manager.totalStepCount, 1);

    const stepA = manager.getStepAt(0);
    assert.strictEqual(stepA?.label, 'Step A');
    assert.strictEqual(stepA?.component, 'test-component-a');

    manager.addStep({ label: 'Step B', component: 'test-component-b', title: 'Step 2' });
    manager.addStep(new StepFlowItem({ label: 'Step C', component: 'test-component-c' }, manager));

    assert.throws(() => {
      // @ts-expect-error - Intentionally passing in the wrong type of thing
      manager.addStep('Hello World');
    });

    const stepB = manager.getStepAt(1);
    assert.strictEqual(stepB?.label, 'Step B');
    assert.strictEqual(stepB?.component, 'test-component-b');

    const stepC = manager.getStepAt(2);
    assert.strictEqual(stepC?.label, 'Step C');
    assert.strictEqual(stepC?.component, 'test-component-c');
  });

  test('steps can be navigated between', function (assert) {
    const manager = new StepFlowManager([
      { label: 'Step A', component: 'test-component-a', indeterminate: true },
      { label: 'Step B', component: 'test-component-b', indeterminate: true },
      { label: 'Step C', component: 'test-component-c', indeterminate: true },
      { label: 'Step D', component: 'test-component-d' },
    ]);

    assert.strictEqual(manager.totalStepCount, 4);
    assert.strictEqual(manager.completedStepCount, 3);
    assert.strictEqual(manager.currentStepIndex, 0);
    assert.false(manager.isComplete);
    assert.false(manager.hasPreviousStep);
    assert.true(manager.hasNextStep);
    assert.strictEqual(manager.previousStep, undefined);
    assert.strictEqual(manager.currentStep, manager.getStepAt(0));
    assert.strictEqual(manager.nextStep, manager.getStepAt(1));

    assert.false(manager.goToStep(-1));
    assert.false(manager.goToStep(5));

    manager.goToNextStep();

    assert.strictEqual(manager.currentStepIndex, 1);

    assert.true(manager.hasPreviousStep);
    assert.true(manager.hasNextStep);
    assert.strictEqual(manager.previousStep, manager.getStepAt(0));
    assert.strictEqual(manager.nextStep, manager.getStepAt(2));

    manager.goToStep(3);

    assert.true(manager.hasPreviousStep);
    assert.false(manager.hasNextStep);
    assert.strictEqual(manager.previousStep, manager.getStepAt(2));
    assert.strictEqual(manager.nextStep, undefined);
  });

  test('the completed state of a StepFlowItem can be toggled via updateCompleteState()', function (assert) {
    const manager = new StepFlowManager([{ label: 'Step A', component: 'test-component-a' }]);
    const stepA = manager.getStepAt(0);

    assert.false(stepA?.isComplete);

    stepA?.updateCompleteState(true);

    assert.true(stepA?.isComplete);

    stepA?.updateCompleteState({ isFormValid: false });

    assert.false(stepA?.isComplete);
  });
});
