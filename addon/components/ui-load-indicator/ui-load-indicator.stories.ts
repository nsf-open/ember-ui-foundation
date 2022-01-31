import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-load-indicator',
  component: 'UiLoadIndicator',
};

const Template = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`<UiLoadIndicator
    @text={{this.text}}
    @animation={{this.animation}}
    @testId={{this.testId}}
  />`,
});

export const Default = Template.bind({});
