import type { Enumeration, Project, Property } from './typedoc';

import {
  findChildById,
  findComponentDefinition,
  getComponentPublicProperties,
  isKindOf,
  ReflectionKind,
  toTypeString,
} from './typedoc';

type ArgsEntry = {
  name: string,
  description?: string,
  defaultValue: string | number | boolean | null | undefined | Record<string, unknown> | unknown[],

  type: {
    name: string,
    required: boolean,
  },

  table: {
    category?: string,
    type: { summary: string },
    defaultValue: { summary: string },
    disable?: boolean,
  },

  options?: (string | number)[];

  mapping?: Record<string, unknown>;

  control: false | {
    type: 'boolean'
      | 'object'
      | 'file'
      | 'radio'
      | 'inline-radio'
      | 'check'
      | 'inline-check'
      | 'multi-select'
      | 'text'
      | 'color'
      | 'date',
  } | {
    type: 'select',
    labels?: Record<string, string>,
  } | {
    type: 'range' | 'number',
    min?: number,
    max?: number,
    step?: number,
  }
};

/**
 * Given a string like "\"Hello World\"" this will remove the escaped quotations
 * at the beginning and end.
 */
function stripEscapedOuterQuotes(value: any) {
  return typeof value === 'string'
    ? value.replace(/^"|^'|"$|'$/g, '')
    : value;
}

/**
 * Given an enum reflection and a string like "NameOfTheEnum.SomeProp", the value
 * of the EnumerationMember named "SomeProp" will be returned.
 */
function getValueOfEnumDotReference(ref: Enumeration, name: string) {
  if (typeof name === 'string') {
    const [enumName, propName] = name.split('.');

    return stripEscapedOuterQuotes(
      ref.children?.find(member => member.name === (propName ?? enumName))?.defaultValue
    );
  }

  return undefined;
}

/**
 * Given a component name, this will return an object whose values are ArgEntry definitions
 * the Storybook can use to put together the Controls pane and supplemental documentation.
 */
export function buildComponentArgumentsTable(project: Project, componentName: string) {
  const component = findComponentDefinition(project, componentName);

  if (!component) {
    return {};
  }

  const tags  = component.comment?.tags ?? [];
  const props = getComponentPublicProperties(project, component) || [];

  const yields = tags.reduce((accumulator, tag) => {
    const entry = buildComponentYieldsEntry(project, tag);

    if (entry) {
      accumulator[entry.name] = entry;
    }

    return accumulator;
  }, {} as Record<string, unknown>);

  const args = props.reduce((accumulator, prop) => {
    const entry = buildComponentArgumentEntry(project, prop);

    if (entry) {
      accumulator[prop.name] = entry;
    }

    return accumulator;
  }, {} as Record<string, unknown>);

  return Object.assign(yields, args);
}


/**
 *
 */
function buildComponentYieldsEntry(_project: Project, tag: { tag: string, text: string }) {
  if (!['yield', 'yields'].includes(tag.tag) || typeof tag.text !== 'string') {
    return undefined;
  }

  let type: string = 'unknown';
  let name: string | undefined = undefined;
  let desc: string | undefined = undefined;

  const text = tag.text.trim();

  let i = 0;
  let brackets = 0;

  // Extract the type described with {brackets}, if provided.
  // The value of "i" will let us pick up the index of where
  // the type definition stops. This is by no means meant to
  // be a particularly impressive way of doing things.
  if (text.charAt(0) === '{') {
    brackets += 1;

    for (i = 1; i < text.length; i += 1) {
      switch (text.charAt(i)) {
        case '{': brackets += 1; break;
        case '}': brackets -= 1; break;
      }

      if (brackets === 0) {
        break;
      }
    }

    type = text.substring(1, i);
  }

  // If a type was described, bump the pointer over the closing "}"
  i = (i > 0) ? (i + 1) : i;

  // There is either a name, or name + description remaining. Find the
  // next whitespace - that'll be the end of the name, or go to the
  // end of the string
  let endOfName = text.indexOf(' ', i + 1);
  endOfName = endOfName > -1 ? endOfName : text.length;

  name = text.substring(i, endOfName).trim();

  // If there is any string left to go it's all description
  i = i + 1 + name.length;

  if (i < text.length) {
    desc = text.substring(i).trim();

    if (desc.startsWith('-')) {
      desc = desc.replace('-', '').trim();
    }
  }

  return {
    name,
    description: desc,
    type: { name: type, required: false },
    control: false,

    table: {
      category: 'Yields',
      type: { summary: type },
    }
  };
}

/**
 *
 */
function buildDescriptionFromComment(comment?: { shortText?: string, text?: string }) {
  if (!comment) {
    return undefined;
  }

  const description = [];

  if (comment.shortText) {
    description.push(comment.shortText);
  }

  // if (comment.text) {
  //   description.push(comment.text);
  // }

  return description.join('');
}


/**
 * A method that is responsible for putting together a single ArgEntry for the given
 * Property. A Control might also be put configured, if possible.
 */
function buildComponentArgumentEntry(project: Project, property: Property) {
  const argType = toTypeString(property.type || '', project)

  const { name, comment } = property;

  const arg: ArgsEntry = {
    name,
    description:  buildDescriptionFromComment(comment),
    type:         { name: argType, required: false },
    defaultValue: stripEscapedOuterQuotes(property.defaultValue) ?? undefined,
    control:      false,

    table: {
      category:     'Properties',
      type:         { summary: argType },
      defaultValue: { summary: property.defaultValue ?? 'undefined' },
    },
  };

  if (arg.type.name === 'string') {
    arg.control = { type: 'text' };
  }
  else if (arg.type.name === 'number' || arg.type.name === 'boolean') {
    arg.control = { type: arg.type.name };
  }
  else if (property.type?.type === 'reference' && property.type.id) {
    const ref = findChildById(project, property.type.id);

    if (isKindOf(ref, ReflectionKind.Enum)) {
      arg.control      = { type: 'select', labels: {} };
      arg.options      = ref.children?.map(child => (stripEscapedOuterQuotes(child.defaultValue)));
      arg.defaultValue = property.defaultValue ? getValueOfEnumDotReference(ref, property.defaultValue) : 'unknown';
      arg.type.name    = `Enum ${ref.name}`;
    }
  }
  else if (property.type?.type === 'union') {
    arg.control = { type: 'select', labels: {} };
    arg.options = property.type.types
      .map(item => item.type === 'literal' ? item.value?.toString() : undefined)
      .filter(Boolean) as (string | number)[];
  }

  // If a select has been created for an optional property then provide a way to unset it.
  if (typeof arg.control !== 'boolean'
    && arg.control.type === 'select'
    && Array.isArray(arg.options)
    && property.flags.isOptional
  ) {
    arg.options.unshift('None');
    arg.mapping = { 'None': undefined };
  }

  return arg;
}
