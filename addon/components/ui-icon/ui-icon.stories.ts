import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-icon',
  component: 'components/ui-icon/component',

  parameters: {
    layout: 'centered',
  },

  args: {
    name: 'superpowers',
  },
};

const Template = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`
    <div class="text-center">
        <UiIcon
          @name={{this.name}}
          @fw={{this.fw}}
          @pending={{this.pending}}
          @pulse={{this.pulse}}
          @spin={{this.spin}}
          @size={{this.size}}
          @pendingAnimation={{this.pendingAnimation}}
        />
    </div>
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-icon';
