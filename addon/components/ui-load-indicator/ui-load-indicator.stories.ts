import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-load-indicator',
  component: 'components/ui-load-indicator/component',
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
