import type { ProgressItemDescriptor } from '@nsf/ui-foundation/lib/ProgressItem';
import Component from '@ember/component';
import ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import { computed, action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout } from '@ember-decorators/component';
import { PanelVariants } from '@nsf/ui-foundation/constants';
import template from './template';

/**
 * A linear workflow, also commonly referred to as a "wizard". Typical use cases
 * include multipart forms and action -> confirm -> execute patterns.
 *
 * The UiStepflow component has a very minimal template footprint. You'll need
 * to provide an array of objects, each one containing `label` and `component`
 * properties. The contents and order of these objects will dictate what is
 * rendered for each step of the workflow, and the order in which it happens.
 *
 * ```typescript
 * public readonly steps = [
 *   { label: 'Select Movie',    component: 'steps/select-movie' },
 *   { label: 'Update Director', component: 'steps/update-director' },
 *   { label: 'Update Actors',   component: 'steps/update-actors' }
 * ];
 * ```
 *
 * ```hbs
 *
 * <UiStepflow @steps={{this.steps}} />
 *
 * ```
 *
 * UiStepFlow also accepts a generic `data` object that is shared between the steps
 * and is available for whatever need is required of it. For example, a multipart
 * form that spans several workflow steps can all record their inputs here for
 * easy retrieval.
 *
 * ```typescript
 * type MovieWorkflowData = {
 *   movie:    Movie;
 *   director: Director;
 *   actors:   Actor[];
 * };
 *
 * public readonly workflowData: MovieWorkflowData = {
 *   movie:    null,
 *   director: null,
 *   actors:   null,
 * };
 * ```
 *
 * ```hbs
 *
 * <UiStepflow @steps={{this.steps}} @data={{this.workflowData}} />
 *
 * ```
 */
@layout(template)
export default class UiStepflow<Data> extends Component {
  public static readonly positionalParams = ['steps'];

  /**
   * An array of ProgressItemDefinition objects
   *
   * The step definitions passed into the component.
   * This can also be set as the first positional parameter of the component.
   * This argument takes an array of StepFlowDescriptor objects. For example:
   */
  public steps?: ProgressItemDescriptor<Data>[];

  /**
   * The data object passed into each component. This argument takes an object that
   * defines which properties will be modified in the stepflow.
   *
   * ```typescript
   * type MovieWorkflowData = {
   * 	movie:    Movie;
   * 	director: Director;
   * 	actors:   Actor[];
   * };
   *
   * public readonly workflowData: MovieWorkflowData = {
   * 	movie:    null,
   * 	director: null,
   * 	actors:   null,
   * };
   * ```
   *
   * ```handlebars
   *
   * ```
   */
  public data?: Data;

  /**
   * Function or task to run when the step-flow is submitted.
   *
   * ```typescript
   * @dropTask
   * public * handleStepFlowSubmit(...args) {
   * 	// do stuff
   * }
   * ```
   *
   * ```handlebars
   * {{ui-stepflow steps=this.steps onCompleteStepFlow=(perform this.handleStepFlowSubmit)}}
   * ```
   */
  public onCompleteStepFlow?: () => void;

  /**
   * Supply a route for an optional Cancel button (well, technically, a
   * link styled like a button).
   *
   * ```handlebars
   * <UiStepflow
   *   steps=this.steps
   *   cancellationRoute="route.to.destination.when.clicked"
   * />
   * ```
   */
  public cancellationRoute?: string;

  /**
   * The Submit button text ("Submit" by default).
   * May be used when the Submit button should have custom text, such as "Add", "Save", etc.
   */
  public submitButtonText = 'Submit';

  public testId?: string;

  public variant = PanelVariants.Default;

  @computed('data', 'steps')
  public get manager() {
    const manager = new ProgressManager<Data>(this.steps);
    manager.data = this.data;

    return manager;
  }

  @computed('manager.currentStep.{title,label}')
  public get heading() {
    const { title, label } = this.manager.currentStep;
    return isEmpty(title) ? label : title;
  }

  @computed('testId')
  public get navBarTestId() {
    return typeof this.testId === 'string' ? `${this.testId}-navigation` : undefined;
  }

  @action
  completeStepFlow() {
    this.onCompleteStepFlow?.();
  }
}
