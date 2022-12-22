import type { ContainerReflection } from 'typedoc/dist/lib/serialization/schema';
import { KindOf, ReflectionKind } from './constants';

/**
 * Finds the indices of the first matching pairs of characters while being aware
 * of the fact that many bracketing patterns can be deeply nested.
 *
 * ```
 * const objString = "{ foo: { bar: { baz } } }";
 * //                 ^                       ^
 * //                 0                       25
 *
 * findMatchingBracket(['{', '}], objString); // > [0, 25];
 * ```
 */
export function findMatchingBracket(pairs: [string, string], searchText: string) {
  let charIndex = 0;
  let bracketDepth = 0;
  let left = -1;
  let right = -1;

  for (charIndex; charIndex < searchText.length; charIndex += 1) {
    const currentChar = searchText.charAt(charIndex);

    if (currentChar === pairs[0]) {
      bracketDepth += 1;

      if (bracketDepth === 1) {
        left = charIndex;
      }
    }

    if (currentChar === pairs[1]) {
      bracketDepth -= 1;

      if (bracketDepth === 0) {
        right = charIndex;
      }
    }

    if (left >= 0 && right >= 1) {
      break;
    }
  }

  return left >= 0 && right >= 1 ? [left, right] : undefined;
}

/**
 * Capitalizes a string, optionally "pluralizing" it as well. It does this
 * second bit by adding and "s" to the end. No, it does not know anything
 * about proper grammatical rules.
 */
export function prettifyName(name: string, pluralize = false) {
  const pretty = name.replace('@', '');

  const pieces = [
    pretty.charAt(0).toUpperCase(),
    pretty.substring(1).toLowerCase(),
    pluralize && pretty.charAt(pretty.length - 1) !== 's' ? 's' : '',
  ];

  return pieces.join('');
}

/**
 * Checks that the children of the provided container are ordered in an ascending
 * sort of their numeric ids.
 */
export function ensureSortedChildren(reflection: ContainerReflection) {
  // @ts-expect-error - usage of __sorted__
  if (Array.isArray(reflection.children) && !reflection.children.__sorted__) {
    reflection.children.sort((a, b) => a.id - b.id);
    // @ts-expect-error - usage of __sorted__
    reflection.children.__sorted__ = true;
  }
}

/**
 * Given a string like "\"Hello World\"" this will remove the escaped quotations
 * at the beginning and end.
 */
export function stripEscapedOuterQuotes<K>(value: K): K;
export function stripEscapedOuterQuotes(value: string): string;
export function stripEscapedOuterQuotes(value: unknown) {
  return typeof value === 'string' ? value.replace(/^"|^'|"$|'$/g, '') : value;
}

/**
 * Reflection type check.
 */
export function isKindOf<K extends ReflectionKind>(value: unknown, kind: K): value is KindOf<K> {
  if (typeof value === 'object' && value !== null && 'kind' in value) {
    return (value as { kind: ReflectionKind }).kind === kind;
  }

  return false;
}
