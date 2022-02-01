import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import MessageManager from '@nsf/ui-foundation/lib/MessageManager';

module('Integration | Component | ui-alert-block', function (hooks) {
  setupRenderingTest(hooks);

  const rootSelector = '[data-test-ident="context-message-block"]';
  const errorBlockSelector = '[data-test-ident="context-message-danger"]';
  const warningBlockSelector = '[data-test-ident="context-message-warning"]';
  const successBlockSelector = '[data-test-ident="context-message-success"]';
  const infoBlockSelector = '[data-test-ident="context-message-secondary"]';
  const mutedBlockSelector = '[data-test-ident="context-message-muted"]';
  const labelSelector = '[data-test-id="label"]';
  const itemSelector = '[data-test-ident="context-message-item"]';

  test('it generates an ordered list of alert blocks based on the input of a message manager', async function (assert) {
    const manager = new MessageManager();
    this.set('manager', manager);

    // language=hbs
    await render(hbs`<UiAlertBlock @manager={{this.manager}} />`);

    assert.dom(rootSelector).exists();
    assert.dom(errorBlockSelector).doesNotExist();
    assert.dom(warningBlockSelector).doesNotExist();
    assert.dom(successBlockSelector).doesNotExist();
    assert.dom(infoBlockSelector).doesNotExist();
    assert.dom(mutedBlockSelector).doesNotExist();

    manager.addInfoMessages('Info Message A');
    await settled();

    assert.dom(infoBlockSelector).isVisible();
    assert.dom(`${infoBlockSelector} ${labelSelector}`).hasText('INFORMATION:');
    assert.dom(`${infoBlockSelector} ${itemSelector}`).hasText('Info Message A');

    const [successMessageId] = manager.addSuccessMessages('Success Message A');
    manager.addWarningMessages('Warning Message A');
    manager.addErrorMessages('Error Message A');
    await settled();

    assert.dom(successBlockSelector).isVisible();
    assert.dom(`${successBlockSelector} ${labelSelector}`).hasText('SUCCESS:');
    assert.dom(`${successBlockSelector} ${itemSelector}`).hasText('Success Message A');

    assert.dom(warningBlockSelector).isVisible();
    assert.dom(`${warningBlockSelector} ${labelSelector}`).hasText('WARNING:');
    assert.dom(`${warningBlockSelector} ${itemSelector}`).hasText('Warning Message A');

    assert.dom(errorBlockSelector).isVisible();
    assert.dom(`${errorBlockSelector} ${labelSelector}`).hasText('ERROR:');
    assert.dom(`${errorBlockSelector} ${itemSelector}`).hasText('Error Message A');

    const blocks = findAll(`${rootSelector} > div.alert`);
    const order = blocks
      .map((block) => block.className.match(/alert-(\w+)/))
      .map((matches) => (matches ? matches[1] : ''));

    assert.deepEqual(
      order,
      ['danger', 'warning', 'secondary', 'success'],
      'The alert block order is correct'
    );

    manager.addWarningMessages('Warning Message B');
    await settled();

    assert.dom(`${warningBlockSelector} ${labelSelector}`).hasText('WARNINGS:');
    assert.dom(`${warningBlockSelector} ${itemSelector}:nth-child(1)`).hasText('Warning Message A');
    assert.dom(`${warningBlockSelector} ${itemSelector}:nth-child(2)`).hasText('Warning Message B');

    manager.updateMessage(successMessageId, 'Success Message B');
    await settled();

    assert.dom(`${successBlockSelector} ${labelSelector}`).hasText('SUCCESS:');
    assert.dom(`${successBlockSelector} ${itemSelector}`).hasText('Success Message B');
  });
});
