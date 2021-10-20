import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor, waitUntil, find, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// // @ts-expect-error - Testing testing 1, 2, 3
// window.__WAIT_FOR_TRANSITION_END__ = true;

module('Integration | Component | ui-collapse', function (hooks) {
  setupRenderingTest(hooks);

  test('it vertically expands a block element', async function (assert) {
    this.set('collapsed', true);

    // language=Handlebars
    await render(
      hbs`<UiCollapse @collapsed={{this.collapsed}}>
          <div style="border: solid 1px #000; padding: 20px; background: #fff;">
              Hello World
          </div>
      </UiCollapse>`
    );

    assert.dom('.ui-collapse').exists();
    assert.dom('.ui-collapse').hasClass('collapse');
    assert.dom('.ui-collapse').doesNotHaveClass('show');
    assert.dom('.ui-collapse').isNotVisible();
    assert.dom('.ui-collapse').hasStyle({ height: 'auto' });

    this.set('collapsed', false);

    await waitFor('.ui-collapse.collapsing');
    await waitFor('.ui-collapse.show');

    assert.dom('.ui-collapse').hasClass('show');
    assert.dom('.ui-collapse').isVisible();
    assert.dom('.ui-collapse').hasStyle({ height: `${find('.ui-collapse')?.scrollHeight}px` });

    this.set('collapsed', true);

    await waitFor('.ui-collapse.collapsing');
    await waitFor('.ui-collapse.collapse');

    assert.dom('.ui-collapse').doesNotHaveClass('show');
    assert.dom('.ui-collapse').isNotVisible();
    assert.dom('.ui-collapse').hasStyle({ height: 'auto' });
  });

  test('it can start in the expanded state', async function (assert) {
    this.set('collapsed', false);

    // language=Handlebars
    await render(
      hbs`<UiCollapse @collapsed={{this.collapsed}}>
          <div style="border: solid 1px #000; padding: 20px; background: #fff;">
              Hello World
          </div>
      </UiCollapse>`
    );

    assert.dom('.ui-collapse').hasClass('show');
    assert.dom('.ui-collapse').isVisible();
    assert.dom('.ui-collapse').hasStyle({ height: `${find('.ui-collapse')?.scrollHeight}px` });

    this.set('collapsed', true);

    await waitFor('.ui-collapse.collapsing');
    await waitFor('.ui-collapse.collapse');

    assert.dom('.ui-collapse').doesNotHaveClass('show');
    assert.dom('.ui-collapse').isNotVisible();
    assert.dom('.ui-collapse').hasStyle({ height: 'auto' });
  });

  test('it runs provided callback actions', async function (assert) {
    this.set('collapsed', true);

    this.set('handleOnShow', function () {
      assert.step('onShow');
    });

    this.set('handleOnShown', function () {
      assert.step('onShown');
    });

    this.set('handleOnHide', function () {
      assert.step('onHide');
    });

    this.set('handleOnHidden', function () {
      assert.step('onHidden');
    });

    // language=Handlebars
    await render(
      hbs`<UiCollapse
              @collapsed={{this.collapsed}}
              @onShow={{this.handleOnShow}}
              @onShown={{this.handleOnShown}}
              @onHide={{this.handleOnHide}}
              @onHidden={{this.handleOnHidden}}
      >
          <div style="border: solid 1px #000; padding: 20px; background: #fff;">
              Hello World
          </div>
      </UiCollapse>`
    );

    this.set('collapsed', false);
    await waitFor('.ui-collapse.show');
    this.set('collapsed', true);
    await waitFor('.ui-collapse.collapse');

    assert.verifySteps(['onShow', 'onShown', 'onHide', 'onHidden']);
  });

  test('it can have its expanded and collapsed size explicitly set', async function (assert) {
    this.set('collapsed', true);
    this.set('expandedSize', 40);
    this.set('collapsedSize', 10);

    // language=Handlebars
    await render(
      hbs`<UiCollapse
              @collapsed={{this.collapsed}}
              @expandedSize={{this.expandedSize}}
              @collapsedSize={{this.collapsedSize}}
              @resetSizeBetweenTransitions={{false}}
      >
          <div style="border: solid 1px #000; padding: 20px; background: #fff;">
              Hello World
          </div>
      </UiCollapse>`
    );

    this.set('collapsed', false);
    await waitFor('.ui-collapse.show');

    assert.dom('.ui-collapse').hasAttribute('style', 'height: 40px;');

    this.set('expandedSize', 30);
    await settled();

    assert.dom('.ui-collapse').hasAttribute('style', 'height: 30px;');

    this.set('collapsed', true);
    await waitFor('.ui-collapse.collapse');

    assert.dom('.ui-collapse').hasAttribute('style', 'height: 10px;');

    this.set('collapsedSize', 20);
    await settled();

    assert.dom('.ui-collapse').hasAttribute('style', 'height: 20px;');
  });

  test('it waits for rendering to finish before moving past "onShow"', async function (assert) {
    // It is a fairly common pattern to have the onShow action doing something that
    // causes the content of the ui-collapse component to change. Those changes need
    // to occur before the final size to expand to is calculated so there isn't an abrupt
    // visual jerk at the end of the animation.

    // The way that this works is to capture an initial size of the expanded block.
    // Collapse it. Expand it again, and in doing so trigger some additional content to be
    // rendered. The new size that it has calculated as what it needs to transition to
    // should be larger than the original.

    function fromPx(str: string | undefined | null) {
      return typeof str === 'string' ? parseInt(str.replace(/\D/g, ''), 10) : undefined;
    }

    this.set('collapsed', false);
    this.set('showMore', false);

    this.set('handleOnShow', () => {
      this.set('showMore', true);
    });

    // language=Handlebars
    await render(
      hbs`<UiCollapse
              @collapsed={{this.collapsed}}
              @onShow={{action this.handleOnShow}}
      >
          <div style="border: solid 1px #000; padding: 20px; background: #fff;">
              Hello World
              {{#if this.showMore}}<p>Foo Bar Baz</p>{{/if}}
          </div>
      </UiCollapse>`
    );

    const originalHeight = find('.ui-collapse')?.scrollHeight || 0;

    this.set('collapsed', true);
    await settled();

    this.set('collapsed', false);
    await waitUntil(() => fromPx(find('.ui-collapse')?.getAttribute('style')) || 0 > 0);

    const newHeight = fromPx(find('.ui-collapse')?.getAttribute('style')) || 0;

    assert.ok(
      newHeight > originalHeight,
      `The new block height (${newHeight}px) is greater than the original (${originalHeight}px)`
    );
  });
});
