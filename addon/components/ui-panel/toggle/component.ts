import UiButton from '@nsf/ui-foundation/components/ui-button/component';
import { setProperties } from '@ember/object';
import { ButtonVariants, Directions, DirectionsX } from '@nsf/ui-foundation/constants';

/**
 * The UiPanelToggleButton is the default button used by the UiPanel to toggle between
 * collapsed and expanded states.
 */
export default class UiPanelToggleButton extends UiButton {
  public isCollapsed = false;

  public variant = ButtonVariants.Link;

  public iconPlacement: DirectionsX = Directions.Right;

  public testId = 'toggle-btn';

  public classNames = ['mt--10px', 'mb--8px'];

  public buttonText = ['Expand', 'Collapse'];

  public buttonIcon = ['chevron-right', 'chevron-down'];

  public buttonAriaLabel = ['expand section', 'collapse section'];

  // Sentinel value to gate other changes
  private _lastCollapsedState?: boolean;

  /**
   * @protected
   */
  public didReceiveAttrs() {
    if (this._lastCollapsedState !== this.isCollapsed) {
      this._lastCollapsedState = this.isCollapsed;
      const collapsed = this.isCollapsed;

      setProperties(this, {
        text: this.buttonText[collapsed ? 0 : 1],
        icon: this.buttonIcon[collapsed ? 0 : 1],
        ariaLabel: this.buttonAriaLabel[collapsed ? 0 : 1],
        ariaExpanded: collapsed ? 'false' : 'true',
      });
    }

    super.didReceiveAttrs();
  }
}
