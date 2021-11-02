import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('@mynsf-ui/elements | ui-load-indicator', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a spinner', async function (assert: Assert) {
    await render(hbs`<UiLoadIndicator />`);

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"] p:nth-child(1)').hasClass('text-center');
    assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa');
    assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-spinner');
    assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-4x');
    assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasClass('text-center');
    assert.dom('[data-test-id="load-indicator"] p:nth-child(2)').hasText('Loading...');
  });

  test('it shows custom loading text', async function (assert) {
    await render(hbs`<UiLoadIndicator @text="Heavy lifting in progress" />`);

    assert
      .dom('[data-test-id="load-indicator"] p:nth-child(2)')
      .hasText('Heavy lifting in progress');
  });

  test('it shows multiple animation styles', async function (assert) {
    this.set('animation', 'spin');

    // language=handlebars
    await render(hbs`<UiLoadIndicator @animation={{this.animation}} />`);

    assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-spin');

    this.set('animation', 'pulse');

    assert.dom('[data-test-id="load-indicator"] p:nth-child(1) span').hasClass('fa-pulse');
  });
});
