import { KeyCodes } from '@nsf-open/ember-ui-foundation/constants';

/**
 * Describes the possible types of value that can be used to figure out a "starting point" for what
 * should happen with a keystroke.
 */
type CurrentElement =
  | undefined
  | null
  | string
  | HTMLElement
  | ((list: HTMLElement[]) => HTMLElement | undefined);

/**
 *
 */
type ElementList = string | HTMLElement[] | NodeListOf<HTMLElement>;

/**
 * The list of keycodes that the navigator utility will respond to. Everything else will be ignored.
 */
const NavigationKeyCodes: string[] = [
  KeyCodes.ArrowUp,
  KeyCodes.ArrowRight,
  KeyCodes.ArrowDown,
  KeyCodes.ArrowLeft,
  KeyCodes.Home,
  KeyCodes.End,
];

/**
 * The default filter method for HTMLElement that should be ignored for navigation purposes.
 *
 * @param {HTMLElement} element
 *
 * @returns {boolean}
 */
export function shouldInclude(element: HTMLElement) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return !(
    element.ariaHidden === 'true' ||
    element.ariaDisabled === 'true' ||
    ('hidden' in element && element.hidden) ||
    element.classList.contains('disabled')
  );
}

/**
 * Normalizes a `CurrentElement` into either an HTMLElement or undefined using the following rules:
 *
 * * If `current` is null or undefined       -> undefined
 * * If `current` is an HTMLElement instance -> HTMLElement
 * * If `current` is a string                -> result of document.querySelector(), or undefined
 * * If `current` is a function              -> result of function
 *
 * @param {CurrentElement} current
 * @param {HTMLElement[]}  elements
 *
 * @returns {HTMLElement | undefined}
 */
export function getCurrentElement(current: CurrentElement, elements: HTMLElement[]) {
  if (!current) {
    return undefined;
  }

  if (current instanceof HTMLElement) {
    return current;
  }

  if (typeof current === 'string') {
    return (document.querySelector(current) as HTMLElement) ?? undefined;
  }

  if (typeof current === 'function') {
    return current(elements);
  }

  return undefined;
}

/**
 * Simply traversing a list of Elements with the keyboard by determining the next HTML Element in a
 * sequence based on the keystroke provided, and the "currently" selected Element.
 */
export default function keyNavigator(
  current: CurrentElement,
  list: ElementList,
  keyCode: KeyCodes | string,
  { listFilter = shouldInclude, wrapAround = true } = {}
) {
  if (!NavigationKeyCodes.includes(keyCode)) {
    return undefined;
  }

  const elements = Array.from(
    typeof list === 'string' ? (document.querySelectorAll(list) as NodeListOf<HTMLElement>) : list
  ).filter((item) => listFilter(item));

  if (!elements.length) {
    return undefined;
  }

  const selected = getCurrentElement(current, elements);
  let nextIndex = -1;

  if (keyCode === KeyCodes.ArrowDown || keyCode === KeyCodes.ArrowRight) {
    nextIndex = selected ? elements.indexOf(selected) + 1 : 0;
  } else if (keyCode === KeyCodes.ArrowUp || keyCode === KeyCodes.ArrowLeft) {
    nextIndex = selected ? elements.indexOf(selected) - 1 : elements.length - 1;
  } else if (keyCode === KeyCodes.Home) {
    nextIndex = 0;
  } else if (keyCode === KeyCodes.End) {
    nextIndex = elements.length - 1;
  }

  if (nextIndex < 0) {
    return wrapAround ? elements[elements.length - 1] : elements[0];
  }

  if (nextIndex >= elements.length) {
    return wrapAround ? elements[0] : elements[elements.length - 1];
  }

  return elements[nextIndex];
}
