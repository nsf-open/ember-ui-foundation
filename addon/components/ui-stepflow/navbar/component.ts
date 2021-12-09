import type ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

@tagName('')
@layout(template)
export default class UiStepflowNavbar extends Component {
  public declare readonly manager: ProgressManager<unknown>;

  public submitButtonText = 'Submit';

  public cancellationRoute?: string;

  public testId?: string;

  public completeStepFlow?: () => void;

  @computed('testId')
  public get navBarTestId() {
    return typeof this.testId === 'string' ? `${this.testId}-navigation` : undefined;
  }

  @action
  protected handleSubmit() {
    this.completeStepFlow?.();
  }
}
