import type { Task } from 'ember-concurrency';
import { task } from 'ember-concurrency';
import ModalContainer from '../-internals/modal-container';
import { set } from '@ember/object';
import { or } from '@ember/object/computed';
import { layout } from '@ember-decorators/component';
import template from './template';
import { AlertLevel, SizeVariants } from '@nsf-open/ember-ui-foundation/constants';
import { extractErrorMessages } from '@nsf-open/ember-ui-foundation/utils';
import MessageManager from '@nsf-open/ember-ui-foundation/lib/MessageManager';

/**
 * The UiModal component creates a "modal window" or captive overlay on top of the application.
 * Focus and interaction with the application is limited to the modal's content so long as it
 * is open.
 *
 * Modals are split into two sections: the header and body. The content of the header is set via
 * the `title` property, while the body receives block content.
 *
 * ```handlebars
 * <UiModal @title="Hello World">
 *   <p>Here is some content</p>
 * </UiModal>
 * ```
 *
 * ## Opening a modal
 * Modals accept a boolean `open` property that can be toggled to programmatically control their
 * visibility.
 *
 * ```handlebars
 * <UiModal @title="Hello World" @open={{this.showModalWindow}}>
 *   <p>Here is some content</p>
 * </UiModal>
 * ```
 *
 * A modal can also be named, and then controlled via either the `{{open-modal}}` template helpers
 * or the injectable `modal` service.
 *
 * ### open-modal helper
 *
 * ```handlebars
 * {{!-- The open-modal helper allows you to create triggers without needing to touch a js/ts file. --}}
 * <UiButton @variant="primary" @onClick={{open-modal "confirm"}}>
 *   Confirm Your Choices
 * </UiButton>
 *
 * <UiModal @name="confirm" @title="Currently Selected Choices">
 *   <p>...</p>
 * </UiModal>
 * ```
 *
 * ### modal service
 *
 * ```handlebars
 * <UiModal @name="confirm" @title="Currently Selected Choices">
 *   <p>...</p>
 * </UiModal>
 * ```
 * ```ts
 * import type { ModalService } from '@nsf-open/ember-ui-foundation/services';
 * import { inject as service } from '@ember/service';
 * // ...
 * @service declare readonly modal: ModalService;
 *
 * openModal() {
 *   this.modal.open('confirm');
 * }
 * ```
 *
 * ## Closing a modal
 * As with opening, the `open` property can be set to false if you want to programmatically
 * close the modal. The `modal` service also provides a `close()` method that will accomplish
 * the same, and since only one modal can be open at a time `close()` does not require a name
 * argument.
 *
 * While a modal is open, there are also two pieces of UI available to be interacted with which
 * will cause the modal to be closed. The first is a button styled with basic exit (X) iconography
 * in the upper-right corner of the modal's header that is always made available unless explicitly
 * disabled.
 *
 * The second is a yielded `closeButton` UiButton component that can be placed wherever the
 * design requires.
 *
 * ```handlebars
 * <UiModal @title="Hello World" @open={{this.showModalWindow}} as |modal|>
 *   <p>Here is some content</p>
 *   {{modal.closeButton}}
 * </UiModal>
 * ```
 *
 * And there is yet one more way to close a modal...
 *
 * ## "Submitting" a modal
 * You're probably wondering what in the world "submitting a modal" means. In this context, to "submit"
 * the modal simply means to perform whatever actions are required when responding to the modal in
 * the affirmative. For a modal containing a form, this would mean submitting the form. If the modal
 * were acting as a confirmation prompt then this could mean navigating to another view, or calling some
 * API, or anything else - the sky is the limit. For other modals that are completely informational
 * this does not apply at all, and that is fine too.
 *
 * So what is it? Modals designed to have this sort of affirmative response typically all follow the same
 * workflow:
 *
 * 1. Some user interaction gets the ball rolling, a button click for example.
 * 2. The UI provides feedback that something is happening, and disables anything that could get in the way
 * of the process.
 * 3. If the action succeeds, then the modal should close. Its job is done.
 * 4. If the action fails, then all relevant UI should be re-enabled and the user notified of what went wrong.
 *
 * Opting into the UiModal submission workflow provides all of this with very little setup.
 *
 * ```handlebars
 * <UiModal @title="Update Your Credentials" @onSubmit={{this.somePromiseReturningMethod}} as |modal|>
 *   <form>...</form>
 *   {{modal.submitButton @text="Submit"}}
 * </UiModal>
 * ```
 *
 * The value passed to `onSubmit` must be a method that returns a promise. When the yielded `submitButton`
 * UiButton component is clicked, the provided method is executed and the promise it returns is used to
 * drive the modal's UI state.
 *
 * - While the promise is pending any close buttons will be disabled, as will the submit button which will
 * also display an indeterminate progress spinner.
 * - If the promise resolves, the modal will close itself gracefully.
 * - If the promise rejects, the modal will remain open, re-enable buttons, and display the message of the
 * throw error in an alert box.
 *
 * ## Messaging Block
 * If needed, UiModal will provide a UiAlertBlock instance for you - all you need to do is provide the MessageManager.
 * It will even clear the manager's content for you when the modal closes to keep that bit of state nice and tidy.
 *
 * ```handlebars
 * <UiModal @title="Hello World" @messageManager={{this.modalMessages}}>
 *   <p>Here is some content</p>
 * </UiModal>
 * ```
 *
 * ```ts
 * import type { MessageManager } from '@nsf-open/ember-ui-foundation';
 * import { messageManager } from '@nsf-open/ember-ui-foundation';
 * // ...
 * @messageManager()
 * declare readonly modalMessages: MessageManager;
 * ```
 *
 * @yield {hash} modal
 * @yield {unknown} modal.data - The `data` argument given.
 * @yield {() => void} modal.close - The modal’s `onClose` handler; useful for passing to
 * children components.
 * @yield {() => void | PromiseLike<unknown>} modal.submit - The modal’s `onSubmit` handler;
 * useful for passing to children components.
 * @yield {UiButton} modal.closeButton - A pre-configured close button for the modal.
 * @yield {UiButton} modal.submitButton - A pre-configured submit button for the modal.
 */
@layout(template)
export default class UiModal extends ModalContainer {
  public static readonly positionalParams = ['title'];

  /**
   * Boolean determining vertical position of the modal window. True centers the
   * modal window. False defaults it to top.
   */
  public centered = false;

  /**
   * The width of the modal window. Can be one of either "sm", "md", or "lg".
   */
  public size: SizeVariants = SizeVariants.Medium;

  /**
   * Whether the close UI (the header and optionally yielded button) are disabled.
   */
  public closeDisabled = false;

  /**
   * The value of the element's `data-test-id` attribute, if required.
   */
  public testId?: string;

  /**
   * The ui-modal will conveniently provide you with an ui-alert-block if you give it
   * a message manager instance to control the alert-block with.
   */
  public messageManager?: MessageManager;

  /**
   * Use the onSubmit callback in conjunction with the yielded "submitButton".
   */
  public onSubmit?: ((...args: unknown[]) => void | Promise<unknown>) | Task<unknown, unknown[]>;

  @or('closeDisabled', 'handleSubmit.isRunning')
  declare readonly disableCloseOptions: boolean;

  @task
  protected *handleSubmit(...rest: unknown[]) {
    try {
      this.getMessageManager()?.clear();

      const args = [...rest, this.data];

      // ui-buttons return the event instance from their onClick, no problem there.
      // For the sake of simplicity though, we're going to make sure the event is
      // at the end of arguments list.
      // const event = args.find((item) => {
      //   return (
      //     item instanceof Event || ('originalEvent' in item && item.originalEvent instanceof Event)
      //   );
      // });
      //
      // if (event) {
      //   const idx = args.indexOf(event);
      //   args.splice(idx, 1);
      //   args.push(event);
      // }

      if (this.onSubmit) {
        yield 'unlinked' in this.onSubmit
          ? this.onSubmit.unlinked().perform(...args)
          : this.onSubmit(...args);
      }

      yield this.close();
    } catch (err) {
      const messages = extractErrorMessages(err);

      if (messages) {
        this.getMessageManager(true)?.addMessagesMany(AlertLevel.ERROR, messages);
      }
    }
  }

  protected getMessageManager(createIfNeeded = false) {
    let manager = this.messageManager;

    if (!manager && createIfNeeded) {
      manager = new MessageManager();
      set(this, 'messageManager', manager);
    }

    return manager;
  }

  closeDialog() {
    this.getMessageManager()?.clear();
    return super.closeDialog();
  }
}
