import type { AsyncBlockStateComponent, MessageOrMessageFunction, TaskFor } from '../component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

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
