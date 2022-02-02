import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-heading',
  component: 'components/ui-heading/component',

  args: {
    text: 'Hello World',
  },

  parameters: {
    docs: {
      iframeHeight: 120,
    },
  },
};

const Template = (context: unknown) => ({
  context,
  // language=handlebars
  template: hbs`
    <UiHeading @text={{this.text}} @level={{this.level}} @class={{this.class}} />
  `,
});

export const H1 = Template.bind({});
H1.args = {
  level: 'h1',
};

export const H2 = Template.bind({});
H2.args = {
  level: 'h2',
};

export const H3 = Template.bind({});
H3.args = {
  level: 'h3',
};

export const H4 = Template.bind({});
H4.args = {
  level: 'h4',
};

export const H5 = Template.bind({});
H5.args = {
  level: 'h5',
};

export const H6 = Template.bind({});
H6.args = {
  level: 'h6',
};
