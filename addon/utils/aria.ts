import { isPresent } from '@ember/utils';

function normalizeAttrName(value: string) {
  return (value.startsWith('aria-') ? value : `aria-${value}`).toLowerCase();
}

/**
 * Given an element and ARIA attribute name the value of that attribute will be returned. The
 * return type is consistently an Array to support attributes like `aria-describedby` which
 * allows ID reference lists (space separated values).
 */
export function getAriaAttributeValues(
  target: HTMLElement,
  attrName: string
): string[] | undefined {
  if (!target) {
    return undefined;
  }

  const attrValue = target.getAttribute(normalizeAttrName(attrName));
  const valueArray = typeof attrValue === 'string' ? attrValue.split(' ') : [];

  return valueArray.map((item) => item.trim()).filter(isPresent);
}

/**
 * Adds an ARIA attribute to the provided element. If the attribute already has a value then
 * it will be appended to, treating the string as an ID reference list.
 */
export function addAriaAttribute(target: HTMLElement, attrName: string, value: string) {
  const normalizedName = normalizeAttrName(attrName);
  const values = getAriaAttributeValues(target, normalizedName);

  if (!values) {
    return;
  }

  if (values.indexOf(value) < 0) {
    values.push(value);
  }

  target.setAttribute(normalizedName, values.join(' '));
}

/**
 * Removes an ARIA attribute from the provided element.
 */
export function removeAriaAttribute(target: HTMLElement, attrName: string, value: string) {
  const normalizedName = normalizeAttrName(attrName);
  const values = getAriaAttributeValues(target, normalizedName);

  if (!values) {
    return;
  }

  const idx = values.indexOf(value);

  if (idx > -1) {
    values.splice(idx, 1);
  }

  if (values.length) {
    target.setAttribute(normalizedName, values.join(' '));
  } else {
    target.removeAttribute(normalizedName);
  }
}
