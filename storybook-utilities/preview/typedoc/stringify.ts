import type {
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  SomeType,
  Type,
} from 'typedoc/dist/lib/serialization/schema';
import { ReflectionKind } from './constants';
import { isKindOf } from './utils';

/**
 * Returns the full description of a reflection, concatenating the short and full comment
 * text as available.
 */
export function getFullCommentText(reflection: Reflection): string {
  // Not sure if this is a bug.
  if (isKindOf(reflection, ReflectionKind.Method)) {
    const firstSignature = reflection.signatures?.[0];

    if (firstSignature) {
      return getFullCommentText(firstSignature);
    }
  }

  if (isKindOf(reflection, ReflectionKind.Accessor)) {
    const firstSignature = reflection.getSignature;

    if (firstSignature) {
      return getFullCommentText(firstSignature);
    }
  }

  if (isKindOf(reflection, ReflectionKind.Property)) {
    if (reflection.type && 'declaration' in reflection.type) {
      const firstSignature = reflection.type.declaration?.signatures?.[0];

      if (firstSignature) {
        return getFullCommentText(firstSignature);
      }
    }
  }

  if (Array.isArray(reflection.comment?.summary)) {
    return reflection.comment?.summary.map((item) => item.text).join('') ?? '';
  }

  return '';
}

/**
 * Stringify a declaration of some sort.
 */
export function toDeclarationString(
  declaration: SignatureReflection | DeclarationReflection | undefined,
  project: ProjectReflection,
  showName = true
) {
  if (!declaration) {
    return '';
  }

  const name = declaration.name;
  const optional = declaration.flags.isOptional ? '?' : '';

  let type = declaration.type ? toTypeString(declaration.type, project) : 'unknown';

  // Function signature
  if (isKindOf(declaration, ReflectionKind.CallSignature)) {
    if ('parameters' in declaration) {
      const params = declaration.parameters
        ?.map((item) => toDeclarationString(item, project))
        .join(', ');

      type = `(${params}) => ${type}`;
    } else {
      type = `() => ${type}`;
    }
  }

  return showName ? `${name}${optional}: ${type}` : type;
}

/**
 * Convert a type definition into a string.
 */
export function toTypeString(type: SomeType | Type | undefined, project: ProjectReflection) {
  if (!type) {
    return '';
  }

  // Literals - strings, numbers, and booleans
  if ('value' in type) {
    return typeof type.value === 'string' ? `"${type.value}"` : String(type.value);
  }

  let str = '';

  // This would be where we look up something like a Class reference, but default exports don't come with the local
  // name of the object... it's always "default", and while that's technically accurate it's not particularly
  // useful to humans. Hrumph.

  // if ('id' in type) {
  //   const ref = findChildById(project, type.id);
  //   if (ref) {}
  // }

  // Inferred, Intrinsic, Predicate, Reference, and Unknown types all have a name
  if ('name' in type) {
    str = type.name;
  }

  // The <string> bit in something like Promise<string>
  if ('typeArguments' in type) {
    const typeArgs = type.typeArguments?.map((item) => toTypeString(item, project));

    str = `${str}<${typeArgs?.join(', ')}>`;
  }

  // Unions and Intersections
  if ('types' in type) {
    const separator = type.type === 'union' ? ' | ' : ' & ';

    const typeString = type.types
      .map((item) => {
        const result = toTypeString(item, project);

        if (
          (type.type === 'union' && item.type === 'intersection') ||
          (item.type === 'union' && type.type === 'intersection')
        ) {
          return `(${result})`;
        }

        return result;
      })
      .join(separator);

    str = `${str}${typeString}`;
  }

  // A reflection
  if (type && 'declaration' in type && type.declaration) {
    if ('children' in type.declaration) {
      str = `{ ${type.declaration.children
        ?.map((item) => toDeclarationString(item, project))
        .join(', ')} }`;
    } else if ('signatures' in type.declaration) {
      str =
        type.declaration.signatures
          ?.map((sig) => toDeclarationString(sig, project, false))
          .join(' | ') ?? '';
    }
  }

  return str;
}
