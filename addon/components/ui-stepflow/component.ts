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
 * ## Passing Data
 *
 * UiStepflow also accepts a generic `data` object that is shared between the steps
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
 *
 *
 * ## Building a Workflow
 *
 * A component is defined and rendered for each step in the workflow. Unless
 * the step is earmarked as `indeterminate` or `complete` then at some point,
 * something within the component will need to happen which indicates that the
 * workflow can proceed to the next step. Otherwise, the Next/Submit button will
 * never be enabled and that seems pretty useless.
 *
 * To make this easy, each rendered component is provided several extra properties
 * described in the `IProgressComponent` interface. There is a concrete implementation
 * as well.
 *
 * ```typescript
 * import ProgressComponent from "@nsf/ui-foundation/lib/ProgressComponent";
 *
 * export default class SelectMovieStep extends ProgressComponent<MovieWorkflowData> {
 *    public updateMovie(movie: Movie) {
 *      // `progressData` is a reference to shared workflow Data object
 *      this.progressData.movie = movie;
 *
 *      // `progressItem` is a reference to the ProgressItem instance
 *      // that describes the workflow step
 *      this.progressItem.markComplete();
 *    }
 * }
 * ```
 *
 *
 * ## Completion
 *
 * All good workflows must come to an end, and so when a UiStepflow reaches its final
 * step a "Submit" button will be rendered in place of a "Next" button. The text of
 * the button can be altered to better reflect what clicking on it actually does, and
 * when that click does come the function provided to `onCompleteStepFlow` will be
 * executed.
 *
 * ```typescript
 * @dropTask
 * public * handleStepFlowSubmit(...args) {
 * 	// do stuff
 * }
 * ```
 *
 * ```hbs
 * <UiStepflow
 *   @steps={{this.steps}}
 *   @onCompleteStepFlow={{perform this.handleStepFlowSubmit}}
 * />
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
   * A generic object that is shared between all steps.
   */
  public data?: Data;

  /**
   * Callback method for the "Submit" button.
   */
  public onCompleteStepFlow?: () => void;

  /**
   * Supply a route for an optional Cancel button (well, technically, a
   * link styled like a button).
   */
  public cancellationRoute?: string;

  /**
   * The Submit button text. May be used when the Submit button should have custom
   * text, such as "Add", "Save", etc.
   */
  public submitButtonText = 'Submit';

  /**
   * A `data-test-id` attribute value, if required.
   */
  public testId?: string;

  /**
   * If true, the rendered step component will be wrapped in a UiPanel.
   */
  public renderPanel = true;

  /**
   * If `renderPanel = true` then this will toggle whether that panel's title bar
   * is displayed.
   */
  public renderPanelHeading = true;

  /**
   * If `renderPanel = true` then this will be the style variant of that panel.
   */
  public panelVariant = PanelVariants.Default;

  /**
   * If true, progress bar chevrons will only take up as much width as is needed
   * for their text content and the progress bar may not be as wide as its parent
   * container.
   *
   * This is ignored at smaller screen widths - the progress bar always takes the
   * full width of its container.
   */
  public progressBarCompact = true;

  /**
   * If true, a checkmark will appear at the end of any progress bar chevron whose
   * progress item is completed.
   */
  public progressBarNumber = false;

  /**
   * If true, the text of each progress bar chevron will be prefixed with an ascending
   * integer starting at 1. Numbers are always shown at smaller screen widths due to the
   * limited horizontal space.
   */
  public progressBarCheckmark = false;

  @computed('data', 'steps')
  public get manager() {
    const manager = new ProgressManager<Data>(this.steps);
    manager.data = this.data;

    return manager;
  }

  @computed('renderPanelHeading', 'manager.currentStep.{title,label}')
  public get heading() {
    if (!this.renderPanelHeading) {
      return undefined;
    }

    const { title, label } = this.manager.currentStep;

    return isEmpty(title) ? label : title;
  }

  @action
  completeStepFlow() {
    this.onCompleteStepFlow?.();
  }
}
