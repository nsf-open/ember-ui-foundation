import { module, test } from 'qunit';
import {
  getAriaAttributeValues,
  addAriaAttribute,
  removeAriaAttribute,
} from '@nsf/ui-foundation/utils/aria';

module('Unit | Util | ARIA Attributes', function () {
  test('it can add, retrieve the value of, and remove attributes from an HTMLElement', function (assert) {
    const element = document.createElement('div');

    assert.deepEqual(getAriaAttributeValues(element, 'aria-describedby'), []);

    addAriaAttribute(element, 'aria-describedby', 'id-1');

    assert.deepEqual(getAriaAttributeValues(element, 'aria-describedby'), ['id-1']);

    addAriaAttribute(element, 'describedby', 'id-2');

    assert.deepEqual(getAriaAttributeValues(element, 'describedby'), ['id-1', 'id-2']);

    removeAriaAttribute(element, 'aria-describedby', 'id-1');

    assert.deepEqual(getAriaAttributeValues(element, 'describedby'), ['id-2']);

    removeAriaAttribute(element, 'describedby', 'id-2');

    assert.deepEqual(getAriaAttributeValues(element, 'describedby'), []);
  });
});
