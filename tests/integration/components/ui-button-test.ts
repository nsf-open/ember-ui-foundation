import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a button in a variety of fun styles', async function (assert) {
    await render(hbs`<UiButton @text="Hello World" @variant="primary" @testId="btn" />`);

    assert.dom('[data-test-id="btn"]').isVisible();
    assert.dom('[data-test-id="btn"]').hasText('Hello World');
    assert.dom('[data-test-id="btn"]').isEnabled();
    assert.dom('[data-test-id="btn"]').hasClass('btn');
    assert.dom('[data-test-id="btn"]').hasClass('btn-primary');

    // language=handlebars
    await render(hbs`<UiButton @variant="secondary" @size="lg" @block={{true}}>Foo Bar</UiButton>`);

    assert.dom('button').isVisible();
    assert.dom('button').hasText('Foo Bar');
    assert.dom('button').isEnabled();
    assert.dom('button').hasClass('btn-secondary');
    assert.dom('button').hasClass('btn-block');
    assert.dom('button').hasClass('btn-lg');
  });

  test('it handles click events', async function (assert) {
    this.set('clickAction', function () {
      assert.step('click');
    });

    // language=handlebars
    await render(hbs`
        <UiButton @text="Hello World" @variant="primary" @onClick={{action this.clickAction}} />
    `);

    await click('button');

    assert.verifySteps(['click']);
  });

  test('it cannot be clicked on when disabled', async function (assert) {
    this.setProperties({
      disabled: false,

      clickAction() {
        assert.step('click A');
      },
    });

    // language=handlebars
    await render(hbs`
        <UiButton
          @text="Hello World"
          @variant="primary"
          @disabled={{this.disabled}}
          @onClick={{action this.clickAction}}
        />
    `);

    await click('button');

    this.setProperties({
      disabled: true,

      clickAction() {
        assert.step('I should not be ran');
      },
    });

    try {
      await click('button');
    } catch (e) {
      // Noop. @ember/test-helpers throws and error if the button is
      // disabled when you try to click on it.
    }

    this.setProperties({
      disabled: false,

      clickAction() {
        assert.step('click B');
      },
    });

    await click('button');

    assert.verifySteps(['click A', 'click B']);
  });

  test('it goes into a "pending" state when a promise is returned from the onClick action', async function (this, assert) {
    const promise = new Promise((resolve) => setTimeout(resolve, 100));

    this.set('clickAction', function () {
      return promise;
    });

    // language=handlebars
    await render(hbs`<UiButton @text="Hello World" @onClick={{action this.clickAction}} />`);

    await click('button');

    assert.dom('button').isDisabled();
    assert.dom('button span:first-child').hasClass('fa-spinner');
    assert.dom('button span:first-child').hasClass('fa-spin');

    await promise;
    await settled();

    assert.dom('button').isEnabled();
    assert.dom('button span').doesNotExist();
  });

  test('it goes into a "pending" state when a promise is provided as an attribute', async function (this, assert) {
    // language=handlebars
    await render(hbs`<UiButton @text="Hello World" @promise={{this.promise}} />`);

    const promise = new Promise((resolve) => setTimeout(resolve, 100));
    this.set('promise', promise);

    await settled();

    assert.dom('button').isDisabled();
    assert.dom('button span:first-child').hasClass('fa-spinner');
    assert.dom('button span:first-child').hasClass('fa-spin');

    await promise;
    await settled();

    assert.dom('button').isEnabled();
    assert.dom('button span').doesNotExist();
  });

  test('it renders icons', async function (assert) {
    this.set('iconPlacement', 'left');

    // language=handlebars
    await render(
      hbs`<UiButton @text="Hello World" @icon="search" @iconPlacement={{this.iconPlacement}} />`
    );

    assert.dom('button span:nth-child(1)').hasClass('fa-search');

    this.set('iconPlacement', 'right');

    assert.dom('button span:nth-child(2)').hasClass('fa-search');
  });

  test('it can be disabled', async function (assert) {
    // language=handlebars
    await render(hbs`<UiButton @text="Hello World" disabled={{true}} />`);
    assert.dom('button').isDisabled();
  });

  test('it has numerous other attribute bindings', async function (assert) {
    await render(hbs`
			<UiButton @text="Hello World"
				@title="Foo"
				@type="submit"
				@ariaExpanded="true"
				@ariaLabel="Bar"
				@ariaLabelledBy="123"
				@ariaDescribedBy="456"
				@ariaControls="789"
				@ariaSelected="false"
				@ariaHasPopup="000"
				@tabIndex="-1"
			/>
		`);

    assert.dom('button').hasAttribute('title', 'Foo');
    assert.dom('button').hasAttribute('type', 'submit');
    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('button').hasAttribute('aria-label', 'Bar');
    assert.dom('button').hasAttribute('aria-labelledby', '123');
    assert.dom('button').hasAttribute('aria-describedby', '456');
    assert.dom('button').hasAttribute('aria-controls', '789');
    assert.dom('button').hasAttribute('aria-selected', 'false');
    assert.dom('button').hasAttribute('aria-haspopup', '000');
    assert.dom('button').hasAttribute('tabindex', '-1');
  });
});
