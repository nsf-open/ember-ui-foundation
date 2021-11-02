// Types for compiled templates
declare module '@nsf/ui-foundation/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '*/template' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const template: TemplateFactory;
  export default template;
}

declare module 'app/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const template: TemplateFactory;
  export default template;
}

declare module 'addon/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const template: TemplateFactory;
  export default template;
}
