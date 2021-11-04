import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui-tooltip', function (hooks) {
  setupRenderingTest(hooks);

  test('it is shown on mouseenter, and hidden on mouseleave', async function (assert) {
    await render(hbs`
      <div style="margin-top: 50px; text-align: center;">
        <UiTooltip @testId="tip">Hello World</UiTooltip>
      </div>
    `);

    const trigger = find('[data-test-id="tip"]:not(.tooltip)') as Element;
    const overlay = find('.tooltip[data-test-id="tip"]') as Element;

    assert.dom(trigger).isVisible();
    assert.dom(trigger).hasClass('fa-question-circle');
    assert.dom(trigger).hasAttribute('aria-labelledby', overlay.id);
    assert.dom(overlay).isNotVisible();

    await triggerEvent(trigger, 'mouseenter');

    assert.dom(overlay).isVisible();
    assert.dom(overlay).hasText('Hello World');

    await triggerEvent(trigger, 'mouseleave');

    assert.dom(overlay).isNotVisible();
  });

  test('it accepts onShow, onShown, onHide, and onHidden actions', async function (assert) {
    this.set('actionCallback', function (name: string) {
      assert.step(name);
    });

    // language=handlebars
    await render(hbs`
      <UiTooltip
        @testId="tip"
        @onShow={{action this.actionCallback "onShow"}}
        @onShown={{action this.actionCallback "onShown"}}
        @onHide={{action this.actionCallback "onHide"}}
        @onHidden={{action this.actionCallback "onHidden"}}
      >
        Hello World
      </UiTooltip>
    `);

    await triggerEvent('[data-test-id="tip"]', 'mouseenter');
    await triggerEvent('[data-test-id="tip"]', 'mouseleave');

    assert.verifySteps(['onShow', 'onShown', 'onHide', 'onHidden']);
  });

  test('it allows its maximum width to be customized', async function (assert) {
    this.set('maxWidth', undefined);

    // language=handlebars
    await render(hbs`
      <UiTooltip @testId="tip" @maxWidth={{this.maxWidth}}>
        Hello World
      </UiTooltip>
    `);

    assert.dom('.tooltip[data-test-id="tip"] .tooltip-inner').doesNotHaveAttribute('style');

    this.set('maxWidth', 100);

    assert
      .dom('.tooltip[data-test-id="tip"] .tooltip-inner')
      .hasAttribute('style', 'max-width: 100px;');

    this.set('maxWidth', '150');

    assert
      .dom('.tooltip[data-test-id="tip"] .tooltip-inner')
      .hasAttribute('style', 'max-width: 150px;');

    this.set('maxWidth', '200px');

    assert
      .dom('.tooltip[data-test-id="tip"] .tooltip-inner')
      .hasAttribute('style', 'max-width: 200px;');
  });
});
