import { module, test } from 'qunit';
import { extractErrorMessages } from '@nsf/ui-foundation/utils';
import { htmlSafe, isHTMLSafe } from '@ember/template';

module('Unit | Util | extract-error-messages', function () {
  test('it reduces a variety of input arguments to a string array', function (assert) {
    assert.strictEqual(extractErrorMessages(undefined), undefined, 'undefined returns undefined');

    assert.strictEqual(extractErrorMessages(null), undefined, 'null returns undefined');

    assert.strictEqual(extractErrorMessages([]), undefined, 'empty array returns undefined');

    assert.deepEqual(
      extractErrorMessages('Hello World'),
      ['Hello World'],
      'string returns string array'
    );

    assert.deepEqual(
      extractErrorMessages(['Hello', 'World']),
      ['Hello', 'World'],
      'string array returns string array'
    );

    assert.deepEqual(
      extractErrorMessages(new Error('Hello World')),
      ['Hello World'],
      'Error instance returns string array'
    );

    assert.deepEqual(
      extractErrorMessages({ errors: { foo: 'bar' } }),
      undefined,
      'object with errors prop that is not an array or string returns undefined'
    );

    assert.deepEqual(
      extractErrorMessages({ errors: [] }),
      undefined,
      'object with empty errors array returns undefined'
    );

    assert.deepEqual(
      extractErrorMessages({ errors: ['Hello', 'World'] }),
      ['Hello', 'World'],
      'object with errors array returns string array'
    );

    assert.deepEqual(
      extractErrorMessages({ error: 'Hello World' }),
      ['Hello World'],
      'object with error string returns string array'
    );

    const safeTestString = htmlSafe('Hello World');

    assert.true(
      isHTMLSafe(extractErrorMessages(safeTestString)?.[0]),
      'htmlSafe string returns htmlSafe string array'
    );

    assert.true(
      isHTMLSafe(extractErrorMessages([safeTestString])?.[0]),
      'htmlSafe string array returns htmlSafe string array'
    );

    assert.true(
      isHTMLSafe(extractErrorMessages({ errors: [safeTestString] })?.[0]),
      'object with errors htmlSafe string array returns htmlSafe string array'
    );

    assert.true(
      isHTMLSafe(extractErrorMessages({ error: safeTestString })?.[0]),
      'object with error htmlSafe string returns htmlSafe string array'
    );
  });
});
