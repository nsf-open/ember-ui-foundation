import type { TaskGenerator } from 'ember-concurrency';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { dropTask } from 'ember-concurrency';
import { perform } from 'ember-concurrency-ts';
import { isPromiseLike } from '@nsf-open/ember-general-utils';

/**
 * The AsyncAwareComponent is a low-level component that other components can extend
 * if they need to manage state based on the status of a pending/settled promise.
 *
 * @class AsyncAwareComponent
 */
export default class AsyncAwareComponent<Result = unknown> extends Component {
  /**
   * @argument isPending
   * @type {boolean}
   * @readonly
   */
  @reads('managePromise.isRunning')
  declare readonly isPending: boolean;

  /**
   * A Promise instance that will drive the component's state.
   *
   * @argument promise
   * @type {PromiseLike<unknown>}
   */
  public get promise() {
    return this._promise;
  }

  public set promise(value: PromiseLike<Result> | undefined) {
    this._promise = value;

    if (isPromiseLike(value)) {
      perform(this.managePromise, value);
    }
  }

  protected _promise?: PromiseLike<Result>;

  @dropTask
  protected *managePromise(promise: PromiseLike<Result>): TaskGenerator<Result> {
    return yield promise;
  }
}
