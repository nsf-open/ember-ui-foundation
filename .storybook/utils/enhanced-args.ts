import type { Project, Property, Enumeration } from './typedoc';
import { findChildById, isKindOf, ReflectionKind } from './typedoc';

/**
 * Given a string like "\"Hello World\"" this will remove the escaped quotations
 * at the beginning and end.
 */
function stripEscapedOuterQuotes(value: any) {
  return typeof value === 'string'
    ? value.replace(/^"|"$/g, '')
    : value;
}

/**
 * Given an enum reflection and a string like "NameOfTheEnum.SomeProp", the value
 * of the EnumerationMember named "SomeProp" will be returned.
 */
function getValueOfEnumDotReference(ref: Enumeration, name: string) {
  if (typeof name === 'string') {
    let [enumName, propName] = name.split('.');

    if (!propName) {
      propName = enumName;
    }

    return stripEscapedOuterQuotes(ref.children.find(member => member.name === propName)?.defaultValue);
  }

  return undefined;
}


export function createArgType(prop: Property, project: Project) {
  const arg = {
    name:         prop.name,
    description:  prop.comment.shortText,
    defaultValue: prop.defaultValue,
    control:      undefined,
    options:      undefined,
    type:         { summary: undefined  },
    table:        { category: 'Properties', defaultValue: { summary: undefined } },
  };

  if (prop.type.type === 'intrinsic') {
    arg.type.summary = prop.type.name;

    switch (prop.type.name) {
      case 'string':
        arg.control = { type: 'text' };
    }
  }
  else if (prop.type.type === 'reference') {
    const ref = findChildById(project, prop.type.id);

    if (isKindOf(ref, ReflectionKind.Enum)) {
      arg.control      = { type: 'select' };
      arg.options      = ref.children.map(child => (stripEscapedOuterQuotes(child.defaultValue)));
      arg.defaultValue = getValueOfEnumDotReference(ref, prop.defaultValue);

      arg.type.summary = `Enum ${ref.name}`;
    }
  }

  arg.table.defaultValue.summary = arg.defaultValue;

  return arg;
}
