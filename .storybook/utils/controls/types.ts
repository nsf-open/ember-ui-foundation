export type ArgsEntry = {
  name: string,
  description?: string,
  defaultValue: string | number | boolean | null | undefined | Record<string, unknown> | unknown[],

  type?: {
    name?: string,
    required?: boolean,
  },

  table?: {
    category?: string,
    type?: { summary?: string },
    defaultValue?: { summary?: string },
    disable?: boolean,
  },

  options?: (string | number)[];

  mapping?: Record<string, unknown>;

  control?: false | {
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
