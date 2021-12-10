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

  /**
   * If true, chevrons will only take up as much width as is needed for their
   * text content and the progress bar may not be as wide as its parent container.
   *
   * This is ignored at smaller screen widths - the progress bar always takes the
   * full width of its container.
   */
  public compact = true;

  /**
   * If true, a checkmark will appear at the end of any chevron whose progress
   * item is completed.
   */
  public checkmark = false;

  /**
   * If true, the text of each chevron will be prefixed with an ascending integer
   * starting at 1. Numbers are always shown at smaller screen widths due to the
   * limited horizontal space.
   */
  public number = false;

  /**
   * Passes the clicked-on chevron index back to the manager.
   */
  protected handleChevronClick(idx: number, event: Event) {
    event.preventDefault();
    this.manager.goToStep(idx);
  }
}
