import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { HeadingLevels } from '@nsf/ui-foundation/constants';

module('Integration | Component | ui-heading', function (hooks) {
  setupRenderingTest(hooks);

  test('it will render the heading levels H1 - H6', async function (assert) {
    this.set('level', HeadingLevels.H1);

    // language=handlebars
    await render(
      hbs`<UiHeading @level={{this.level}} @text="Hello World" @class="a-heading-class" />`
    );

    assert.dom('h1').hasText('Hello World');
    assert.dom('h1').hasClass('a-heading-class');

    this.set('level', HeadingLevels.H2);
    assert.dom('h2').hasText('Hello World');

    this.set('level', HeadingLevels.H3);
    assert.dom('h3').hasText('Hello World');

    this.set('level', HeadingLevels.H4);
    assert.dom('h4').hasText('Hello World');

    this.set('level', HeadingLevels.H5);
    assert.dom('h5').hasText('Hello World');

    this.set('level', HeadingLevels.H6);
    assert.dom('h6').hasText('Hello World');
  });

  test('it will render the heading levels H1 - H6 with a content block', async function (assert) {
    this.set('level', HeadingLevels.H1);

    // language=handlebars
    await render(
      hbs`<UiHeading @level={{this.level}} @class="a-heading-class">Hello World</UiHeading>`
    );

    assert.dom('h1').hasText('Hello World');
    assert.dom('h1').hasClass('a-heading-class');

    this.set('level', HeadingLevels.H2);
    assert.dom('h2').hasText('Hello World');

    this.set('level', HeadingLevels.H3);
    assert.dom('h3').hasText('Hello World');

    this.set('level', HeadingLevels.H4);
    assert.dom('h4').hasText('Hello World');

    this.set('level', HeadingLevels.H5);
    assert.dom('h5').hasText('Hello World');

    this.set('level', HeadingLevels.H6);
    assert.dom('h6').hasText('Hello World');
  });
});
