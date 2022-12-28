import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-popover',
  component: 'components/ui-popover/component',

  parameters: {
    layout: 'centered',
  },

  args: {
    textContent: 'Hello World',
  },
};

const Template = (context: unknown) => {
  return {
    context: Object.assign({}, context),

    // language=handlebars
    template: hbs`
      <div class="text-center">
        <UiButton @variant="primary">
            Log In
            <UiPopover @title="Hello World">
                Username and password go here
            </UiPopover>
        </UiButton>
      </div>
    `,
  };
};

export const Default = Template.bind({});
Default.storyName = 'ui-popover';
