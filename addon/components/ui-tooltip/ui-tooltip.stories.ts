import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-tooltip',
  component: 'components/ui-tooltip/component',

  args: {
    textContent: 'Hello World',
  },
};

const Template = (context: unknown) => {
  return {
    context: Object.assign({}, context),

    // language=handlebars
    template: hbs`
      <UiTooltip
        @ariaAttachAs={{this.ariaAttachAs}}
        @ariaHidden={{this.ariaHidden}}
        @ariaLabel={{this.ariaLabel}}
        @ariaSelector={{this.ariaSelector}}
        @autoPlacement={{this.autoPlacement}}
        @delay={{this.delay}}
        @delayHide={{this.delayHide}}
        @delayShow={{this.delayShow}}
        @distance={{this.distance}}
        @enabled={{this.enabled}}
        @fade={{this.fade}}
        @icon={{this.icon}}
        @maxWidth={{this.maxWidth}}
        @overlayId={{this.overlayId}}
        @placement={{this.placement}}
        @renderInPlace={{this.renderInPlace}}
        @testId={{this.testId}}
        @viewportPadding={{this.viewportPadding}}
        @viewportSelector={{this.viewportSelector}}
        @visible={{this.visible}}
      >{{this.textContent}}</UiTooltip>`,
  };
};

export const Default = Template.bind({});
Default.storyName = 'ui-tooltip';
