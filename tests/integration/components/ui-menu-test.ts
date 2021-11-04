import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, triggerKeyEvent, focus } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui-menu', function (hooks) {
  setupRenderingTest(hooks);

  test('it opens and closes a flyout menu', async function (assert) {
    // language=handlebars
    await render(hbs`
      {{#ui-menu "Align" testId="menu" as |Menu|}}
        {{Menu.Item "Left"}}
        {{Menu.Item "Right"}}
        {{Menu.Item "Center"}}
      {{/ui-menu}}
    `);

    const trigger = find('button[data-test-id="menu"]') as HTMLElement;
    const overlay = find('div[data-test-id="menu"]') as HTMLElement;

    assert.dom(trigger).isVisible();
    assert.dom(trigger).hasText('Align');
    assert.dom(trigger).hasAttribute('aria-haspopup', 'true');
    assert.dom(trigger).hasAttribute('aria-expanded', 'false');
    assert.dom(trigger).hasAttribute('aria-controls', overlay.id);
    assert.dom(overlay).isNotVisible();

    await click(trigger);

    assert.dom(trigger).hasAttribute('aria-expanded', 'true');
    assert.dom(overlay).isVisible();
    assert.dom('button:nth-child(1)', overlay).isFocused();

    await click(trigger);

    assert.dom(trigger).hasAttribute('aria-expanded', 'false');
    assert.dom(overlay).isNotVisible();
  });

  test('it can be navigated by keyboard', async function (assert) {
    this.set('handleClick', function (name: string) {
      assert.step(name);
    });

    // language=handlebars
    await render(hbs`
      {{#ui-menu "Align" testId="menu" as |Menu|}}
        {{Menu.Item "Left" onClick=(action this.handleClick "left")}}
        {{Menu.Item "Right" disabled=true}}
        {{Menu.Item "Center" onClick=(action this.handleClick "right")}}
      {{/ui-menu}}
    `);

    const trigger = find('button[data-test-id="menu"]') as HTMLElement;
    const overlay = find('div[data-test-id="menu"]') as HTMLElement;

    assert.dom(overlay).isNotVisible();

    await focus(trigger);

    // Should open an focus on first option
    await triggerKeyEvent(trigger, 'keydown', 'ArrowDown');
    assert.dom(overlay).isVisible();
    assert.dom('button:nth-child(1)', overlay).isFocused();

    // Second option is disabled, should move to third
    await triggerKeyEvent(overlay, 'keydown', 'ArrowDown');
    assert.dom('button:nth-child(3)', overlay).isFocused();

    // Should loop back to first option
    await triggerKeyEvent(overlay, 'keydown', 'ArrowDown');
    assert.dom('button:nth-child(1)', overlay).isFocused();

    // Should loop back to third option
    await triggerKeyEvent(overlay, 'keydown', 'ArrowUp');
    assert.dom('button:nth-child(3)', overlay).isFocused();

    // Second option is disabled, should move to first
    await triggerKeyEvent(overlay, 'keydown', 'ArrowUp');
    assert.dom('button:nth-child(1)', overlay).isFocused();

    // Should close and return focus to trigger
    await triggerKeyEvent(overlay, 'keydown', 'Escape');
    assert.dom(overlay).isNotVisible();
    assert.dom(trigger).isFocused();

    // Should close after clicking an option
    await triggerKeyEvent(trigger, 'keydown', 'ArrowDown');
    assert.dom('button:nth-child(1)', overlay).isFocused();

    await click(overlay.querySelector('button:nth-child(1)') || '');
    assert.dom(overlay).isNotVisible();
    assert.dom(trigger).isFocused();

    // Should close when focus in on the trigger and the up arrow is typed
    await click(trigger);
    assert.dom(overlay).isVisible();

    await focus(trigger);
    await triggerKeyEvent(trigger, 'keydown', 'ArrowUp');
    assert.dom(overlay).isNotVisible();

    // Should close when focus is on the trigger and the escape key is typed
    await click(trigger);
    assert.dom(overlay).isVisible();

    await focus(trigger);
    await triggerKeyEvent(trigger, 'keydown', 'Escape');
    assert.dom(overlay).isNotVisible();

    assert.verifySteps(['left']);
  });
});
