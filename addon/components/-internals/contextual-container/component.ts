import type { EmberRunTimer } from '@ember/runloop/types';
import Component from '@ember/component';
import EmberObject, { computed, set } from '@ember/object';
import { reads, gt } from '@ember/object/computed';
import { addObserver } from '@ember/object/observers';
import { guidFor } from '@ember/object/internals';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { bind, cancel, later, next, schedule } from '@ember/runloop';
import { layout, tagName } from '@ember-decorators/component';
import {
  addAriaAttribute,
  removeAriaAttribute,
  waitForTransitionEnd,
  createOutsideClickListener,
  removeOutsideClickListener,
  getRootElement,
} from '@nsf/ui-foundation/utils';
import template from './template';

export enum SelectorStrategies {
  PARENT = 'parent',
  PARENT_VIEW = 'parentView',
  SELF = 'element',
}

export enum TriggerEvents {
  CLICK = 'click',
  HOVER = 'hover',
  FOCUS = 'focus',
}

const TriggerEventsMap = {
  [TriggerEvents.HOVER]: ['mouseenter', 'mouseleave'],
  [TriggerEvents.FOCUS]: ['focusin', 'focusout'],
  [TriggerEvents.CLICK]: 'click',
};

enum HoverState {
  IN = 'in',
  OUT = 'out',
}

class UiContextContainerInState extends EmberObject {
  public [TriggerEvents.HOVER] = false;
  public [TriggerEvents.FOCUS] = false;
  public [TriggerEvents.CLICK] = false;

  get show() {
    return this[TriggerEvents.CLICK] || this[TriggerEvents.HOVER] || this[TriggerEvents.FOCUS];
  }
}

/**
 * A base class for associating "reference" and "overlay" DOM elements with each other, as
 * would be needed for tooltips, popovers, floating menus, etc. Used in close coordination with
 * UiContextualElement, and UiPopper.
 */
@tagName('')
@layout(template)
export default class UiContextualContainer extends Component {
  public static readonly positionalParams = ['textContent'];

  /**
   * Placement of the positioned element, relative to its reference element.
   * One of ['top', 'right', 'bottom', 'left'].
   */
  public placement = 'top';

  /**
   * If true, the positioned element will change its position automatically based
   * on available space.
   */
  public autoPlacement = true;

  /**
   * Whether the component is accepting any interactions.
   */
  public enabled = true;

  /**
   * Whether the positioned element is in view.
   */
  public visible = false;

  /**
   * The amount of time, in milliseconds, between the trigger event occurring
   * and the positioned element being shown or hidden. This value is applied
   * equally to both show and hide events. See `delayShow` and `delayHide` to
   * control each value independently.
   */
  public delay = 0;

  /**
   * The amount of time, in milliseconds, between the trigger event occurring
   * and the positioned element being shown. If not explicitly set, this
   * will be equal to the value of `delay`.
   */
  @reads('delay')
  public delayShow!: number;

  /**
   * The amount of time, in milliseconds, between the trigger event occurring
   * and the positioned element being hidden. If not explicitly set, this
   * will be equal to the value of `delay`.
   */
  @reads('delay')
  public delayHide!: number;

  /**
   * A query selector for the container describing the area that the positioned
   * element will be checked for overflow relative to.
   * https://popper.js.org/docs/v2/modifiers/prevent-overflow/#boundary
   */
  public viewportSelector = 'body';

  /**
   * Virtual "padding" for the PopperJS preventOverflow modifier.
   * https://popper.js.org/docs/v2/modifiers/prevent-overflow/#padding
   *
   * @type {number|{ top?: number, left?: number, right?: number, bottom?: number }}
   */
  public viewportPadding = 0;

  /**
   * An offset, in pixels, for the PopperJS offset modifier.
   * https://popper.js.org/docs/v2/modifiers/offset/#distance
   */
  public distance = 0;

  /**
   * If true, the element will be displayed and positioned within its parent element.
   * When false, the element will be moved to a higher position in the DOM. Use this
   * to mitigate z-index and other layout issues.
   */
  public renderInPlace = false;

  /**
   * Describes the type of action(s) that will cause the positioned element to be
   * shown/hidden. Possible values are "hover", "focus", and "click". These can be
   * provided as an array, or a single string with a space between each option.
   *
   * @hidden
   */
  public triggerEvents: TriggerEvents | TriggerEvents[] = [
    TriggerEvents.HOVER,
    TriggerEvents.FOCUS,
  ];

  /**
   * A query selector or keyword for the DOM element that will be acting as the
   * "trigger" for showing/hiding the positioned element. Available keywords:
   *
   * - "self":       The root element created by this component if a tagName is given.
   * - "parent":     The DOM element that this component is created inside of.
   * - "parentView": The Ember Component instance that this component is created inside of.
   */
  public triggerSelector = SelectorStrategies.PARENT;

  /**
   * A query selector or keyword for the DOM element that will associated with the
   * content of the positioned element for accessibility purposes. E.g. a tooltip may
   * be triggered by a button, but its content describe a form field label. In this
   * case, the button is the trigger element, and the form field label is the ARIA
   * element. Available keywords:
   *
   * - "self":       The root element created by this component if a tagName is given.
   * - "parent":     The DOM element that this component is created inside of.
   * - "parentView": The Ember Component instance that this component is created inside of.
   * - "trigger":    The DOM "trigger" element.
   *
   * Set as null/undefined if no such support is desired.
   */
  public ariaSelector?: string = 'trigger';

  /**
   * The ARIA attribute that will be used to associate the positioned element with the
   * `ariaSelector` element.
   */
  public ariaAttachAs = 'aria-describedby';

  /**
   * Whether to use a fade transition on the positioned element as it is being
   * shown/hidden.
   */
  public fade = true;

  /**
   * The approximate number, in milliseconds, that the fade transition runs. This is
   * a backup just in case "transitionEnd" is not supported and shouldn't ever need
   * to be fiddled with.
   *
   * @hidden
   */
  public animationDuration = 150;

  /**
   * A method that will execute when the positioned element first begins to
   * visibly appear onscreen. Returning a boolean false from this method will
   * prevent the positioned element from being shown.
   */
  public onShow?: (instance: UiContextualContainer) => void | boolean;

  /**
   * A method that will execute when the positioned element is visible onscreen.
   * This will be after all transitions have finished.
   */
  public onShown?: (instance: UiContextualContainer) => void;

  /**
   * A method that will execute when the positioned element first begins to
   * disappear offscreen. Returning a boolean false from this method will
   * prevent the positioned element from being removed.
   */
  public onHide?: (instance: UiContextualContainer) => void | boolean;

  /**
   * A method this will execute when the positioned element has disappeared
   * offscreen. This will be after all transitions have finished.
   */
  public onHidden?: (instance: UiContextualContainer) => void;

  /**
   * A unique ID for the positioned element.
   */
  public overlayId?: string;

  /**
   * An optional value for the CSS max-width property of the positioned element.
   */
  public maxWidth?: string | number;

  /**
   * The name of the component that will be rendered as the positioned element.
   * It should always be something that extends UiContextElement.
   */
  public overlayComponent = 'ui-contextual/element';

  /**
   * Text that will put in the body of the rendered `overlayComponent` if not yielding
   * block content. This is a pretty simple convenience that allows UiContextContainer
   * to be quickly used inline.
   */
  public textContent?: string;

  /* **************** *
   * Private API
   * **************** */

  /**
   * The _isHidden and _showOverlay properties work together to display the positioned
   * element. When being transitioned in, _isHidden will toggle `true` first, indicating
   * that the element should be rendered. Once rendered, _showOverlay is toggled `true`
   * as well, which causes the CSS transition in to begin. Hiding is simply the reverse.
   *
   * @private
   */
  _isHidden = true;

  /**
   * @private
   */
  @reads('visible')
  _showOverlay!: boolean;

  /**
   * Boolean indicating whether or not a show delay has been set.
   *
   * @protected
   */
  @gt('delayShow', 0)
  protected readonly hasDelayShow!: boolean;

  /**
   * Boolean indicating whether or not a hide delay has been set.
   *
   * @protected
   */
  @gt('delayHide', 0)
  protected readonly hasDelayHide!: boolean;

  /**
   * The run loop timer ID for the delayShow and delayHide pauses between when
   * an interaction occurs and the positioned element beings being transitioned.
   *
   * @private
   */
  private timer?: EmberRunTimer;

  /**
   * A state management flag used to help marshall show/hide the positioned
   * element for mouseover and focus events.
   *
   * @private
   */
  private hoverState?: HoverState;

  /**
   * The EventListener that is set up to handle mouseover and focus events.
   *
   * @protected
   */
  protected handleEnter!: EventListener;

  /**
   * The EventListener that is set up to handle mouseleave and blur events.
   *
   * @protected
   */
  protected handleLeave!: EventListener;

  /**
   * The EventListener that is set up to handle click events.
   *
   * @protected
   */
  protected handleToggle!: EventListener;

  /**
   * The EventListener that is set up on the document when triggerEvents
   * contains "click". This listener is responsible for closing the overlay
   * when an outside click occurs.
   *
   * @protected
   */
  protected handleOutsideClick?: EventListener;

  /**
   * A Text node inserted into the template to find the parent element of
   * this component when it itself is tagless.
   *
   * @private
   */
  private parentFinder!: Text;

  /**
   * The unique ID of the positioned element which will be generated
   * if not provided via `overlayId`.
   *
   * @protected
   */
  @computed('overlayId')
  protected get overlayElementId() {
    return this.overlayId || `${guidFor(this)}-overlay`;
  }

  /**
   * The container to render the positioned element into if `renderInPlace`
   * is false. This container is provided by the addon itself, injected into
   * the application's index.html at build time.
   *
   * @protected
   */
  @computed()
  protected get overlayDestinationElement() {
    return getRootElement(this);
  }

  /**
   * The trigger element is what gets interacted with to activate
   * the overlay. This is purposefully memoized with no dependent
   * keys - once set the trigger should not change for a single
   * component instance.
   *
   * @protected
   */
  @computed('triggerSelector')
  protected get triggerElement() {
    return this.findElementWithSelectorStrategy(this.triggerSelector);
  }

  /**
   * A more thorough `renderInPlace` used internally by the component that
   * also takes into account whether or not there is a destination container
   * to worm-hole the positioned element out to.
   *
   * @protected
   */
  @computed('overlayDestinationElement', 'renderInPlace')
  protected get actuallyRenderInPlace() {
    return this.renderInPlace || !this.overlayDestinationElement;
  }

  /**
   * The HTMLElement result of querying for the value of `viewportSelector`.
   *
   * @protected
   */
  @computed('viewportSelector')
  protected get viewportElement() {
    return document.querySelector(this.viewportSelector);
  }

  /**
   * Yet another state management doodad.
   *
   * @protected
   */
  @computed()
  protected get inState() {
    return UiContextContainerInState.create();
  }

  /**
   * An array of provided `triggerEvents`.
   *
   * @protected
   */
  @computed('triggerEvents.[]')
  protected get triggerEventsArray() {
    const events = this.triggerEvents;
    const eventArray = typeof events === 'string' ? events.split(' ') : events;

    return (isArray(eventArray) ? eventArray : []) as TriggerEvents[];
  }

  /**
   * @protected
   * */
  // eslint-disable-next-line ember/classic-decorator-hooks
  public init() {
    super.init();

    this.handleEnter = bind(this, this.handleTriggerEvent, this.enter);
    this.handleLeave = bind(this, this.handleTriggerEvent, this.leave);
    this.handleToggle = bind(this, this.handleTriggerEvent, this.toggle);
    this.parentFinder = document.createTextNode('');

    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'visible', this.onVisiblePropertyChange);
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'enabled', this.onEnabledPropertyChange);
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  public didInsertElement() {
    super.didInsertElement();
    this.attachTriggerEventListeners(this.triggerElement, this.triggerEventsArray);

    if (this.enabled) {
      next(this, this.attachAriaDescriptor);
    }

    if (this.visible) {
      next(this, this.show, true);
    }
  }

  /**
   * @protected
   * */
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  public willDestroyElement() {
    super.willDestroyElement();
    this.removeTriggerEventListeners(this.triggerElement, this.triggerEventsArray);
    this.removeAriaDescriptor();
  }

  /**
   * The overlay element is the "attached" thing - e.g. the DOM
   * of the tooltip, flyout, menu, etc.
   *
   * @protected
   */
  protected getOverlayElement() {
    return document.getElementById(this.overlayElementId);
  }

  /**
   * The ARIA element is some additional DOM node to be specially
   * annotated for increased accessibility.
   *
   * @protected
   */
  protected getAriaElement() {
    if (!this.ariaSelector) {
      return null;
    } else if (this.ariaSelector === 'trigger') {
      return this.triggerElement;
    }

    return this.findElementWithSelectorStrategy(this.ariaSelector);
  }

  /**
   * Used for the event listeners attached to the trigger element to short-circuit events that
   * happen from within the overlay. Not doing this could cause weird things to happen if the
   * overlay is being rendered in-place as a child of the trigger.
   *
   * @protected
   */
  protected handleTriggerEvent(handler: (event: Event) => void, e: Event) {
    const overlay = this.getOverlayElement();
    const trigger = this.triggerElement;

    return overlay?.contains(trigger) ? undefined : handler.call(this, e);
  }

  /**
   * Attach event listeners to the provided element. This occurs for the
   * trigger element during component setup, and for the positional element
   * when it is shown.
   *
   * @protected
   */
  protected attachTriggerEventListeners(target: HTMLElement | null, triggers: TriggerEvents[]) {
    if (target) {
      triggers.forEach((trigger) => {
        const eventOrEvents = TriggerEventsMap[trigger];

        if (isArray(eventOrEvents)) {
          const [inEvent, outEvent] = eventOrEvents;

          target.addEventListener(inEvent, this.handleEnter);
          target.addEventListener(outEvent, this.handleLeave);
        } else {
          target.addEventListener(eventOrEvents, this.handleToggle);
        }
      });
    }
  }

  /**
   * Remove event listeners from the provided element. This occurs for the
   * trigger element during component teardown, and for the positional element
   * when it is hidden.
   *
   * @protected
   */
  protected removeTriggerEventListeners(target: HTMLElement | null, triggers: TriggerEvents[]) {
    if (target) {
      triggers.forEach((trigger) => {
        const eventOrEvents = TriggerEventsMap[trigger];

        if (isArray(eventOrEvents)) {
          const [inEvent, outEvent] = eventOrEvents;

          target.removeEventListener(inEvent, this.handleEnter);
          target.removeEventListener(outEvent, this.handleLeave);
        } else {
          target.removeEventListener(eventOrEvents, this.handleToggle);
        }
      });
    }
  }

  /**
   * Manages the state change of the overlay from hidden to visible.
   *
   * @protected
   */
  protected show() {
    if (
      this.checkDestruction() ||
      !(this._isHidden && this.enabled) ||
      this.onShow?.(this) === false
    ) {
      return;
    }

    // Wait for the tooltip/popover element to be created. When animating a worm holed
    // tooltip/popover we need to wait until things have moved into the DOM for the animation
    // to be correct, so use Ember.run.next in this case.
    if (!this.actuallyRenderInPlace && this.fade) {
      next(this, this._show);
    } else {
      schedule('afterRender', this, this._show);
    }

    set(this, '_isHidden', false);
  }

  /**
   * Queued into the run loop by show(), this does the actual transition work.
   *
   * @protected
   */
  protected _show(skipAnimation = false) {
    set(this, '_showOverlay', true);

    // If this is a touch-enabled device we add extra empty mouseover listeners to the
    // body's immediate children; only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    // See https://github.com/twbs/bootstrap/pull/22481
    if ('ontouchstart' in document.documentElement) {
      const { children } = document.body;

      for (let i = 0; i < children.length; i++) {
        children[i].addEventListener('mouseover', function () {
          // Compatibility
        });
      }
    }

    const onOverlayShowComplete = () => {
      if (this.checkDestruction()) {
        return;
      }

      if (typeof this.onShown === 'function') {
        this.onShown(this);
      }

      const prevHoverState = this.hoverState;
      this.hoverState = undefined;

      if (prevHoverState === HoverState.OUT) {
        this.leave();
      }
    };

    const target = this.getOverlayElement();

    if (target && !target.getAttribute('data-has-trigger')) {
      target.setAttribute('data-has-trigger', 'true');

      if (this.triggerEventsArray.includes(TriggerEvents.HOVER)) {
        this.attachTriggerEventListeners(target, [TriggerEvents.HOVER]);
      } else if (this.triggerEventsArray.includes(TriggerEvents.CLICK)) {
        const outsideClickTargets = [target];

        if (this.triggerElement) {
          outsideClickTargets.push(this.triggerElement);
        }

        this.handleOutsideClick = createOutsideClickListener(
          this,
          outsideClickTargets,
          this.handleToggle
        );
      }
    }

    !skipAnimation && this.fade && target
      ? waitForTransitionEnd(target, this.animationDuration).then(onOverlayShowComplete)
      : onOverlayShowComplete();
  }

  /**
   * Manages the state change of the overlay from visible to hidden.
   *
   * @protected
   */
  protected hide(skipAnimation = false) {
    if (this.checkDestruction() || this.onHide?.(this) === false) {
      return;
    }

    // Make sure our click state is off, otherwise the next click would
    // close the already-closed tooltip/popover. We don't need to worry
    // about this for hover/focus because those aren't "stateful" toggle
    // events like click, but to make sure it is always correct we're doing
    // it in hide anyway.
    this.inState.set(TriggerEvents.CLICK, false);

    const target = this.getOverlayElement();

    const onOverlayHideComplete = () => {
      if (this.checkDestruction()) {
        return;
      }

      if (this.hoverState !== HoverState.IN) {
        set(this, '_isHidden', true);
      }

      if (typeof this.onHidden === 'function') {
        this.onHidden(this);
      }

      if (target && target.getAttribute('data-has-trigger')) {
        target.removeAttribute('data-has-trigger');

        if (this.triggerEventsArray.includes(TriggerEvents.HOVER)) {
          this.removeTriggerEventListeners(target, [TriggerEvents.HOVER]);
        } else if (
          this.triggerEventsArray.includes(TriggerEvents.CLICK) &&
          this.handleOutsideClick
        ) {
          removeOutsideClickListener(this.handleOutsideClick);
          this.handleOutsideClick = undefined;
        }
      }
    };

    set(this, '_showOverlay', false);

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      const { children } = document.body;

      for (let i = 0; i < children.length; i++) {
        children[i].removeEventListener('mouseover', function () {
          // Compatibility
        });
      }
    }

    !skipAnimation && this.fade && target
      ? waitForTransitionEnd(target, this.animationDuration).then(onOverlayHideComplete)
      : onOverlayHideComplete();

    this.hoverState = undefined;
  }

  /**
   * Internal state management used by the hover + focus trigger event scheme
   * to make the overlay visible if it is not already.
   *
   * @protected
   */
  protected enter(event?: Event) {
    if (event) {
      const type = event.type === 'focusin' ? TriggerEvents.FOCUS : TriggerEvents.HOVER;
      this.inState.set(type, true);
    }

    if (this._showOverlay || this.hoverState === HoverState.IN) {
      this.hoverState = HoverState.IN;
      return;
    }

    if (this.timer) {
      cancel(this.timer);
      this.timer = undefined;
    }

    this.hoverState = HoverState.IN;

    if (!this.hasDelayShow) {
      return this.show();
    }

    this.timer = later(
      this,
      () => {
        if (this.hoverState === HoverState.IN) {
          this.show();
        }
      },
      this.delayShow
    );
  }

  /**
   * Internal state management used by the hover + focus trigger event scheme
   * to make the overlay hidden if it is not already.
   *
   * @protected
   */
  protected leave(event?: Event) {
    if (event) {
      const type = event.type === 'focusout' ? TriggerEvents.FOCUS : TriggerEvents.HOVER;
      this.inState.set(type, false);
    }

    if (this.inState.show) {
      return;
    }

    if (this.timer) {
      cancel(this.timer);
      this.timer = undefined;
    }

    this.hoverState = HoverState.OUT;

    if (!this.hasDelayHide) {
      return this.hide();
    }

    this.timer = later(
      this,
      () => {
        if (this.hoverState === HoverState.OUT) {
          this.hide();
        }
      },
      this.delayHide
    );
  }

  /**
   * Internal state management used by the click trigger event scheme to
   * toggle the visibility of the overlay.
   *
   * @protected
   */
  protected toggle(event?: Event) {
    if (event) {
      this.inState.toggleProperty(TriggerEvents.CLICK);
      this.inState.show ? this.enter() : this.leave();
    } else {
      this._showOverlay ? this.leave() : this.enter();
    }
  }

  /**
   * Yielded action to programmatically close from within the tooltip/flyout/whatever.
   *
   * @protected
   */
  protected close() {
    this.hide();
  }

  /**
   * Adds the ARIA property to the target element.
   *
   * @protected
   */
  protected attachAriaDescriptor() {
    const target = this.getAriaElement();

    if (target && this.ariaAttachAs) {
      addAriaAttribute(target, this.ariaAttachAs, this.overlayElementId);
    }
  }

  /**
   * Cleans the ARIA property of the target element.
   *
   * @protected
   */
  protected removeAriaDescriptor() {
    const target = this.getAriaElement();

    if (target && this.ariaAttachAs) {
      removeAriaAttribute(target, this.ariaAttachAs, this.overlayElementId);
    }
  }

  /**
   * Convenience method to check whether or not we should continue to do...
   * pretty much anything with this component instance.
   *
   * @protected
   */
  protected checkDestruction() {
    return this.isDestroying || this.isDestroyed;
  }

  /**
   * Observer change handler of the "visible" property.
   *
   * @protected
   */
  protected onVisiblePropertyChange() {
    this.visible ? this.show() : this.hide();
  }

  /**
   * Observer change handler of the "enabled" property.
   *
   * @protected
   */
  protected onEnabledPropertyChange() {
    if (this.enabled) {
      this.attachAriaDescriptor();
    } else {
      this.removeAriaDescriptor();

      if (!this._isHidden) {
        this.hide(true);
      }
    }
  }

  /**
   * Looks up an HTMLElement in a variety of ways. Used by this component, for example,
   * to find the trigger element, the ARIA target element, etc.
   *
   * @protected
   */
  protected findElementWithSelectorStrategy(
    strategy: SelectorStrategies | string
  ): HTMLElement | null {
    if (!strategy || strategy === SelectorStrategies.PARENT) {
      // This can be a bit confusing, so to explain - this component is typically tagless,
      // but subclasses can be tagged. In either case when speaking of the "parent" element
      // we undoubtedly mean the element that the component is defined immediately within.
      return isEmpty(this.tagName)
        ? (this.parentFinder.parentNode as HTMLElement)
        : (this.parentFinder.parentNode?.parentNode as HTMLElement);
    } else if (!isEmpty(this.tagName) && strategy === SelectorStrategies.SELF) {
      return this.element as HTMLElement;
    } else if (strategy === SelectorStrategies.PARENT_VIEW) {
      // @ts-expect-error - parentView is an intimate Ember Component API property.
      return this.parentView?.element as HTMLElement;
    }

    return document.querySelector(strategy);
  }
}
