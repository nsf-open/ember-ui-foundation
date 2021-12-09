import { hbs } from 'ember-cli-htmlbars';

export default {
  title: '<%= dasherizedModuleName %>',
  component: '<%= classifiedModuleName %>',
};

export const Default = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`<<%= classifiedModuleName %> />`,
});
