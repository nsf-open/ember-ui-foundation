import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | ui-icon', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a span element with Font Awesome class names', async function (assert) {
    this.set('iconName', 'superpowers');

    await render(hbs`<UiIcon @name="{{this.iconName}}" />`);

    assert.dom('span').exists();
    assert.dom('span').hasAria('hidden', 'true');
    assert.dom('span').hasClass('fa');
    assert.dom('span').hasClass('fa-superpowers');

    this.set('iconName', 'mail');

    assert.dom('span').hasClass('fa-mail');
  });

  test('it supports fixed width icons', async function (assert) {
    this.set('iconName', 'superpowers');
    this.set('fixedWidth', false);

    await render(
      // language=Handlebars
      hbs`<UiIcon @name="{{this.iconName}}" @fw={{this.fixedWidth}} />`
    );

    assert.dom('span').hasClass('fa');
    assert.dom('span').hasClass('fa-superpowers');
    assert.dom('span').doesNotHaveClass('fa-fw');

    this.set('fixedWidth', true);

    assert.dom('span').hasClass('fa-superpowers');
    assert.dom('span').hasClass('fa-fw');

    this.set('iconName', 'mail');

    assert.dom('span').hasClass('fa-mail');
    assert.dom('span').hasClass('fa-fw');
  });

  test('it supports spinning icons', async function (assert) {
    this.set('iconName', 'superpowers');
    this.set('spin', false);

    await render(
      // language=Handlebars
      hbs`<UiIcon @name="{{this.iconName}}" @spin={{this.spin}} />`
    );

    assert.dom('span').hasClass('fa');
    assert.dom('span').hasClass('fa-superpowers');
    assert.dom('span').doesNotHaveClass('fa-spin');

    this.set('spin', true);

    assert.dom('span').hasClass('fa-superpowers');
    assert.dom('span').hasClass('fa-spin');

    this.set('iconName', 'mail');

    assert.dom('span').hasClass('fa-mail');
    assert.dom('span').hasClass('fa-spin');
  });

  test('it has a special pending style that will always show a loading spinner', async function (assert) {
    this.set('iconName', 'superpowers');
    this.set('pending', false);

    await render(
      // language=Handlebars
      hbs`<UiIcon @name="{{this.iconName}}" @pending={{this.pending}} />`
    );

    assert.dom('span').hasClass('fa');
    assert.dom('span').hasClass('fa-superpowers');
    assert.dom('span').doesNotHaveClass('fa-spin');
    assert.dom('span').doesNotHaveClass('fa-spinner');

    this.set('pending', true);

    assert.dom('span').doesNotHaveClass('fa-superpowers');
    assert.dom('span').hasClass('fa-spin');
    assert.dom('span').hasClass('fa-spinner');
  });
});
