import type {
  ContainerReflection,
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
  Reflection,
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

type KindOf<K extends ReflectionKind> =
  K extends ReflectionKind.Project
    ? Project
    : K extends ReflectionKind.Module
      ? Module
      : K extends ReflectionKind.Class
        ? Class
        : K extends ReflectionKind.Property
          ? Property
          : K extends ReflectionKind.Enum
            ? Enumeration
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

  const module = project.children.find((child) => {
    return [
      `components/${dashedName}/component`,
      `components/${dashedName}`,
      `components/${classyName}/component`,
      `components/${classyName}`,
    ].includes(child.name);
  });

  return module ?? undefined;
}

/**
 * Given a container, return all its children of the requested Kind.
 */
export function findChildrenOfKind<K extends ReflectionKind>(parent: ContainerReflection, kind: K) {
  const group = parent.groups.find(group => group.kind === kind);

  if (group) {
    return group.children.map(
      id => parent.children.find(child => child.id === id)
    ) as KindOf<K>[];
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

  return children.find(child => child.name === name) as KindOf<K> ?? undefined;
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

  return parent.children.find(child => child.id === id) as ReturnType ?? undefined;
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
