import type {
  ContainerReflection,
  ProjectReflection,
  Reflection,
} from 'typedoc/dist/lib/serialization/schema';
import { ensureSortedChildren } from './utils';
import { GroupTitles, KindOf, ReflectionKind } from './constants';

/**
 * Given a container, return the reflection with the given id. IDs are unique to
 * each reflection and increment depth-first, so it's The Price is Right rules when
 * it comes to looking one up. In a list of containers, the ID of the direct ancestor
 * of whatever we're trying to find will the closest without going over.
 *
 * The `returnParent` boolean will result in the immediate parent of the search target
 * being returned. This is useful if you have something like an enumeration member and
 * want to find the enumeration.
 */
export function findDescendantById<ReturnType extends Reflection = Reflection>(
  parent: ContainerReflection,
  id: number,
  returnParent = false
): ReturnType | undefined {
  if (Array.isArray(parent?.children)) {
    ensureSortedChildren(parent);

    for (let i = 0; i < parent.children.length; i += 1) {
      if (parent.children[i].id === id) {
        return (returnParent ? parent : parent.children[i]) as ReturnType;
      }

      if (parent.children[i].id > id && i > 0) {
        return findDescendantById<ReturnType>(parent.children[i - 1], id, returnParent);
      }
    }
  }

  return undefined;
}

/**
 * Given a container, return the reflection with the given name. If multiple names
 * are provided then the first match will be returned.
 */
export function findChildByName<ReturnType extends Reflection = Reflection>(
  parent: ContainerReflection,
  name: string | string[]
): ReturnType | undefined {
  if (Array.isArray(name)) {
    let found: ReturnType | undefined;

    for (let i = 0; i < name.length; i += 1) {
      found =
        (parent.children?.find((child) => child.name.includes(name[i])) as ReturnType) ?? undefined;

      if (found) {
        break;
      }
    }

    return found;
  }

  return (parent.children?.find((child) => child.name.includes(name)) as ReturnType) ?? undefined;
}

/**
 * Given a container, return all children of the given Kind.
 */
export function findChildrenByKind<K extends ReflectionKind>(
  parent: ContainerReflection,
  kind: K
): KindOf<K>[] {
  const group = parent.groups?.find((group) => GroupTitles[group.title] === kind);

  if (group && group.children) {
    return group.children
      .map((id) => findDescendantById<KindOf<K>>(parent, id))
      .filter(Boolean) as KindOf<K>[];
  }

  return [];
}

/**
 * Returns a reflection of some named export from a module. To use, the "name" provided
 * is a concatenation of the module name + export name. For example, the following will
 * return the reflection for the named export `StreetSuffixes` given it exists inside
 * a `AddressModel` module.
 *
 * ```ts
 * getModuleExport(project, 'AddressModel#StreetSuffixes');
 * ```
 *
 * By default, the "default" export will be returned if no specific export name is provided.
 */
export function getModuleExport(project: ProjectReflection, name: string) {
  const [moduleName, exportName] = name.split('#', 2);
  const module = findChildByName(project, moduleName);

  return module ? findChildByName(module, exportName || 'default') : undefined;
}
