import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-button',
  component: 'components/ui-button/component',

  parameters: {
    layout: 'centered',
  },

  args: {
    text: 'Hello World',
  },

  argTypes: {
    onClick: {
      control: false,
    },
  },
};

const Template = (context: unknown) => ({
  context,
  // language=hbs
  template: hbs`
    <div class="text-center">
      <UiButton
        @text={{this.text}}
        @variant={{this.variant}}
        @active={{this.active}}
        @ariaControls={{this.ariaControls}}
        @ariaDescribedBy={{this.ariaDescribedBy}}
        @ariaExpanded={{this.ariaExpanded}}
        @ariaHasPopup={{this.ariaHasPopup}}
        @ariaLabel={{this.ariaLabel}}
        @ariaLabelledBy={{this.ariaLabelledBy}}
        @ariaSelected={{this.ariaSelected}}
        @block={{this.block}}
        @disabled={{this.disabled}}
        @icon={{this.icon}}
        @iconPlacement={{this.iconPlacement}}
        @responsive={{this.responsive}}
        @size={{this.size}}
        @tabIndex={{this.tabIndex}}
        @testId={{this.testId}}
        @title={{this.title}}
        @type={{this.type}}
        @onClick={{action this.onClick}}
      />
    </div>
  `,
});

// *********************
// Color Variants
// *********************

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
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

// *********************
// Disabled
// *********************

export const DisabledDefault = Template.bind({});
DisabledDefault.args = {
  disabled: true,
  variant: 'default',
};

export const DisabledPrimary = Template.bind({});
DisabledPrimary.args = {
  disabled: true,
  variant: 'primary',
};

export const DisabledInfo = Template.bind({});
DisabledInfo.args = {
  disabled: true,
  variant: 'info',
};

export const DisabledWarning = Template.bind({});
DisabledWarning.args = {
  disabled: true,
  variant: 'warning',
};

export const DisabledDanger = Template.bind({});
DisabledDanger.args = {
  disabled: true,
  variant: 'danger',
};

// *********************
// Icon
// *********************

export const IconLeft = Template.bind({});
IconLeft.args = {
  icon: 'superpowers',
  iconPlacement: 'left',
};

export const IconRight = Template.bind({});
IconRight.args = {
  icon: 'superpowers',
  iconPlacement: 'right',
};

// *********************
// Pending
// *********************

export const Pending = (context: unknown) => {
  return Template(
    Object.assign({}, context, {
      onClick(...args: unknown[]) {
        // @ts-expect-error - the outer context is not typed
        context.onClick(...args);
        return new Promise((resolve) => setTimeout(resolve, 10000));
      },

      didInsertElement() {
        const element = document.querySelector('button.btn') as HTMLButtonElement;
        element?.click();
      },
    })
  );
};
Pending.args = {
  variant: 'primary',
};
