import type RouterService from '@ember/routing/router-service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service, { inject as service } from '@ember/service';
import { optionalService } from '@nsf-open/ember-ui-foundation/utils';

module('Unit | Util | optionalService', function (hooks) {
  setupTest(hooks);

  class TestService extends Service {
    @service
    public declare readonly router: RouterService;

    @optionalService()
    public declare readonly doesNotExist: unknown;
  }

  hooks.beforeEach(function () {
    this.owner.register('service:test-service', TestService);
  });

  hooks.afterEach(function () {
    this.owner.unregister('service:test-service');
  });

  test('it does not throw an exception when the service does not exist', function (assert) {
    const testService = this.owner.lookup('service:test-service') as TestService;
    const routerService = this.owner.lookup('service:router') as RouterService;

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
