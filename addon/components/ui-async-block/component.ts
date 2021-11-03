import type { TaskForTaskFunction, TaskFunction } from 'ember-concurrency';
import AsyncAwareComponent from '@nsf/ui-foundation/components/-internals/async-aware-component';
import { layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { taskFor } from 'ember-concurrency-ts';
import template from './template';

export type TaskFor<Result = unknown> = TaskForTaskFunction<TaskFunction<Result, never>>;

export type MessageOrMessageFunction<Result = unknown, T extends TaskFor = TaskFor<Result>> =
  | string
  | ((name: string | undefined, task: T) => string);

/**
 * A minimal interface describing what UiAsyncBlock will provide to a component that is being
 * used to show state. See the no-results, pending, and rejected child components for
 * reference usage.
 */
export interface AsyncBlockStateComponent<Result = unknown> {
  parentTask: TaskFor<Result>;
  parentName?: string;
  message?: MessageOrMessageFunction<Result>;
}

/**
 * An Async Block is designed to consistently manage the data loading -> resolve/reject UI
 * lifecycle. Given a promise to watch, the block will show loading progress, and then
 * either yield out of the resolved Promise response, or display an error message if the
 * Promise fails.
 *
 * @class UiAsyncBlock
 * @extends AsyncAwareComponent
 */
@tagName('')
@layout(template)
export default class UiAsyncBlock<Result = unknown> extends AsyncAwareComponent<Result> {
  public static readonly positionalParams = ['name', 'promise'];

  /**
   * An optional fourth "state" for the block that seems common enough in the application to
   * warrant a spot here. When true, if the Promise resolves, but its returned value is
   * "empty" - null, an empty string, or very commonly an empty array - then a message will be
   * shown in the same way as with the loading and error states.
   *
   * @argument noResults
   * @type {boolean}
   * @default false
   */
  public noResults = false;

  /**
   * A name for the sort of thing this async block is managing. If provided, it'll be used
   * to play a game of mad-libs and customize the various messages displayed. For example,
   * if set to "Witty Catchphrases":
   *
   * * Pending Message:     "Loading Witty Catchphrases"
   * * Rejected Message:    "Could not retrieve Willy Catchphrases"
   * * No Results Message:  "No Witty Catchphrases have been added"
   *
   * @argument name
   * @type {string}
   * @default undefined
   */
  public name?: string;

  /**
   * A message to show while the promise is pending.
   *
   * @argument pendingMessage
   * @type {MessageOrMessageFunction}
   * @default "Loading..."
   */
  public pendingMessage?: MessageOrMessageFunction<Result>;

  /**
   * A message to show when the promise has rejected.
   *
   * @argument rejectedMessage
   * @type {MessageOrMessageFunction}
   * @default "An Error Has Occurred"
   */
  public rejectedMessage?: MessageOrMessageFunction<Result>;

  /**
   * A message to show when the promise has resolved with an "empty" value.
   * This will only be used when the `noResults` property is true.
   *
   * @argument noResultsMessage
   * @type {MessageOrMessageFunction}
   * @default "No Content Is Available"
   */
  public noResultsMessage?: MessageOrMessageFunction<Result>;

  /**
   * @argument pendingComponent
   * @type {string}
   * @default "ui-async-block/pending"
   */
  public pendingComponent = 'ui-async-block/pending';

  /**
   * @argument rejectedComponent
   * @type {string}
   * @default "ui-async-block/rejected"
   */
  public rejectedComponent = 'ui-async-block/rejected';

  /**
   * @argument noResultsComponent
   * @type {string}
   * @default "ui-async-block/no-results"
   */
  public noResultsComponent = 'ui-async-block/no-results';

  /**
   * The name of the component to render based on the current state of the managing Task.
   */
  @computed(
    'managePromise',
    'managePromise.isRunning',
    'managePromise.last.{isError,value}',
    'noResults',
    'pendingComponent',
    'rejectedComponent',
    'noResultsComponent'
  )
  protected get componentToRender() {
    const promiseTask = taskFor(this.managePromise);

    if (promiseTask.isRunning) {
      return this.pendingComponent;
    }

    if (promiseTask.last?.isError) {
      return this.rejectedComponent;
    }

    if (this.noResults && isEmpty(promiseTask.last?.value)) {
      return this.noResultsComponent;
    }

    return undefined;
  }

  /**
   * The custom message text/function to go along with the current component, if provided.
   */
  @computed(
    'componentToRender',
    'pendingComponent',
    'pendingMessage',
    'rejectedComponent',
    'rejectedMessage',
    'noResultsComponent',
    'noResultsMessage'
  )
  protected get customMessage() {
    switch (this.componentToRender) {
      case this.pendingComponent:
        return this.pendingMessage;

      case this.rejectedComponent:
        return this.rejectedMessage;

      case this.noResultsComponent:
        return this.noResultsMessage;

      default:
        return undefined;
    }
  }
}
