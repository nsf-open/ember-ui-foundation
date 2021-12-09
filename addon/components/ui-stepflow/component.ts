import type { ProgressItemDescriptor } from '@nsf/ui-foundation/lib/ProgressItem';
import Component from '@ember/component';
import ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import { computed, action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout } from '@ember-decorators/component';
import { PanelVariants } from '@nsf/ui-foundation/constants';
import template from './template';

/**
 * A multistep workflow, also commonly referred to as a "wizard".
 *
 * The component's inline form expects two main parameters: steps and data.
 *
 * ```handlebars
 * {{ui-stepflow steps=this.steps data=this.workflowData}}
 * ```
 *
 * @yield {object} stepflow
 * */
@layout(template)
export default class UiStepFlow<Data> extends Component {
  /**
   * The positionalParams property indicates that the steps argument can also be
   * passed to the component as the first positional parameter. For example:
   *
   * ```handlebars
   * {{ui-stepflow this.steps data=this.workflowData}}
   * ```
   */
  public static readonly positionalParams = ['steps'];

  /**
   * The step definitions passed into the component.
   * This can also be set as the first positional parameter of the component.
   * This argument takes an array of StepFlowDescriptor objects. For example:
   *
   * ```typescript
   * public readonly steps = [{
   *		label:     'Select Movie',
   *		component: 'components/select-movie',
   *	}, {
   *		label:     'Update Director',
   *		component: 'components/update-director',
   *	}, {
   *		label:     'Update Actors',
   *		component: 'components/update-actors',
   *	}];
   * ```
   *
   * ```handlebars
   * {{ui-stepflow steps=this.steps}}
   * ```
   */
  public steps?: ProgressItemDescriptor<Data>[];

  /**
   * The data object passed into the component. This argument takes an object that
   * defines which properties will be modified in the stepflow. For example:
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
   * {{ui-stepflow steps=this.steps data=this.workflowData}}
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
