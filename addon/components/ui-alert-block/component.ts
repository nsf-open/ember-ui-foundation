import type MessageManager from '@nsf/ui-foundation/lib/MessageManager';
import Component from '@ember/component';
import { layout, attribute } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { MessageEvents, getCorrectedAlertLevel } from '@nsf/ui-foundation/lib/MessageManager';
import { AlertLevelOrdering } from '@nsf/ui-foundation/constants';
import template from './template';

/**
 * @class UiAlertBlock
 */
@layout(template)
export default class UiAlertBlock extends Component {
  public static readonly positionalParams = ['manager'];

  public declare manager: MessageManager;

  @attribute('data-test-ident')
  public testId = 'context-message-block';

  @computed('manager.groups.[]')
  get sortedGroups() {
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
    this.manager.on(MessageEvents.MESSAGE_ADDED, this, 'onMessageAdded');
  }

  /**
   * @protected
   */
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    this.manager.off(MessageEvents.MESSAGE_ADDED, this, 'onMessageAdded');
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
