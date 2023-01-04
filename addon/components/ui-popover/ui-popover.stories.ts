import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Elements/ui-popover',
  component: 'components/ui-popover/component',

  parameters: {
    docs: {
      iframeHeight: 300,
    },
  },

  args: {
    title: 'Please Login to Your Account to Continue',
  },
};

const Template = (context: unknown) => {
  return {
    context: Object.assign({}, context),

    // language=handlebars
    template: hbs`
      <div class="text-center">
        <a href="#">Other focus target A</a>

        <UiButton @variant="primary">
            Log In
            <UiPopover
              @title={{this.title}}
              @autoPlacement={{this.autoPlacement}}
              @delay={{this.delay}}
              @distance={{this.distance}}
              @enabled={{this.enabled}}
              @fade={{this.fade}}
              @maxWidth={{this.maxWidth}}
              @overlayId={{this.overlayId}}
              @placement={{this.placement}}
              @renderInPlace={{this.renderInPlace}}
              @testId={{this.testId}}
            >
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" class="form-control" />
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" />
              </div>

              <div class="text-right">
                <button type="button" class="btn btn-primary">Login</button>
              </div>
            </UiPopover>
        </UiButton>

        <a href="#">Other focus target B</a>
      </div>
    `,
  };
};

export const Default = Template.bind({});
Default.storyName = 'ui-popover';
