import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'ui-tabs',
  component: 'UiTabs',
};

export const Default = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <UiTabs as |Tabs|>
      <Tabs.Option @value="A">Hello</Tabs.Option>
      <Tabs.Option @value="B">World</Tabs.Option>
    </UiTabs>
`,
});

// import { Meta, ArgsTable, Story, Source, Description } from '@storybook/addon-docs/blocks';
// import { createTemplateBuilder } from '../-utils';
// import { action } from '@storybook/addon-actions';
// import { select } from '@storybook/addon-knobs';
//
//
// export const UiTabPanelTemplate = createTemplateBuilder(`
// 	{{#ui-tab-panel as |panel|}}
// 		{{#panel.tabs selected=this.defaultSelection onChange=(action this.handleTabChange) as |tabs|}}
// 			{{tabs.option "Tab A"}}
// 			{{tabs.option "Tab B"}}
// 			{{tabs.option "Tab C"}}
// 		{{/panel.tabs}}
// 		{{#panel.body as |selectedValue|}}
// 			{{selectedValue}} is currently selected.
// 		{{/panel.body}}
// 	{{/ui-tab-panel}}
// `);
//
//
// <Meta title="Elements/Tabs" />
//
// # Tabs
// Use tabs to create a styled menu bar for selectively displaying blocks of content, or for navigation.
//
// - [Usage (Tab Panels)](#usage)
//     - [Panel Header](#panel-header)
//         - [Option Tab](#option-tab-type)
//         - [Link Tab](#link-tab-type)
//     - [Panel Body](#panel-body)
// - [Examples](#examples)
//
// <hr />
//
// <Story name="Default" height="110px">{UiTabPanelTemplate({
// 	handleTabChange:  action('onChange'),
// 	defaultSelection: select('Selected Tab', ["Tab A", "Tab B", "Tab C"], "Tab B"),
// })}</Story>
//
// <Source code={UiTabPanelTemplate({}, true)} language="handlebars" />
//
//
// ## Usage
// The example above is using the `{{ui-tab-panel}}` component, the most commonly used implementation.
// <Description of="UiTabPanel" />
//
// ### Panel Header
// <Description of="UiTabPanelHeader" />
// <ArgsTable of="UiTabPanelHeader" />
//
// #### Option Tab Type
// <Description of="UiTabsTab" />
// <ArgsTable of="UiTabsTab" />
//
// #### Link Tab Type
// <Description of="UiTabsLink" />
// <ArgsTable of="UiTabsLink" />
//
// ### Panel Body
// <Description of="UiTabPanelBody" />
//
// ## Examples
// __Options__
// <Source code={UiTabPanelTemplate({}, true)} language="handlebars" />
//
// __Links__
// ```handlebars
// {{#ui-tab-panel as |panel|}}
//   {{#panel.tabs as |tabs|}}
//     {{tabs.link "User Info" "user.index" this.user}}
//     {{tabs.link "Class Schedule" "user.schedule" this.user}}
//   {{/panel.tabs}}
//   {{#panel.body}}
//     {{outlet}}
//   {{/panel.body}}
// {{/ui-tab-panel}}
// ```
