import Component from '@ember/component';
import { action, computed, get, set, setProperties } from '@ember/object';
import { debounce, next } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { layout, tagName } from '@ember-decorators/component';
import QueryParser from '../../lib/QueryParser';
import { escapeRegExp } from '@nsf-open/ember-general-utils';
import { isArray } from '@ember/array';
import template from './template';

type FilterRecord = Record<string, unknown>;

/**
 * A FilterRule describes how to compare the current filter value to a candidate
 * property of each object in the record set being filtered.
 */
export type FilterRule = {
  /**
   * The name of the property to compare. This can be a dot.separated.string to
   * reach into nested objects.
   */
  propertyName: string;

  /**
   * It is common to convert boolean values into friendly strings for display,
   * (e.g. "Confirmed"/"Denied", "Approved"/"Rejected") and so it is likely that
   * users will provide those values as filter terms. This duple provides a way
   * to map those strings back to the booleans they represent.
   * (e.g. ["Approved", "Rejected"] -> [true, false])
   */
  booleanMap?: [string, string];

  /**
   * Whether string comparisons should be case-sensitive.
   */
  caseSensitive?: boolean;

  /**
   * Whether string comparisons should be an exact match.
   */
  exactMatch?: boolean;

  /**
   * Whether string comparisons should start at the beginning of candidate being
   * evaluated.
   */
  startsWith?: boolean;
};

/**
 * The UiFilter provides an easy mechanism for keyword filtering a recordset.
 *
 * ```handlebars
 * <UiFilter @records={{this.recordSet}} @filterRules={{this.filterRules}} as |Filter|>
 *   <Filter.Input />
 *
 *   <ul>
 *     {{#each Filter.filteredRecords as |record|}}
 *       <li>...</li>
 *     {{/each}}
 *   </ul>
 * </UiFilter>
 * ```
 *
 * ## Filter Configuration
 *
 * ### Filter Rules
 * The easiest way to get to filtering is to provide an array of FilterRule objects. Their job
 * is to describe the properties of items in the recordset whose values should be considered
 * in the filtering process, and optionally, describe some additional parameters with which those
 * values should be evaluated.
 *
 * If all you need to do is describe which properties should be considered by the filter, then an
 * array of string property names can be provided.
 *
 * ```typescript
 * public get filterRules() {
 *   return ['firstName', 'lastName', 'email'];
 * }
 * ```
 *
 * For additional configuration, the full shape of a FilterRule is described below. Your array may contain
 * any combination of both plain strings, and complex FilterRule objects.
 *
 * ```typescript
 * public get filterRules() {
 *   return [{
 *     // Required. The name of the property to compare with the filter value. This can be a
 *     // dot.separated.string to reach into nested objects.
 *     propertyName: 'firstName',
 *
 *     // Optional. Whether string comparisons should be case-sensitive. Default `false`.
 *     caseSensitive: false,
 *
 *     // Optional. Whether string comparisons should be an exact match. Default `false`.
 *     exactMatch: false,
 *
 *     // Optional. Whether string comparisons should start at the beginning of the string.
 *     // If `false`, then any substring will match. Default `false`.
 *     startsWith: false,
 *
 *     // Optional. A special offering for situations where the property being evaluated is a boolean
 *     // value that is used to display something more friendly on screen, e.g. "Approved/Denied". Chances
 *     // are good that the string being displayed is what will be used as the filter term. This
 *     // array accepts two strings - the affirmative at index 0, and the negative at index 1 - and uses
 *     // those strings to map back to the underlying boolean. Default `undefined`.
 *     booleanMap: ['Yes', 'No'],
 *   }];
 * }
 * ```
 *
 * ### Custom Function
 * For really fine-grain control over the filtering process, a callback method can be provided.
 *
 * The method will receive two arguments:
 * - `string term`:   The value provided to the filter text input, with regular expression control
 *                    characters escaped so that it can be safely passed into a RegExp.
 * - `R[] recordSet`: A reference to the original array provided to the component through its records
 *                    attribute.
 *
 * ```typescript
 * public filterMethod(term: string, recordSet: R[]) {
 *   return recordSet.filter(record => {
 *     // Provide Filtering Logic
 *   });
 * }
 * ```
 *
 * ```handlebars
 * <UiFilter @records={{this.recordSet}} @filterMethod={{this.filterMethod}} as |Filter|>
 *   {{!-- ... --}}
 * </UiFilter>
 * ```
 *
 * ### Query Parser (Beta)
 * Query parsing is an advanced filtering concept that exposes a small DSL through which a complex
 * filter can be constructed using plain language which would probably be familiar to anyone with has
 * ever written a SQL query.
 *
 * #### Theory
 *
 * Queries consist of two types of building blocks:
 *
 * 1. `Evaluand`: An evaluand is anything that will be getting compared to something else (evaluated).
 *                This can be a primitive literal type - undefined, null, number, boolean, string - or
 *                a property name of the recordset objects whose value will be read and used.
 * 2. `Operand`:  Operands describe logic. For example, the "EQUALS" operand is used to compare the
 *                evaluands on its left and right. There are several comparison operands described in
 *                more detail below, as well as logical continuation operands (e.g. AND, OR) that
 *                allow for some pretty complex questions to be formed. Operands will always be expressed
 *                in UPPERCASE characters.
 *
 * The most simple query consists of two evaluands separated by a comparison operand (EQUALS) like so:
 *
 * ```
 * Evaluand COMPARISON-OPERAND Evaluand
 * ```
 *
 * This grouping is referred to as a `stanza`. Multiple stanzas can be joined together by continuation
 * operands (AND, OR) to craft more complex queries.
 *
 * ```
 * (Evaluand COMPARISON-OPERAND Evaluand) CONTINUATION-OPERAND (Evaluand COMPARISON-OPERAND Evaluand)
 * ```
 *
 * #### Usage
 *
 * To indicate that the provided filter text should be treated as a query, it must being with the keyword
 * `QUERY: ` - the uppercase word QUERY, followed by a colon, followed by a space.
 *
 * | Operand             | Example                        | Description                                  |
 * | ------------------- | ------------------------------ | -------------------------------------------- |
 * | EQUALS              | name EQUALS "George"           | (value of property `name`) === "George"      |
 * | DOES NOT EQUAL      | name DOES NOT EQUAL "George"   | (value of property `name`) !== "George"      |
 * | STARTS WITH         | name STARTS WITH "Ge"          | (value of property `name`).startsWith("Ge")  |
 * | ENDS WITH           | name ENDS WITH "ge"            | (value of property `name`).endsWith("ge")    |
 * | INCLUDES            | name INCLUDES "org"            | (value of property `name`).includes("org")   |
 * | IS LESS THAN        | age IS LESS THAN 21            | (value of property `age`) < 21               |
 * | IS GREATER THAN     | age IS GREATER THAN 21         | (value of property `age`) > 21               |
 * | DOES NOT START WITH | name DOES NOT START WITH "Ge"  | !(value of property `name`).startsWith("Ge") |
 * | DOES NOT END WITH   | name DOES NOT END WITH "ge"    | !(value of property `name`).endsWith("ge")   |
 * | DOES NOT INCLUDE    | name DOES NOT INCLUDE "org"    | !(value of property `name`).includes("ge")   |
 *
 * ```typescript
 * // Filter for records whose name property is strictly equal to "George"
 * 'QUERY: name EQUALS "George"';
 *
 * // Filter for name === "George" records which also have their isAdmin property equal to boolean true
 * 'QUERY: name EQUALS "George" AND isAdmin EQUALS true';
 *
 * // Filter for all "George" administrators, or anyone whose age property is a numeric 21 or greater.
 * 'QUERY: (name EQUALS "George" AND isAdmin EQUALS true) OR (age IS GREATER THAN 20)';
 * ```
 *
 * ## Pre-Configured Filters
 * It is possible to provide canned filter values for ease of use by providing a `filters` array to the
 * input component. The array takes objects of the shape `{ value: string, label: string }` where `value`
 * is the filter term that will be given to the input, and `label` is a human-friendly description for
 * the term.
 *
 * ```handlebars
 * <UiFilter @records={{this.recordSet}} @filterRules={{this.filterRules}} as |Filter|>
 *   <Filter.Input
 *     @filters={{array
 *       (hash value="Bob" label="The name 'Bob'")
 *       (hash value="QUERY: isAdmin EQUALS true" label="Administrators")
 *     }}
 *   />
 *
 *   {{!-- ... --}}
 * </UiFilter>
 * ```
 *
 *
 * @yields {UiFilterInput} Input - The text box input that receives filter values.
 * @yields {R[]} filteredRecords - The subset of records that have passed through the current filter.
 */
@tagName('')
@layout(template)
export default class UiFilter<R extends FilterRecord = FilterRecord> extends Component {
  public static readonly positionalParams = ['records'];

  /**
   * The array of objects that we be filtered. This can also be provided as the first
   * positional parameter of the component.
   */
  public records!: R[];

  /**
   * The text filter value. This is typically manipulated via the component's yielded
   * input field, but it can also be set here as well.
   */
  public filterValue?: string;

  /**
   * If provided, this method will be called whenever `filterValue` or `records` changes,
   * and will need to return whatever it considers the filtered subset back.
   */
  public filterMethod?: (filterValue: string, records: R[]) => R[];

  /**
   * Instead of manually managing all filtering via `filterMethod`, an array of "rule"
   * definitions can be provided for use by the component's internal filtering function.
   */
  public filterRules?: Array<string | FilterRule>;

  /**
   * The amount of time, in milliseconds, between the last update to `filterValue` and
   * when the filter is reapplied to `records`. It is a debounce behavior that smooths
   * out rapid value inputs (as happens when `filterValue` is being updated via keystrokes).
   */
  public updateDelay = 350;

  /**
   * The `filterValue` prefix that will trigger the advanced QueryParser to be used for
   * filtering when it appears at the beginning of the string.
   */
  public advancedQueryPrefix = 'QUERY: ';

  /**
   * The equivalent to `updateDelay` that is used when the QueryParser has been activated.
   * Since query filter strings can be significantly more complex than just typing any old
   * value in having more of a pause built-in is useful to end users.
   */
  public advancedQueryUpdateDelay = 1200;

  /**
   * A callback that is executed whenever the set of filtered records changes. This can be
   * used to gain access to the results of a filtering action outside the component.
   */
  public onFilterUpdate?: (filterValue: string, filteredRecords: R[]) => void;

  /**
   * @protected
   */
  queryParser?: QueryParser;

  /**
   * @protected
   */
  lastErrorMessage?: string;

  /**
   * @protected
   */
  showErrorMessage = false;

  /**
   * @property filteredRecords
   * @type {Object[]}
   * @protected
   * @readonly
   */
  @computed(
    'records.[]',
    'filterValue',
    'filterMethod',
    'normalizedFilterRules.[]',
    'advancedQueryPrefix'
  )
  protected get filteredRecords(): R[] {
    let filteredRecords: R[] = isArray(this.records) ? this.records : [];

    if (typeof this.filterValue === 'string' && !isEmpty(this.filterValue)) {
      if (this.filterValue.startsWith(this.advancedQueryPrefix)) {
        filteredRecords = this.advancedQueryFilterMethod(this.filterValue, this.records);
      } else if (typeof this.filterMethod === 'function') {
        filteredRecords = this.filterMethod(escapeRegExp(this.filterValue), this.records);
      } else {
        filteredRecords = this.rulesBasedFilterMethod(
          this.filterValue,
          this.records,
          this.normalizedFilterRules
        );
      }
    }

    this.onFilterUpdate?.(this.filterValue ?? '', filteredRecords);

    return filteredRecords;
  }

  /**
   * @property normalizedFilterRules
   * @type {FilterRule[]}
   * @protected
   * @readonly
   */
  @computed('filterRules.[]')
  protected get normalizedFilterRules(): FilterRule[] {
    if (isArray(this.filterRules)) {
      return this.filterRules.map((rule) =>
        typeof rule === 'string' ? { propertyName: rule } : rule
      );
    }

    return [];
  }

  @action
  protected handleFilterValueChange(newValue: string, pauseForMore = true): void {
    set(this, 'showErrorMessage', false);

    if (pauseForMore) {
      const updateDelay = newValue.startsWith(this.advancedQueryPrefix)
        ? this.advancedQueryUpdateDelay
        : this.updateDelay;

      debounce(null, set, this, 'filterValue', newValue, updateDelay);
    } else {
      set(this, 'filterValue', newValue);
    }
  }

  protected advancedQueryFilterMethod(filterValue: string, records: R[]): R[] {
    try {
      if (!this.queryParser) {
        this.queryParser = new QueryParser();
      }

      // Relying on the fact that .replace() only operates on the first occurrence here.
      const filterMethod = this.queryParser.evaluate(
        filterValue.replace(this.advancedQueryPrefix, '')
      );
      return records.filter(filterMethod);
    } catch (e) {
      next(null, setProperties, this, {
        lastErrorMessage: e.message,
        showErrorMessage: true,
      });
    }

    return [];
  }

  protected rulesBasedFilterMethod(filterValue: string, records: R[], rules: FilterRule[]): R[] {
    return records.filter(function (record) {
      for (let i = 0; i < rules.length; i += 1) {
        const rule = rules[i];
        const casedFilterValue = rule.caseSensitive ? filterValue : filterValue.toLowerCase();

        let testValue = get(record, rule.propertyName) as unknown;

        if (typeof testValue === 'number') {
          testValue = testValue.toString();
        } else if (typeof testValue === 'boolean') {
          testValue = rule.booleanMap?.[testValue ? 0 : 1] ?? testValue.toString();
        }

        if (typeof testValue === 'string') {
          const casedTestValue = rule.caseSensitive ? testValue : testValue.toLowerCase();

          if (rule.exactMatch) {
            if (casedTestValue === casedFilterValue) {
              return true;
            }
          } else if (rule.startsWith) {
            if (casedTestValue.startsWith(casedFilterValue)) {
              return true;
            }
          } else if (casedTestValue.indexOf(casedFilterValue) !== -1) {
            return true;
          }
        }
      }

      return false;
    });
  }
}
