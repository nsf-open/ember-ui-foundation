import { computed, set, action } from '@ember/object';
import { or } from '@ember/object/computed';
import StepFlowManager from './StepFlowManager';

/**
 * Constants that can be joined together to describe the various states
 * of a StepFlowItem.
 */
export enum StatusValues {
  Complete = 'complete',
  Incomplete = 'incomplete',
  Indeterminate = 'indeterminate',
  Active = 'active',
  Inactive = 'inactive',
  PrevActive = 'prev-active',
  PastActive = 'past-active',
  NextActive = 'next-active',
  FutureActive = 'future-active',
}

/**
 * When rendered via StepFlow a component will receive the additional
 * properties described in this interface.
 */
export interface StepFlowComponent<Data> {
  readonly currentStep: StepFlowItem<Data>;
  readonly stepFlowManager: StepFlowManager<Data>;
  readonly stepFlowData: Data;
}

/**
 * A StepFlowDescriptor is a POJO that a StepFlowManager can use to create a
 * full StepFlowItem.
 */
export type StepFlowDescriptor<Data> = {
  /** A short name for the step to be used in the progress bar. */
  label: string;

  /** The full name of the component that will be rendered for the step. */
  component: string | StepFlowComponent<Data>;

  /**
   * The header text of the panel that the step will be rendered within.
   * If not provided then the label will be used.
   * */
  title?: string;

  /**  Whether the step is predetermined to have already been completed when rendered. */
  complete?: boolean;

  /** Whether the step has no solid concepts of complete and incomplete states. */
  indeterminate?: boolean;
};

/**
 * A StepFlowItem represents a single step within a StepFlow. Its primary purpose
 * is to manage the state of the step in relation to what comes before and after it.
 * This includes things like: is this step the one currently being viewed?, can the
 * next step be navigated to?, etc.
 *
 * @class StepFlowItem
 */
export default class StepFlowItem<Data> {
  constructor(descriptor: StepFlowDescriptor<Data>, manager: StepFlowManager<Data>) {
    this.label = descriptor.label;
    this.component = descriptor.component;
    this.title = descriptor.title;

    set(this, 'manager', manager);

    if (typeof descriptor.complete === 'boolean') {
      set(this, 'complete', descriptor.complete);
    }

    if (typeof descriptor.indeterminate === 'boolean') {
      set(this, 'indeterminate', descriptor.indeterminate);
    }
  }

  /**
   * A short name for the step to be used in the progress bar.
   */
  public label: string;

  /**
   * The header text of the panel that the step will be rendered within.
   * If not provided then the label will be used.
   */
  public title?: string;

  /**
   * The full name of the component that will be rendered for the step.
   */
  public component: string | StepFlowComponent<Data>;

  /**
   * If true, the flow is allowed to progress past this step item. This value
   * will be ignored if the step is `indeterminate`.
   * */
  public complete = false;

  /**
   * An indeterminate step does not track completion. In this sense it is
   * always "complete". Although, it will never be "incomplete" either...
   */
  public indeterminate = false;

  /**
   * True if either the step is complete, or the step is indeterminate. In
   * either case, the flow is allowed to progress past this step item.
   */
  @or('complete', 'indeterminate')
  public declare readonly isComplete: boolean;

  /**
   * The StepFlowManager to which this step item belongs.
   */
  public declare readonly manager: StepFlowManager<Data>;

  /**
   * The index of this step item in the ordering of all steps within the
   * manager.
   */
  @computed('manager.steps.[]')
  public get index() {
    return this.manager.steps.indexOf(this);
  }

  /**
   * The step item before this one.
   */
  @computed('index', 'manager')
  public get previousStep() {
    return this.manager.getStepBefore(this.index);
  }

  /**
   * The step item after this one.
   */
  @computed('index', 'manager')
  public get nextStep() {
    return this.manager.getStepAfter(this.index);
  }

  /**
   * True if this step item is the current one.
   */
  @computed('manager.currentStep')
  public get isActive() {
    return this.manager.currentStep === this;
  }

  /**
   * True if the step immediately before this one is the current step.
   */
  @computed('manager.currentStep', 'previousStep')
  public get isPreviousActive() {
    return this.manager.currentStep === this.previousStep;
  }

  /**
   * True if the step immediately after this one is the current step.
   */
  @computed('manager.currentStep', 'nextStep', 'previousStep')
  public get isNextActive() {
    return this.manager.currentStep === this.nextStep;
  }

  /**
   * True if any step before this one is the current step.
   */
  @computed('manager.currentStepIndex', 'index')
  public get isPastStepActive() {
    return this.manager.currentStepIndex < this.index;
  }

  /**
   * True if any step after this one is the current step.
   */
  @computed('manager.currentStepIndex', 'index')
  public get isFutureStepActive() {
    return this.manager.currentStepIndex > this.index;
  }

  /**
   * If true, this step should be linked to from the caret bar.
   */
  @computed('previousStep.isComplete', 'isActive')
  public get canBeLinkedTo() {
    const previousStep = this.previousStep;
    return !this.isActive && (!previousStep || previousStep.isComplete);
  }

  /**
   * A string containing current information about this step.
   */
  @computed(
    'isActive',
    'complete',
    'indeterminate',
    'isPastStepActive',
    'isPreviousActive',
    'isFutureStepActive',
    'isNextActive'
  )
  public get status() {
    const completedStatus = this.indeterminate
      ? StatusValues.Indeterminate
      : StatusValues[this.complete ? 'Complete' : 'Incomplete'];

    return [
      StatusValues[this.isActive ? 'Active' : 'Inactive'],
      completedStatus,
      this.isPastStepActive ? StatusValues.PastActive : null,
      this.isFutureStepActive ? StatusValues.FutureActive : null,
      this.isPreviousActive ? StatusValues.PrevActive : null,
      this.isNextActive ? StatusValues.NextActive : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Sets the complete flag on this step to true, allowing the user to move onto
   * the next step of the flow.
   */
  @action
  public markComplete() {
    set(this, 'complete', true);
  }

  /**
   * Sets the `complete` flag on this step to false, disabling the ability to move
   * forward in the flow.
   */
  @action
  public markIncomplete() {
    set(this, 'complete', false);
  }

  /**
   * Update the completed status of this step item. This method is particularly
   * useful as the argument of a UiForm's `onFormValidationChange` callback.
   */
  @action
  public updateCompleteState(complete: boolean | { isFormValid: boolean }): void {
    if (typeof complete === 'boolean') {
      set(this, 'complete', complete);
    } else if (complete && 'isFormValid' in complete) {
      set(this, 'complete', !!complete?.isFormValid);
    }
  }
}
