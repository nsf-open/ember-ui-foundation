import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { addObserver } from '@ember/object/observers';
import { not, and } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { camelize } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { scheduleOnce, next } from '@ember/runloop';
import { Promise } from 'rsvp';
import { layout, attribute, className, classNames } from '@ember-decorators/component';
import { waitForTransitionEnd } from '../../utils';
import { Dimensions } from '../../constants';
import template from './template';

type VoidCallback = () => void;

/**
 * The UiCollapse component provides the base mechanics to smoothly collapse/expand a block element.
 */
@classNames('ui-collapse')
@layout(template)
export default class UiCollapse extends Component {
  /**
   * Toggles whether the element is expanded or collapsed.
   */
  public collapsed = true;

  /**
   * An optional callback that will run when the element first begins to collapse.
   */
  public onHide?: VoidCallback;

  /**
   * An optional callback that will run when the element finishes being collapsed.
   */
  public onHidden?: VoidCallback;

  /**
   * An optional callback that will run when the element first begins to expand.
   */
  public onShow?: VoidCallback;

  /**
   * An optional callback that will run when the element finishes being expanded.
   */
  public onShown?: VoidCallback;

  /**
   * The axis that the collapse/expand will occur on. Can be either "height" or "width".
   */
  @className
  public collapseDimension = Dimensions.Height;

  /**
   * This can be set to a value > 0 if a custom expanded height/width pixel value is needed.
   */
  public expandedSize?: number;

  /**
   * This can be set to a value > 0 if a custom collapsed height/width pixel value is needed.
   */
  public collapsedSize = 0;

  /**
   * The UiCollapse component sets a `height` or `width` style on the collapsing element
   * in order to provide a destination value for the CSS transition to move to. The inline
   * value is typically removed when no longer needed but if you want it to keep it around
   * for whatever reason you can set this to false.
   */
  public resetSizeBetweenTransitions = true;

  /**
   * Whether the component is actively undergoing a transition.
   *
   * @protected
   */
  @className('collapsing')
  transitioning = false;

  /**
   * The calculated size for either width or height that the element will have when
   * the transition is finished. This gets written as an inline style value for the
   *  element.
   *
   * @protected
   */
  transitioningSize?: number;

  /**
   * Most likely, the "transitionend" event will be used to indicate that the
   * collapse/expand has finished. This is a backup timeout if for whatever
   * reason that doesn't happen.
   *
   * @protected
   */
  transitionDuration = 350;

  /**
   * An internal flag that will always be the opposite value of collapsed, so, it will
   * be true if the element is expanded and false otherwise. The change occurs on the
   * leading edge of the animation.
   *
   * @protected
   */
  active = false;

  @className('collapse')
  @not('transitioning')
  protected declare notTransitioning: boolean;

  @className('show')
  @and('notTransitioning', 'active')
  protected declare showContent: boolean;

  @attribute
  @computed('collapseDimension', 'transitioningSize')
  get style() {
    return typeof this.transitioningSize === 'number'
      ? htmlSafe(`${this.collapseDimension}: ${this.transitioningSize}px;`)
      : undefined;
  }

  getExpandedSize(action: 'show' | 'hide') {
    if (isPresent(this.expandedSize)) {
      return this.expandedSize;
    }

    const prefix = action === 'show' ? 'scroll' : 'offset';
    const propName = camelize(`${prefix}-${this.collapseDimension}`) as
      | 'scrollHeight'
      | 'scrollWidth'
      | 'offsetHeight'
      | 'offsetWidth';

    return (this.element as HTMLElement)[propName];
  }

  async show() {
    if (typeof this.onShow === 'function') {
      this.onShow();

      // The purpose of this here is to ensure that anything which might have been queued
      // up to render as a result of calling onShow will be rendered before we move on
      // to calculate the size of the container.
      await new Promise((resolve) => scheduleOnce('afterRender', null, resolve));
    }

    set(this, 'transitioning', true);
    set(this, 'transitioningSize', this.collapsedSize);
    set(this, 'active', true);

    await new Promise((resolve) => next(null, resolve));

    set(this, 'transitioningSize', this.getExpandedSize('show'));

    await waitForTransitionEnd(this.element, this.transitionDuration);

    if (this.isDestroyed) {
      return;
    }

    set(this, 'transitioning', false);

    if (this.resetSizeBetweenTransitions) {
      set(this, 'transitioningSize', undefined);
    }

    this.onShown?.();
  }

  async hide() {
    this.onHide?.();

    set(this, 'transitioning', true);
    set(this, 'transitioningSize', this.getExpandedSize('hide'));
    set(this, 'active', false);

    await new Promise((resolve) => next(null, resolve));

    set(this, 'transitioningSize', this.collapsedSize);

    await waitForTransitionEnd(this.element, this.transitionDuration);

    if (this.isDestroyed) {
      return;
    }

    set(this, 'transitioning', false);

    if (this.resetSizeBetweenTransitions) {
      set(this, 'transitioningSize', undefined);
    }

    this.onHidden?.();
  }

  _onCollapsedChange() {
    if (this.collapsed !== this.active) {
      return;
    } else if (this.collapsed) {
      this.hide();
    } else {
      this.show();
    }
  }

  _updateCollapsedSize() {
    if (!this.resetSizeBetweenTransitions && this.collapsed && !this.transitioning) {
      set(this, 'transitioningSize', this.collapsedSize);
    }
  }

  _updateExpandedSize() {
    if (!this.resetSizeBetweenTransitions && !this.collapsed && !this.transitioning) {
      set(this, 'transitioningSize', this.expandedSize);
    }
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    set(this, 'active', !this.collapsed);

    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'collapsed', this, this._onCollapsedChange);
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'collapsedSize', this, this._updateCollapsedSize);
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'expandedSize', this, this._updateExpandedSize);
  }
}
