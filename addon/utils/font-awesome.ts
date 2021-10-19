// Prefix "fa-" to any string that doesn't already start with it.
function ensureStylePrefix(value: string) {
  return value.trim().substring(0, 3) === 'fa-' ? value : `fa-${value}`;
}

// Prune an array to only contain strings, and make sure that each beings with "fa-".
function ensureStylePrefixArray(values: unknown[]) {
  return values
    .map(function (item) {
      return typeof item === 'string'
        ? item.split(' ').map(ensureStylePrefix).join(' ')
        : undefined;
    })
    .filter(Boolean) as string[];
}

/**
 * Prepares a string for use as the `class` attribute on an element that'll be showing
 * a Font Awesome icon.
 *
 * @function buildFaClassNameString
 */
export default function buildFaClassNameString(
  value: string | string[],
  ...rest: string[]
): string {
  const iconClassNames = Array.isArray(value) ? value : [value].concat(rest);
  return `fa ${ensureStylePrefixArray(iconClassNames).join(' ')}`;
}
