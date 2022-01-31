import Service from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { next } from '@ember/runloop';
import { Promise } from 'rsvp';
import { getRootElement, waitForTransitionEnd } from '@nsf/ui-foundation/utils';

const BODY_CLASS = 'modal-open';
const FADE_CLASS = 'fade';
const SHOW_CLASS = 'in';
const BACKDROP_CLASS = 'modal-backdrop';

function hasClassName(element: HTMLElement, className: string) {
  return !!element?.classList.contains(className);
}

function addClassName(element: HTMLElement, className: string) {
  if (element && !hasClassName(element, className)) {
    element.classList.add(className);
  }
}

function removeClassName(element: HTMLElement, className: string) {
  if (hasClassName(element, className)) {
    element.classList.remove(className);
  }
}

function calculateScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.width = '50px';

  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

/**
 * The BackdropService provides a single mechanism for controlling the full window
 * overlay that appears behind modal windows, loading indicators, or whatever else
 * is needed. When the backdrop is "enabled", the document body cannot be scrolled
 * and it's content is muted with a semi-transparent opacity layer.
 *
 * @class BackdropService
 */
export default class BackdropService extends Service {
  /**
   * The id of the backdrop element.
   */
  public backdropId!: string;

  /**
   * The calculated width of a scrollbar for the browser being used. When the backdrop
   * is enabled this is set as padding on the document body if needed to counteract
   * losing the vertical scrollbar. Not doing so would result in a very obvious and
   * unsightly horizontal jump of content.
   */
  public scrollbarWidth!: number;

  public bodyOverflow = false;

  public originalBodyPad = '';

  /**
   * The HTMLElement playing the role of the backdrop, if it exists.
   */
  private get backdropElement() {
    return document.getElementById(this.backdropId);
  }

  /**
   * Show the backdrop. The returned promise will resolve once the opacity
   * animation has completed, or immediately if animation is disabled.
   *
   * @param [animate] Whether or not the opacity of the backdrop should be animated.
   */
  public open(animate = true): Promise<void> {
    return new Promise((resolve) => {
      this.lockDocumentBody();
      const backdrop = this.backdropElement || this.createBackdropElement();

      if (!backdrop || hasClassName(backdrop, SHOW_CLASS)) {
        resolve();
      } else if (animate) {
        addClassName(backdrop, FADE_CLASS);

        next(this, () => {
          addClassName(backdrop, SHOW_CLASS);
          waitForTransitionEnd(backdrop, 150).then(resolve);
        });
      } else {
        addClassName(backdrop, SHOW_CLASS);
        resolve();
      }
    });
  }

  /**
   * Hide the backdrop. The returned promise will resolve once the backdrop HTMLElement
   * is removed and scrolling has been returned to the document body.
   *
   * @param [animate] Whether or not the opacity of the backdrop should be animated.
   */
  public close(animate = true): Promise<void> {
    return new Promise((resolve) => {
      const backdrop = this.backdropElement;

      if (!backdrop) {
        resolve();
      } else if (animate) {
        removeClassName(backdrop, SHOW_CLASS);

        waitForTransitionEnd(backdrop, 150).then(() => {
          this.unlockDocumentBody();
          this.destroyBackdropElement();
          resolve();
        });
      } else {
        this.unlockDocumentBody();
        this.destroyBackdropElement();
        resolve();
      }
    });
  }

  private lockDocumentBody() {
    this.bodyOverflow = document.body.clientWidth < window.innerWidth;
    this.originalBodyPad = document.body.style.paddingRight || '';

    if (this.bodyOverflow) {
      const bodyPad = parseInt((document.body.style.paddingRight || '0').replace('px', ''), 10);
      document.body.style.paddingRight = `${bodyPad + this.scrollbarWidth}px`;
    }

    addClassName(document.body, BODY_CLASS);
  }

  private unlockDocumentBody() {
    document.body.style.paddingRight = this.originalBodyPad;

    this.bodyOverflow = false;
    this.originalBodyPad = '';

    removeClassName(document.body, BODY_CLASS);
  }

  private createBackdropElement(): HTMLElement | null {
    const destination = getRootElement(this);

    if (destination) {
      const backdrop = document.createElement('div');
      backdrop.id = this.backdropId;

      backdrop.classList.add(BACKDROP_CLASS);
      destination.appendChild(backdrop);

      return backdrop;
    }

    return null;
  }

  private destroyBackdropElement() {
    const backdrop = this.backdropElement;
    backdrop?.parentElement?.removeChild(backdrop);
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();
    this.backdropId = `${guidFor(this)}-backdrop`;
    this.scrollbarWidth = calculateScrollbarWidth();
  }

  /**
   * Cleanup. Ensure that the backdrop is destroyed if this service is disposed of.
   *
   * @protected
   */
  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    this.destroyBackdropElement();
    return super.destroy();
  }
}

declare module '@ember/service' {
  interface Registry {
    backdrop: BackdropService;
  }
}
