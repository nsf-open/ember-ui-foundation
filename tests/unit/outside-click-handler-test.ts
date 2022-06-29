import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  createOutsideClickListener,
  removeOutsideClickListener,
} from '@nsf-open/ember-ui-foundation/utils/outside-click';

module('Unit | Util | outside-click-handler', function (hooks) {
  setupRenderingTest(hooks);

  test('it creates a listener that only fires when click happen outside of a given element', async function (assert) {
    await render(hbs`
      <div id="outer">
        <div id="target">
          <div id="inner"></div>
        </div>
      </div>
    `);

    const listener = createOutsideClickListener(
      null,
      find('#target') as HTMLElement,
      function (event: Event) {
        const eventTarget = event.target as Element;
        assert.step(eventTarget.id);
      }
    );

    await click('#outer');
    await click('#target');
    await click('#inner');
    await click('#target');
    await click('#outer');

    removeOutsideClickListener(listener);

    await click('#outer');
    await click('#target');
    await click('#inner');

    assert.verifySteps(['outer', 'outer']);
  });

  test('it accepts multiple elements that must all be outside of the click hierarchy', async function (assert) {
    await render(hbs`
      <div id="outer">
        <div id="target1">
          <div id="inner1"></div>
        </div>
        <div id="target2">
          <div id="inner2"></div>
        </div>
      </div>
    `);

    const target1 = find('#target1') as HTMLElement;
    const target2 = find('#target2') as HTMLElement;

    const listener = createOutsideClickListener(null, [target1, target2], function (event: Event) {
      const eventTarget = event.target as Element;
      assert.step(eventTarget.id);
    });

    await click('#outer');
    await click('#target1');
    await click('#inner1');
    await click('#target1');
    await click('#target2');
    await click('#inner2');
    await click('#target2');
    await click('#outer');

    removeOutsideClickListener(listener);

    await click('#outer');
    await click('#target1');
    await click('#target2');
    await click('#inner1');
    await click('#inner2');

    assert.verifySteps(['outer', 'outer']);
  });
});
