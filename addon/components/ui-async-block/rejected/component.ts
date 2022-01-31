import type { AsyncBlockStateComponent, MessageOrMessageFunction, TaskFor } from '../component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * The UiAsyncBlockRejectedView component is the default for a UiAsyncBlock whose managed
 * promise has been rejected. It will display a Font Awesome "exclamation-triangle" with
 * accompanying text that will both be styled in the "danger" text variant.
 *
 * If the UiAsyncBlock has not been named then it will display:
 * - "An Error Has Occurred"
 *
 * And if it has been named:
 * - "Could not retrieve &lt;NAME&gt;"
 */
@tagName('')
@layout(template)
export default class UiAsyncBlockRejectedView
  extends Component
  implements AsyncBlockStateComponent
{
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
    return isEmpty(name) ? 'An Error Has Occurred' : `Could not retrieve ${name}`;
  }
}
