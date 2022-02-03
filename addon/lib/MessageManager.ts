import type NativeArray from '@ember/array/-private/native-array';
import { computed, setProperties } from '@ember/object';
import { sendEvent } from '@ember/object/events';
import { guidFor } from '@ember/object/internals';
import { A, isArray } from '@ember/array';
import { debounce } from '@ember/runloop';
import { AlertLevel, AlertLevelAlternates, AlertLevelKeys, AlertLevelOrdering } from '../constants';

interface Message {
  id: string;
  message: string;
  escapeHTML: boolean;
  details: string | null;
  detailsOpen: boolean;
}

interface MessageGroup {
  name: AlertLevel;
  messages: NativeArray<Message>;
  messagesText: Set<string>;
  clear: () => void;
}

type StringOrStringArray = string | string[];

export type MessageMetadata = {
  hasSuccesses: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  hasInformationals: boolean;
  warnings: string[];
  errors: string[];
  successes: string[];
  informationals: string[];
};

function isArrayLike<T = unknown>(obj: unknown): obj is Array<T> {
  return isArray(obj);
}

export function getCorrectedAlertLevel(name: string) {
  const normalized = AlertLevelAlternates[name] || name;
  return AlertLevelOrdering.indexOf(normalized) > -1 ? (normalized as AlertLevel) : null;
}

export type MessageHash = Partial<Record<AlertLevelKeys, StringOrStringArray>>;

export enum MessageEvents {
  MESSAGE_ADDED = 'received',
}

/*
 * Computed macro to create a MessageManager instance.
 *
 * @param {{enableScrollTo?: boolean}} [options]
 */
export const messageManager = function (options: { enableScrollTo?: boolean } = {}) {
  return computed(function () {
    const manager = new MessageManager();

    if (options.enableScrollTo) {
      manager.enableScrollTo = true;
    }

    return manager;
  });
};

/**
 * The MessageManager acts as the interface for a UiAlertBlock.
 * Messages can be added, updated, and/or removed from an instance of this class, and the component
 * that it is attached to will update in response.
 *
 * @class MessageManager
 */
export default class MessageManager {
  public enableDetails = false;

  /**
   * If true, the ui-alert-block that is rendering the contents of this instance will be scrolled
   * into view when the content changes.
   *
   * @property enableScrollTo
   * @type {boolean}
   */
  public enableScrollTo = false;

  /**
   * An array of `group` objects. A group can be thought of as the "type" or "severity" of the messages
   * put into it (really though, these are arbitrary). By default, four groups are created for a new
   * instance of this class: `error`, `warning`, `information`, and `success`. The configuration for
   * each corresponds to the Bootstrap CSS "alert" banner: `alert-danger`, `alert-warning`,
   * `alert-secondary`, and `alert-success`.
   *
   * @property groups
   * @type MutableArray<MessageGroup>
   */
  public readonly groups: NativeArray<MessageGroup>;

  constructor() {
    this.groups = A<MessageGroup>();
  }

  /**
   * Retrieves the MessageGroup with the given name.
   *
   * @method getGroup
   *
   * @param {AlertLevel} name
   *
   * @return {MessageGroup | null}
   */
  public getGroup(name: AlertLevel) {
    return this.groups.findBy('name', name);
  }

  /**
   * Adds a new MessageGroup if one with the given name does not already exist.
   *
   * @method addGroup
   *
   * @param {AlertLevel} name
   *
   * @return {MessageGroup}
   */
  public addGroup(name: AlertLevel) {
    let group = this.getGroup(name);

    if (!group) {
      group = {
        name,
        messages: A<Message>(),
        messagesText: new Set<string>(),

        clear() {
          this.messages.clear();
          this.messagesText.clear();
        },
      };

      this.groups.pushObject(group);
    }

    return group;
  }

  /**
   * Does what it says. If a MessageGroup with the given name exists then it will be
   * returned, otherwise one will be created.
   *
   * @method getOrAddGroup
   *
   * @param {AlertLevel} name
   *
   * @return {MessageGroup}
   */
  public getOrAddGroup(name: AlertLevel) {
    return this.getGroup(name) || this.addGroup(name);
  }

  /**
   * Removes the MessageGroup with the given name.
   *
   * @method removeGroup
   *
   * @param {AlertLevel} name
   *
   * @return {boolean}
   */
  public removeGroup(name: AlertLevel) {
    const group = this.getGroup(name);

    if (group) {
      group.clear();
      this.groups.removeObject(group);
    }

    return !!group;
  }

  /**
   * Check whether this MessageManager has the specified message string.
   * If a group is provided, only that provided group is checked;
   * else, all groups are checked.
   *
   * @method hasMessage
   *
   * @param {string} messageText     - The text of the message to check
   * @param {AlertLevel} groupName   - The group to look in, or `null` to look in all groups
   *
   * @return {boolean} Does this MessageManager have the specified message?
   *
   * @author  charvey@associates.nsf.gov
   * @updated 2019-12-19
   */
  public hasMessage(messageText: string, groupName: AlertLevel | null = null) {
    return groupName
      ? !!this.getGroup(groupName)?.messagesText.has(messageText)
      : !!this.groups.find((group) => group.messagesText.has(messageText));
  }

  /**
   * Create a Message and add it to the named MessageGroup
   *
   * @method addMessage
   *
   * @param {AlertLevel}  groupName          The name of the MessageGroup to add the new message to.
   * @param {string}      message            The text content of the message.
   *
   * @param {object}      [options]
   * @param {string}      [options.details=null]     Additional content to ride along with the message.
   * @param {boolean}     [options.clearPrior=false] Whether or not current messages in the group should be cleared before adding.
   * @param {boolean}     [options.escape=true]      Whether or not to HTML escape the contents of `message`.
   *
   * @return {string|boolean}
   */
  public addMessage(
    groupName: AlertLevel,
    message: string,
    options: { details?: string | null; clearPrior?: boolean; escape?: boolean } = {}
  ) {
    if (groupName && message) {
      const group = this.getOrAddGroup(groupName);

      const opts = Object.assign(
        {
          details: null,
          clearPrior: false,
          escape: true,
        },
        options
      );

      if (group) {
        if (opts.clearPrior) {
          group.clear();
        }

        const messageId = `${groupName}-${guidFor(message)}`;

        const newMessage: Message = {
          message,
          id: messageId,
          escapeHTML: opts.escape,
          details: this.enableDetails ? opts.details : null,
          detailsOpen: false,
        };

        group.messages.addObject(newMessage);
        group.messagesText.add(message);

        this._scheduleTriggerEvent(MessageEvents.MESSAGE_ADDED);

        return messageId;
      }
    }

    return false;
  }

  /**
   * Add many simple messages to a group.
   *
   * @method addMessagesMany
   *
   * @param {AlertLevel}  groupName - The name of the group to add to
   * @param {string}      messages  - An array of string messages
   * @param {object}      [options]
   * @param {boolean}     [options.clearPrior]
   * @param {boolean}     [options.escape=true] - Whether to HTML escape the contents of `message`.
   *
   * @return {string[]}
   *
   * @author  charvey@associates.nsf.gov
   * @updated 2019-12-19
   */
  public addMessagesMany(
    groupName: AlertLevel,
    messages: string[],
    options: { clearPrior?: boolean; escape?: boolean } = {}
  ): string[] {
    if (isArrayLike(messages)) {
      if (options?.clearPrior) {
        this.getGroup(groupName)?.clear();
      }

      return messages
        .map((message) => this.addMessage(groupName, message, { escape: options.escape }))
        .filter(Boolean) as string[];
    }

    return [];
  }

  /**
   * A convenience method which calls either `addMessage` or `addMessagesMany` depending
   * on the provided argument being a single string or array of strings.
   *
   * @method addMessages
   *
   * @param {AlertLevel}  groupName - The name of the group to add to
   * @param {string}      messages  - A single string or array of string messages
   * @param {object}      [options]
   * @param {boolean}     [options.clearPrior]
   *
   * @return {string[]}
   */
  public addMessages(groupName: AlertLevel, messages: StringOrStringArray, options = {}) {
    if (typeof messages === 'string') {
      const id = this.addMessage(groupName, messages, options);
      return id ? [id] : [];
    } else if (Array.isArray(messages)) {
      return this.addMessagesMany(groupName, messages, options);
    }

    return [];
  }

  /**
   * Given a hash of AlertLevel keys, and string or string array values each value will be mapped
   * to it's keyed message group.
   *
   * @method addMessagesByGroup
   *
   * @param {MessageHash} obj
   * @param {object}      [options]
   * @param {boolean}     [options.clearPrior]
   */
  public addMessagesByGroup(obj: MessageHash, options: { clearPrior?: boolean } = {}) {
    if (options?.clearPrior) {
      this.clear();
    }

    if (obj) {
      Object.keys(obj).forEach((key: keyof MessageHash) => {
        const groupName = getCorrectedAlertLevel(key);

        if (groupName) {
          const content = obj[key];

          if (content) {
            this.addMessages(groupName, content);
          }
        }
      });
    }
  }

  /**
   * Added one or more messages to the success group.
   *
   * @method addSuccessMessages
   *
   * @param {StringOrStringArray} messages
   * @param {object}              [options]
   * @param {boolean}             [options.clearPrior]
   *
   * @return {string[]}
   */
  public addSuccessMessages(messages: StringOrStringArray, options: { clearPrior?: boolean } = {}) {
    return this.addMessages(AlertLevel.SUCCESS, messages, options);
  }

  /**
   * Added one or more messages to the warning group.
   *
   * @method addWarningMessages
   *
   * @param {StringOrStringArray} messages
   * @param {object}              [options]
   * @param {boolean}             [options.clearPrior]
   *
   * @return {string[]}
   */
  public addWarningMessages(messages: StringOrStringArray, options: { clearPrior?: boolean } = {}) {
    return this.addMessages(AlertLevel.WARNING, messages, options);
  }

  /**
   * Added one or more messages to the error group.
   */
  public addErrorMessages(messages: StringOrStringArray, options: { clearPrior?: boolean } = {}) {
    return this.addMessages(AlertLevel.ERROR, messages, options);
  }

  /**
   * Added one or more messages to the info group.
   */
  public addInfoMessages(messages: StringOrStringArray, options: { clearPrior?: boolean } = {}) {
    return this.addMessages(AlertLevel.INFO, messages, options);
  }

  /**
   * Updates an existing Message with new content.
   */
  public updateMessage(messageId: string, newMessage: string, newDetails: string | null = null) {
    if (messageId) {
      const [groupName] = messageId.split('-');
      const group = this.getGroup(groupName as AlertLevel);

      if (group) {
        const msgObj = group.messages.findBy('id', messageId);

        if (msgObj) {
          const enableDetails = this.enableDetails;
          const oldMessage = msgObj.message;

          setProperties(msgObj, {
            message: newMessage,
            details: enableDetails ? newDetails : null,
            detailsOpen: enableDetails && !!newDetails && msgObj.detailsOpen,
          });

          group.messagesText.delete(oldMessage);
          group.messagesText.add(newMessage);

          return true;
        }
      }
    }

    return false;
  }

  /**
   * Removes the message with the given ID. IDs are provided for each message when calling
   * `.addMessage()` and `.addMessagesMany()`.
   */
  public removeMessage(messageId: string) {
    if (messageId) {
      const [groupName] = messageId.split('-');
      const group = this.getGroup(groupName as AlertLevel);

      if (group) {
        const messageObj = group.messages.findBy('id', messageId);

        if (messageObj) {
          group.messages.removeObject(messageObj);
          group.messagesText.delete(messageObj.message);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * A one-stop shop convenience method that will add, update, or remove a message based on the provided
   * arguments hash.
   *
   * messageId == null AND message != null THEN add new message (will also require `groupName` to be provided)
   * messageId != null AND message == null THEN remove message
   * messageId != null AND message != null THEN update message
   */
  public message(
    options: { messageId?: string; groupName?: AlertLevel; message?: string; details?: string } = {}
  ) {
    const { messageId, groupName, message, details } = options;

    if (typeof messageId === 'string') {
      if (typeof message === 'string') {
        this.updateMessage(messageId, message);
        return messageId;
      } else {
        this.removeMessage(messageId);
      }
    } else if (typeof groupName === 'string' && typeof message === 'string') {
      return this.addMessage(groupName, message, { details });
    }

    return null;
  }

  /**
   * Check whether a given group is empty (has no messages). If no group is given,
   * check all groups.
   */
  public isEmpty(groupName?: AlertLevel) {
    return groupName
      ? (this.getGroup(groupName)?.messages.length ?? 0) === 0
      : this.groups.every((group) => group.messages.length === 0);
  }

  /**
   * Empty the MessageGroup with the given name(s), or all groups.
   */
  public clear(groupName?: AlertLevel | AlertLevel[]) {
    if (isArrayLike(groupName)) {
      groupName.forEach((name) => this.getGroup(name)?.clear());
    } else if (typeof groupName === 'string') {
      this.getGroup(groupName)?.clear();
    } else if (!groupName) {
      this.groups.forEach((group) => group.clear());
    }
  }

  private _scheduleTriggerEvent(name: MessageEvents) {
    debounce(this, this._triggerEvent, name, 100);
  }

  private _triggerEvent(name: MessageEvents) {
    sendEvent(this, name);
  }
}
