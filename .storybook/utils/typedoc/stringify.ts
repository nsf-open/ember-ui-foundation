import type {
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  SomeType,
  Type,
} from 'typedoc/dist/lib/serialization/schema';

/**
 * Given a string like "\"Hello World\"" this will remove the escaped quotations
 * at the beginning and end.
 */
export function stripEscapedOuterQuotes(value: any) {
  return typeof value === 'string'
    ? value.replace(/^"|^'|"$|'$/g, '')
    : value;
}

/**
 * Returns the full description of a reflection, concatenating the short and full comment
 * text as available.
 */
export function getFullCommentText(reflection: Reflection) {
  const { shortText, text } = reflection.comment ?? { shortText: null, text: null };

  return [shortText, text]
    .map(text => typeof text === 'string' ? text.trim() : text)
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Stringify a declaration of some sort.
 */
export function toDeclarationString(
  declaration: SignatureReflection | DeclarationReflection,
  project: ProjectReflection,
  showName = true
) {
  const name     = declaration.name;
  const optional = declaration.flags.isOptional ? '?' : '';

  let type = declaration.type ? toTypeString(declaration.type, project) : 'unknown';

  // Function signature
  if ('parameters' in declaration) {
    const params = declaration.parameters?.map(
      item => toDeclarationString(item, project)
    ).join(', ');

    type = `(${params}) => ${type}`;
  }

  return showName
    ? `${name}${optional}: ${type}`
    : type;
}

/**
 * Convert a type definition into a string.
 */
export function toTypeString(type: SomeType | Type, project: ProjectReflection) {
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
    const typeArgs = type.typeArguments?.map(
      item => toTypeString(item, project)
    );

    str = `${str}<${typeArgs?.join(', ')}>`;
  }

  // Unions and Intersections
  if ('types' in type) {
    const separator = type.type === 'union'
      ? ' | '
      : ' & ';

    const typeString = type.types.map(item => {
      const result = toTypeString(item, project);

      if (
        (type.type === 'union' && item.type === 'intersection') ||
        (item.type === 'union' && type.type === 'intersection')
      ) {
        return `(${result})`;
      }

      return result;
    }).join(separator);

    str = `${str}${typeString}`;
  }

  // A reflection
  if (type && 'declaration' in type && type.declaration) {
    if ('children' in type.declaration) {
      str = `{ ${ type.declaration.children?.map(item => toDeclarationString(item, project)).join(', ') } }`;
    }
    else if ('signatures' in type.declaration) {
      str = type.declaration.signatures?.map(sig => toDeclarationString(sig, project, false)).join(' | ') ?? '';
    }
  }

  return str;
}


const STRING_DECAMELCASE_REGEXP = (/([a-z\d])([A-Z])/g);
const STRING_KEBAB_REGEXP = (/[ _]/g);
const STRING_CAMELCASE_REGEXP_1 = (/(-|_|\.|\/|\s)+(.)?/g);
const STRING_CAMELCASE_REGEXP_2 = (/(^|\/)([A-Z])/g);

/**
 * Returns the Capitalized form of a string.
 */
export function upperFirst(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
}


/**
 * Returns the lowerCamelCase form of a string.
 */
export function camelCase(str) {
  return str
  .replace(STRING_CAMELCASE_REGEXP_1, (match, separator, chr) => chr ? chr.toUpperCase() : '')
  .replace(STRING_CAMELCASE_REGEXP_2, (match) => match.toLowerCase());
}

/**
 * Returns the UpperCamelCase form of a string.
 */
export function classyCase(str) {
  return upperFirst(camelCase(str));
}

/**
 * Converts a camelized string into all lower case separated by underscores.
 */
export function deCamelCase(str) {
  return str.replace(STRING_DECAMELCASE_REGEXP, '$1_$2').toLowerCase();
}


/**
 * Replaces underscores, spaces, or camelCase with dashes.
 */
export function kebabCase(str) {
  return deCamelCase(str).replace(STRING_KEBAB_REGEXP, '-');
}
