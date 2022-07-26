import type UiPopper from '@nsf-open/ember-ui-foundation/components/ui-popper/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, settled, scrollTo, getRootElement } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import lookupComponent from '../../helpers/lookup-component';

module('Integration | Component | ui-popper', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(async function () {
    // Some tests scroll around so this ensures things always get put back.
    // @ts-expect-error The root testing element will always have a parent
    await scrollTo(getRootElement().parentElement, 0, 0);
  });

  test('it generates a PopperJS instance', async function (assert) {
    await render(hbs`
      <div id="original-container">
        <UiPopper @popperTarget="#target-btn" @id="test-popper">
          Hello World
        </UiPopper>
      </div>

      <button id="target-btn">A Button</button>
    `);

    assert.dom('#test-popper').isVisible();
    assert.dom('#test-popper').hasText('Hello World');
    assert.dom('#test-popper').hasAttribute('data-popper-placement', 'bottom');

    assert.notEqual(
      find('#test-popper')?.parentNode,
      find('#original-container'),
      'The popper has been moved out of its original parent node'
    );
  });

  test('it can be rendered where it was defined', async function (assert) {
    // language=Handlebars
    await render(hbs`
      <div id="original-container">
        <UiPopper @popperTarget="#target-btn" @id="test-popper" @renderInPlace={{true}}>
          Hello World
        </UiPopper>
      </div>

      <button id="target-btn">A Button</button>
    `);

    assert.strictEqual(
      find('#test-popper')?.parentNode,
      find('#original-container'),
      "The popper's current parent is its original parent node"
    );
  });

  test('it will create an id for the positioned content if not provided', async function (assert) {
    // language=Handlebars
    await render(hbs`
      <UiPopper @popperTarget="#target-btn" @class="test-popper">Hello World</UiPopper>
      <button id="target-btn">A Button</button>
    `);

    assert.dom('.test-popper').hasAttribute('id', /.+-popper/);
  });

  test('it has several target-finding strategies', async function (assert) {
    this.set('popperTarget', '#target-btn');

    // language=Handlebars
    await render(hbs`
      <div id="original-container">
        <UiPopper @popperTarget={{this.popperTarget}} @class="test-popper">Hello World</UiPopper>
      </div>

      <button id="target-btn">A Button</button>
      <button id="other-target">Another Button</button>
    `);

    const popperId = find('.test-popper')?.getAttribute('id')?.replace('-popper', '') as string;
    const instance = lookupComponent<UiPopper>(this, popperId);

    assert.strictEqual(instance.realPopperTarget, find('#target-btn'));

    this.set('popperTarget', find('#other-target'));
    await settled();

    assert.strictEqual(instance.realPopperTarget, find('#other-target'));

    this.set('popperTarget', undefined);
    await settled();

    assert.strictEqual(instance.realPopperTarget, find('#original-container'));
  });

  test('it can be dynamically configured', async function (assert) {
    this.set('handlePopperUpdate', undefined);
    this.set('placement', 'bottom');
    this.set('renderInPlace', false);
    this.set('enabled', true);

    // language=Handlebars
    await render(hbs`
      <div id="original-container">
        <UiPopper
                @popperTarget="#target-btn"
                @id="test-popper"
                @renderInPlace={{this.renderInPlace}}
                @placement={{this.placement}}
                @enabled={{this.enabled}}
                @onUpdate={{this.handlePopperUpdate}}
        >
          Hello World
        </UiPopper>
      </div>

      <button id="target-btn" style="margin-top: 50px; margin-left: 50px;">A Button</button>
    `);

    assert.dom('#test-popper').isVisible();
    assert.dom('#test-popper').hasAttribute('data-popper-placement', 'bottom');

    this.set('placement', 'right');
    await settled();

    assert.dom('#test-popper').hasAttribute('data-popper-placement', 'right');

    assert.notEqual(
      find('#test-popper')?.parentNode,
      find('#original-container'),
      'The popper has been moved out of its original parent node'
    );

    this.set('renderInPlace', true);
    await settled();

    assert.strictEqual(
      find('#test-popper')?.parentNode,
      find('#original-container'),
      "The popper's current parent is its original parent node"
    );

    this.set('enabled', false);
    await settled();

    assert.dom('#test-popper').exists();
    assert.dom('#test-popper').isNotVisible();
    assert.dom('#test-popper').doesNotHaveAttribute('data-popper-placement');
    assert.dom('#test-popper').hasAttribute('data-popper-disabled');
    assert.dom('#test-popper').hasStyle({ display: 'none' });

    let onUpdateCount = 0;

    this.set('enabled', true);
    this.set('placement', 'top');
    this.set('renderInPlace', false);
    this.set('handlePopperUpdate', () => {
      if (onUpdateCount < 2) {
        assert.step('onUpdate');
      }

      // This could wind up getting called a lot depending on a ton of factors
      // that PopperJS deems relevant. Don't care about all of the calls, just
      // the couple expected ones.
      onUpdateCount += 1;
    });

    await settled();

    assert.dom('#test-popper').isVisible();
    assert.dom('#test-popper').doesNotHaveAttribute('data-popper-disabled');
    assert.dom('#test-popper').hasAttribute('data-popper-placement', 'top');

    // @ts-expect-error The root testing element will always have a parent
    await scrollTo(getRootElement().parentElement, 0, 30);
    await settled();

    // Two calls are expected - the first will happen as a result of the popper
    // being enabled and its layout getting calculated. The second will be due
    // to the scroll event that just occurred.
    assert.verifySteps(['onUpdate', 'onUpdate']);
  });
});
