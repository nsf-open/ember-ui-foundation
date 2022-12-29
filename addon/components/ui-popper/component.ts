import type { Instance, Modifier, Placement, Options, PositioningStrategy } from '@popperjs/core';
import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { not } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { htmlSafe } from '@ember/template';
import { debounce } from '@ember/runloop';
import { layout, tagName } from '@ember-decorators/component';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import template from './template';

/**
 * A wrapper component for the PopperJS placement library.
 *
 * @class UiPopper
 */
@tagName('')
@layout(template)
export default class UiPopper extends Component {
  /**
   * The anchor that the popped element will be positioned relative to.
   *
   * @argument popperTarget
   * @type {Element|string}
   */
  public popperTarget!: Element | string;

  /**
   * Enables/disables the instance by creating/destroying it. When disabled,
   * a [data-popper-disabled] attribute will be set on the target element.
   *
   * @argument enabled
   * @type {boolean}
   * @default true
   */
  public enabled = true;

  /**
   * The `id` of the positioned element. One will be generated if not provided.
   *
   * @argument id
   * @type {string}
   * @default undefined
   */
  public id!: string;

  /**
   * The `role` attribute of the positioned element.
   *
   * @argument ariaRole
   * @type {string}
   * @default undefined
   */
  public ariaRole!: string;

  /**
   * Modifiers that will be merged into the PopperJS instance's options hash.
   * https://popper.js.org/docs/v2/modifiers/
   *
   * @argument modifiers
   * @type {Modifier[]}
   * @default undefined
   */
  public modifiers?: Modifier<unknown, Record<string, unknown>>[];

  /**
   * Default placement of the positioned element relative to what it is anchoring to.
   *
   * @argument placement
   * @type {string}
   * @default "bottom"
   */
  public placement: Placement = 'bottom';

  /**
   * The popper element typically needs to be moved higher in the DOM tree to avoid z-index
   * issues, so this is that "higher" target. This is ignored if `renderInPlace` is true.
   *
   * @argument popperContainer
   * @type {Element|string}
   * @default ".ember-application"
   */
  public popperContainer: Element | string = '.ember-application';

  /**
   * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
   * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
   * deeply in the DOM tree.
   *
   * @argument renderInPlace
   * @type {boolean}
   * @default false
   */
  public renderInPlace = false;

  /**
   * An optional function executed when popper recalculates layout.
   *
   * @argument onUpdate
   * @type {() => void}
   * @default undefined
   */
  public onUpdate?: () => void;

  /**
   * @argument testId
   * @type {string}
   * @default undefined
   * @public
   */
  public testId?: string;

  /**
   * The HTML tag that will be rendered as the root element of the popper instance.
   */
  public htmlTagName = 'div';

  /**
   * @private
   */
  @not('enabled')
  readonly disabled!: boolean;

  /**
   * @private
   */
  @computed('enabled')
  get style() {
    return this.enabled ? null : htmlSafe('display: none;');
  }

  /**
   * The actual DOM element that is getting "popped".
   *
   * @private
   */
  get popperElement() {
    return document.getElementById(this.id) ?? undefined;
  }

  /**
   * A reference to the Node that this component was a child of before
   * it was possibly moved up in the DOM.
   *
   * @private
   */
  get initialParentNode() {
    return this.parentFinder?.parentNode ?? undefined;
  }

  /**
   * @private
   */
  get bailOut() {
    return this.isDestroying || this.isDestroyed;
  }

  /**
   * The managing PopperJS instance, so long as `enabled` is true.
   *
   * @private
   */
  popper?: Instance;

  /**
   * A TextNode that is used to access a reference to the parent of
   * this component.
   *
   * @private
   */
  parentFinder?: Text;

  /**
   * A Map of the last known values for the "public" properties that
   * could trigger an update.
   *
   * @private
   */
  valueCache = new Map<keyof UiPopper, unknown>();

  /**
   * Check a value against the cache - true if the two are the same, false
   * if not - and optionally update it.
   *
   * @private
   */
  compareToCached(key: keyof UiPopper, value: unknown, update = false) {
    if (this.valueCache.get(key) === value) {
      return true;
    }

    if (update) {
      this.valueCache.set(key, value);
    }

    return false;
  }

  /**
   * The parent DOM node that the popper will be rendered into.
   *
   * @private
   */
  @computed('initialParentNode', 'popperContainer')
  get realPopperContainer() {
    let container;

    if (this.popperContainer instanceof Element) {
      container = this.popperContainer;
    } else {
      const elements = document.querySelectorAll(this.popperContainer);

      assert(
        `ui-popper with popperContainer selector "${this.popperContainer}" found
				${elements.length} possible containers when there should be exactly 1.`,
        elements.length === 1
      );

      container = elements[0];
    }

    return container;
  }

  /**
   * Returns the popper Element itself.
   *
   * @private
   */
  get realPopperElement() {
    return this.popperElement;
  }

  /**
   * Returns the target Element that the popper instance will be anchoring to.
   *
   * @private
   */
  get realPopperTarget() {
    if (typeof this.popperTarget === 'string') {
      return document.querySelector(this.popperTarget) as Element;
    }

    return (this.popperTarget || this.initialParentNode) as Element;
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    if (!this.id) {
      set(this, 'id', `${guidFor(this)}-popper`);
    }

    this.parentFinder = document.createTextNode('');
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didInsertElement() {
    super.didInsertElement();
    this.updatePopper();
    this.realPopperElement?.setAttribute('data-popper-disabled', '');
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didUpdateAttrs() {
    super.didUpdateAttrs();
    this.schedulePopperUpdate();
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    super.willDestroyElement();
    this.destroyPopper();
  }

  schedulePopperUpdate() {
    debounce(this, this.updatePopper, 20);
  }

  /**
   * Check properties for changes from their last known values.
   *
   * @private
   */
  checkForUpdates() {
    if (this.bailOut) {
      return false;
    }

    // Purposefully not short circuiting anything below so that multiple changes
    // that all came in at the same time get written back into the tracking map.

    let noChange = this.compareToCached('modifiers', this.modifiers, true);
    noChange = this.compareToCached('onUpdate', this.onUpdate, true) && noChange;
    noChange = this.compareToCached('placement', this.placement, true) && noChange;
    noChange = this.compareToCached('renderInPlace', this.renderInPlace, true) && noChange;
    noChange = this.compareToCached('enabled', this.enabled, true) && noChange;
    noChange = this.compareToCached('popperTarget', this.realPopperTarget, true) && noChange;

    return !noChange;
  }

  /**
   * Puts together a set of PopperJS options from the current component configuration.
   *
   * @private
   */
  getPopperOptions(): Options {
    const options = {
      strategy: 'absolute' as PositioningStrategy,
      placement: this.placement,
      modifiers: this.modifiers?.slice(0) || [flip, preventOverflow],
    };

    if (typeof this.onUpdate === 'function') {
      options.modifiers.push({
        name: 'onUpdate',
        phase: 'afterWrite',
        enabled: true,
        fn: this.onUpdate,
      });
    }

    return options;
  }

  /**
   * Creates, destroys, or updates a Popper instance as required.
   *
   * @private
   */
  updatePopper() {
    if (this.popper) {
      if (this.checkForUpdates()) {
        if (this.enabled) {
          this.popper.setOptions(this.getPopperOptions());
        } else {
          this.destroyPopper();
        }
      }
    } else if (this.enabled) {
      this.createPopper();
    }
  }

  /**
   * Initializes the PopperJS instance if one does not already exist.
   *
   * @private
   */
  createPopper() {
    const element = this.realPopperElement;

    if (this.bailOut || !this.enabled || !element || !!this.popper) {
      return;
    }

    // The contents of this if statement are never being ran despite that
    // attribute not existing being a passing assertion in tests? Current
    // theory is that PopperJS rolls through any `data-popper-*` attributes
    // when it initializes. Interesting stuff.
    if (element?.hasAttribute('data-popper-disabled')) {
      element.removeAttribute('data-popper-disabled');
    }

    // This call is to sync the current and last known values so we can be more
    // efficient in subsequent updates. The actual response doesn't matter.
    this.checkForUpdates();
    this.popper = createPopper(this.realPopperTarget, element, this.getPopperOptions());
  }

  /**
   * Cleans up the current instance if it exists and resets tracking in the component.
   *
   * @private
   */
  destroyPopper() {
    if (this.popper) {
      this.popper.destroy();
    }

    this.valueCache.clear();
    this.popper = undefined;

    if (!this.bailOut) {
      this.realPopperElement?.setAttribute('data-popper-disabled', '');
    }
  }
}
