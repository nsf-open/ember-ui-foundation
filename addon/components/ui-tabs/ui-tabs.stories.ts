import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-tabs',
  component: 'components/ui-tabs/component',
  subcomponents: {
    'Tabs.Option': 'components/ui-tabs/option/component',
  },
};

export const Default = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <UiTabs
      @ariaLabel={{this.ariaLabel}}
      @ariaRole={{this.ariaRole}}
      @headingLevel={{this.headingLevel}}
      @testId={{this.testId}}
      @onChange={{action this.onChange}}
    as |Tabs|>
      <Tabs.Option @value="A">Hello</Tabs.Option>
      <Tabs.Option @value="B">World</Tabs.Option>
    </UiTabs>
`,
});
