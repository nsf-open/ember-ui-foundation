import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-inline-text-icon-layout', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders text', async function (assert) {
    this.set('text', 'Hello World');

    await render(hbs`<UiInlineTextIconLayout @text="{{this.text}}" />`);

    assert.dom().hasText('Hello World');
    assert.dom('span').doesNotExist();

    this.set('text', 'foobar');

    assert.dom().hasText('foobar');
  });

  test('it renders an icon followed by text', async function (assert) {
    this.set('icon', 'superpowers');

    // Inline
    await render(hbs`<UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" />`);

    assert.dom('span:nth-child(1)').hasClass('fa');
    assert.dom('span:nth-child(1)').hasClass('fa-superpowers');
    assert.dom('span:nth-child(2)').hasText('Hello World');
    assert.dom('span:nth-child(2)').hasClass('ml-5px');

    this.set('icon', 'mail');

    assert.dom('span:nth-child(1)').hasClass('fa-mail');
  });

  test('it renders text followed by an icon', async function (assert) {
    this.set('icon', 'superpowers');

    await render(
      hbs`<UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" @iconPlacement="right" />`
    );

    assert.dom('span:nth-child(1)').hasText('Hello World');
    assert.dom('span:nth-child(1)').hasClass('mr-5px');
    assert.dom('span:nth-child(2)').hasClass('fa');
    assert.dom('span:nth-child(2)').hasClass('fa-superpowers');

    this.set('icon', 'mail');

    assert.dom('span:nth-child(2)').hasClass('fa-mail');
  });

  test('it will not render an empty text span next to an icon', async function (assert) {
    await render(hbs`<UiInlineTextIconLayout @icon="superpowers" />`);

    assert.dom('span:nth-child(1)').hasClass('fa');
    assert.dom('span:nth-child(2)').doesNotExist();

    await render(hbs`<UiInlineTextIconLayout @icon="superpowers"></UiInlineTextIconLayout>`);

    //
    assert.dom('span:nth-child(1)').hasClass('fa');
    assert.dom('span:nth-child(2)').exists();
  });

  test('it will provide a responsive class name to hide text when required', async function (assert) {
    this.set('icon', 'superpowers');
    this.set('responsive', false);

    await render(
      // language=Handlebars
      hbs`<UiInlineTextIconLayout @text="Hello World" @icon="{{this.icon}}" @responsive={{this.responsive}} />`
    );

    // With icon but not responsive flag
    assert.dom('span:nth-child(2)').hasText('Hello World');
    assert.dom('span:nth-child(2)').hasClass('ml-5px');
    assert.dom('span:nth-child(2)').doesNotHaveClass('hidden-sm-down');

    // With icon and responsive flag
    this.set('responsive', true);

    assert.dom('span:nth-child(2)').hasClass('ml-5px');
    assert.dom('span:nth-child(2)').hasClass('hidden-sm-down');

    // Without an icon, responsiveness would just mean the text disappearing
    this.set('icon', undefined);

    assert.dom('span:nth-child(1)').doesNotExist();
    assert.dom('span:nth-child(2)').doesNotExist();
  });

  test('it has a special tooltip style that will always show a tip icon', async function (assert) {
    this.set('icon', 'superpowers');
    this.set('responsive', true);
    this.set('tooltip', undefined);

    await render(
      // language=Handlebars
      hbs`<UiInlineTextIconLayout
                @text="Foo"
                @icon="{{this.icon}}"
                @responsive={{this.responsive}}
                @tooltip="{{this.tooltip}}"
        />`
    );

    assert.dom('span:nth-child(1)').hasClass('fa-superpowers');
    assert.dom('span:nth-child(2)').hasText('Foo');
    assert.dom('span:nth-child(2)').hasClass('ml-5px');
    assert.dom('span:nth-child(2)').hasClass('hidden-sm-down');

    // The tooltip icon should always come after the text content
    this.set('tooltip', 'Hello World');

    assert.dom('span:nth-child(2)').hasClass('fa-question-circle');
    assert.dom('span:nth-child(1)').hasText('Foo');
    assert.dom('span:nth-child(1)').hasClass('mr-5px');
    // Don't hide tooltip icon text
    assert.dom('span:nth-child(1)').doesNotHaveClass('hidden-sm-down');
  });
});
