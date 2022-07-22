import { action, computed, set } from '@ember/object';
import { humanize } from '@nsf-open/ember-general-utils';
import { SortOrder } from '../constants';
import { maybeSplitString } from '../utils';

type SortInstruction = { sortOn: string; direction?: SortOrder };

/**
 * A SortRule stores information about sorting criteria such as the
 * property of an object to sort against, and the current direction
 * of the sort.
 */
export default class SortRule {
  /**
   * An optional, human-friendly name for the sort rule. If not provided,
   * then the value of `sortOn` will be used. Use `displayName` to access.
   */
  public name?: string;

  /**
   * If being used in the context of multiple sort rules, this will reflect
   * the index of the rule - the order in which it will be applied.
   */
  public index?: number;

  /**
   * The name of the property whose value will be used for sorting.
   */
  public sortOn?: string;

  /**
   * A string of comma separated values that will be used as 2nd, 3rd, to n-th
   * order child sorts in the order provided. This is useful in situations where
   * a large list of identical values might be sorted indeterminately - think a
   * list of names with lots of people sharing the same first name. Providing a
   * `subSortOn` of "lastName" would help to further group the sorted results.
   */
  public subSortOn?: string;

  /**
   * A compliment to `subSortOn` that provides a way for sub-sort properties to
   * have their sort direction "pinned" to a specific value. By default, sub-sorts
   * follow the primary sort direction.
   */
  public subSortDirection?: string;

  /**
   * A three-step sort direction cycle
   */
  public threeStepCycle = true;

  /** @private */
  _direction = SortOrder.NONE;

  /** @private */
  _previousDirection = SortOrder.NONE;

  /**
   * The current direction of the sort - ascending, descending, or none.
   */
  @computed('_direction')
  public get direction() {
    return this._direction;
  }

  public set direction(value: SortOrder) {
    set(this, '_previousDirection', this._direction);
    set(this, '_direction', value);
  }

  /**
   * The last sort direction. This can be used in conjunction with the `direction`
   * property to figure out what comes next if cycling through sort ordering options.
   */
  @computed('_previousDirection')
  public get previousDirection() {
    return this._previousDirection;
  }

  /**
   *
   */
  @computed('direction', 'threeStepCycle')
  public get nextDirection() {
    if (this.direction === SortOrder.ASC) {
      return SortOrder.DESC;
    }

    if (this.direction === SortOrder.DESC) {
      return this.threeStepCycle ? SortOrder.NONE : SortOrder.ASC;
    }

    return SortOrder.ASC;
  }

  /**
   *
   */
  public get enabled() {
    return this.direction !== SortOrder.NONE;
  }

  /**
   *
   */
  @computed('name', 'sortOn')
  public get displayName() {
    return this.name ?? (this.sortOn && humanize(this.sortOn, true)) ?? '';
  }

  /**
   * Simplifies the current state of the rule, as well as any sub-sort rules,
   * to an array of `sortOn` and `direction` objects to be read like an ordered
   * set of instructions.
   */
  public flatten(): Required<SortInstruction>[] {
    const results = [];

    if (typeof this.sortOn === 'string' && this.direction !== SortOrder.NONE) {
      results.push({ sortOn: this.sortOn, direction: this.direction });

      const subSortOn = maybeSplitString(this.subSortOn);

      if (subSortOn?.length) {
        const subSortDirection = maybeSplitString(this.subSortDirection);

        subSortOn.forEach((sortOnName, index) => {
          results.push({
            sortOn: sortOnName,
            direction: subSortDirection?.[index] ?? this.direction,
          });
        });
      }
    }

    return results;
  }

  @action
  public updateToNextSortDirection() {
    set(this, 'direction', this.nextDirection);
  }
}
