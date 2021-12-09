import type Component from '@ember/component';
import type ProgressManager from './ProgressManager';
import { computed, set, action } from '@ember/object';
import { or } from '@ember/object/computed';

/**
 * Components rendered via workflows that leverage a ProgressManager will receive
 * the additional properties described in this interface.
 */
export interface ProgressComponent<Data> extends Component {
  readonly progressItem: ProgressItem<Data>;
  readonly progressManager: ProgressManager<Data>;
  readonly progressData: Data;
}

/**
 * The ProgressItemDescriptor describes a basic object that can be provided to a
 * ProgressManager to create a ProgressItem instance.
 */
export type ProgressItemDescriptor<Data> = {
  /**
   * A simple, short descriptor of the progress item being defined. This will be
   * used to identify the item in things like chevron bars or ordered lists.
   */
  label: string;

  /**
   * A more verbose descriptor of the progress item being defined. This can be
   * defined in addition to `label` and will be used in things like panel
   * headings.
   * */
  title?: string;

  /**
   * A ProgressComponent class or string name where a component can be resolved.
   * Different workflow implementations will use this in different ways.
   */
  component?: string | ProgressComponent<Data>;

  /**
   * If true then the progress item will default to its `completed` state. For
   * example, this should be set to true for a step in the progression of a
   * workflow that displays a pre-populated form with correct values.
   */
  complete?: boolean;

  /**
   * If true then the progress item will never be either complete or incomplete.
   * This is particularly useful for informational or confirmation steps within
   * a workflow.
   */
  indeterminate?: boolean;
};

/**
 * A ProgressItem defines a single step within a workflow - a link in a chain when
 * defining linear paths, or a node in a web for more complex designs. ProgressItem
 * instances are created by a ProgressManager and carry stateful information about
 * their own internal status as well as their standing within the larger group of
 * all items being managed.
 *
 * @class ProgressItem
 */
export default class ProgressItem<Data> {
  constructor(descriptor: ProgressItemDescriptor<Data>, manager: ProgressManager<Data>) {
    const { label, title, component, complete, indeterminate } = descriptor;

    this.label = label;
    this.component = component;
    this.title = title;

    set(this, 'manager', manager);

    if (typeof complete === 'boolean') {
      set(this, 'complete', complete);
    }

    if (typeof indeterminate === 'boolean') {
      set(this, 'indeterminate', indeterminate);
    }
  }

  /**
   * A simple, short descriptor of the progress item being defined. This will be
   * used to identify the item in things like chevron bars or ordered lists.
   */
  public label: string;

  /**
   * A more verbose descriptor of the progress item being defined. This can be
   * defined in addition to `label` and will be used in things like panel
   * headings.
   * */
  public title?: string;

  /**
   * A ProgressComponent class or string name where a component can be resolved.
   * Different workflow implementations will use this in different ways.
   */
  public component?: string | ProgressComponent<Data>;

  /**
   * If true, the flow is allowed to progress past this step item. This value
   * will be ignored if the step is `indeterminate`.
   * */
  public complete = false;

  /**
   * If true then the progress item will never be either complete or incomplete.
   * This is particularly useful for informational or confirmation steps within
   * a workflow.
   */
  public indeterminate = false;

  /**
   * True if the progress item is either complete or indeterminate.
   */
  @or('complete', 'indeterminate')
  public declare readonly isComplete: boolean;

  /**
   * The ProgressManager that owns this ProgressItem.
   */
  public declare readonly manager: ProgressManager<Data>;

  /**
   * The index of this ProgressItem within the queue of its owning ProgressManager.
   */
  @computed('manager.steps.[]')
  public get index() {
    return this.manager.steps.indexOf(this);
  }

  /**
   * The ProgressItem indexed immediately before this one, or undefined if this
   * is the first item in the workflow.
   */
  @computed('index', 'manager')
  public get previousStep() {
    return this.manager.getStepBefore(this.index);
  }

  /**
   * The ProgressItem indexed immediately after this one, or undefined if this
   * is the last item in the workflow.
   */
  @computed('index', 'manager')
  public get nextStep() {
    return this.manager.getStepAfter(this.index);
  }

  /**
   * True if this is the current ProgressItem in the ProgressManager.
   */
  @computed('manager.currentStep')
  public get isActive() {
    return this.manager.currentStep === this;
  }

  /**
   * True if the ProgressItem immediately before this one is the current item in
   * the ProgressManager.
   */
  @computed('manager.currentStep', 'previousStep')
  public get isPreviousActive() {
    return this.manager.currentStep === this.previousStep;
  }

  /**
   * True if the ProgressItem immediately after this one is the current item in
   * the ProgressManager.
   */
  @computed('manager.currentStep', 'nextStep', 'previousStep')
  public get isNextActive() {
    return this.manager.currentStep === this.nextStep;
  }

  /**
   * True if the current item in the ProgressManager is indexed lower than this
   * one.
   */
  @computed('manager.currentStepIndex', 'index')
  public get isPastStepActive() {
    return this.manager.currentStepIndex < this.index;
  }

  /**
   * True if the current item in the ProgressManager is indexed higher than this
   * one.
   */
  @computed('manager.currentStepIndex', 'index')
  public get isFutureStepActive() {
    return this.manager.currentStepIndex > this.index;
  }

  /**
   * True if this step is allowed to be navigated to from somewhere else. Current
   * support is limited to a linear workflow - the ProgressItem immediately before
   * this one must have been marked as either complete or indeterminate.
   */
  @computed('previousStep.isComplete', 'isActive')
  public get canBeLinkedTo() {
    const previousStep = this.previousStep;
    return !this.isActive && (!previousStep || previousStep.isComplete);
  }

  /**
   * A string representation of the current item's completion state and location
   * within the workflow.
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
      ? 'indeterminate'
      : this.complete
      ? 'complete'
      : 'incomplete';

    return [
      this.isActive ? 'active' : 'inactive',
      completedStatus,
      this.isPastStepActive ? 'past-active' : null,
      this.isFutureStepActive ? 'future-active' : null,
      this.isPreviousActive ? 'prev-active' : null,
      this.isNextActive ? 'next-active' : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Sets the `complete` flag on this step to true.
   */
  @action
  public markComplete() {
    set(this, 'complete', true);
  }

  /**
   * Sets the `complete` flag on this item to false.
   */
  @action
  public markIncomplete() {
    set(this, 'complete', false);
  }

  /**
   * Updates the `complete` value of this item. This method is particularly
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
