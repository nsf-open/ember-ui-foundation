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
 * UiSorterCriterion is a tagless component whose job is to act as an interface
 * between the Handlebars template and the Sorter. Under the hood, this component
 * creates a SortRule instance and passes through most attribute to it.
 *
 * @yields {number | undefined} index  - The 1's-based index of where the rule sits in the sort
 *                                       priority. As rules are turned on they are pushed onto
 *                                       the back of the priority queue. As they are turned off
 *                                       (sort "none") they get removed from the queue.
 * @yields {string} direction          - The current direction of the sort. Will always be one of
 *                                       "ascending", "descending", or "none".
 * @yields {string} nextDirection      - The next up direction that will be cycled to if the
 *                                       `cycleDirection` method is called. The cycle order is "none"
 *                                       -> "ascending" -> "descending" -> "none". This value will
 *                                       always be one ahead of `direction` and is mostly useful for
 *                                       building good ARIA support.
 * @yields {string} displayName        - Either the `name` value provided, or a title-cased version
 *                                       of the `propertyName` being sorted. Mostly useful for
 *                                       building good ARIA support.
 * @yields {string} iconClass          - One of either "fa-sort", "fa-sort-asc", or "fa-sort-desc"
 *                                       in step with the current direction.
 * @yields {() => void} cycleDirection - A method suitable for providing as an event listener, e.g.
 *                                       `<button onclick={{Criterion.cycleDirection}}>`, this will
 *                                       cause the sort `direction` to move forward to its next value.
 *
 * @class UiSorterCriterion
 */
@tagName('')
@layout(template)
export default class UiSorterCriterion extends Component {
  public static readonly positionalParams = ['sortOn', 'direction'];

  /**
   * A human-friendly name for the sort. Mostly useful for building good ARIA support.
   */
  @alias('rule.name')
  public declare name: SortRule['name'];

  /**
   * The property name of the objects within the target recordset whose value will
   * be sorted on. This may be a _dot.separated.value_ to target nested object properties.
   */
  @alias('rule.sortOn')
  public declare sortOn: SortRule['sortOn'];

  /**
   * The direction of the sort when the component is first rendered. Can be one of
   * "ascending", "descending", or (the default) "none".
   */
  @alias('rule.direction')
  public declare direction: SortRule['direction'];

  /**
   * An optional string to provide second, third, to _N_-th order child sorts. Multiple
   * values can be provided via a comma separated list. E.g. `@subSortOn="firstName,middleName,phoneNumber"`.
   * Sorts will be processed in the order that they are provided.
   *
   * Imagine a long list of names where many of the last names were all _"Smith"_. It might
   * be convenient to end-users to automatically sort on first names after the round of last
   * name sorting so that all the _"Smith"_ records are easier to scan.
   */
  @alias('rule.subSortOn')
  public declare subSortOn: SortRule['subSortOn'];

  /**
   * By default, the direction of all sub-sorts follow the direction of the primary sort. If
   * the direction of the sub-sort needs to be fixed, then that fixed direction can be provided
   * via this attribute. Multiple values can be provided via a comma separated list, and are
   * mapped to each `subSortOn` in the order they are provided.
   */
  @alias('rule.subSortDirection')
  public declare subSortDirection: SortRule['subSortDirection'];

  @alias('rule.threeStepCycle')
  protected declare threeStepCycle: SortRule['threeStepCycle'];

  protected declare onUpdate: (rule: SortRule) => void;

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
