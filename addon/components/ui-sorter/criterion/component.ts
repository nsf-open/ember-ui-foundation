import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed, set } from '@ember/object';
import { alias } from '@ember/object/computed';

import { SortOrder } from '../../../constants';
import SortRule from '../../../lib/SortRule';
import template from './template';

const IconClassNames = {
  [SortOrder.NONE]: 'fa-sort',
  [SortOrder.ASC]: 'fa-sort-asc',
  [SortOrder.DESC]: 'fa-sort-desc',
};

/**
 * @class UiSorterCriterion
 */
@tagName('')
@layout(template)
export default class UiSorterCriterion extends Component {
  public static readonly positionalParams = ['sortOn', 'direction'];

  @alias('rule.name')
  public declare name: SortRule['name'];

  @alias('rule.sortOn')
  public declare sortOn: SortRule['sortOn'];

  @alias('rule.direction')
  public declare direction: SortRule['direction'];

  @alias('rule.subSortOn')
  public declare subSortOn: SortRule['subSortOn'];

  @alias('rule.subSortDirection')
  public declare subSortDirection: SortRule['subSortDirection'];

  @alias('rule.threeStepCycle')
  public declare threeStepCycle: SortRule['threeStepCycle'];

  public declare onUpdate: (rule: SortRule) => void;

  @computed('direction')
  public get iconClass() {
    return IconClassNames[this.direction];
  }

  @action
  public cycleDirection() {
    this.rule.updateToNextSortDirection();
    this.onUpdate(this.rule);
  }

  private rule = new SortRule();

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    if (this.rule.enabled) {
      this.onUpdate(this.rule);
    }
  }

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    set(this.rule, 'direction', SortOrder.NONE);
    this.onUpdate(this.rule);
    super.willDestroyElement();
  }
}
