import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'ui-tabs',
  component: 'UiTabs',
  subcomponents: { 'Tabs.Option': 'UiTabs/Option' },
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
