import type { CommentTag } from 'typedoc/dist/lib/serialization/schema';
import {
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
  SignatureReflection,
  UnionType,
} from 'typedoc/dist/lib/serialization/schema';
import { findMatchingBracket, isKindOf, prettifyName, stripEscapedOuterQuotes } from './utils';
import { ArgsEntry, ReflectionKind } from './constants';
import { getFullCommentText, toDeclarationString, toTypeString } from './stringify';
import { findChildByName, findDescendantById } from './traverse';

/**
 * Given a block tag, e.g. @yields foobar, with _almost_ JSDoc-like comment
 * structure, this will parse out the type, name, and description.
 *
 * In JSDoc, when describing something like a @param, the _type_ comes first
 * inside curly brackets, e.g. {string}. TypeDoc will strip out this syntax
 * so use parenthesis instead.
 *
 * ```
 * @yield (string) name - the name of the user
 *
 * @yield ({ id: string, name: string }) user basic user information
 *
 * @yield
 * ```
 */
export function argsEntryFromBlockTag(commentTag: CommentTag) {
  // Join comment parts, and squash multiple concurrent whitespaces
  // into a single one.
  let text = commentTag.content
    .map((item) => item.text)
    .join('')
    .trim()
    .replace(/\s{2,}/g, ' ');

  let type = 'unknown';
  let name = '';
  let desc = '';

  const typeSubstring = findMatchingBracket(['(', ')'], text);

  if (typeSubstring) {
    const [left, right] = typeSubstring;

    type = text.substring(left + 1, right);
    text = text.substring(right + 1).trim();
  }

  // There is either a name, or name + description remaining. Find the
  // next whitespace - that'll be the end of the name, or go to the
  // end of the string.
  const nextSpace = text.indexOf(' ');

  if (nextSpace > -1) {
    name = text.substring(0, nextSpace);
    desc = text.substring(nextSpace + 1).trim();

    // Take care of common formatting trends.
    if (desc.charAt(0) === '-' || desc.charAt(0) === ':') {
      desc = desc.substring(1).trim();
    }
  } else {
    name = text;
  }

  return {
    name,
    description: desc,
    control: false,
    type: { name: type, required: false },
    table: {
      category: prettifyName(commentTag.name ?? commentTag.tag, true),
      type: { summary: type },
    },
  } as ArgsEntry;
}

/**
 * Given an array of ParameterReflections, this will return an array of ArgEntry objects
 * describing each property in Storybook-friendly fashion.
 */
export function buildArgumentEntriesObject(
  project: ProjectReflection,
  properties: (ParameterReflection | SignatureReflection | DeclarationReflection)[],
  inferControls = true,
  category?: string
) {
  return properties.reduce((accumulator, prop) => {
    let entry = buildArgumentEntry(project, prop, category);

    if (entry) {
      if (inferControls) {
        entry = inferArgumentControl(project, prop, entry);
      }

      accumulator[prop.name] = entry;
    }

    return accumulator;
  }, {} as Record<string, ArgsEntry>);
}

/**
 * A method that is responsible for putting together a single ArgEntry for the given
 * Property.
 */
export function buildArgumentEntry(
  project: ProjectReflection,
  property: ParameterReflection | DeclarationReflection,
  category?: string
): ArgsEntry {
  const isMethod = isKindOf(property, ReflectionKind.Method);
  const isAccessor = isKindOf(property, ReflectionKind.Accessor);

  const typeString = isMethod
    ? toDeclarationString(property.signatures?.[0], project)
    : isAccessor
    ? toTypeString(property.getSignature?.type, project)
    : toTypeString(property.type, project);

  return {
    name: property.name,
    description: getFullCommentText(property),
    type: { name: typeString, required: false },
    defaultValue: stripEscapedOuterQuotes(property.defaultValue) ?? undefined,
    control: false,

    table: {
      category,
      type: { summary: typeString },
      defaultValue: { summary: isMethod ? undefined : property.defaultValue ?? 'undefined' },
    },
  };
}

/**
 * Takes a previously created ArgEntry, along with the Property and Project used to build
 * it, and attempts to piece together a useful Storybook Control.
 */
export function inferArgumentControl(
  project: ProjectReflection,
  property: ParameterReflection,
  argEntry: ArgsEntry
): ArgsEntry {
  // Strings
  if (argEntry.type?.name === 'string') {
    argEntry.control = { type: 'text' };
    return argEntry;
  }

  // Numbers
  if (argEntry.type?.name === 'number') {
    argEntry.control = { type: 'number' };
    argEntry.defaultValue =
      typeof argEntry.defaultValue === 'string'
        ? parseFloat(argEntry.defaultValue)
        : argEntry.defaultValue;

    return argEntry;
  }

  // Booleans
  if (argEntry.type?.name === 'boolean') {
    argEntry.control = { type: 'boolean' };
    argEntry.defaultValue =
      typeof argEntry.defaultValue === 'string'
        ? argEntry.defaultValue === 'true'
        : argEntry.defaultValue;

    return argEntry;
  }

  // Unions
  if (property.type?.type === 'union') {
    return Object.assign(argEntry, buildControlFromUnionType(project, property, property.type));
  }

  // References
  if (property.type?.type === 'reference') {
    const ref = property.type.id ? findDescendantById(project, property.type.id) : undefined;

    // A reference to an Enumeration
    if (isKindOf(ref, ReflectionKind.Enum)) {
      return Object.assign(argEntry, buildControlFromEnumeration(property, ref));
    }

    // A reference to a TypeAlias that describes a union
    if (isKindOf(ref, ReflectionKind.TypeAlias) && ref.type?.type === 'union') {
      return Object.assign(argEntry, buildControlFromUnionType(project, property, ref.type));
    }
  }

  return argEntry;
}

/**
 * Creates a select control from an enumeration's members.
 */
function buildControlFromEnumeration(
  property: ParameterReflection,
  enumeration: DeclarationReflection
) {
  const options: (string | number)[] = [];
  const labels: Record<string, string> = {};
  const mapping: Record<string, unknown> = {};

  enumeration.children?.forEach((child) => {
    const defaultValue = stripEscapedOuterQuotes(child.defaultValue);

    if (defaultValue) {
      labels[defaultValue] = child.name;
      options.push(defaultValue);
    }
  });

  if (property.flags.isOptional) {
    options.unshift('No Selection');
    mapping['No Selection'] = null;
  }

  let defaultValue = property.defaultValue;

  // Going to pull the value out of the enumeration if possible.
  if (
    typeof property.defaultValue === 'string' &&
    property.defaultValue.startsWith(enumeration.name)
  ) {
    const [, memberName] = property.defaultValue.split('.', 2);

    if (memberName) {
      const member = findChildByName<ParameterReflection>(enumeration, memberName);

      if (member) {
        defaultValue = stripEscapedOuterQuotes(member.defaultValue);
      }
    }
  }

  return {
    defaultValue,
    options,
    control: { labels, mapping, type: 'select' as const },
  };
}

/**
 * Creates a select control from a union of literals.
 */
function buildControlFromUnionType(
  project: ProjectReflection,
  property: ParameterReflection,
  union: UnionType
) {
  const options: unknown[] = [];
  const labels: Record<string, string> = {};
  const mapping: Record<string, unknown> = {};
  let defaultValue = stripEscapedOuterQuotes(property.defaultValue);

  for (let i = 0; i < union.types.length; i += 1) {
    const item = union.types[i];

    // For the moment we're only going to support literal types or references
    // that directly point to something equally easy to tease a value from.
    // Intersecting with things like enumerations is definitely possible though.
    if (item.type !== 'literal') {
      if (item.type === 'reference') {
        const ref = item.id ? findDescendantById(project, item.id) : undefined;

        if (isKindOf(ref, ReflectionKind.EnumMember)) {
          const value = stripEscapedOuterQuotes(ref.defaultValue);

          if (typeof value === 'string' || typeof value === 'number') {
            labels[value] = ref.name;
            options.push(value);
          }

          // This can definitely be reimagined. There isn't much info available with
          // defaultValues to easily tie them back to something like an enumeration
          // so this is relying on the I-Guess-Its-Not-Too-Unlikely possibility of
          // being able to determine what that value is as the union members are
          // processed.
          const parent = findDescendantById(project, ref.id, true);

          if (parent && `${parent.name}.${ref.name}` === defaultValue) {
            // @ts-expect-error - _typings_, am I right?
            defaultValue = stripEscapedOuterQuotes(ref.defaultValue);
          }

          continue;
        }
      }

      return {};
    }

    options.push(item.value);
  }

  if (property.flags.isOptional) {
    options.unshift('No Selection');
    mapping['No Selection'] = null;
  }

  return {
    defaultValue,
    options,
    control: { labels, mapping, type: 'select' as const },
  };
}
