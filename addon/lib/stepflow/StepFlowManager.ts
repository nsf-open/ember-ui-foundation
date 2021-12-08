import { set, computed, action } from '@ember/object';
import { reads, notEmpty } from '@ember/object/computed';
import { A, isArray } from '@ember/array';
import { assert } from '@ember/debug';
import StepFlowItem, { StepFlowDescriptor } from './StepFlowItem';

/**
 * Decorator to create a new StepFlowManager instance.
 *
 * ```typescript
 * @stepFlowManager([{ label: 'Step A', component: 'steps/step-a' }])
 * public declare manager: StepFlowManager;
 * ```
 */
export function stepFlowManager<Data = Record<string, unknown>>(
  steps?: StepFlowDescriptor<Data>[]
) {
  return computed(function createStepFlowManager() {
    return new StepFlowManager<Data>(steps);
  });
}

/**
 * @class StepFlowManager
 */
export default class StepFlowManager<Data> {
  constructor(steps?: (StepFlowItem<Data> | StepFlowDescriptor<Data>)[]) {
    if (isArray(steps)) {
      steps.forEach((step) => this.addStep(step));
    }
  }

  /** The ordered steps of this StepFlow. */
  public readonly steps = A<StepFlowItem<Data>>();

  /**
   * A single `data` object is shared throughout a StepFlow instance, and is
   * available for whatever need is required of it. For example, a multipart
   * form that spans several steps can all record their inputs here for easy
   * access.
   */
  public data?: Data;

  /** The index of the current step item in the flow. */
  public currentStepIndex = 0;

  /** The total number of step items within this StepFlow. */
  @reads('steps.length')
  public declare readonly totalStepCount: number;

  /** If true, there is at least one step before the current. */
  @notEmpty('previousStep')
  public declare readonly hasPreviousStep: boolean;

  /** If true, there is at least one more step after the current. */
  @notEmpty('nextStep')
  public declare readonly hasNextStep: boolean;

  /** The current StepFlowItem instance. */
  @computed('steps.[]', 'currentStepIndex')
  public get currentStep() {
    return this.steps.objectAt(this.currentStepIndex) as StepFlowItem<Data>;
  }

  /** The reference to the StepFlowItem prior to the current one. */
  @computed('currentStep', 'currentStepIndex', 'steps')
  public get previousStep() {
    const prevIndex = this.currentStepIndex - 1;
    return prevIndex < 0 ? undefined : this.steps[prevIndex];
  }

  /** A reference to the StepFlowItem after the current one. */
  @computed('currentStep', 'currentStepIndex', 'steps.length')
  public get nextStep() {
    const nextIndex = this.currentStepIndex + 1;
    return nextIndex >= this.steps.length ? undefined : this.steps[nextIndex];
  }

  /** The number of steps that have been completed so far. */
  @computed('steps.@each.{complete,indeterminate}')
  public get completedStepCount() {
    const steps = this.steps;

    // Since this is 1's-based, look for the first step that
    // is NOT marked as complete and return that index.
    for (let i = 0; i < steps.length; i += 1) {
      if (!steps[i].isComplete) {
        return i;
      }
    }

    return steps.length;
  }

  /** If true, all steps have been marked complete. */
  @computed('totalStepCount', 'completedStepCount')
  public get isComplete() {
    return this.totalStepCount === this.completedStepCount;
  }

  /** Retrieves the step at the specified index. */
  public getStepAt(index: number) {
    return this.steps.objectAt(index);
  }

  /** Retrieves the step that is one step before the specified index. */
  public getStepBefore(index: number) {
    return this.getStepAt(index - 1);
  }

  /** Retrieves the step that is one step after the specified index. */
  public getStepAfter(index: number) {
    return this.getStepAt(index + 1);
  }

  /** Action to navigate to the step at a specific index. */
  @action
  public goToStep(index: number) {
    if (index > -1 && index <= this.completedStepCount) {
      set(this, 'currentStepIndex', index);
      return true;
    }

    return false;
  }

  /** Action to navigate forward one step. */
  @action
  public goToNextStep() {
    assert(
      'You attempted to navigate to the next workflow step without completing the current one. ' +
        'It is possible that you meant to disable the navigation at this point, or mark the current ' +
        'step as "indeterminate".',
      this.currentStep.isComplete
    );

    return this.goToStep(this.currentStepIndex + 1);
  }

  /** Action to navigate back one step. */
  @action
  public goToPreviousStep() {
    return this.goToStep(this.currentStepIndex - 1);
  }

  /** Add a new step to the end of the current list. */
  public addStep(step: StepFlowItem<Data> | StepFlowDescriptor<Data>) {
    if (step instanceof StepFlowItem) {
      set(step, 'manager', this);
      this.steps.addObject(step);
    } else if (typeof step?.label === 'string') {
      this.steps.addObject(new StepFlowItem(step, this));
    } else {
      assert('The properties passed to "addStep" must be an object', false);
    }
  }
}
