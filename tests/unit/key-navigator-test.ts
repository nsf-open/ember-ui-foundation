import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { keyNavigator } from '@nsf-open/ember-ui-foundation/utils';
import { KeyCodes } from '@nsf-open/ember-ui-foundation/constants';
import { getCurrentElement, shouldInclude } from '@nsf-open/ember-ui-foundation/utils/key-navigator';

module('Unit | Util | key-navigator', function (hooks) {
  setupRenderingTest(hooks);

  test('it will determine the previous/next element in a sequence', async function (assert) {
    await render(hbs`
      <ul id="list">
        <li><button id="btn-a">Item A</button></li>
        <li><button id="btn-b">Item B</button></li>
        <li><button id="btn-c">Item C</button></li>
        <li><button id="btn-d">Item D</button></li>
      </ul>
    `);

    assert.strictEqual(
      undefined,
      keyNavigator(undefined, '#list button', KeyCodes.Escape),
      'unrecognized keycodes are ignored'
    );

    assert.strictEqual(
      undefined,
      keyNavigator(undefined, '#foo-bar .baz', KeyCodes.ArrowDown),
      'with no selections possible, undefined is returned'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(undefined, findAll('#list button') as HTMLElement[], KeyCodes.ArrowDown),
      'It accepts an array of HTMLElements'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(undefined, '#list button', KeyCodes.ArrowDown),
      '#btn-a chosen with ArrowDown'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(undefined, '#list button', KeyCodes.ArrowRight),
      '#btn-a chosen with ArrowRight'
    );

    assert.strictEqual(
      find('#btn-d'),
      keyNavigator(undefined, '#list button', KeyCodes.ArrowUp),
      '#btn-d chosen with ArrowUp'
    );

    assert.strictEqual(
      find('#btn-d'),
      keyNavigator(undefined, '#list button', KeyCodes.ArrowLeft),
      '#btn-d chosen with ArrowLeft'
    );

    assert.strictEqual(
      find('#btn-c'),
      keyNavigator(find('#btn-b') as HTMLElement, '#list button', KeyCodes.ArrowDown),
      '#btn-c chosen with ArrowDown (#btn-b was previous)'
    );

    assert.strictEqual(
      find('#btn-c'),
      keyNavigator(find('#btn-b') as HTMLElement, '#list button', KeyCodes.ArrowRight),
      '#btn-c chosen with ArrowRight (#btn-b was previous)'
    );

    assert.strictEqual(
      find('#btn-b'),
      keyNavigator(find('#btn-c') as HTMLElement, '#list button', KeyCodes.ArrowUp),
      '#btn-b chosen with ArrowUp (#btn-c was previous)'
    );

    assert.strictEqual(
      find('#btn-b'),
      keyNavigator(find('#btn-c') as HTMLElement, '#list button', KeyCodes.ArrowLeft),
      '#btn-b chosen with ArrowLeft (#btn-c was previous)'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(find('#btn-c') as HTMLElement, '#list button', KeyCodes.Home),
      '#btn-c chosen with Home'
    );

    assert.strictEqual(
      find('#btn-d'),
      keyNavigator(find('#btn-b') as HTMLElement, '#list button', KeyCodes.End),
      '#btn-d chosen with End'
    );

    assert.strictEqual(
      find('#btn-d'),
      keyNavigator(find('#btn-a') as HTMLElement, '#list button', KeyCodes.ArrowUp),
      '#btn-d chosen with ArrowUp (#btn-a was previous, wrapAround enabled)'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(find('#btn-d') as HTMLElement, '#list button', KeyCodes.ArrowDown),
      '#btn-a chosen with ArrowDown (#btn-d was previous, wrapAround enabled)'
    );

    assert.strictEqual(
      find('#btn-a'),
      keyNavigator(find('#btn-a') as HTMLElement, '#list button', KeyCodes.ArrowUp, {
        wrapAround: false,
      }),
      '#btn-d chosen with ArrowUp (#btn-a was previous, wrapAround disabled)'
    );

    assert.strictEqual(
      find('#btn-d'),
      keyNavigator(find('#btn-d') as HTMLElement, '#list button', KeyCodes.ArrowDown, {
        wrapAround: false,
      }),
      '#btn-a chosen with ArrowDown (#btn-d was previous, wrapAround disabled)'
    );
  });

  test('it can determine the "current" element from a variety of possible inputs', async function (assert) {
    await render(hbs`
      <ul id="list">
        <li><button id="btn-a">Item A</button></li>
        <li><button id="btn-b">Item B</button></li>
        <li><button id="btn-c">Item C</button></li>
        <li><button id="btn-d">Item D</button></li>
      </ul>
    `);

    assert.strictEqual(undefined, getCurrentElement(undefined, []), 'undefined returns undefined');
    assert.strictEqual(undefined, getCurrentElement(null, []), 'null returns undefined');

    // @ts-expect-error - passing incorrect type on purpose
    assert.strictEqual(undefined, getCurrentElement(10, []), 'unrecognized type returns undefined');

    assert.strictEqual(
      find('#btn-b'),
      getCurrentElement('#btn-b', []),
      'string selector returns HTMLElement'
    );

    assert.strictEqual(
      undefined,
      getCurrentElement('#btn-e', []),
      'string selector returns undefined'
    );

    assert.strictEqual(
      find('#btn-c'),
      getCurrentElement(find('#btn-c') as HTMLElement, []),
      'HTMLElement returns HTMLElement'
    );

    assert.strictEqual(
      find('#btn-d'),
      getCurrentElement((elements) => elements.pop(), findAll('#list button') as HTMLElement[]),
      'function returns HTMLElement'
    );
  });

  test('its default filter correctly removes objects it thinks should not be selectable', function (assert) {
    assert.false(
      // @ts-expect-error - passing incorrect type on purpose
      shouldInclude(null),
      'things that are not HTMLElement instances are not included'
    );

    const elementA = document.createElement('div');
    elementA.ariaDisabled = 'true';
    assert.false(shouldInclude(elementA), 'elements with ariaDisabled="true" are not included');

    const elementB = document.createElement('div');
    elementB.ariaHidden = 'true';
    assert.false(shouldInclude(elementB), 'elements with ariaHidden="true" are not included');

    const elementC = document.createElement('div');
    elementC.hidden = true;
    assert.false(shouldInclude(elementC), 'elements with hidden=true are not included');

    const elementD = document.createElement('div');
    elementD.classList.add('disabled');
    assert.false(shouldInclude(elementD), 'elements with a class name "disabled" are not included');

    const elementE = document.createElement('div');
    elementE.ariaDisabled = 'false';
    elementE.ariaHidden = 'false';
    elementE.hidden = false;
    elementE.classList.add('foo');
    assert.true(shouldInclude(elementE), 'other elements are included');

    const elementF = document.createElement('div');
    assert.true(shouldInclude(elementF), 'other elements are included');
  });
});
