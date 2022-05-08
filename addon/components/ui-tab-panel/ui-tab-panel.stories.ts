import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-tab-panel',
  component: 'components/ui-tab-panel/component',
  subcomponents: {
    'Panel.TabList': 'components/ui-tab-panel/tab-list/component',
    'Panel.TabPanel': 'components/ui-tab-panel/tab-panel/component',
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

export const Default = (context: unknown) => ({
  context: Object.assign(context, {}),

  // language=handlebars
  template: hbs`
    <UiTabPanel
      class="panel panel-default"
      @selected={{this.selected}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
    as |Panel|>
      <Panel.TabList style="margin: -1px -1px 0;" as |Tabs|>
        <Tabs.Option @value="A" @text="Tab A" />
        <Tabs.Option @value="B" @text="Tab B" />
        <Tabs.Option @value="C" @text="Tab C" />
        <Tabs.Option @value="D" @text="Tab D" />
      </Panel.TabList>

      <Panel.TabPanel class="panel-body" as |value|>
        "{{value}}" is currently selected
      </Panel.TabPanel>
    </UiTabPanel>
`,
});

export const Links = (context: unknown) => ({
  context: Object.assign(context, {}),

  // language=handlebars
  template: hbs`
    <UiTabPanel
      class="panel panel-default"
      @role="navigation"
    as |Panel|>
      <Panel.TabList style="margin: -1px -1px 0;" as |Tabs|>
        <Tabs.Option>
            <a href="https://www.google.com">Google</a>
        </Tabs.Option>
        <Tabs.Option>
            <a href="https://www.yahoo.com">Yahoo</a>
        </Tabs.Option>
        <Tabs.Option>
            <a href="https://www.bing.com">Bing</a>
        </Tabs.Option>
      </Panel.TabList>

      <Panel.TabPanel class="panel-body">
        {{outlet}}
      </Panel.TabPanel>
    </UiTabPanel>
`,
});
