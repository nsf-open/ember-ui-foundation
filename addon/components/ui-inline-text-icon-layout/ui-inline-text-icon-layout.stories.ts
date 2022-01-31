import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-inline-text-icon-layout',
  component: 'components/ui-inline-text-icon-layout/component',

  parameters: {
    layout: 'centered',
  },

  args: {
    text: 'Hello World',
    icon: 'superpowers',
    tooltip: null,
  },
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <div class="text-center">
      <UiInlineTextIconLayout
        @text={{this.text}}
        @icon={{this.icon}}
        @tooltip={{this.tooltip}}
        @fw={{this.fw}}
        @iconPlacement={{this.iconPlacement}}
        @pending={{this.pending}}
        @responsive={{this.responsive}}
        @spin={{this.spin}}
      />
    </div>
  `,
});

export const Default = Template.bind({});
