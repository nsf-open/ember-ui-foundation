import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, triggerKeyEvent, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-tabs', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders multiple tabs', async function (assert: Assert) {
    await render(hbs`
      <UiTabs data-test-tabs as |tabs|>
        <tabs.Option>Tab A</tabs.Option>
        <tabs.Option @text="Tab B" />
      </UiTabs>
    `);

    function testTab(element: Element | undefined, text: string) {
      assert.dom(element).isVisible();
      assert.dom(element).hasAttribute('data-test-id', 'tabs-option');
      assert.dom(element).hasAttribute('role', 'presentation');

      assert.dom('a', element).hasClass('btn-tab');
      assert.dom('a', element).hasAttribute('href', '#');
      assert.dom('a', element).hasAttribute('role', 'tab');
      assert.dom('a', element).hasText(text);
    }

    const el = find('[data-test-tabs]') ?? undefined;

    assert.dom(el).hasClass('nav');
    assert.dom(el).hasClass('nav-tabs');
    assert.dom(el).hasAttribute('role', 'tablist');

    testTab(el?.querySelector('li:nth-child(1)') ?? undefined, 'Tab A');
    testTab(el?.querySelector('li:nth-child(2)') ?? undefined, 'Tab B');
  });

  test('it transitions active state between tabs', async function (assert: Assert) {
    // Using only clicks
    this.set('handleTabChange', function (newTabValue: string) {
      assert.step(newTabValue);
    });

    // language=Handlebars
    await render(hbs`
      <UiTabs data-test-tabs @onChange={{action this.handleTabChange}} as |tabs|>
        <tabs.Option @value="A">Tab A</tabs.Option>
        <tabs.Option @value="B" @text="Tab B" />
      </UiTabs>
    `);

    assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
    assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

    // Change selected value to "B" by clicking on it
    await click('li:nth-child(2) a');

    assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
    assert.dom('li:nth-child(2) a').hasClass('active');

    // Change selected value to "A" by clicking on it
    await click('li:nth-child(1) a');

    assert.dom('li:nth-child(1) a').hasClass('active');
    assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

    assert.verifySteps(['B', 'A']);

    // Using both clicks and set()
    this.set('selected', 'A');

    // language=Handlebars
    await render(hbs`
      <UiTabs data-test-tabs @selected={{this.selected}} @onChange={{action this.handleTabChange}} as |tabs|>
        <tabs.Option @value="A">Tab A</tabs.Option>
        <tabs.Option @value="B" @text="Tab B" />
      </UiTabs>
    `);

    assert.dom('li:nth-child(1) a').hasClass('active');
    assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

    // Change selected value to "B" by clicking on it
    await click('li:nth-child(2) a');

    // Ensure that multiple clicks on the same tab don't result in multiple onChange calls
    await click('li:nth-child(2) a');

    assert.dom('li:nth-child(1) a').doesNotHaveClass('active');
    assert.dom('li:nth-child(2) a').hasClass('active');

    // Change selected value back to "A"
    this.set('selected', 'A');

    assert.dom('li:nth-child(1) a').hasClass('active');
    assert.dom('li:nth-child(2) a').doesNotHaveClass('active');

    // Ensure that multiple sets of the same value don't result in multiple onChange calls
    this.set('selected', 'A');

    assert.verifySteps(['B', 'A']);
  });

  test('the active tab can be changed via keyboard', async function (assert) {
    // language=Handlebars
    await render(hbs`
      <UiTabs data-test-tabs @selected="A" as |tabs|>
        <tabs.Option @value="A">Tab A</tabs.Option>
        <tabs.Option @value="B">Tab B</tabs.Option>
        <tabs.Option @value="C">Tab C</tabs.Option>
      </UiTabs>
    `);

    assert.dom('li:nth-child(1) a').hasClass('active');

    await focus('li:nth-child(1) a');
    await triggerKeyEvent('[data-test-tabs]', 'keyup', 'ArrowRight');

    assert.dom('li:nth-child(2) a').isFocused();

    await triggerKeyEvent('[data-test-tabs]', 'keyup', 'ArrowRight');

    assert.dom('li:nth-child(3) a').isFocused();

    await click('li:nth-child(3) a');

    assert.dom('li:nth-child(3) a').hasClass('active');
  });
});
