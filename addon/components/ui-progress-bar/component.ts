import type ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

@tagName('')
@layout(template)
export default class UiProgressBar extends Component {
  /**
   * The ProgressManager that this progress bar will use to create
   * navigation elements. Each ProgressItem in the manager will receive
   * a chevron with usage based on that step being `complete`.
   */
  public declare readonly manager: ProgressManager<unknown>;

  public compact = true;

  public checkmark = false;

  /**
   * Passes the clicked-on chevron index back to the manager.
   */
  protected handleChevronClick(idx: number, event: Event) {
    event.preventDefault();
    this.manager.goToStep(idx);
  }
}
