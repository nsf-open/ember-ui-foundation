import UiContextualContainer, {
  SelectorStrategies,
  TriggerEvents,
} from '../-internals/contextual-container/component';
import { manageFlowThroughFocus } from '@nsf-open/ember-ui-foundation/utils';

/**
 *
 */
export default class UiPopoverContextContainer extends UiContextualContainer {
  /**
   * The amount of time, in milliseconds, between the triggering interaction
   * and when the tooltip is displayed.
   */
  delay = 150;

  distance = 11;

  /** @hidden */
  ariaAttachAs = 'aria-controls';

  /** @hidden */
  closeOnOutsideClick = false;

  /** @hidden */
  triggerEvents = TriggerEvents.CLICK;

  /** @hidden */
  triggerSelector = SelectorStrategies.PARENT;

  /** @hidden */
  readonly overlayComponent = 'ui-popover/element';

  private removeFocus?: () => void;

  public didInsertElement() {
    super.didInsertElement();
    this.getAriaElement()?.setAttribute('aria-expanded', 'false');
  }

  /** @hidden */
  onShow = () => {
    const trigger = this.getAriaElement();

    trigger?.setAttribute('aria-expanded', 'true');

    // Focus management only needs to occur if the popover is not being
    // rendered inline.
    if (!this.actuallyRenderInPlace) {
      this.removeFocus = manageFlowThroughFocus(
        this.getOverlayElement() ?? undefined,
        trigger ?? undefined
      );
    }
  };

  /** @hidden */
  onHide = () => {
    this.getAriaElement()?.setAttribute('aria-expanded', 'true');
    this.removeFocus?.();
    this.removeFocus = undefined;
  };
}
