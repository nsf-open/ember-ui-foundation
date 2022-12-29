import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, focus, triggerKeyEvent } from '@ember/test-helpers';
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

  test('it manages focus as though it were inline with its trigger', async function (assert) {
    // language=handlebars
    await render(hbs`
      <a href="#">Other focus target A</a>

      <UiButton @variant="primary" id="trigger">
        Log In
        <UiPopover @title="Please Login to Your Account to Continue" @renderInPlace={{this.renderInPlace}}>
          <label for="username">Username</label>
          <input type="text" id="username" />

          <label for="password">Password</label>
          <input type="password" id="password" />

          <button type="button" id="submitLogin">Login</button>
        </UiPopover>
      </UiButton>

      <a href="#" id="alternateFocusB">Other focus target B</a>
    `);

    // See https://github.com/emberjs/ember-test-helpers/issues/738
    // Some keyboard interaction are particularly difficult to fake with Javascript,
    // and tabbing through focusable elements is one of them. For this, we only
    // _really_ want to make sure that focus gets wrapped between first <-> last
    // elements in the modal. Going out on a limb here that the browser is capable
    // of handing everything in-between.

    assert.dom('.popover').isNotVisible();

    await click('#trigger');

    assert.dom('.popover').isVisible();
    assert.dom('#trigger').isFocused();

    await triggerKeyEvent('#trigger', 'keydown', 'Tab');

    assert.dom('.popover #username').isFocused();

    await focus('.popover #submitLogin');
    await triggerKeyEvent('.popover', 'keydown', 'Tab');

    assert.dom('#alternateFocusB').isFocused();

    await triggerKeyEvent('#alternateFocusB', 'keydown', 'Tab', { shiftKey: true });

    assert.dom('.popover #submitLogin').isFocused();

    await focus('.popover #username');
    await triggerKeyEvent('.popover', 'keydown', 'Tab', { shiftKey: true });

    assert.dom('#trigger').isFocused();
  });
});
