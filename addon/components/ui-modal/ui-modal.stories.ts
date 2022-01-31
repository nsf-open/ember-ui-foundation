import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-modal',
  component: 'components/ui-modal/component',
};

export const Default = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`<UiModal />`,
});
