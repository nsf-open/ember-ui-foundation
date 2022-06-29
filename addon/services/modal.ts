import type BackdropService from '@nsf-open/ember-ui-foundation/services/backdrop';
import type ModalContainer from '@nsf-open/ember-ui-foundation/components/-internals/modal-container';
import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';

export enum ModalEvents {
  OpenRequest = 'openModalRequested',
  CloseRequest = 'closeModalRequested',
}

// eslint-disable-next-line ember/no-classic-classes
const EventedService = Service.extend(Evented);

/**
 * The ModalService exists to provide programmatic control of modal windows in the
 * application. Modal windows with a set name can be opened and closed from here
 * instead of having to set up a boolean flag in your controller/template or component.
 *
 * ```ts
 * import type { ModalService } from '@nsf-open/ember-ui-foundation/services';
 * import { inject as service } from '@ember/service';
 * // ...
 * @service
 * declare readonly modal: ModalService;
 * ```
 */
export default class ModalService extends EventedService {
  @service
  protected declare readonly backdrop: BackdropService;

  /**
   * A reference to the currently opened modal, if there is one.
   */
  protected currentModal: ModalContainer | null = null;

  /**
   * A reference to the HTMLElement that had focus before the modal was opened.
   * Since modals capture focus, this provides a way to return that focus to where
   * it was when the window first opened.
   */
  protected lastFocused: HTMLElement | null = null;

  /**
   * Opens a modal window with the given name. The name of a modal is provided via its `name`
   * attribute when defined in a template. Names must be unique.
   *
   * @param identifier The unique name of the modal to be opened.
   * @param [data]     A value that will be yielded back out within the modal body's template as `data`.
   * @param [title]    A title for the modal. Particularly useful if the title needs to be dynamic.
   */
  public open(identifier: string, data?: unknown, title?: string) {
    this.trigger(ModalEvents.OpenRequest, identifier, data, title);
  }

  /**
   * Closes the currently open modal window. Since only one modal can be open at a time no
   * more information is required.
   */
  public close() {
    this.trigger(ModalEvents.CloseRequest);
  }

  /**
   * A convenience method to access the BackdropService `open()` method that will
   * cause the overlay backdrop to be shown.
   */
  public showBackdrop(animate = true) {
    return this.backdrop.open(animate);
  }

  /**
   * A convenience method to access the BackdropService `close()` method that will
   * cause the overlay backdrop to be removed.
   */
  public hideBackdrop(animate = true) {
    return this.backdrop.close(animate);
  }

  /**
   * This will be called by a Modal before it begins to open. If another Modal is already
   * open it will first be given the opportunity to close.
   *
   * @protected
   */
  public async openRequested(target: ModalContainer, animate = true) {
    if (this.currentModal) {
      if (this.currentModal.onCanHide?.() === false) {
        target.onHideBlocked?.();
        return false;
      } else {
        const leavingModal = this.currentModal;
        this.currentModal = target;

        await leavingModal.closeDialog();
        return true;
      }
    } else {
      this.currentModal = target;
      await this.showBackdrop(animate);

      if (!this.lastFocused) {
        this.lastFocused = document.activeElement as HTMLElement;
      }

      return true;
    }
  }

  /**
   * @protected
   */
  async closeRequested(target: ModalContainer, animate = true) {
    if (this.currentModal === target) {
      await this.hideBackdrop(animate);
      this.currentModal = null;

      if (this.lastFocused) {
        this.lastFocused.focus();
        this.lastFocused = null;
      }
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    modal: ModalService;
  }
}
