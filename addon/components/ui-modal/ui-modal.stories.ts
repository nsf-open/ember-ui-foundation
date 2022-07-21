import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-modal',
  component: 'components/ui-modal/component',

  parameters: {
    docs: {
      iframeHeight: 310,
    },
  },
};

export const Default = (context: unknown) => ({
  context: Object.assign(
    {
      onModalSubmit() {
        return new Promise((resolve) => setTimeout(resolve, 2500));
      },
    },
    context
  ),

  // language=handlebars
  template: hbs`
    <UiModal @name="standard" @title="Standard Modal" @onSubmit={{this.onModalSubmit}} as |Modal|>
      <UiLorem />

      <div class="text-right">
        <Modal.submitButton />
        <Modal.closeButton />
      </div>
    </UiModal>

    <UiModal @name="wide" @title="Wide Modal" @size="lg" @onSubmit={{this.onModalSubmit}} as |Modal|>
        <UiLorem />

        <div class="text-right">
          <Modal.submitButton />
          <Modal.closeButton />
        </div>
    </UiModal>

    <UiModal @name="narrow" @title="Narrow Modal" @size="sm" @onSubmit={{this.onModalSubmit}} as |Modal|>
        <UiLorem />

        <div class="text-right">
          <Modal.submitButton />
          <Modal.closeButton />
        </div>
    </UiModal>

    <div class="text-center">
        <UiButton @variant="primary" @onClick={{open-modal "standard"}}>Basic Modal</UiButton>
        <UiButton @variant="primary" @onClick={{open-modal "wide"}}>Wide Modal</UiButton>
        <UiButton @variant="primary" @onClick={{open-modal "narrow"}}>Narrow Modal</UiButton>
    </div>
  `,
});

Default.storyName = 'ui-modal';
