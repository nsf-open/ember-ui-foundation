import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'ui-progress-bar',
  component: 'UiProgressBar',
};

export const Default = (context: unknown) => ({
  context,

  // language=handlebars
  template: hbs`<UiProgressBar @steps={{array (hash label="Step 1")}} />`,
});
