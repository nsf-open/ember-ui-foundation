import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import { gte } from 'ember-compatibility-helpers';

const enableTest = gte('3.12.0');
const testOrSkip = enableTest ? test : skip;

module('Integration | Helpers | in-array', function (hooks) {
  setupRenderingTest(hooks);

  const testMsg = enableTest
    ? 'it determines whether a value is within an array'
    : 'not compatible with Ember < 3.12';

  testOrSkip(testMsg, async function (assert) {
    this.set('targetArray', undefined);
    this.set('searchValue', undefined);

    // language=handlebars
    await render(hbs`
      {{#if (in-array this.targetArray this.searchValue)}}
          <p>In Array</p>
      {{else}}
          <p>Not In Array</p>
      {{/if}}
    `);

    assert.dom('p').hasText('Not In Array');

    const targetArray = A([1, 2, 3]);

    this.set('targetArray', targetArray);
    assert.dom('p').hasText('Not In Array');

    this.set('searchValue', 3);
    assert.dom('p').hasText('In Array');

    this.set('searchValue', 4);
    assert.dom('p').hasText('Not In Array');

    targetArray.pushObject(4);
    await settled();
    assert.dom('p').hasText('In Array');

    targetArray.removeObject(2);
    await settled();
    assert.dom('p').hasText('In Array');

    targetArray.removeObject(4);
    await settled();
    assert.dom('p').hasText('Not In Array');
  });
});
