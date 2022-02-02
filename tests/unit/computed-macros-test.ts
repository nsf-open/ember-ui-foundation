import { module, test } from 'qunit';
import { set } from '@ember/object';
import { listenTo } from '@nsf/ui-foundation/utils';

class TestClass {
  @listenTo('sourceValue', 'A Default Value')
  public declare listenerValue: string;

  public sourceValue? = 'Hello World';
}

module('Unit | Util | computed-macros', function () {
  test('@listenTo macro', function (assert) {
    const testClass = new TestClass();

    assert.strictEqual(testClass.sourceValue, 'Hello World', 'source value is correct');
    assert.strictEqual(testClass.listenerValue, 'Hello World', 'listener value is correct');

    set(testClass, 'sourceValue', undefined);

    assert.strictEqual(
      testClass.listenerValue,
      'A Default Value',
      'listener value expresses its default when source is undefined'
    );

    set(testClass, 'sourceValue', 'FooBar');

    assert.strictEqual(testClass.sourceValue, 'FooBar', 'source value is correct');
    assert.strictEqual(
      testClass.listenerValue,
      'FooBar',
      'listener value is correct after source change'
    );

    set(testClass, 'listenerValue', 'Baz');

    assert.strictEqual(
      testClass.sourceValue,
      'FooBar',
      'source value is correct after listener change'
    );
    assert.strictEqual(
      testClass.listenerValue,
      'Baz',
      'listener value is correct after deviating from source'
    );

    set(testClass, 'sourceValue', '1001');

    assert.strictEqual(testClass.sourceValue, '1001', 'source value is correct');
    assert.strictEqual(
      testClass.listenerValue,
      '1001',
      'listener value snaps back to source when source is updated'
    );
  });
});
