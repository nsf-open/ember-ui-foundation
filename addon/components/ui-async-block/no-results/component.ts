import type { AsyncBlockStateComponent, MessageOrMessageFunction, TaskFor } from '../component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { layout, tagName } from '@ember-decorators/component';
import { kindaLooksPlural } from '@nsf-open/ember-ui-foundation/utils';
import template from './template';

/**
 * The UiAsyncBlockNoResultsView component is the default for a UiAsyncBlock whose managed
 * promise resolves, but appears "empty".
 *
 * If the UiAsyncBlock has not been named then it will display:
 * - "No Content Is Available"
 *
 * And if it has been named it will attempt to determine the correct inflection and display:
 * - "No &lt;NAME&gt; &lt;have/has&gt; been added"
 */
@tagName('')
@layout(template)
export default class UiAsyncBlockNoResultsView
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
    return isEmpty(name)
      ? 'No Content Is Available'
      : `No ${name} ${kindaLooksPlural(name) ? 'have' : 'has'} been added`;
  }
}
