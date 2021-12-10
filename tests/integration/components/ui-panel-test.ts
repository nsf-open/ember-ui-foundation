import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-panel', function (hooks) {
  setupRenderingTest(hooks);

  test('it creates a panel with heading', async function (assert) {
    await render(hbs`<UiPanel @heading="Hello World" @testId="panel">Foo Bar</UiPanel>`);

    assert.dom('[data-test-id="panel"]').isVisible();
    assert.dom('[data-test-id="panel"]').hasTagName('section');
    assert.dom('[data-test-id="panel"]').hasClass('panel');
    assert.dom('[data-test-id="panel"]').hasClass('panel-default');

    assert.dom('[data-test-id="panel"] .panel-heading').isVisible();
    assert.dom('[data-test-id="panel"] .panel-heading').hasTagName('header');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').isVisible();
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h2');
    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasText('Hello World');

    assert.dom('[data-test-id="panel"] .panel-body').isVisible();
    assert.dom('[data-test-id="panel"] .panel-body').hasText('Foo Bar');
  });

  test('it can create a panel without a heading', async function (assert) {
    await render(hbs`<UiPanel @testId="panel">Foo Bar</UiPanel>`);

    assert.dom('[data-test-id="panel"]').isVisible();
    assert.dom('[data-test-id="panel"]').hasTagName('section');
    assert.dom('[data-test-id="panel"]').hasClass('panel');
    assert.dom('[data-test-id="panel"]').hasClass('panel-default');

    assert.dom('[data-test-id="panel"] .panel-heading').doesNotExist();

    assert.dom('[data-test-id="panel"] .panel-body').isVisible();
    assert.dom('[data-test-id="panel"] .panel-body').hasText('Foo Bar');
  });

  test('it can create a panel in different variants', async function (assert) {
    this.set('variant', 'primary');

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @variant={{this.variant}} @testId="panel">Foo Bar</UiPanel>`
    );

    assert.dom('[data-test-id="panel"].panel-primary').isVisible();

    this.set('variant', 'secondary');

    assert.dom('[data-test-id="panel"].panel-secondary').isVisible();

    this.set('variant', 'success');

    assert.dom('[data-test-id="panel"].panel-success').isVisible();
  });

  test('is can create a panel heading with different heading level (H1, H2, etc)', async function (assert) {
    this.set('level', 'h1');

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @level={{this.level}} @testId="panel">Foo Bar</UiPanel>`
    );

    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h1');

    this.set('level', 'h3');

    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h3');

    this.set('level', 'h4');

    assert.dom('[data-test-id="panel"] .panel-heading .panel-title').hasTagName('h4');
  });

  test('it can yield provided content back without being wrapped in a panel', async function (assert) {
    this.set('renderPanel', true);

    // language=handlebars
    await render(
      hbs`<UiPanel @heading="Hello World" @renderPanel={{this.renderPanel}}>Foo Bar</UiPanel>`
    );

    assert.dom('.panel .panel-heading').isVisible();
    assert.dom('.panel .panel-body').isVisible();
    assert.dom('.panel .panel-body').hasText('Foo Bar');

    this.set('renderPanel', false);

    assert.dom('.panel .panel-heading').doesNotExist();
    assert.dom('.panel .panel-body').doesNotExist();
    assert.dom().hasText('Foo Bar');
  });
});
