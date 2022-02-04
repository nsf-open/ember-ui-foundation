import { hbs } from 'ember-cli-htmlbars';
import { set } from '@ember/object';

export default {
  title: 'Elements/ui-collapse',
  component: 'components/ui-collapse/component',
};

const Template = (context: unknown) => ({
  context: Object.assign({}, context, {
    toggleState() {
      // @ts-expect-error - being added by the outer context
      set(this, 'collapsed', !this.collapsed);
    },
  }),

  // language=handlebars
  template: hbs`
    <UiButton
      @text={{if this.collapsed "Expand" "Collapse"}}
      @variant="default"
      @onClick={{action this.toggleState}}
    />

    <hr />

    <UiCollapse
      @onShow={{action this.onShow}}
      @onShown={{action this.onShown}}
      @onHide={{action this.onHide}}
      @onHidden={{action this.onHidden}}
      @collapsed={{this.collapsed}}
      @collapseDimension={{this.collapseDimension}}
      @collapsedSize={{this.collapsedSize}}
      @expandedSize={{this.expandedSize}}
      @resetSizeBetweenTransitions={{this.resetSizeBetweenTransitions}}
    >
      <div style="background-color: #aaa; padding: 15px;">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium luctus eros,
            in semper arcu aliquet ut. Pellentesque eleifend diam et luctus placerat. Morbi varius
            nec orci eu aliquet. In non pellentesque diam. Fusce dictum placerat enim. Aenean
            vestibulum urna ut ante ullamcorper dapibus quis porta ante. Maecenas accumsan neque
            nec scelerisque tristique. Curabitur cursus lectus tellus, sit amet ultrices libero
            scelerisque eget. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Aenean sed bibendum libero. Aliquam in consequat augue, id volutpat
            dui. Maecenas efficitur ultrices vulputate. Praesent quis turpis eu mauris consequat
            laoreet.</p>
      </div>
    </UiCollapse>
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-collapse';
Default.parameters = {
  docs: {
    iframeHeight: 280,
  },
};
