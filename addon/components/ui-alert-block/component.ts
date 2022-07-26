import type MessageManager from '@nsf-open/ember-ui-foundation/lib/MessageManager';
import type { MessageGroup } from '@nsf-open/ember-ui-foundation/lib/MessageManager';
import Component from '@ember/component';
import { layout, attribute } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { MessageEvents, getCorrectedAlertLevel } from '@nsf-open/ember-ui-foundation/lib/MessageManager';
import { AlertLevelOrdering } from '@nsf-open/ember-ui-foundation/constants';
import template from './template';

/**
 * A UiAlertBlock will create a stack of UiAlert components based on the inputs provided
 * to a MessageManager instance.
 *
 * ```handlebars
 *
 * <UiAlertBlock @manager={{this.messages}} />
 * ```
 *
 * ```ts
 * import type { MessageManager } from '@nsf-open/ember-ui-foundation';
 * import { messageManager } from '@nsf-open/ember-ui-foundation';
 * // ...
 * @messageManager()
 * declare readonly messages: MessageManager;
 * ```
 */
@layout(template)
export default class UiAlertBlock extends Component {
  public static readonly positionalParams = ['manager'];

  /**
   * The MessageManager instance that will be used by this component to generate
   * alert blocks.
   */
  public declare manager: MessageManager;

  /**
   * The data-test-id attribute for this element, if required.
   */
  @attribute('data-test-ident')
  public testId = 'context-message-block';

  @computed('manager.groups.[]')
  get sortedGroups(): MessageGroup[] {
    const groups = this.manager.groups;

    return groups.sort(function (a, b) {
      const correctA = getCorrectedAlertLevel(a.name);
      const correctB = getCorrectedAlertLevel(b.name);

      const aIdx = correctA ? AlertLevelOrdering.indexOf(correctA) : 0;
      const bIdx = correctB ? AlertLevelOrdering.indexOf(correctB) : 0;

      return aIdx - bIdx;
    });
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();
    addListener(this.manager, MessageEvents.MESSAGE_ADDED, this, this.onMessageAdded);
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    removeListener(this.manager, MessageEvents.MESSAGE_ADDED, this, this.onMessageAdded);
    super.willDestroyElement();
  }

  /**
   * @protected
   */
  onMessageAdded() {
    if (this.manager.enableScrollTo) {
      this.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
