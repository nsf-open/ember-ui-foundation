import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui-popover', function (hooks) {
  setupRenderingTest(hooks);

  test('it attaches event listeners to its parent element', async function (assert) {
    await render(hbs`
      <button>
        Foo <UiPopover @testId="tip">Hello World</UiPopover>
      </button>
    `);

    const overlay = find('.popover[data-test-id="tip"]') as Element;

    assert
      .dom('button')
      .hasAttribute('aria-controls', overlay.id)
      .hasAttribute('aria-expanded', 'false');
    assert.dom('.popover[data-test-id="tip"]').isNotVisible();

    await click('button');

    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('.popover[data-test-id="tip"]').isVisible().hasText('Hello World');

    await click('button');

    assert.dom('.popover[data-test-id="tip"]').isNotVisible();
  });

  test('it is not closed by outside interactions', async function (assert) {
    await render(hbs`
      <button id="toggle">
        Foo <UiPopover @testId="tip">Hello World</UiPopover>
      </button>

      <button id="other-button">Click Me</button>
    `);

    assert.dom('.popover[data-test-id="tip"]').isNotVisible();

    await click('#toggle');

    assert.dom('.popover[data-test-id="tip"]').isVisible();

    await click('#other-button');

    assert.dom('.popover[data-test-id="tip"]').isVisible();
  });

  test('it accepts a heading', async function (assert) {
    await render(hbs`
      <button>
        Foo <UiPopover @testId="tip" @title="Popover Title">Hello World</UiPopover>
      </button>
    `);

    assert.dom('.popover[data-test-id="tip"]').hasTagName('section');
    assert
      .dom('.popover[data-test-id="tip"] .popover-title')
      .hasTagName('header')
      .hasText('Popover Title');
  });
});
