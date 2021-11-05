import type ModalService from '@nsf/ui-foundation/services/modal';

import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { timeout, task } from 'ember-concurrency';
import {
  render,
  settled,
  waitFor,
  waitUntil,
  find,
  click,
  clearRender,
  triggerKeyEvent,
  focus,
} from '@ember/test-helpers';

module('Integration | Component | ui-modal', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a modal window that can be opened and closed', async function (assert) {
    this.set('isOpen', false);

    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{this.isOpen}}>
        <p>Content Goes Here</p>
      </UiModal>
    `);

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();

    this.set('isOpen', true);

    await waitFor('.modal-backdrop');

    assert.dom('.modal-backdrop').hasClass('fade');
    assert.dom('.modal-backdrop').hasClass('in');
    assert.dom('[data-test-id="modal"]').doesNotExist();

    await waitFor('[data-test-id="modal"]');

    assert.dom('[data-test-id="modal"]').hasClass('fade');
    assert.dom('[data-test-id="modal"]').hasStyle({ opacity: '0' });

    await waitFor('[data-test-id="modal"].fade.in');

    assert.dom('[data-test-id="modal"]').hasClass('in');
    assert.dom('[data-test-id="modal"] .modal-dialog').exists();

    await waitUntil(
      () => getComputedStyle(find('[data-test-id="modal"]') as HTMLElement).opacity === '1'
    );

    assert.dom('[data-test-id="modal"]').hasAttribute('role', 'dialog');
    assert.dom('[data-test-id="modal"]').hasAttribute('tabindex', '-1');
    assert
      .dom('[data-test-id="modal"]')
      .hasAttribute('aria-labelledby', find('.modal-header')?.id || '');
    assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();
    assert.dom('[data-test-id="modal"] .modal-dialog').hasAttribute('role', 'document');
    assert.dom('[data-test-id="modal"] .modal-dialog').hasClass('modal-md');
    assert.dom('[data-test-id="modal"] .modal-title').hasText('Hello World');
    assert.dom('[data-test-id="modal"] .modal-header button.close').isFocused();
    assert.dom('[data-test-id="modal"] .modal-body').hasText('Content Goes Here');

    this.set('isOpen', false);
    await settled();

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();
  });

  test('it can be rendered directly into the open state', async function (assert) {
    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{true}}>
        <p>Content Goes Here</p>
      </UiModal>
    `);

    assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();
    assert.dom('[data-test-id="modal"] .modal-title').hasText('Hello World');
    assert.dom('[data-test-id="modal"] .modal-header button.close').isFocused();
    assert.dom('[data-test-id="modal"] .modal-body').hasText('Content Goes Here');
  });

  test('it can be closed via the close button in the dialog header', async function (assert) {
    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{true}}>
        <p>Content Goes Here</p>
      </UiModal>
    `);

    assert.dom('[data-test-id="modal"] .modal-dialog').isVisible();

    await click('[data-test-id="modal"] .modal-header button.close');

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();
  });

  test('it can be opened and closed via the modal service', async function (assert) {
    const modal: ModalService = this.owner.lookup('service:modal');

    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @name="testModal">
        <p>Content Goes Here</p>
      </UiModal>
    `);

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();

    modal.open('testModal');
    await settled();

    assert.dom('.modal-backdrop').isVisible();
    assert.dom('[data-test-id="modal"]').isVisible();

    modal.close();
    await settled();

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();
  });

  test('it can be dynamically passed data and a title via the modal service', async function (assert) {
    const modal: ModalService = this.owner.lookup('service:modal');

    // language=handlebars
    await render(hbs`
      <UiModal @testId="modal" @name="testModal" as |modal|>
        <p>{{modal.data}}</p>
      </UiModal>
    `);

    modal.open('testModal', 'Test modal content', 'Test modal title');
    await settled();

    assert.dom('[data-test-id="modal"] .modal-title').hasText('Test modal title');
    assert.dom('[data-test-id="modal"] .modal-body').hasText('Test modal content');
  });

  test('it will close one modal when another is requested to be opened', async function (assert) {
    const modal: ModalService = this.owner.lookup('service:modal');

    // language=handlebars
    await render(hbs`
      <UiModal @testId="modalA" @name="testModalA" as |modal|>
        <p>{{modal.data}}</p>
      </UiModal>

      <UiModal @testId="modalB" @name="testModalB" as |modal|>
          <p>{{modal.data}}</p>
      </UiModal>
    `);

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modalA"]').doesNotExist();
    assert.dom('[data-test-id="modalB"]').doesNotExist();

    modal.open('testModalA', 'Test Modal A Content', 'Test modal A Title');
    await settled();

    assert.dom('[data-test-id="modalA"] .modal-title').hasText('Test modal A Title');
    assert.dom('[data-test-id="modalA"] .modal-body').hasText('Test Modal A Content');

    assert.dom('.modal-backdrop').isVisible();
    assert.dom('[data-test-id="modalB"]').doesNotExist();

    modal.open('testModalB', 'Test Modal B Content', 'Test modal B Title');

    await waitUntil(() => !document.querySelector('[data-test-id="modalA"]'));

    // The backdrop should never go away when transitioning between modals
    assert.dom('.modal-backdrop').isVisible();

    await settled();

    assert.dom('[data-test-id="modalB"] .modal-title').hasText('Test modal B Title');
    assert.dom('[data-test-id="modalB"] .modal-body').hasText('Test Modal B Content');

    modal.close();
    await settled();

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modalA"]').doesNotExist();
    assert.dom('[data-test-id="modalB"]').doesNotExist();
  });

  test('it allows an open modal to cancel the opening of a new modal', async function (assert) {
    const modal: ModalService = this.owner.lookup('service:modal');

    this.set('canHideModal', function () {
      assert.step('blocking');
      return false;
    });

    this.set('showModalBlocked', function () {
      assert.step('blocked');
    });

    // language=handlebars
    await render(hbs`
      <UiModal @testId="modalA" @name="testModalA" @onCanHide={{action this.canHideModal}} as |modal|>
        <p>{{modal.data}}</p>
      </UiModal>

      <UiModal @testId="modalB" @name="testModalB" @onHideBlocked={{action this.showModalBlocked}} as |modal|>
          <p>{{modal.data}}</p>
      </UiModal>
    `);

    modal.open('testModalA', 'Test Modal A Content', 'Test modal A Title');
    await settled();

    assert.dom('[data-test-id="modalA"]').isVisible();
    assert.dom('[data-test-id="modalB"]').doesNotExist();

    modal.open('testModalB', 'Test Modal B Content', 'Test modal B Title');
    await settled();

    assert.dom('[data-test-id="modalA"]').isVisible();
    assert.dom('[data-test-id="modalB"]').doesNotExist();

    assert.verifySteps(['blocking', 'blocked']);
  });

  test('it will clean up after itself if destroyed without being properly closed', async function (assert) {
    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{true}}>
        <p>Content Goes Here</p>
      </UiModal>
    `);

    assert.dom('.modal-backdrop').isVisible();
    assert.dom('[data-test-id="modal"]').isVisible();

    await clearRender();

    assert.dom('.modal-backdrop').isNotVisible();
  });

  test('it can be opened with the "open-modal" helper', async function (assert) {
    // language=handlebars
    await render(hbs`
      <button
        type="button"
        id="openModal"
        onclick={{open-modal "testModal" "Test Modal Content" "Test Modal Title"}}
      >
        Open Modal
      </button>

      <UiModal @name="testModal" @testId="modal" as |modal|>
        <p>{{modal.data}}</p>
      </UiModal>
    `);

    assert.dom('.modal-backdrop').doesNotExist();
    assert.dom('[data-test-id="modal"]').doesNotExist();

    await click('#openModal');

    assert.dom('.modal-backdrop').isVisible();
    assert.dom('[data-test-id="modal"]').isVisible();
    assert.dom('[data-test-id="modal"] .modal-title').hasText('Test Modal Title');
    assert.dom('[data-test-id="modal"] .modal-body').hasText('Test Modal Content');
  });

  test('it traps focus inside the dialog', async function (assert) {
    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{true}}>
        <button type="button" id="buttonA">Button A</button>
        <button type="button" id="buttonB">Button B</button>
      </UiModal>
    `);

    // See https://github.com/emberjs/ember-test-helpers/issues/738
    // Some keyboard interaction are particularly difficult to fake with Javascript,
    // and tabbing through focusable elements is one of them. For this, we only
    // _really_ want to make sure that focus gets wrapped between first <-> last
    // elements in the modal. Going out on a limb here that the browser is capable
    // of handing everything in-between.

    assert.dom('.modal-header button.close').isFocused();

    await focus('#buttonB');
    assert.dom('#buttonB').isFocused();

    await triggerKeyEvent('[data-test-id="modal"]', 'keydown', 'Tab');

    assert.dom('.modal-header button.close').isFocused();

    await triggerKeyEvent('[data-test-id="modal"]', 'keydown', 'Tab', { shiftKey: true });

    assert.dom('#buttonB').isFocused();
  });

  test('it supports the generic "submission" workflow by accepting a promise', async function (assert) {
    this.set('handleSubmit', async function () {
      assert.step('promise');
      return timeout(10);
    });

    // language=handlebars
    await render(hbs`
      <UiModal @title="Hello World" @testId="modal" @open={{true}} @onSubmit={{this.handleSubmit}} as |modal|>
        <p>Content Goes Here</p>
        {{modal.submitButton}}
      </UiModal>
    `);

    assert.dom('.modal-body button.btn').isVisible();
    assert.dom('.modal-body button.btn').hasText('Submit');

    const clickPromise = click('.modal-body button.btn');

    await waitFor('.modal-body button.btn:disabled');
    assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spinner');
    assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spin');

    assert.dom('.modal-header button.close').isDisabled();

    await clickPromise;

    assert.dom('[data-test-id="modal"]').doesNotExist();

    assert.verifySteps(['promise']);
  });

  test('it supports the generic "submission" workflow by accepting a concurrency task', async function (assert) {
    this.set(
      'taskWrapper',
      // eslint-disable-next-line ember/no-classic-classes
      EmberObject.extend({
        handleSubmit: task(function* () {
          assert.step('task');
          yield timeout(10);
          return true;
        }),
      }).create()
    );

    // language=handlebars
    await render(hbs`
      <UiModal
        @title="Hello World"
        @testId="modal"
        @open={{true}}
        @onSubmit={{this.taskWrapper.handleSubmit}}
      as |modal|>
        <p>Content Goes Here</p>
        {{modal.submitButton}}
      </UiModal>
    `);

    assert.dom('.modal-body button.btn').isVisible();
    assert.dom('.modal-body button.btn').hasText('Submit');

    const clickPromise = click('.modal-body button.btn');

    await waitFor('.modal-body button.btn:disabled');
    assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spinner');
    assert.dom('.modal-body button.btn span:nth-child(1)').hasClass('fa-spin');

    assert.dom('.modal-header button.close').isDisabled();

    await clickPromise;

    assert.dom('[data-test-id="modal"]').doesNotExist();

    assert.verifySteps(['task']);
  });

  test('it runs a "submission" workflow concurrency task as unlinked so it continues running even if the modal is destroyed', async function (assert) {
    this.set(
      'taskWrapper',
      // eslint-disable-next-line ember/no-classic-classes
      EmberObject.extend({
        handleSubmit: task(function* () {
          yield timeout(10);
          assert.step('task');
          return true;
        }),
      }).create()
    );

    // language=handlebars
    await render(hbs`
        <UiModal
          @title="Hello World"
          @testId="modal"
          @open={{true}}
          @onSubmit={{this.taskWrapper.handleSubmit}}
        as |modal|>
          <p>Content Goes Here</p>
          {{modal.submitButton}}
        </UiModal>
      `);

    const clickPromise = click('.modal-body button.btn');

    await waitFor('.modal-body button.btn:disabled');
    await clearRender();
    await clickPromise;

    assert.verifySteps(['task']);
  });
});
