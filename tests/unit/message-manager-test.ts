import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import MessageManager, { messageManager } from '@nsf-open/ember-ui-foundation/lib/MessageManager';
import { AlertLevel } from '@nsf-open/ember-ui-foundation/constants';

class TestClass {
  @messageManager()
  public declare readonly decoratorBuiltManager: MessageManager;

  @messageManager({ enableScrollTo: true })
  public declare readonly configuredDecoratorBuiltManager: MessageManager;
}

module('Unit | Lib | MessageManager', function (hooks) {
  setupTest(hooks);

  test('@messageManager decorator', function (assert) {
    const testInstance = new TestClass();

    assert.true(testInstance.decoratorBuiltManager instanceof MessageManager);
    assert.false(testInstance.decoratorBuiltManager.enableScrollTo);

    assert.true(testInstance.configuredDecoratorBuiltManager instanceof MessageManager);
    assert.true(testInstance.configuredDecoratorBuiltManager.enableScrollTo);
  });

  test('a single message can be added', async function (assert) {
    const manager = new MessageManager();

    let messageId = manager.addMessage(AlertLevel.INFO, '');

    assert.false(messageId, '');

    messageId = manager.addMessage(AlertLevel.INFO, 'Message A');

    assert.strictEqual(typeof messageId, 'string');

    const group = manager.getGroup(AlertLevel.INFO);
    const messageText = group ? [...group.messagesText.values()] : [];

    assert.strictEqual(group?.name, AlertLevel.INFO);
    assert.strictEqual(group?.messages.length, 1);
    assert.deepEqual(messageText, ['Message A']);

    assert.deepEqual(group?.messages?.[0], {
      id: messageId as string,
      message: 'Message A',
      escapeHTML: true,
      details: null,
      detailsOpen: false,
    });

    assert.true(manager.hasMessage('Message A', AlertLevel.INFO));
    assert.true(manager.hasMessage('Message A'));
  });

  test('adding a single message supports configurable options', function (assert) {
    const manager = new MessageManager();
    manager.enableDetails = true;

    const messageId = manager.addMessage(AlertLevel.INFO, 'Message A', {
      escape: false,
      details: 'More Content',
    });

    assert.deepEqual(manager.getGroup(AlertLevel.INFO)?.messages?.[0], {
      id: messageId as string,
      message: 'Message A',
      escapeHTML: false,
      details: 'More Content',
      detailsOpen: false,
    });
  });

  test('multiple messages can be added in sequence', function (assert) {
    const manager = new MessageManager();

    manager.addMessage(AlertLevel.INFO, 'Message A');
    manager.addMessage(AlertLevel.INFO, 'Message B');

    const group = manager.getGroup(AlertLevel.INFO);

    assert.strictEqual(group?.messages[0].message, 'Message A');
    assert.strictEqual(group?.messages[1].message, 'Message B');

    assert.true(manager.hasMessage('Message A'));
    assert.true(manager.hasMessage('Message B'));

    manager.addMessage(AlertLevel.INFO, 'Message C', { clearPrior: true });

    assert.strictEqual(group?.messages[0].message, 'Message C');
    assert.strictEqual(group?.messages.length, 1);

    assert.false(manager.hasMessage('Message A'));
    assert.false(manager.hasMessage('Message B'));
    assert.true(manager.hasMessage('Message C'));
  });

  test('multiple messages can be added in parallel', function (assert) {
    const manager = new MessageManager();

    let messageIds = manager.addMessagesMany(AlertLevel.INFO, []);

    assert.deepEqual(
      messageIds.map((id) => typeof id),
      []
    );

    messageIds = manager.addMessagesMany(AlertLevel.INFO, ['Message A', 'Message B']);

    assert.deepEqual(
      messageIds.map((id) => typeof id),
      ['string', 'string']
    );

    const group = manager.getGroup(AlertLevel.INFO);

    assert.strictEqual(group?.messages[0].message, 'Message A');
    assert.strictEqual(group?.messages[1].message, 'Message B');

    assert.true(manager.hasMessage('Message A'));
    assert.true(manager.hasMessage('Message B'));
  });

  test('adding multiple messages in parallel supports configurable options', function (assert) {
    const manager = new MessageManager();
    manager.enableDetails = true;

    const messageIds = manager.addMessagesMany(AlertLevel.INFO, ['Message A', 'Message B'], {
      escape: false,
    });

    const group = manager.getGroup(AlertLevel.INFO);

    assert.deepEqual(group?.messages?.[0], {
      id: messageIds[0],
      message: 'Message A',
      escapeHTML: false,
      details: null,
      detailsOpen: false,
    });

    assert.deepEqual(group?.messages?.[1], {
      id: messageIds[1],
      message: 'Message B',
      escapeHTML: false,
      details: null,
      detailsOpen: false,
    });

    manager.addMessagesMany(AlertLevel.INFO, ['Message C', 'Message D'], {
      clearPrior: true,
    });

    assert.false(manager.hasMessage('Message A'));
    assert.false(manager.hasMessage('Message B'));
    assert.strictEqual(group?.messages[0].message, 'Message C');
    assert.strictEqual(group?.messages[1].message, 'Message D');
  });

  test('a message can be removed via its id', function (assert) {
    const manager = new MessageManager();
    const messageId = manager.addMessage(AlertLevel.INFO, 'Message A') as string;

    assert.true(manager.hasMessage('Message A'));

    assert.false(manager.removeMessage(''));
    assert.false(manager.removeMessage('nope'));
    assert.true(manager.removeMessage(messageId));

    assert.false(manager.hasMessage('Message A'));
  });

  test('a message can be updated via its id', function (assert) {
    const manager = new MessageManager();
    manager.enableDetails = true;

    const messageId = manager.addMessage(AlertLevel.INFO, 'Message A') as string;
    const group = manager.getGroup(AlertLevel.INFO);

    assert.true(manager.hasMessage('Message A'), 'The manager has the message');

    assert.strictEqual(group?.messages[0].details, null);

    assert.false(manager.updateMessage('', 'Message B'), 'An id is required');
    assert.false(manager.updateMessage('nope', 'Message B'), 'A valid id is required');
    assert.true(manager.updateMessage(messageId, 'Message B', 'More Content'));

    assert.strictEqual(group?.messages[0].details, 'More Content');

    assert.false(manager.hasMessage('Message A'));
    assert.true(manager.hasMessage('Message B'));
  });

  test('whole message groups can be cleared of content', function (assert) {
    const manager = new MessageManager();

    manager.addMessage(AlertLevel.INFO, 'Info Message A');
    manager.addMessage(AlertLevel.ERROR, 'Error Message A');
    manager.addMessage(AlertLevel.WARNING, 'Warning Message A');
    manager.addMessage(AlertLevel.SUCCESS, 'Success Message A');
    manager.addMessage(AlertLevel.MUTED, 'Muted Message A');

    const infoGroup = manager.getGroup(AlertLevel.INFO);
    const errorGroup = manager.getGroup(AlertLevel.ERROR);
    const warningGroup = manager.getGroup(AlertLevel.WARNING);
    const successGroup = manager.getGroup(AlertLevel.SUCCESS);
    const mutedGroup = manager.getGroup(AlertLevel.MUTED);

    assert.strictEqual(infoGroup?.messages.length, 1);
    assert.strictEqual(errorGroup?.messages.length, 1);
    assert.strictEqual(warningGroup?.messages.length, 1);
    assert.strictEqual(successGroup?.messages.length, 1);
    assert.strictEqual(mutedGroup?.messages.length, 1);

    manager.clear(AlertLevel.INFO);

    assert.true(!!manager.getGroup(AlertLevel.INFO));
    assert.true(manager.isEmpty(AlertLevel.INFO));

    assert.false(manager.isEmpty(AlertLevel.ERROR));
    assert.false(manager.isEmpty(AlertLevel.WARNING));
    assert.false(manager.isEmpty(AlertLevel.SUCCESS));
    assert.false(manager.isEmpty(AlertLevel.MUTED));

    manager.clear([AlertLevel.ERROR, AlertLevel.WARNING]);

    assert.true(!!manager.getGroup(AlertLevel.ERROR));
    assert.true(!!manager.getGroup(AlertLevel.WARNING));

    assert.true(manager.isEmpty(AlertLevel.ERROR));
    assert.true(manager.isEmpty(AlertLevel.WARNING));

    assert.false(manager.isEmpty(AlertLevel.SUCCESS));
    assert.false(manager.isEmpty(AlertLevel.MUTED));

    manager.clear();

    assert.true(!!manager.getGroup(AlertLevel.SUCCESS));
    assert.true(!!manager.getGroup(AlertLevel.MUTED));

    assert.true(manager.isEmpty(AlertLevel.SUCCESS));
    assert.true(manager.isEmpty(AlertLevel.MUTED));
  });

  test('groups can be completely removed', function (assert) {
    const manager = new MessageManager();

    manager.addMessage(AlertLevel.INFO, 'Info Message A');
    manager.addMessage(AlertLevel.ERROR, 'Error Message A');

    assert.true(!!manager.getGroup(AlertLevel.INFO));
    assert.true(!!manager.getGroup(AlertLevel.ERROR));

    manager.removeGroup(AlertLevel.INFO);

    assert.false(!!manager.getGroup(AlertLevel.INFO));
    assert.true(!!manager.getGroup(AlertLevel.ERROR));
  });

  test('groups can be queried for whether they are empty or not', function (assert) {
    const manager = new MessageManager();

    assert.true(manager.isEmpty());

    manager.addMessage(AlertLevel.INFO, 'Message A');

    assert.false(manager.isEmpty());
    assert.false(manager.isEmpty(AlertLevel.INFO));

    assert.true(manager.isEmpty(AlertLevel.MUTED));
  });

  test('the addMessages method can be used to create one or more messages', function (assert) {
    const manager = new (class TestMessageManager extends MessageManager {
      public addMessage(
        groupName: AlertLevel,
        message: string,
        options: { details?: string | null; clearPrior?: boolean; escape?: boolean } = {}
      ) {
        assert.step('addMessage');
        assert.step(groupName);
        assert.step(message);

        return super.addMessage(groupName, message, options);
      }

      public addMessagesMany(
        groupName: AlertLevel,
        messages: string[],
        options: { clearPrior?: boolean; escape?: boolean } = {}
      ) {
        assert.step('addMessagesMany');
        assert.step(groupName);
        assert.step(messages.toString());

        return super.addMessagesMany(groupName, messages, options);
      }
    })();

    manager.addMessages(AlertLevel.INFO, 'Message A');
    manager.addMessages(AlertLevel.ERROR, ['Message B', 'Message C']);

    assert.verifySteps([
      'addMessage',
      AlertLevel.INFO,
      'Message A',
      'addMessagesMany',
      AlertLevel.ERROR,
      'Message B,Message C',
      'addMessage',
      AlertLevel.ERROR,
      'Message B',
      'addMessage',
      AlertLevel.ERROR,
      'Message C',
    ]);
  });

  test('the addSuccessMessages helper method adds messages to the success group', function (assert) {
    const manager = new MessageManager();

    manager.addSuccessMessages('Message A');
    manager.addSuccessMessages(['Message B', 'Message C']);

    const group = manager.getGroup(AlertLevel.SUCCESS);
    const messages = group ? [...group.messagesText.values()] : [];

    assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
  });

  test('the addErrorMessages helper method adds messages to the error group', function (assert) {
    const manager = new MessageManager();

    manager.addErrorMessages('Message A');
    manager.addErrorMessages(['Message B', 'Message C']);

    const group = manager.getGroup(AlertLevel.ERROR);
    const messages = group ? [...group.messagesText.values()] : [];

    assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
  });

  test('the addWarningMessages helper method adds messages to the warning group', function (assert) {
    const manager = new MessageManager();

    manager.addWarningMessages('Message A');
    manager.addWarningMessages(['Message B', 'Message C']);

    const group = manager.getGroup(AlertLevel.WARNING);
    const messages = group ? [...group.messagesText.values()] : [];

    assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
  });

  test('the addInfoMessages helper method adds messages to the informational group', function (assert) {
    const manager = new MessageManager();

    manager.addInfoMessages('Message A');
    manager.addInfoMessages(['Message B', 'Message C']);

    const group = manager.getGroup(AlertLevel.INFO);
    const messages = group ? [...group.messagesText.values()] : [];

    assert.deepEqual(messages, ['Message A', 'Message B', 'Message C']);
  });

  test('the addMessagesByGroup helper method adds messages via an object whose keys are group names', function (assert) {
    const manager = new MessageManager();

    manager.addMessagesByGroup({
      success: 'Message A',
      warning: ['Message B', 'Message C'],
    });

    const successGroup = manager.getGroup(AlertLevel.SUCCESS);
    const warningGroup = manager.getGroup(AlertLevel.WARNING);

    let successMessages = successGroup ? [...successGroup.messagesText.values()] : [];
    let warningMessages = warningGroup ? [...warningGroup.messagesText.values()] : [];

    assert.deepEqual(successMessages, ['Message A']);
    assert.deepEqual(warningMessages, ['Message B', 'Message C']);

    manager.addMessagesByGroup({ errors: 'Message D' }, { clearPrior: true });

    const errorGroup = manager.getGroup(AlertLevel.ERROR);
    const errorMessages = errorGroup ? [...errorGroup.messagesText.values()] : [];

    successMessages = successGroup ? [...successGroup.messagesText.values()] : [];
    warningMessages = warningGroup ? [...warningGroup.messagesText.values()] : [];

    assert.deepEqual(successMessages, []);
    assert.deepEqual(warningMessages, []);
    assert.deepEqual(errorMessages, ['Message D']);
  });

  test('the message helper method will add, update, or remove a message based on provided arguments', function (assert) {
    const manager = new MessageManager();

    const messageId = manager.message({
      message: 'Message A',
      groupName: AlertLevel.INFO,
    }) as string;

    assert.strictEqual(typeof messageId, 'string');
    assert.true(manager.hasMessage('Message A', AlertLevel.INFO));

    manager.message({ messageId, message: 'Message B' });

    assert.false(manager.hasMessage('Message A', AlertLevel.INFO));
    assert.true(manager.hasMessage('Message B', AlertLevel.INFO));

    manager.message({ messageId });

    assert.false(manager.hasMessage('Message B', AlertLevel.INFO));
  });
});
