import type { ArgsEntry } from './types';
import type { DeclarationReflection } from 'typedoc/dist/lib/serialization/schema';
import { ProjectReflection } from 'typedoc/dist/lib/serialization/schema';
import { buildArgumentEntriesObject } from './args';
import { findChildrenByKind } from '../typedoc/traversal';
import { ReflectionKind } from '../typedoc/types';

/**
 * Given at least a partial lookup string as a name, this will return an object whose values
 * are ArgEntry definitions that Storybook can use to put together documentation. Unlike the
 * Ember Component specific method below, this includes all public properties and methods,
 * and does not attempt to create controls.
 */
export function buildClassLikeArgumentsTable(project: ProjectReflection, item: DeclarationReflection) {
  const properties = findChildrenByKind(item, ReflectionKind.Property)
    .filter(function(prop) {
      return !(
        prop.flags.isExternal
        || prop.flags.isPrivate
        || prop.flags.isProtected
      );
    });

  const methods = findChildrenByKind(item, ReflectionKind.Method)
    .filter(function(prop) {
      return !(
        prop.flags.isExternal
        || prop.flags.isPrivate
        || prop.flags.isProtected
      );
    });

  return Object.assign(
    buildArgumentEntriesObject(project, properties, false, 'Properties'),
    buildArgumentEntriesObject(project, methods, false, 'Methods'),
  );
}

/**
 * Given a component name, this will return an object whose values are ArgEntry definitions
 * that Storybook can use to put together the Controls pane and supplemental documentation.
 */
export function buildComponentArgumentsTable(project: ProjectReflection, component: DeclarationReflection) {
  const properties = findChildrenByKind(component, ReflectionKind.Property)
    .filter(function(prop) {
      return !(
        prop.flags.isExternal
        || prop.flags.isStatic
        || prop.flags.isReadonly
        || prop.flags.isPrivate
        || prop.flags.isProtected
      );
    });

  return Object.assign(
    buildYieldsEntriesForComponent(component),
    buildArgumentEntriesObject(project, properties, true, 'Properties'),
  );
}

/**
 * Given a "component" DeclarationReflection, this will return an array of ArgEntry objects
 * derived from the @yield or @yields tags in its description. The ArgEntries will be sorted
 * in ascending value of their names.
 */
export function buildYieldsEntriesForComponent(component: DeclarationReflection) {
  const tags = component.comment?.tags;

  if (!Array.isArray(tags) || tags.length < 1) {
    return {};
  }

  const definiteTags = tags
    .map(tag => buildYieldsEntry(tag))
    .filter(Boolean) as ArgsEntry[];

  return definiteTags.sort((a, b) => a.name.localeCompare(b.name))
    .reduce((accumulator, tag) => {
      accumulator[tag.name] = tag;
      return accumulator;
    }, {} as Record<string, ArgsEntry>);
}

/**
 * Given a @yield or @yields with JSDoc-like comment structure, this will parse
 * out the type, name, and description.
 *
 * ```
 * @yield {string} name - the name of the user
 * ```
 */
export function buildYieldsEntry(tag: { tag: string, text: string }): ArgsEntry | undefined {
  if (!['yield', 'yields'].includes(tag.tag) || typeof tag.text !== 'string') {
    return undefined;
  }

  let type: string = 'unknown';
  let name: string | undefined = undefined;
  let desc: string | undefined = undefined;

  // Squashes multiple concurrent whitespaces into a single one.
  const text = tag.text.trim().replace(/\s{2,}/g, ' ');

  let i = 0;
  let brackets = 0;

  // Extract the type described with {brackets}, if provided.
  // The value of "i" will let us pick up the index of where
  // the type definition stops. This is by no means meant to
  // be a particularly impressive way of doing things.
  if (text.charAt(0) === '{') {
    brackets += 1;

    for (i = 1; i < text.length; i += 1) {
      switch (text.charAt(i)) {
        case '{': brackets += 1; break;
        case '}': brackets -= 1; break;
      }

      if (brackets === 0) {
        break;
      }
    }

    type = text.substring(1, i);
  }

  // If a type was described, bump the pointer over the closing "}"
  i = (i > 0) ? (i + 1) : i;

  // There is either a name, or name + description remaining. Find the
  // next whitespace - that'll be the end of the name, or go to the
  // end of the string
  let endOfName = text.indexOf(' ', i + 1);
  endOfName = endOfName > -1 ? endOfName : text.length;

  name = text.substring(i, endOfName).trim();

  // If there is any string left to go it's all description
  i = i + 1 + name.length;

  if (i < text.length) {
    desc = text.substring(i).trim();

    if (desc.startsWith('-')) {
      desc = desc.replace('-', '').trim();
    }
  }

  return {
    name,
    description: desc,
    type: { name: type, required: false },
    control: false,

    table: {
      category: 'Yields',
      type: { summary: type },
    }
  } as ArgsEntry;
}
