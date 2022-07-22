import type NativeArray from '@ember/array/-private/native-array';
import type SortRule from '../../lib/SortRule';

import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed, set } from '@ember/object';
import { A, isArray } from '@ember/array';
import { next } from '@ember/runloop';

import { SortOrder } from '../../constants';
import { sortArrayWithRules } from '../../utils';
import template from './template';

/**
 *
 */
function defaultSortDescription(rules: SortRule[]) {
  if (!rules.length) {
    return 'No sorting has been applied';
  }

  const messages = rules
    .map((rule) => (rule.enabled ? `${rule.displayName} ${rule.direction}` : null))
    .filter(Boolean);

  return `Sorted on ${messages.join(', ')}`;
}

/**
 * The UiSorter provides an easy mechanism for multidimensional sorting of a recordset.
 *
 * ```handlebars
 * {{!-- This example shows a table whose Last Name column is sortable --}}
 *
 * <UiSorter @records={{this.records}} as |Sorter|>
 *   <p>{{Sorter.description}}</p>
 *
 *   <table class="table">
 *     <thead>
 *       <tr>
 *         <th>First Name</th>
 *
 *         <Sorter.Criterion @sortOn="lastName" as |Criterion|>
 *           <th onclick={{Criterion.cycleDirection}} aria-sort="{{Criterion.direction}}">
 *             {{if Criterion.index (concat Criterion.index '. ')}}
 *             Last Name
 *             <UiIcon @name={{Criterion.iconClass}} />
 *           </th>
 *         </Sorter.Criterion>
 *       </tr>
 *     </thead>
 *
 *     <tbody>
 *       {{#each Sorter.sortedRecords as |record|}}
 *         <tr>
 *           <td>{{record.firstName}}</td>
 *           <td>{{record.lastName}}</td>
 *         </tr>
 *       {{/each}}
 *     </tbody>
 *   </table>
 * </UiSorter>
 * ```
 *
 * ## Sort Criterion
 * The workhorse of the UiSorter is the `Criterion` component which is yielded in the UiSorter's
 * block. This is a tagless component, and is intended to be wrapped around a button or whatever
 * other interactive element is to be used.
 *
 * The `@sortOn` attribute is always required. This is the property name of the objects within
 * the target recordset whose value will be sorted on.
 *
 * ```handlebars
 * <Sorter.Criterion @sortOn="lastName" as |Criterion|>
 *   {{!-- --}}
 * </Sorter.Criterion>
 * ```
 *
 * ### Pre-sorting
 * By default, the order that the recordset is provided in will be the same order that the yielded
 * `sortedRecords` array will have as all sort criterion default their sort direction to "none".
 *
 * It is possible to request a default sort that will be applied when the component renders by
 * providing the `@direction` attribute with a string of either "ascending" or "descending".
 *
 * ```handlebars
 * <Sorter.Criterion @sortOn="lastName" @direction="ascending" as |Criterion|>
 *   {{!-- --}}
 * </Sorter.Criterion>
 * ```
 *
 * ### Sub-sorting
 * Second, third, to _N_-th order child sorts can be provided with the `@subSortOn` attributes.
 *
 * Imagine a long list of names where many of the last names were all _"Smith"_. It might be convenient
 * to end-users to automatically sort on first names after the round of last name sorting so that
 * all of the _"Smith"_ records are easier to scan.
 *
 * ```handlebars
 * <Sorter.Criterion @sortOn="lastName" @subSortOn="firstName" as |Criterion|>
 *   {{!-- --}}
 * </Sorter.Criterion>
 * ```
 *
 * Multiple values can be provided to the `@subSortOn` attribute by providing a comma separated list. E.g.
 * `@subSortOn="firstName,middleName,phoneNumber"`. Sorts will be processed in the order that they are
 * provided.
 *
 * By default, the direction of all sub-sorts follow the direction of the primary sort. If the direction
 * of the sub-sort needs to be fixed, then there is a `@subSortDirection` attribute for that.
 *
 * ```handlebars
 * <Sorter.Criterion @sortOn="lastName" @subSortOn="firstName" @subSortDirection="ascending" as |Criterion|>
 *   {{!-- --}}
 * </Sorter.Criterion>
 * ```
 *
 * Multiple `@subSortDirection` values can be provided via a comma separated list, and are mapped to each
 * `@subSortOn` in the order they are provided.
 */
@tagName('')
@layout(template)
export default class UiSorter extends Component {
  public static readonly positionalParams = ['records'];

  /**
   * The array of objects that will be sorted. Sort operations do not mutate this array.
   */
  public declare records: unknown[];

  /**
   * The method that is used to generate descriptive text for the state of the sort for
   * assistive technologies. It receives, as an argument, an array containing active
   * SortRule instances and must return a string.
   */
  public createDescription: (rules: SortRule[]) => string = defaultSortDescription;

  protected ruleSet: NativeArray<SortRule> = A([]);

  @computed('ruleSet.[]', 'ruleSet.@each.{displayName,direction}')
  protected get description() {
    return this.createDescription(this.ruleSet);
  }

  @computed(
    'records.[]',
    'ruleSet.[]',
    'ruleSet.@each.{sortOn,direction,subSortOn,subSortDirection}'
  )
  protected get sortedRecords() {
    return isArray(this.records) ? sortArrayWithRules(this.records, this.ruleSet) : [];
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init();

    // Cannot pin down why, but on first render the `description` property is
    // being computed before any rules are pushed in, but not being recomputed
    // after. Oddly enough `sortedRecords` is being recomputed, but the two
    // display different behavior even will the exact same dependent keys.
    next(this, 'notifyPropertyChange', 'description');
  }

  @action
  handleRuleUpdated(rule: SortRule) {
    // The rule was turned off, remove it
    if (!rule.enabled) {
      this.ruleSet.removeObject(rule);
      set(rule, 'index', undefined);
    }
    // The rule was just turned on, add it to the end of the list
    else if (rule.previousDirection === SortOrder.NONE) {
      this.ruleSet.addObject(rule);
    }

    // Re-index all remaining rules
    this.ruleSet.forEach((item, idx) => set(item, 'index', idx + 1));
  }
}
