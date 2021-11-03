import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { Promise } from 'rsvp';
import silenceExceptions from 'dummy/tests/helpers/silence-exceptions';
import { render, clearRender, settled } from '@ember/test-helpers';

module('Integration | Component | ui-async-block', function (hooks) {
  setupRenderingTest(hooks);

  function resolvingPromise(ms = 50, payload?: unknown) {
    return new Promise((resolve) => setTimeout(() => resolve(payload), ms));
  }

  function rejectingPromise(ms = 50, payload?: unknown) {
    return new Promise((_, reject) => setTimeout(() => reject(payload), ms));
  }

  test('it renders content when not given a promise', async function (assert) {
    await render(hbs`
      {{#ui-async-block}}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
    `);

    assert.dom('[data-test-content]').isVisible();
    assert.dom('[data-test-content]').hasText('Hello World');
  });

  test('it handles a resolved promised', async function (assert) {
    const promise = this.set('promise', resolvingPromise());

    // language=handlebars
    await render(hbs`
      <UiAsyncBlock @promise={{this.promise}}>
        <p data-test-content>Hello World</p>
      </UiAsyncBlock>
    `);

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');

    await promise;
    await settled();

    assert.dom('[data-test-content]').isVisible();
    assert.dom('[data-test-content]').hasText('Hello World');
  });

  test('it yields the resolved result to its content block', async function (assert) {
    const promise = this.set('promise', resolvingPromise(50, '1234'));

    await render(hbs`
			{{#ui-async-block promise=this.promise as |promiseResult|}}
				<p data-test-content>{{promiseResult}}</p>
			{{/ui-async-block}}
		`);

    await promise;
    await settled();

    assert.dom('[data-test-content]').isVisible();
    assert.dom('[data-test-content]').hasText('1234');
  });

  test('it handles a rejected promise', async function (assert) {
    const promise = this.set('promise', rejectingPromise());

    await render(hbs`
			{{#ui-async-block promise=this.promise}}
				<p data-test-content>Hello World</p>
			{{/ui-async-block}}
		`);

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');

    await silenceExceptions(async () => {
      await promise;
    });

    assert.dom('[data-test-id="error-block"]').isVisible();
    assert.dom('[data-test-id="error-block"]').hasText('An Error Has Occurred');
    assert
      .dom('[data-test-id="error-block"] p:nth-child(1) span')
      .hasClass('fa-exclamation-triangle');
  });

  test('it handles a promise that resolves something "empty"', async function (assert) {
    const promise = this.set('promise', resolvingPromise());

    await render(hbs`
      {{#ui-async-block promise=this.promise noResults=true}}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
    `);

    assert.dom('[data-test-id="load-indicator"]').isVisible();
    assert.dom('[data-test-id="load-indicator"]').hasText('Loading...');

    await promise;
    await settled();

    assert.dom('[data-test-id="no-results-block"]').isVisible();
    assert.dom('[data-test-id="no-results-block"]').hasText('No Content Is Available');
  });

  test('it generates customized messages based on a provided "name"', async function (assert) {
    let promise = this.set('promise', resolvingPromise());

    await render(hbs`
      {{#ui-async-block "Witty Catchphrases" promise=this.promise noResults=true}}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
    `);

    assert.dom('[data-test-id="load-indicator"]').hasText('Loading Witty Catchphrases');

    await promise;
    await settled();

    assert
      .dom('[data-test-id="no-results-block"]')
      .hasText('No Witty Catchphrases have been added');

    await clearRender();

    promise = this.set('promise', rejectingPromise());

    await render(hbs`
      {{#ui-async-block "Witty Catchphrases" promise=this.promise}}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
    `);

    await silenceExceptions(async () => {
      await promise;
    });

    assert.dom('[data-test-id="error-block"]').hasText('Could not retrieve Witty Catchphrases');
  });

  test('it shows fully custom message strings when provided', async function (assert) {
    let promise = this.set('promise', resolvingPromise());

    await render(hbs`
      {{#ui-async-block "Witty Catchphrases"
        promise          = this.promise
        noResults        = true
        pendingMessage   = "Foo"
        noResultsMessage = "Bar"
        rejectedMessage  = "Baz"
      }}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
     `);

    assert.dom('[data-test-id="load-indicator"]').hasText('Foo');

    await promise;
    await settled();

    assert.dom('[data-test-id="no-results-block"]').hasText('Bar');

    await clearRender();

    promise = this.set('promise', rejectingPromise());

    await render(hbs`
      {{#ui-async-block "Witty Catchphrases"
        promise          = this.promise
        pendingMessage   = "Foo"
        rejectedMessage  = "Baz"
      }}
        <p data-test-content>Hello World</p>
      {{/ui-async-block}}
    `);

    await silenceExceptions(async () => {
      await promise;
    });

    assert.dom('[data-test-id="error-block"]').hasText('Baz');
  });

  test('it shows fully custom messages via function when provided', async function (assert) {
    let promise = this.set('promise', resolvingPromise());

    this.set('pendingMessageFunction', function (name: string) {
      return `Pending a response for ${name}`;
    });

    this.set('rejectedMessageFunction', function (name: string) {
      return `The request for ${name} failed`;
    });

    this.set('noResultsMessageFunction', function (name: string) {
      return `No results returned for ${name}`;
    });

    // language=handlebars
    await render(hbs`
      <UiAsyncBlock
        @name="Witty Catchphrases"
        @promise={{this.promise}}
        @noResults={{true}}
        @pendingMessage={{this.pendingMessageFunction}}
        @noResultsMessage={{this.noResultsMessageFunction}}
        @rejectedMessage={{this.rejectedMessageFunction}}
      >
        <p data-test-content>Hello World</p>
      </ UiAsyncBlock>
    `);

    assert
      .dom('[data-test-id="load-indicator"]')
      .hasText('Pending a response for Witty Catchphrases');

    await promise;
    await settled();

    assert
      .dom('[data-test-id="no-results-block"]')
      .hasText('No results returned for Witty Catchphrases');

    await clearRender();

    promise = this.set('promise', rejectingPromise());

    // language=handlebars
    await render(hbs`
      <UiAsyncBlock
        @name="Witty Catchphrases"
        @promise={{this.promise}}
        @pendingMessage={{this.pendingMessageFunction}}
        @rejectedMessage={{this.rejectedMessageFunction}}
      >
        <p data-test-content>Hello World</p>
      </ UiAsyncBlock>
    `);

    await silenceExceptions(async () => {
      await promise;
    });

    assert.dom('[data-test-id="error-block"]').hasText('The request for Witty Catchphrases failed');
  });
});
