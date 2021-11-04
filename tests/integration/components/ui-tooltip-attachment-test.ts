import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, focus, blur } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui-tooltip-attachment', function (hooks) {
  setupRenderingTest(hooks);

  test('it attaches event listeners to its parent element', async function (assert) {
    await render(hbs`
      <button>
        Foo <UiTooltipAttachment @testId="tip">Hello World</UiTooltipAttachment>
      </button>
    `);

    const overlay = find('.tooltip[data-test-id="tip"]') as Element;

    assert.dom('button').hasAttribute('aria-labelledby', overlay.id);
    assert.dom('.tooltip[data-test-id="tip"]').isNotVisible();

    await focus('button');

    assert.dom('.tooltip[data-test-id="tip"]').isVisible();
    assert.dom('.tooltip[data-test-id="tip"]').hasText('Hello World');

    await blur('button');

    assert.dom('.tooltip[data-test-id="tip"]').isNotVisible();
  });
});
