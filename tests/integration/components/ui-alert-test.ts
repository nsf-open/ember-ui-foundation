import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { getCorrectedAlertLevel } from '@nsf-open/ember-ui-foundation/lib/MessageManager';
import { AlertLevel, AlertGroups } from '@nsf-open/ember-ui-foundation/constants';

module('Integration | Component | ui-alert', function (hooks) {
  setupRenderingTest(hooks);

  test('its title text and iconography are correct for the supported alert types', function (assert) {
    assert.expect(4);

    assert.deepEqual(
      AlertGroups[AlertLevel.ERROR],
      { singular: 'ERROR:', plural: 'ERRORS:', icon: 'fa fa-exclamation-triangle' },
      'Correct for ERROR'
    );

    assert.deepEqual(
      AlertGroups[AlertLevel.WARNING],
      { singular: 'WARNING:', plural: 'WARNINGS:', icon: 'fa fa-exclamation-triangle' },
      'Correct for WARNING'
    );

    assert.deepEqual(
      AlertGroups[AlertLevel.SUCCESS],
      { singular: 'SUCCESS:', plural: 'SUCCESS:', icon: 'fa fa-check-circle-o' },
      'Correct for SUCCESS'
    );

    assert.deepEqual(
      AlertGroups[AlertLevel.INFO],
      { singular: 'INFORMATION:', plural: 'INFORMATION:', icon: 'fa fa-info-circle' },
      'Correct for INFORMATION'
    );
  });

  test('it will map numerous variant names to the supported types', function (assert) {
    assert.expect(11);

    assert.strictEqual(AlertLevel.ERROR, getCorrectedAlertLevel('danger'));
    assert.strictEqual(AlertLevel.ERROR, getCorrectedAlertLevel('errors'));
    assert.strictEqual(AlertLevel.ERROR, getCorrectedAlertLevel('error'));
    assert.strictEqual(AlertLevel.WARNING, getCorrectedAlertLevel('warnings'));
    assert.strictEqual(AlertLevel.WARNING, getCorrectedAlertLevel('warning'));
    assert.strictEqual(AlertLevel.SUCCESS, getCorrectedAlertLevel('successes'));
    assert.strictEqual(AlertLevel.SUCCESS, getCorrectedAlertLevel('success'));
    assert.strictEqual(AlertLevel.INFO, getCorrectedAlertLevel('secondary'));
    assert.strictEqual(AlertLevel.INFO, getCorrectedAlertLevel('info'));
    assert.strictEqual(AlertLevel.INFO, getCorrectedAlertLevel('information'));
    assert.strictEqual(AlertLevel.INFO, getCorrectedAlertLevel('informationals'));
  });

  test('it allows the default title text and iconography to be customized', async function (assert) {
    this.set('variant', 'success');
    this.set('alertGroups', { [AlertLevel.WARNING]: { singular: 'DANGER WILL ROBINSON:' } });

    // language=handlebars
    await render(hbs`
        <UiAlert
          @variant={{this.variant}}
          @alertGroups={{this.alertGroups}}
          @content="Lorem Ipsum"
        />
    `);

    assert.dom('[data-test-id="label"]').hasText('SUCCESS:');

    this.set('variant', 'warning');

    assert.dom('[data-test-id="label"]').hasText('DANGER WILL ROBINSON:');
  });

  test('it renders a single string message', async function (assert) {
    await render(hbs`{{ui-alert "error" "This is an error message"}}`);

    assert.dom('[data-test-id="label"]').hasText('ERROR:');
    assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
    assert.dom('[data-test-ident="context-message-item"]').hasText('This is an error message');
  });

  test('it renders an array with one string message', async function (assert) {
    this.set('messages', ['This is an error message']);
    await render(hbs`{{ui-alert "error" this.messages}}`);

    assert.dom('[data-test-id="label"]').hasText('ERROR:');
    assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
    assert.dom('[data-test-ident="context-message-item"]').hasText('This is an error message');
  });

  test('it renders an array with multiple string messages', async function (assert) {
    this.set('messages', ['This is an error message', 'This is another error message']);
    await render(hbs`{{ui-alert "error" this.messages}}`);

    assert.dom('[data-test-id="label"]').hasText('ERRORS:');
    assert.dom('[data-test-ident="context-message-item"]:nth-child(1)').hasTagName('li');
    assert
      .dom('[data-test-ident="context-message-item"]:nth-child(1)')
      .hasText('This is an error message');
    assert.dom('[data-test-ident="context-message-item"]:nth-child(2)').hasTagName('li');
    assert
      .dom('[data-test-ident="context-message-item"]:nth-child(2)')
      .hasText('This is another error message');
  });

  test('it supports generic block content', async function (assert) {
    await render(hbs`
			{{#ui-alert "error" as |alert|}}
				<p>{{alert.title}} <span data-test-ident="context-message-item">This is a custom error message</span></p>
			{{/ui-alert}}
		`);

    assert.dom('[data-test-id="label"]').hasText('ERROR:');
    assert.dom('[data-test-ident="context-message-item"]').hasTagName('span');
    assert
      .dom('[data-test-ident="context-message-item"]')
      .hasText('This is a custom error message');

    await render(hbs`
			{{#ui-alert "error" as |alert|}}
				{{alert.title plural=true}}
				<ul>
					<li data-test-ident="context-message-item">This is a custom error message</li>
					<li data-test-ident="context-message-item">This is another custom error message</li>
				</ul>
			{{/ui-alert}}
		`);

    assert.dom('[data-test-id="label"]').hasText('ERRORS:');
    assert
      .dom('[data-test-ident="context-message-item"]:nth-child(1)')
      .hasText('This is a custom error message');
    assert
      .dom('[data-test-ident="context-message-item"]:nth-child(2)')
      .hasText('This is another custom error message');
  });
});
