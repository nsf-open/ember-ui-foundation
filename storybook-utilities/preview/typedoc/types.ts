import type {
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  TypeParameterReflection,
} from 'typedoc/dist/lib/serialization/schema';

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

export interface EnumerationMemberReflection extends Reflection {
  defaultValue: unknown;
}

/**
 * Type casting various reflections to increase specificity.
 */
export type KindOf<K extends ReflectionKind> = K extends ReflectionKind.Project
  ? ProjectReflection
  : K extends ReflectionKind.Module
  ? DeclarationReflection
  : K extends ReflectionKind.Class
  ? DeclarationReflection
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
 * Reflection type check.
 */
export function isKindOf<K extends ReflectionKind>(value: any, kind: K): value is KindOf<K> {
  return value && value.kind === kind;
}
