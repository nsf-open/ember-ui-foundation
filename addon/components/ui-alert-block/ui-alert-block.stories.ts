import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-alert-block',
  component: 'components/ui-alert-block/component',
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <UiAlertBlock />
  `,
});

export const Default = Template.bind({});
