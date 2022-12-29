import UiContextualContainer, {
  SelectorStrategies,
  TriggerEvents,
} from '../-internals/contextual-container/component';
import { manageFlowThroughFocus } from '@nsf-open/ember-ui-foundation/utils';

/**
 * The UiPopover component attaches itself to its parent element - typically a
 * button - and will display some text context in a styled flyout when the parent
 * is clicked.
 *
 * The major difference between this an UiTooltip is that the interaction is click
 * driven, and highly preferable if interactive content is to be rendered within
 * a flyout.
 *
 * ```handlebars
 * <UiButton @variant="primary">
 *   Log In
 *   <UiPopover @title="Please Log In to Your Account to Continue">
 *     <div class="form-group">
 *       <label for="username">Username</label>
 *       <input type="text" id="username" class="form-control" />
 *     </div>
 *
 *     <div class="form-group">
 *       <label for="password">Password</label>
 *       <input type="password" id="password" class="form-control" />
 *     </div>
 *
 *     <div class="text-right">
 *       <button type="button" class="btn btn-primary" onclick={{this.login}}>
 *         Login
 *       </button>
 *     </div>
 *   </UiPopover>
 * </UiButton>
 * ```
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
