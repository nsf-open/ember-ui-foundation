import { module, test } from 'qunit';
import { kindaLooksPlural } from '@nsf-open/ember-ui-foundation/utils';

module('Unit | Util | kindaLooksPlural', function () {
  test('it identifies things that might need to be pluralized in the english language', function (assert) {
    assert.true(kindaLooksPlural(0), 'The number zero is plural');
    assert.false(kindaLooksPlural(1), 'The number one is singular');
    assert.true(kindaLooksPlural(2), 'The number two is plural');
    assert.true(kindaLooksPlural('0'), 'The string zero is plural');
    assert.false(kindaLooksPlural('1'), 'The string one is singular');
    assert.true(kindaLooksPlural('2'), 'The string two is plural');
    assert.false(kindaLooksPlural('dog'), 'The string "dog" is singular');
    assert.true(kindaLooksPlural('dogs'), 'The string "dogs" is already plural');
    assert.false(kindaLooksPlural('compass'), 'The string "compass" is singular');

    assert.false(
      kindaLooksPlural(null),
      'The null value is not plural (this is the fallthrough case for anything that is not a string or number)'
    );
  });
});
