import type {
  ContainerReflection,
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
  SignatureReflection,
  SomeType,
  Reflection,
  Type,
} from 'typedoc/dist/lib/serialization/schema';

import { classify, dasherize } from '@ember/string';

// Lifted out of typedoc/src/lib/models/reflections/abstract.ts
// so that it'll make it client-side.
export enum ReflectionKind {
  Project = 0x1,
  Module = 0x2,
  Namespace = 0x4,
  Enum = 0x8,
  EnumMember = 0x10,
  Variable = 0x20,
  Function = 0x40,
  Class = 0x80,
  Interface = 0x100,
  Constructor = 0x200,
  Property = 0x400,
  Method = 0x800,
  CallSignature = 0x1000,
  IndexSignature = 0x2000,
  ConstructorSignature = 0x4000,
  Parameter = 0x8000,
  TypeLiteral = 0x10000,
  TypeParameter = 0x20000,
  Accessor = 0x40000,
  GetSignature = 0x80000,
  SetSignature = 0x100000,
  ObjectLiteral = 0x200000,
  TypeAlias = 0x400000,
  Event = 0x800000,
  Reference = 0x1000000,
}

export enum TypeOfTypes {
  Intrinsic = 'intrinsic',
  Literal = 'literal',
}

export interface Project extends ProjectReflection {
  kind:       ReflectionKind.Project;
  kindString: never;
  children:   Module[];
}

export interface Module extends DeclarationReflection {
  kind:       ReflectionKind.Module;
  kindString: 'Module';
}

export interface Class extends DeclarationReflection {
  kind:       ReflectionKind.Class,
  kindString: 'Class';
}

export interface Property extends ParameterReflection {
  kind:       ReflectionKind.Property,
  kindString: 'Property'
}

export interface Enumeration extends DeclarationReflection {
  kind:        ReflectionKind.Enum;
  kindString: 'Enumeration';
}

/**
 * Type casting various reflections to increase specificity.
 */
type KindOf<K extends ReflectionKind> =
  K extends ReflectionKind.Project
    ? Project
    : K extends ReflectionKind.Module
      ? Module
      : K extends ReflectionKind.Class
        ? Class
        : K extends ReflectionKind.Property
          ? Property
          : K extends ReflectionKind.Parameter
            ? ParameterReflection
            : K extends ReflectionKind.Enum
              ? Enumeration
              : K extends ReflectionKind.Function
                ? SignatureReflection
                : K extends ReflectionKind.Method
                  ? SignatureReflection
                  : K extends ReflectionKind.CallSignature
                    ? SignatureReflection
                    : Reflection;


/**
 * Reflection type check.
 */
export function isKindOf<K extends ReflectionKind>(value: any, kind: K): value is KindOf<K> {
  return value && value.kind === kind;
}


/**
 * Looks through the project's modules for one whose name matches the provided
 * argument based on a few typical patterns for component layout in Ember addons
 * and folder/file naming.
 */
export function findComponentModule(project: Project, name: string) {
  const dashedName = dasherize(name);
  const classyName = classify(name);

  const lookups = [
    `components/${dashedName}/component`,
    `components/${dashedName}`,
    `components/${classyName}/component`,
    `components/${classyName}`,
  ];

  const module = project.children.find((child) => {
    return lookups.includes(child.name);
  });

  if (!module) {
    console.warn(`COMPONENT NOT FOUND IN DOCS. Searched \n[\n  "${lookups.join('",\n  "')}"\n]`);
  }

  return module ?? undefined;
}


/**
 * Retries all of the writable public properties of a component.
 */
export function getComponentPublicProperties(project: Project, nameOrClass: string | Class) {
  const component = typeof nameOrClass === 'string'
    ? findComponentDefinition(project, nameOrClass)
    : nameOrClass;

  if (component) {
    return findChildrenOfKind(component, ReflectionKind.Property)
      .filter(function(prop) {
        return !(
          prop.flags.isExternal
          || prop.flags.isStatic
          || prop.flags.isReadonly
          || prop.flags.isPrivate
          || prop.flags.isProtected
        );
      });
  }

  return undefined;
}


/**
 * Returns the full description of the component, concatenating the short and full comment
 * text as available.
 */
export function getComponentDescription(project: Project, name: string) {
  const component = findComponentDefinition(project, name);

  if (component) {
    const { shortText, text } = component.comment ?? {};
    return `${shortText}\n\n${text}`.trim();
  }

  return undefined;
}


/**
 * Given a container, return all its children of the requested Kind.
 */
export function findChildrenOfKind<K extends ReflectionKind>(parent: ContainerReflection, kind: K) {
  if (!(parent && parent.groups && parent.children)) {
    return [];
  }

  const group = parent.groups.find(group => group.kind === kind);

  if (group && group.children) {
    return group.children.map(
      id => parent.children?.find(child => child.id === id)
    ).filter(Boolean) as KindOf<K>[];
  }

  return [];
}

/**
 * Given a container, return the child of the provided name. If a name is not provided
 * then the default export will be returned, if applicable. The search scope can be
 * further narrowed by indicating the Kind of child to look for.
 */
export function findChildByName<K extends ReflectionKind>(
  parent: ContainerReflection,
  name = 'default',
  kind?: K
) {
  const children = kind
    ? findChildrenOfKind(parent, kind) as Reflection[]
    : parent.children;

  return children?.find(child => child.name === name) as KindOf<K> ?? undefined;
}

/**
 * Given a container, return the child with the provided ID. This also works against the Project
 * itself by first looking up the module that the reflection would be exported from.
 */
export function findChildById<ReturnType extends Reflection = Reflection>(
  parent: ContainerReflection,
  id: number
): ReturnType {
  if (isKindOf(parent, ReflectionKind.Project)) {
    for (let i = 0; i < parent.children.length; i += 1) {
      // IDs are unique to each reflection and increment depth-first, so its The Price is
      // Right rules when it comes to looking up the module that it'll be exported from.
      // The Module's ID will be the closest without going over the ID that we're looking up.
      if (parent.children[i].id > id) {
        return findChildById<ReturnType>(parent.children[i - 1], id);
      }
    }
  }

  return parent.children?.find(child => child.id === id) as ReturnType ?? undefined;
}

/**
 * Returns the default export of a component module.
 */
export function findComponentDefinition(project: Project, name: string) {
  const module = findComponentModule(project, name);

  return module
    ? findChildByName(module, 'default', ReflectionKind.Class)
    : undefined;
}

/**
 * Stringify a declaration of some sort.
 */
export function toDeclarationString(
  declaration: SignatureReflection | DeclarationReflection,
  project: Project,
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
export function toTypeString(type: SomeType | Type, project: Project) {
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
