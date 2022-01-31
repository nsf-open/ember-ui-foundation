import type Component from '@ember/component';
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
 * The UiAsyncBlock component is designed to consistently manage the pending
 * state -> resolve/reject UI lifecycle that is ubiquitous in most applications.
 * It does this by selectively rendering a specific component based on the
 * current status of the provided PromiseLike.
 *
 * You typically won't need to interact with this component directly, as it is
 * already embedded into many other components (see Panels, for example). If and/or
 * when you need to change up the defaults thought, there are a number of ways to do
 * so.
 *
 * ### Mad-Libs
 * The whole history of this component can be summed up in the all-too-familiar story
 * of developers getting frustrated with having to code the same hunk of logic again
 * and again. You need to display something that requires a fetch. If the fetch succeeds
 * then great, but if it fails, or if it's "empty" (you know, zero results found), or
 * while it's in-flight, you have to relay _something_ to the humans.
 *
 * You're now throwing conditionals in your templates based on a promise's state and despite
 * this being your 100th rodeo you know that 9 times out of 10 the only difference in
 * anything that you're copy/pasting will be one or two words.
 *
 * Here is where the simplicity of the UiAsyncBlock's configuration (hopefully) shines. Go
 * ahead and just name the thing you're fetching.
 *
 * ```hbs
 * <UiAsyncBlock @name="Albums" @promise={{this.someAlbumLoadingPromise}}>
 *   <p>This will render when the promise resolves.</p>
 * </UiAsyncBlock>
 * ```
 *
 * What will be shown to users along the way is:
 *
 * - __Loading__: "Loading Albums"
 * - __Rejected__: "Could not retrieve Albums"
 * - __Empty__: "No Albums have been added"
 *
 * It is far from perfect, and will absolutely not cover ever conceivable situation, but it
 * is surprising just how many situations it _does_ cover - with a single string.
 *
 * ### Message Builders
 * To fully tailor messages that are displayed, there are the `pendingMessage`, `rejectedMessage`
 * and `noResultsMessage` properties that can be set as either a string literal or function.
 *
 * If a function is provided, it will be required to return a string. The name of the UiAsyncBlock
 * (if set), and the promise being managed are provided as arguments.
 *
 * ```ts
 * const customPendingMessage = function(name: string | undefined, promise: PromiseLike) {
 *   return `One second on that, we're out back fetching some ${name}`;
 * }
 * ```
 *
 * Do note that `rejectedMessage` and `noResultsMessage` functions will be called _AFTER_ the
 * promise has settled. Having access to the settled promise isn't typically all that useful, but
 * if you are using Ember Concurrency tasks instead - that could be quite handy.
 *
 * ### Custom Components
 * If neither naming the UiAsyncBlock nor providing custom messages is enough, then you can also
 * swap out entire components. The default components used are `ui-async-block/pending`,
 * `ui-async-block/rejected` and `ui-async-block/no-results`.
 *
 * For any component being used as such, it can be described with the AsyncBlockStateComponent interface.
 *
 * ```ts
 * interface AsyncBlockStateComponent<Result = unknown> {
 *   // The Ember Concurrency task managing the UiAsyncBlock's state
 *   parentTask: TaskFor<Result>;
 *
 *   // The name of the UiAsyncBlock, if provided.
 *   parentName?: string;
 *
 *   // The message string or builder function relevant to the current state.
 *   message?: MessageOrMessageFunction<Result>;
 * }
 * ```
 */
@tagName('')
@layout(template)
export default class UiAsyncBlock<Result = unknown> extends AsyncAwareComponent<Result> {
  public static readonly positionalParams = ['name', 'promise'];

  /**
   * An optional fourth state for the block that seems common enough in the application to
   * warrant a spot here. When true, if the Promise resolves, but its returned value is
   * "empty" - null, an empty string, or very commonly an empty array - then a message will be
   * shown in the same way as with the loading and error states.
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
   */
  public name?: string;

  /**
   * A message to show while the promise is pending.
   */
  public pendingMessage?: MessageOrMessageFunction<Result>;

  /**
   * A message to show when the promise has rejected.
   */
  public rejectedMessage?: MessageOrMessageFunction<Result>;

  /**
   * A message to show when the promise has resolved with an "empty" value.
   * This will only be used when the `noResults` property is true.
   */
  public noResultsMessage?: MessageOrMessageFunction<Result>;

  /**
   * The component that will render while the managed promise is in a pending
   * state.
   */
  public pendingComponent: string | typeof Component = 'ui-async-block/pending';

  /**
   * The component that will render when the managed promise is rejected.
   */
  public rejectedComponent: string | typeof Component = 'ui-async-block/rejected';

  /**
   * The component that will render when the managed promise resolves, but contains
   * no content. This will only be used when `noResults` is true.
   */
  public noResultsComponent: string | typeof Component = 'ui-async-block/no-results';

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
