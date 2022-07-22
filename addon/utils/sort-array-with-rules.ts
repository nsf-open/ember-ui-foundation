import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { compare } from '@ember/utils';

import { SortOrder } from '../constants';
import type SortRule from '../lib/SortRule';

/**
 * Sorts a `records` array using the provided SortRules. This returns a new
 * array, and does not modify the original.
 */
export default function sortArrayWithRules<R>(records: R[], sortRules: SortRule[]): R[] {
  assert('An array is required', isArray(records));

  const rules = sortRules.reduce(
    (arr, rule) => arr.concat(rule.flatten()),
    [] as ReturnType<SortRule['flatten']>
  );

  // Still clone the array to maintain consistent behavior, but with no
  // rule we don't actually have anything to do.
  if (!rules.length) {
    return records.slice();
  }

  return records.slice().sort(function (recordA, recordB) {
    let sortResult = 0;

    // Go through each rule. We only need to progress so far as to break
    // ties - if rule #1 reports the two values as equal, then we need to
    // progress to rule #2, but otherwise we can short-circuit on whatever
    // rule says that the values differ.
    for (let i = 0; i < rules.length; i += 1) {
      const compareResult = compare(get(recordA, rules[i].sortOn), get(recordB, rules[i].sortOn));

      // Short-circuit the loop when values aren't equal. The last bit in
      // here is to honor the sort direction. For a descending order, we
      // need to flip the sign on the +1 / -1 being returned.
      if (compareResult !== 0) {
        sortResult = rules[i].direction === SortOrder.ASC ? compareResult : compareResult * -1;

        break;
      }
    }

    return sortResult;
  });
}
