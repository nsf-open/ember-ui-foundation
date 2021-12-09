import type ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import Component from '@ember/component';
import { layout, tagName, classNames } from '@ember-decorators/component';
import template from './template';

/**
 * @class UiStepFlowProgressBar
 */
@tagName('ol')
@classNames('list-unstyled', 'progress-chevrons')
@layout(template)
export default class UiStepFlowProgressBar extends Component {
  /**
   * The manager that this progress bar will use to create navigation
   * elements. Each step in the manager will receive a chevron with
   * usage based on that step being `complete`.
   */
  public declare readonly manager: ProgressManager<unknown>;

  /**
   * Passes the clicked-on chevron index back to the manager.
   */
  protected handleChevronClick(idx: number, event: Event) {
    event.preventDefault();
    this.manager.goToStep(idx);
  }
}
