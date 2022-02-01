import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/<%= dasherizedModuleName %>',
  component: 'components/<%= dasherizedModuleName %>/component',
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <<%= classifiedModuleName %> />
  `,
});

export const Default = Template.bind({});
