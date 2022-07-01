import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-tabs',
  component: 'components/ui-tabs/component',
  subcomponents: {
    'Tabs.Option': 'components/ui-tabs/option/component',
  },
  parameters: {
    docs: {
      iframeHeight: 150,
    },
  },
  args: {
    selected: 'B',
  },
  argTypes: {
    onChange: { control: false },
    selected: { control: { type: 'text' } },
  },
};

export const Default = (context: Record<string, unknown>) => ({
  context: Object.assign(context, {}),

  // language=handlebars
  template: hbs`
    <UiTabs
      @ariaLabel={{this.ariaLabel}}
      @role={{this.role}}
      @testId={{this.testId}}
      @selected={{this.selected}}
      @fullAriaSupport={{this.fullAriaSupport}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
    as |Tabs|>
      <Tabs.Option @value="A">Tab A</Tabs.Option>
      <Tabs.Option @value="B">Tab B</Tabs.Option>
      <Tabs.Option @value="C">Tab C</Tabs.Option>
      <Tabs.Option @value="D">Tab D</Tabs.Option>
    </UiTabs>

    <div class="panel panel-default" style="border-radius: 0; margin-top: -1px;">
      <div class="panel-body">
        The currently selected value is: {{this.selected}}
      </div>
    </div>
`,
});
