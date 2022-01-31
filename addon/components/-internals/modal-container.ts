import type ModalService from '@nsf/ui-foundation/services/modal';
import type BackdropService from '@nsf/ui-foundation/services/backdrop';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, setProperties } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { schedule, bind, next } from '@ember/runloop';
import { Promise, resolve } from 'rsvp';
import { tagName } from '@ember-decorators/component';
import { getRootElement, waitForTransitionEnd } from '@nsf/ui-foundation/utils';
import { ModalEvents } from '@nsf/ui-foundation/services/modal';

/**
 * @class UiModalContainer
 */
@tagName('')
export default class ModalContainer extends Component {
  @service
  declare readonly modal: ModalService;

  @service
  declare readonly backdrop: BackdropService;

  /**
   * Boolean. Toggles the modal window visible or hidden.
   */
  public open = false;

  /**
   * String. Naming a modal window allows it to be opened programmatically
   * via the modal service.
   */
  public name?: string;

  /**
   * The modal window's heading.
   */
  public title?: string;

  /**
   * A generic placeholder for information the modal might need. Same idea as
   * an Ember Controller's model - use it if you need it - though it's getting
   * a different name because "modal.model" is a confusing mouthful.
   *
   * @argument data
   * @type unknown
   */
  public data: unknown = null;

  /**
   * A callback method executed when the modal window begins opening.
   */
  public onShow?: () => void;

  /**
   * A callback method executed when the modal window finishes opening - after
   * any transitions are complete.
   */
  public onShown?: () => void;

  /**
   * A callback method executed when the modal window begins closing.
   */
  public onHide?: () => void;

  /**
   * A callback method executed when the modal window finishes closing - after
   * any transitions are complete.
   */
  public onHidden?: () => void;

  /**
   * A callback method executed when the modal window is about to begin closing. This
   * callback has the ability to deny that from occurring if desired by returning a
   * boolean false. In conjunction with `onHideBlocked` this can be used to create
   * some interesting multi-modal workflow patterns.
   */
  public onCanHide?: () => void | boolean;

  /**
   * A callback method executed when the modal window is blocked from being opened
   * because another is currently open and refusing to close. In conjunction with
   * `onCanHide` this can be used to create some interesting multi-modal workflow
   * patterns.
   */
  public onHideBlocked?: () => void;

  public renderInPlace = false;

  /**
   * @protected
   */
  dialogId!: string;

  /**
   * @protected
   */
  identifier!: string;

  /**
   * @protected
   */
  destinationElement!: HTMLElement;

  /**
   * @protected
   */
  scrollbarWidth!: number;

  /**
   * @protected
   */
  paddingLeft: number | null = null;

  /**
   * @protected
   */
  paddingRight: number | null = null;

  /**
   * @protected
   */
  isOpen = false;

  /**
   * @protected
   */
  inDom = false;

  /**
   * @protected
   */
  showDialog = false;

  /**
   * @protected
   */
  bodyOverflow = false;

  /**
   * @protected
   */
  originalBodyPad: string | null = null;

  /**
   * @protected
   */
  resizeListener: EventListener | null = null;

  /**
   * @protected
   */
  _renderInPlace = false;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();
    const guid = guidFor(this);

    setProperties(this, {
      dialogId: `${guid}-dialog`,
      identifier: this.name || guid,
    });

    // eslint-disable-next-line ember/classic-decorator-no-classic-methods,ember/no-observers
    this.addObserver('open', this, this.openPropertyWatcher);
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didInsertElement() {
    super.didInsertElement();
    const destinationElement = getRootElement(this);

    setProperties(this, {
      destinationElement,
      _renderInPlace: this.renderInPlace || !destinationElement,
      scrollbarWidth: this.calculateScrollbarWidth(),
    });

    const modal = this.modal;
    modal.on(ModalEvents.OpenRequest, this, this.handleOpenRequest);
    modal.on(ModalEvents.CloseRequest, this, this.handleCloseRequest);

    if (this.open) {
      next(this, this.openDialog);
    }
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    this.detachResizeListener();
    this.resetLayout();

    const modal = this.modal;
    modal.off(ModalEvents.OpenRequest, this, this.handleOpenRequest);
    modal.off(ModalEvents.CloseRequest, this, this.handleCloseRequest);

    if (this.isOpen) {
      modal.closeRequested(this, false);
    }

    // eslint-disable-next-line ember/classic-decorator-no-classic-methods
    this.removeObserver('open', this, this.openPropertyWatcher);
    super.willDestroyElement();
  }

  get dialogElement(): HTMLElement | null {
    return document.getElementById(this.dialogId);
  }

  calculateScrollbarWidth(): number {
    const element = this.dialogElement;

    if (element) {
      const scrollDiv = document.createElement('div');
      scrollDiv.className = 'modal-scrollbar-measure';

      if (element.parentNode) {
        element.parentNode.insertBefore(scrollDiv, element.nextSibling);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        if (scrollDiv.parentNode) {
          scrollDiv.parentNode.removeChild(scrollDiv);
        }

        return scrollbarWidth;
      }
    }

    return 0;
  }

  setDomMarker() {
    return new Promise((resolveFn) => {
      if (this.inDom || this.destructionCheck()) {
        resolveFn();
        return;
      }

      set(this, 'inDom', true);

      next(this, () => {
        schedule('afterRender', this, resolveFn);
      });
    });
  }

  removeDomMarker() {
    return new Promise((resolveFn) => {
      if (!this.inDom || this.destructionCheck()) {
        resolveFn();
        return;
      }

      set(this, 'inDom', false);
      schedule('afterRender', this, resolveFn);
    });
  }

  adjustLayout() {
    const element = this.dialogElement;

    if (element) {
      const modalOverflow = element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = this.backdrop.scrollbarWidth;

      set(this, 'paddingLeft', modalOverflow ? scrollbarWidth : null);
    } else {
      set(this, 'paddingLeft', null);
    }
  }

  resetLayout() {
    if (!this.isDestroying && !this.isDestroyed) {
      set(this, 'paddingLeft', null);
    }
  }

  attachResizeListener() {
    if (!this.resizeListener) {
      this.resizeListener = bind(this, this.adjustLayout);
      window.addEventListener('resize', this.resizeListener, false);
    }
  }

  detachResizeListener() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener, false);
      this.resizeListener = null;
    }
  }

  // Event listener for the modal service
  handleOpenRequest(identifier: string, data?: unknown, title?: string) {
    const isTarget = this.identifier === identifier && !this.isOpen;

    if (isTarget) {
      set(this, 'data', data);

      if (title) {
        set(this, 'title', title);
      }

      return this.openDialog();
    }

    return resolve();
  }

  // Event listener for the modal service
  handleCloseRequest() {
    return this.close();
  }

  // Action yielded out in templates
  close() {
    return this.isOpen ? this.closeDialog() : resolve();
  }

  destructionCheck() {
    return this.isDestroying || this.isDestroyed;
  }

  async openPropertyWatcher() {
    if (this.open && !this.isOpen) {
      await this.openDialog();
    } else if (!this.open && this.isOpen) {
      await this.closeDialog();
    }
  }

  async openDialog() {
    if (this.destructionCheck() || this.isOpen || !(await this.modal.openRequested(this))) {
      return;
    }

    setProperties(this, {
      open: true,
      isOpen: true,
    });

    await this.setDomMarker();

    this.onShow?.();

    this.adjustLayout();
    this.attachResizeListener();

    const element = this.dialogElement;

    if (element && !this.destructionCheck()) {
      set(this, 'showDialog', true);
      await waitForTransitionEnd(element, 300);
      this.onShown?.();
    }
  }

  async closeDialog() {
    if (this.destructionCheck() || !this.isOpen) {
      return;
    }

    this.onHide?.();
    set(this, 'showDialog', false);

    const element = this.dialogElement;

    if (element) {
      await waitForTransitionEnd(element, 300);
    }

    await this.removeDomMarker();

    this.detachResizeListener();
    this.resetLayout();
    this.onHidden?.();

    await this.modal.closeRequested(this);

    if (!this.destructionCheck()) {
      setProperties(this, {
        open: false,
        isOpen: false,
      });
    }
  }
}
