import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  createOutsideClickListener,
  removeOutsideClickListener,
} from '@nsf/ui-foundation/utils/outside-click';

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
});
