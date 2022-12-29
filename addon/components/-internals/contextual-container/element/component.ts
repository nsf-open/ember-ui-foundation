import type { Modifier } from '@popperjs/core';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { reads } from '@ember/object/computed';
import { computed, set } from '@ember/object';
import { htmlSafe } from '@ember/template';
import hide from '@popperjs/core/lib/modifiers/hide';
import flip from '@popperjs/core/lib/modifiers/flip';
import arrow from '@popperjs/core/lib/modifiers/arrow';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import template from './template';

function popperToBootstrapPlacement(value: string): string {
  return value.replace('-start', '').replace('-end', '');
}

function bootstrapToPopperPlacement(value: string): string {
  return value.replace('-left', '-start').replace('-right', '-end');
}

/**
 * The UiContextElement component serves as the base class for tooltips, popovers, menus,
 * and more. Anything that needs to be dynamically positioned relative to some other "anchor"
 * element begins here.
 *
 * @class UiContextualElement
 */
@tagName('')
@layout(template)
export default class UiContextualElement extends Component {
  /**
   * The role attribute of the element.
   */
  public ariaRole = 'tooltip';

  /**
   * Placement of the element, relative to its reference element.
   * One of ['top', 'right', 'bottom', 'left'].
   */
  public placement = 'top';

  /**
   * Whether the element is visible and positioned.
   */
  public isHidden = false;

  /**
   * Optional text that will be shown in a separate block above the primary content. Some
   * controls, such as popovers, have an optional title block.
   */
  public titleText?: string;

  public fade = true;

  public showContent = false;

  /**
   * If true, the element will be displayed and positioned within its parent element. When
   * false, the element will be moved to a higher position in the DOM. Use this to mitigate
   * z-index and other layout issues.
   */
  public renderInPlace = true;

  /**
   * If true, the element will change its position automatically based on available space.
   */
  public autoPlacement = true;

  /**
   * Virtual "padding" for the PopperJS preventOverflow modifier.
   * https://popper.js.org/docs/v2/modifiers/prevent-overflow/#padding
   */
  public viewportPadding:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number } = 0;

  /**
   * An offset, in pixels, for the PopperJS offset modifier.
   * https://popper.js.org/docs/v2/modifiers/offset/#distance
   */
  public distance = 0;

  /**
   * The "reference" that this element will be positioned relative to.
   */
  public popperTarget?: HTMLElement;

  /**
   * Describes the area that the element will be checked for overflow relative to.
   * https://popper.js.org/docs/v2/modifiers/prevent-overflow/#boundary
   */
  public viewportElement?: HTMLElement | 'clippingParents';

  /**
   * If `renderInPlace` is false, then this will need to be supplied as the
   * container that this element will be rendered into.
   */
  public destinationElement?: HTMLElement;

  public testId?: string;

  /**
   * A method provided by the parent container to dismiss the positioned element.
   */
  public declare readonly close: () => void;

  /**
   * If true, a floating close button will be rendered at the top of the positioned
   * element. This can be handy when using the "click" trigger.
   */
  public showCloseButton = false;

  /**
   * CSS class names for the element.
   */
  public get popperClassNames(): undefined | string | string[] {
    return undefined;
  }

  /**
   * A unique id for the element. One will be generated if not provided.
   */
  public id?: string;

  /**
   * An optional value for the CSS max-width property of the inner block of this
   * element.
   */
  public maxWidth?: string | number;

  /**
   * If true, a directional caret will be shown, pointing to the target element.
   */
  public showArrow = true;

  /**
   * CSS class name for the arrow caret.
   */
  public arrowClassName = 'tooltip-arrow';

  /**
   * CSS class name for the inner block content of this element.
   */
  public innerClassName = 'tooltip-inner';

  /**
   * CSS class name for the title text content block.
   */
  public titleTextClassName?: string;

  /**
   * The real placement of the element. If `autoPlacement` is enabled then
   * this could differ from `placement`.
   */
  @reads('placement')
  public readonly actualPlacement!: string;

  /**
   * The `placement` property allows for either PopperJS or Bootstrap
   * standard layout position strings to be provided. This readonly
   * value will always be the PopperJS translated version.
   */
  @computed('placement')
  public get popperPlacement() {
    return bootstrapToPopperPlacement(this.placement);
  }

  /**
   * Concatenated CSS class names for the element.
   */
  @computed('popperClassNames.[]', 'class')
  public get popperClasses() {
    const classNames =
      typeof this.popperClassNames === 'string'
        ? [this.popperClassNames]
        : this.popperClassNames || [];

    // TODO figure out a better way forward with passing through custom class names
    // @ts-expect-error - Class is a property... sort of... we'll probably want to change this.
    const classProp = this.class as string | undefined;

    return typeof classProp === 'string'
      ? classNames.concat(classProp.split(' ')).join(' ')
      : classNames.join(' ');
  }

  /**
   * An array of PopperJS modifier descriptions created from the configuration
   * properties of this component.
   */
  @computed('arrowClass', 'autoPlacement', 'viewportElement', 'viewportPadding', 'distance')
  public get popperModifiers() {
    return this.getPopperModifiers();
  }

  @computed('maxWidth')
  public get innerElementStyles() {
    let max = this.maxWidth;

    if (max) {
      max = typeof max === 'number' ? max.toString(10) : max;

      if (typeof max == 'string') {
        max = max.endsWith('px') ? max : `${max}px`;
        return htmlSafe(`max-width: ${max};`);
      }
    }

    return undefined;
  }

  protected getPopperModifiers(): Modifier<unknown, Record<string, unknown>>[] {
    return [
      { ...arrow, enabled: this.showArrow, options: { padding: 8 } },
      { ...hide, enabled: this.autoPlacement },
      { ...flip, enabled: this.autoPlacement },
      {
        ...preventOverflow,
        enabled: this.autoPlacement,
        options: { boundary: this.viewportElement, padding: this.viewportPadding },
      },
      {
        ...offset,
        enabled: this.distance > 0,
        options: { offset: [0, this.distance] },
      },
    ];
  }

  /**
   * PopperJS uses slightly different terminology than Bootstrap.
   */
  protected updatePlacement(data?: { state?: { placement: string } }) {
    set(this, 'actualPlacement', popperToBootstrapPlacement(data?.state?.placement || ''));
  }
}
