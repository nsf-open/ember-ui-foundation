import type { AsyncBlockStateComponent, MessageOrMessageFunction, TaskFor } from '../component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * The UiAsyncBlockPendingView component is the default for a UiAsyncBlock whose managed
 * promise is in the pending state. It will display the standard UILoadIndicator with
 * accompanying text.
 *
 * If the UiAsyncBlock has not been named then it will display:
 * - "Loading..."
 *
 * And if it has been named:
 * - "Loading &lt;NAME&gt;"
 */
@tagName('')
@layout(template)
export default class UiAsyncBlockPendingView extends Component implements AsyncBlockStateComponent {
  public parentTask!: TaskFor;

  public parentName?: string;

  public message?: MessageOrMessageFunction;

  @computed('message', 'parentName', 'parentTask')
  protected get outputMessage() {
    if (this.message) {
      return typeof this.message === 'string'
        ? this.message
        : this.message(this.parentName, this.parentTask);
    }

    return this.defaultMessage(this.parentName);
  }

  protected defaultMessage(name?: string) {
    return isEmpty(name) ? 'Loading...' : `Loading ${name}`;
  }
}
