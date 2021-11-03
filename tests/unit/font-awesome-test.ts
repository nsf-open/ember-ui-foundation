import { module, test } from 'qunit';
import { buildFaClassNameString } from '@nsf/ui-foundation/utils';

module('Unit | Util | font-awesome', function () {
  test('it applies the "fa-" prefix to one or more strings as required', function (assert) {
    assert.strictEqual(buildFaClassNameString('fa-foo'), 'fa fa-foo');
    assert.strictEqual(buildFaClassNameString('foo'), 'fa fa-foo');
    assert.strictEqual(buildFaClassNameString('fa-foo bar'), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString('fa-foo fa-bar'), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString('fa-foo', 'bar'), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString('fa-foo', 'fa-bar'), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString(['foo', 'bar']), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString(['fa-foo', 'bar']), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString(['fa-foo', 'fa-bar']), 'fa fa-foo fa-bar');
    assert.strictEqual(buildFaClassNameString(['foo', '', 'bar']), 'fa fa-foo fa-bar');

    // @ts-expect-error - testing for invalid arguments
    assert.strictEqual(buildFaClassNameString(['foo', undefined, 'bar']), 'fa fa-foo fa-bar');
  });
});
