import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-menu',
  component: 'components/ui-menu/component',

  args: {
    buttonText: 'Align',
    variant: 'primary',
  },

  argTypes: {
    handleSelection: {
      action: 'click',
      table: {
        disable: true,
      },
    },
  },
};

const Template = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`
    <UiMenu
      @buttonText={{this.buttonText}}
      @disabled={{this.disabled}}
      @testId={{this.testId}}
      @variant={{this.variant}}
      @visible={{this.visible}}
    as |Menu|>
      <Menu.Item @text="Left"   @icon="align-left"   @onClick={{action this.handleSelection "left"}} />
      <Menu.Item @text="Center" @icon="align-center" @onClick={{action this.handleSelection "center"}} />
      <Menu.Item @text="Right"  @icon="align-right"  @onClick={{action this.handleSelection "right"}} />
    </UiMenu>`,
});

export const Default = Template.bind({});
Default.storyName = 'ui-menu';
