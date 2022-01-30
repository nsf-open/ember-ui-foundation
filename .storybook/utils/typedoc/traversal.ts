import { ContainerReflection, Reflection } from 'typedoc/dist/lib/serialization/schema';
import { KindOf, ReflectionKind } from './types';

/**
 * Checks that the children of the provided container are ordered in an ascending sort of
 * their numeric ids.
 */
export function ensureSortedChildren(reflection: ContainerReflection) {
  // @ts-expect-error
  if (Array.isArray(reflection.children) && !reflection.children.__sorted__) {
    reflection.children.sort((a, b) => a.id - b.id);
    // @ts-expect-error
    reflection.children.__sorted__ = true;
  }
}

/**
 * Given a container, return the reflection with the given id. IDs are unique to
 * each reflection and increment depth-first, so it's The Price is Right rules when
 * it comes to looking one up. In a list of containers, the ID of the direct ancestor
 * of whatever we're trying to find will the closest without going over.
 */
export function findDescendantById<ReturnType extends Reflection = Reflection>(
  parent: ContainerReflection,
  id: number,
  returnParent = false,
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
  return (Array.isArray(name)
    ? parent.children.find(child => name.includes(child.name))
    : parent.children.find(child => name === child.name)) as ReturnType ?? undefined;
}

/**
 * Given a container, return all children of the given Kind.
 */
export function findChildrenByKind<K extends ReflectionKind>(
  parent: ContainerReflection,
  kind: K
): KindOf<K>[] {
  const group = parent.groups.find(group => group.kind === kind);

  if (group) {
    return group.children.map(function (id) {
      return findDescendantById<KindOf<K>>(parent, id);
    });
  }

  return [];
}
