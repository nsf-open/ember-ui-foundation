import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { guidFor } from '@ember/object/internals';
import { set } from '@ember/object';
import { bind } from '@ember/runloop';
import { ButtonVariants, KeyNames } from '../../constants';
import template from './template';

enum ListNav {
  FIRST,
  LAST,
  PREV,
  NEXT,
}

/**
 * Menus allow for several related actions/options to be grouped together and only made visible when requested.
 *
 * ```js
 * {{#ui-menu "Align" as |menu|}}
 *   {{menu.item "Left"  onClick=(action this.handleAlignSelection "left")}}
 *   {{menu.item "Right" onClick=(action this.handleAlignSelection "right")}}
 * {{/ui-menu}}
 * ```
 *
 * The yielded `item` is just a button with it's styling preconfigured.
 *
 * By default, the menu options flyout will be positioned below and right of the trigger button, but will
 * automatically pick another orientation if the trigger's placement requires it.
 *
 * Accessibility-wise the menu announces itself as such, and provides the expected navigation using keys
 * such as `arrow up`, `arrow down`, `escape`, `enter`, and `spacebar`.
 *
 * @class UiMenu
 */
@tagName('')
@layout(template)
export default class UiMenu extends Component {
  public static readonly positionalParams = ['buttonText'];

  /**
   * Boolean. Programmatically toggle the menu flyout.
   *
   * @argument visible
   * @type {boolean}
   * @default false
   * @public
   */
  public visible = false;

  /**
   * The text content of the trigger button. This can also be set as the first positional parameter
   * of the component.
   *
   * @argument buttonText
   * @type {string}
   * @default undefined
   * @public
   */
  public buttonText?: string;

  /**
   * The style variant of the control.
   *
   * @argument variant
   * @type {string}
   * @default "primary"
   * @public
   */
  public variant = ButtonVariants.Primary;

  /**
   * The value of the element's `data-test-id` attribute, if required.
   *
   * @argument testId
   * @type {string}
   * @default undefined
   * @public
   */
  public testId?: string;

  /**
   * Boolean. Disables interaction with the control.
   *
   * @argument disabled.
   * @type {boolean}
   * @default false
   * @public
   */
  public disabled = false;

  private overlayElement!: HTMLElement;

  private overlayKeyListener!: EventListener;

  triggerId!: string;

  overlayId!: string;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    const guid = guidFor(this);
    set(this, 'triggerId', `${guid}-button`);
    set(this, 'overlayId', `${guid}-menu`);
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didInsertElement() {
    super.didInsertElement();

    this.overlayElement = this.getOverlayElement() as HTMLElement;

    if (this.overlayElement) {
      this.overlayKeyListener = bind(this, this.handleOverlayKeyEvents);
      this.overlayElement.addEventListener('keydown', this.overlayKeyListener);
    }
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    super.willDestroyElement();

    if (this.overlayElement && this.overlayKeyListener) {
      this.overlayElement.removeEventListener('keydown', this.overlayKeyListener);
    }
  }

  protected setVisibility(state: boolean) {
    if (this.visible !== state && !this.isDestroying && !this.isDestroyed) {
      set(this, 'visible', state);
    }
  }

  protected getOverlayElement() {
    return document.getElementById(this.overlayId);
  }

  protected getMenuItems() {
    const selectorString = '[role="menuitem"]:not([disabled])';

    return this.overlayElement
      ? ([...this.overlayElement.querySelectorAll(selectorString)] as HTMLElement[])
      : [];
  }

  protected focusOnMenuItem(cmd: ListNav) {
    const menuItems = this.getMenuItems();

    if (cmd === ListNav.FIRST) {
      return menuItems[0].focus();
    } else if (cmd === ListNav.LAST) {
      return menuItems[menuItems.length - 1].focus();
    }

    const current = document.activeElement as HTMLElement | null;
    const currentIdx = current ? menuItems.indexOf(current) : -1;

    if (currentIdx === -1) {
      return menuItems[0].focus();
    } else if (cmd === ListNav.NEXT) {
      const nextIdx = currentIdx + 1 >= menuItems.length ? 0 : currentIdx + 1;
      return menuItems[nextIdx].focus();
    } else if (cmd === ListNav.PREV) {
      const prevIdx = currentIdx - 1 < 0 ? menuItems.length - 1 : currentIdx - 1;
      return menuItems[prevIdx].focus();
    }
  }

  /**
   * Moves document focus to the trigger button.
   *
   * @method focusOnTrigger
   * @protected
   */
  protected focusOnTrigger() {
    const trigger = document.getElementById(this.triggerId);

    if (trigger) {
      trigger.focus();
    }
  }

  /**
   * @method handleOverlayShown
   * @protected
   */
  protected handleOverlayShown() {
    this.setVisibility(true);
    this.focusOnMenuItem(ListNav.FIRST);
  }

  /**
   * @method handleOverlayHidden
   * @protected
   */
  protected handleOverlayHidden() {
    this.setVisibility(false);
  }

  /**
   * The keydown event listener for the trigger button. Provides keyboard navigation
   * when focused on the open/close button.
   *
   * @method handleTriggerKeyEvents
   * @param {KeyboardEvent} event
   * @protected
   */
  protected handleTriggerKeyEvents(event: KeyboardEvent) {
    const key = event.key;

    if (this.visible && (KeyNames.Escape === key || KeyNames.ArrowUp === key)) {
      this.setVisibility(false);
      event.preventDefault();
    } else if (KeyNames.ArrowDown === key) {
      this.setVisibility(true);
      event.preventDefault();
    }
  }

  /**
   * The keydown event listener for the menu overlay. Provides keyboard navigation
   * through the list of menu items.
   *
   * @method handleOverlayKeyEvents
   * @param {KeyboardEvent} event
   * @protected
   */
  protected handleOverlayKeyEvents(event: KeyboardEvent) {
    switch (event.key) {
      case KeyNames.Escape:
        this.setVisibility(false);
        this.focusOnTrigger();
        event.preventDefault();
        break;

      case KeyNames.ArrowDown:
        this.focusOnMenuItem(ListNav.NEXT);
        event.preventDefault();
        break;

      case KeyNames.ArrowUp:
        this.focusOnMenuItem(ListNav.PREV);
        event.preventDefault();
        break;
    }
  }

  /**
   * @method handleMenuItemClick
   * @protected
   */
  protected handleMenuItemClick() {
    this.setVisibility(false);
    this.focusOnTrigger();
  }
}
