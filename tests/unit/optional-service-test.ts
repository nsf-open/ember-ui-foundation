import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service, { inject as service } from '@ember/service';
import { optionalService } from '@nsf/ui-foundation/utils';

module('Unit | Util | optionalService', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:test-service',
      // eslint-disable-next-line ember/no-classic-classes
      Service.extend({
        router: service(),
        doesNotExist: optionalService(),
      })
    );
  });

  hooks.afterEach(function () {
    this.owner.unregister('service:test-service');
  });

  test('it does not throw an exception when the service does not exist', function (assert) {
    const testService = this.owner.lookup('service:test-service');
    const routerService = this.owner.lookup('service:router');

    assert.strictEqual(
      testService.router,
      routerService,
      'The router service does exist as expected'
    );

    assert.strictEqual(
      testService.doesNotExist,
      undefined,
      'The "doesNotExist" service does not exist, and no exception was raised'
    );
  });
});
