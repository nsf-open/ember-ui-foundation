import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-lorem',
  component: 'components/ui-lorem/component',
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <UiLorem @count={{this.count}} @units={{this.units}} />
  `,
});

export const Default = Template.bind({});
