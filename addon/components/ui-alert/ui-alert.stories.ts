import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-alert',
  component: 'components/ui-alert/component',
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`<UiAlert
    @variant={{this.variant}}
    @content={{this.content}}
    @testId={{this.testId}}
  />`,
});

export const SingleSuccess = Template.bind({});
SingleSuccess.args = {
  variant: 'success',
  content: 'Hello World',
};
SingleSuccess.parameters = {
  docs: {
    iframeHeight: 110,
  },
};

export const SingleInfo = Template.bind({});
SingleInfo.args = {
  variant: 'info',
  content: 'Hello World',
};
SingleInfo.parameters = {
  docs: {
    iframeHeight: 110,
  },
};

export const SingleWarning = Template.bind({});
SingleWarning.args = {
  variant: 'warning',
  content: 'Hello World',
};
SingleWarning.parameters = {
  docs: {
    iframeHeight: 110,
  },
};

export const SingleDanger = Template.bind({});
SingleDanger.args = {
  variant: 'danger',
  content: 'Hello World',
};
SingleDanger.parameters = {
  docs: {
    iframeHeight: 110,
  },
};

export const MultipleSuccess = Template.bind({});
MultipleSuccess.args = {
  variant: 'success',
  content: ['Success Message A', 'Success Message B', 'Success Message C'],
};
MultipleSuccess.parameters = {
  docs: {
    iframeHeight: 160,
  },
};

export const MultipleInfo = Template.bind({});
MultipleInfo.args = {
  variant: 'info',
  content: ['Information Message A', 'Information Message B', 'Information Message C'],
};
MultipleInfo.parameters = {
  docs: {
    iframeHeight: 160,
  },
};

export const MultipleWarning = Template.bind({});
MultipleWarning.args = {
  variant: 'warning',
  content: ['Warning Message A', 'Warning Message B', 'Warning Message C'],
};
MultipleWarning.parameters = {
  docs: {
    iframeHeight: 160,
  },
};

export const MultipleDanger = Template.bind({});
MultipleDanger.args = {
  variant: 'danger',
  content: ['Danger Message A', 'Danger Message B', 'Danger Message C'],
};
MultipleDanger.parameters = {
  docs: {
    iframeHeight: 160,
  },
};
