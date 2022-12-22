import { DeclarationReflection, ProjectReflection } from 'typedoc/dist/lib/serialization/schema';
import {
  ArgsEntry,
  argsEntryFromBlockTag,
  buildArgumentEntriesObject,
  findChildrenByKind,
  ReflectionKind,
} from '../typedoc';

/**
 * Given at least a partial lookup string as a name, this will return an object whose values
 * are ArgEntry definitions that Storybook can use to put together documentation. Unlike the
 * Ember Component specific method below, this includes all public properties and methods,
 * and does not attempt to create controls.
 */
export function buildClassLikeArgumentsTable(
  project: ProjectReflection,
  item: DeclarationReflection
) {
  const properties = findChildrenByKind(item, ReflectionKind.Property).filter((prop) => {
    const { isExternal, isPrivate, isProtected } = prop.flags;
    return !(isExternal || isPrivate || isProtected);
  });

  const methods = findChildrenByKind(item, ReflectionKind.Method).filter((prop) => {
    const { isExternal, isPrivate, isProtected } = prop.flags;
    return !(isExternal || isPrivate || isProtected);
  });

  return Object.assign(
    buildArgumentEntriesObject(project, properties, false, 'Properties'),
    buildArgumentEntriesObject(project, methods, false, 'Methods')
  );
}

/**
 * Given a component name, this will return an object whose values are ArgEntry definitions
 * that Storybook can use to put together the Controls pane and supplemental documentation.
 */
export function buildComponentArgumentsTable(
  project: ProjectReflection,
  component: DeclarationReflection
) {
  const properties = findChildrenByKind(component, ReflectionKind.Property).filter((prop) => {
    const { isExternal, isStatic, isReadonly, isPrivate, isProtected } = prop.flags;
    return !(isExternal || isStatic || isReadonly || isPrivate || isProtected);
  });

  const accessors = findChildrenByKind(component, ReflectionKind.Accessor).filter((prop) => {
    const { isPrivate, isProtected } = prop.flags;
    return !(isPrivate || isProtected || !('setSignature' in prop));
  });

  return {
    ...buildYieldsEntriesForComponent(component),
    ...buildArgumentEntriesObject(project, [...properties, ...accessors], true, 'Properties')
  };
}

/**
 * Returns a hash containing ArgEntry objects derived from the @yield or @yields
 * tags in the reflection's description. The keys of the returned object will be
 * sorted in ascending string value, and will be equal to each entry's name.
 */
export function buildYieldsEntriesForComponent(
  component: DeclarationReflection
): Record<string, ArgsEntry> {
  const tags = component.comment?.blockTags;

  if (!tags?.length) {
    return {};
  }

  return tags
    .filter((tag) => ['yield', 'yields'].includes((tag.name ?? tag.tag).replace('@', '')))
    .map((tag) => argsEntryFromBlockTag(tag))
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
}
