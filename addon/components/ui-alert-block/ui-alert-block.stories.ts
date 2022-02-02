import { hbs } from 'ember-cli-htmlbars';

// @ts-expect-error - requirejs exists at runtime
const MessageManager = requirejs('@nsf/ui-foundation/lib/MessageManager').default;

export default {
  title: 'Elements/ui-alert-block',
  component: 'components/ui-alert-block/component',

  parameters: {
    docs: {
      iframeHeight: 310,
    },
  },
};

const Template = (context: unknown) => ({
  context: Object.assign(
    {
      manager: null,
      errors: null,
      warnings: null,
      successes: null,
      informationals: null,

      init() {
        // @ts-expect-error - Good 'ol CoreObject super call.
        this._super();

        const manager = new MessageManager();

        manager.addErrorMessages(this.errors);
        manager.addWarningMessages(this.warnings);
        manager.addSuccessMessages(this.successes);
        manager.addInfoMessages(this.informationals);

        this.manager = manager;
      },
    },
    context
  ),

  // language=handlebars
  template: hbs`
    <UiAlertBlock @manager={{this.manager}} @testId={{this.testId}} />
  `,
});

export const Default = Template.bind({});
Default.args = {
  successes: ['Success Message A'],
  errors: ['Error Message A'],
  warnings: ['Warning Message A'],
  informationals: ['Info Message A'],
};
