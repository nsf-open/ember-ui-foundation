import type {
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
  ContainerReflection,
  Reflection,
  ReferenceReflection,
  SignatureReflection,
  TypeParameterReflection,
} from 'typedoc/dist/lib/serialization/schema';

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

export const GroupTitles: Record<string, ReflectionKind> = {
  Accessors: ReflectionKind.Accessor,
  Constructors: ReflectionKind.Constructor,
  Classes: ReflectionKind.Class,
  Enumerations: ReflectionKind.Enum,
  ['Enumeration Members']: ReflectionKind.EnumMember,
  Functions: ReflectionKind.Function,
  Interfaces: ReflectionKind.Interface,
  Methods: ReflectionKind.Method,
  Properties: ReflectionKind.Property,
  References: ReflectionKind.Reference,
  ['Type Aliases']: ReflectionKind.TypeAlias,
};

export interface EnumerationMemberReflection extends Reflection {
  defaultValue: unknown;
}

/**
 * Type casting various reflections to increase specificity.
 */
export type KindOf<K extends ReflectionKind> = K extends ReflectionKind.Project
  ? ProjectReflection
  : K extends ReflectionKind.Module
  ? ContainerReflection
  : K extends ReflectionKind.Class
  ? ContainerReflection
  : K extends ReflectionKind.Reference
  ? ReferenceReflection
  : K extends ReflectionKind.Property
  ? ParameterReflection
  : K extends ReflectionKind.Parameter
  ? ParameterReflection
  : K extends ReflectionKind.Enum
  ? DeclarationReflection
  : K extends ReflectionKind.Function
  ? SignatureReflection
  : K extends ReflectionKind.Method
  ? DeclarationReflection
  : K extends ReflectionKind.CallSignature
  ? SignatureReflection
  : K extends ReflectionKind.TypeAlias
  ? TypeParameterReflection
  : K extends ReflectionKind.EnumMember
  ? EnumerationMemberReflection
  : K extends ReflectionKind.Accessor
  ? DeclarationReflection
  : Reflection;

/**
 * An ArgsEntry object provides a description that is used by different parts
 * of Storybook to generate UI controls and documentation.
 */
export type ArgsEntry = {
  name: string;
  description?: string;
  defaultValue: string | number | boolean | null | undefined | Record<string, unknown> | unknown[];

  type?: {
    name?: string;
    required?: boolean;
  };

  table?: {
    category?: string;
    type?: { summary?: string };
    defaultValue?: { summary?: string };
    disable?: boolean;
  };

  options?: (string | number)[];

  mapping?: Record<string, unknown>;

  control?:
    | false
    | {
        type:
          | 'boolean'
          | 'object'
          | 'file'
          | 'radio'
          | 'inline-radio'
          | 'check'
          | 'inline-check'
          | 'multi-select'
          | 'text'
          | 'color'
          | 'date';
      }
    | {
        type: 'select';
        labels?: Record<string, string>;
      }
    | {
        type: 'range' | 'number';
        min?: number;
        max?: number;
        step?: number;
      };
};
