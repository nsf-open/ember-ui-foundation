import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-panel',
  component: 'components/ui-panel/component',

  parameters: {
    docs: {
      iframeHeight: 200,
    },
  },

  args: {
    heading: 'Panel Heading',
  },

  argTypes: {
    headerButtons: { control: { type: 'array' } },
  },
};

function makePromise(doResolve = true, time = 5000) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      doResolve ? resolve(undefined) : reject();
    }, time);
  });
}

const Template = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`
    <UiPanel
      @heading="{{this.heading}}"
      @variant="{{this.variant}}"
      @headingLevel="{{this.headingLevel}}"
      @testId="{{this.testId}}"
      @renderPanel={{this.renderPanel}}
      @promise={{this.promise}}
      @name={{this.name}}
      @collapsed={{this.collapsed}}
      @startCollapsed={{this.startCollapsed}}
      @onShow={{this.onShow}}
      @onHidden={{this.onHidden}}
      @headerButtons={{this.headerButtons}}
    >
        <UiLorem />
    </UiPanel>`,
});

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Info = Template.bind({});
Info.args = {
  variant: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  variant: 'warning',
};

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
};

export const NoHeading = Template.bind({});
NoHeading.args = {
  heading: undefined,
};

export const PendingAsyncBlock = Template.bind({});
PendingAsyncBlock.args = {
  get promise() {
    return makePromise(true, 200000);
  },
};

export const RejectedAsyncBlock = Template.bind({});
RejectedAsyncBlock.args = {
  variant: 'default',

  get promise() {
    return makePromise(false, 2000);
  },
};

export const Collapsible = Template.bind({});
Collapsible.args = {
  collapsed: false,
};

export const LoadOnOpen = Template.bind({});
LoadOnOpen.args = {
  startCollapsed: true,
  onShow() {
    return makePromise(true, 5000);
  },
};

export const FailOnOpen = Template.bind({});
FailOnOpen.args = {
  startCollapsed: true,
  onShow() {
    return makePromise(false, 5000);
  },
};
