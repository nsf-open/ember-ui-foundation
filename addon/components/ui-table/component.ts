import type { FilterRule } from '@nsf-open/ember-ui-foundation/components/ui-filter/component';
import type { ITableColumn } from '@nsf-open/ember-ui-foundation/constants';

import Component from '@ember/component';
import { computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';
import { guidFor } from '@ember/object/internals';

/**
 * The UiTable provides a HTML table with support for sorting, filtering, and pagination.
 *
 * @class UiTable
 */
@tagName('')
@layout(template)
export default class UiTable extends Component {
  public records?: unknown[];

  public columns?: ITableColumn[];

  public filterRules?: FilterRule[];

  public filterMethod?: <R>(term: string, records: R[]) => R[];

  /**
   * An array that will be used to populate a menu of options that can
   * be selected to auto-populate the filter text input.
   */
  public filters?: { label: string; value: string }[];

  /**
   * Whether to display a clear button to the right of the filter text input.
   */
  public showFilterClearButton = false;

  /**
   * The filter text input's placeholder text.
   */
  public filterPlaceholder?: string;

  public filterEnabled = true;

  public pagingEnabled = true;

  protected get tableGuid() {
    return `${guidFor(this)}-table`;
  }

  @computed('filterRules.[]', 'columns.[]')
  protected get derivedFilterRules(): FilterRule[] | undefined {
    if (Array.isArray(this.filterRules)) {
      return this.filterRules;
    }

    if (!Array.isArray(this.columns)) {
      return undefined;
    }

    const filterRules: FilterRule[] = [];

    this.columns.forEach((column) => {
      if (column.propertyName) {
        filterRules.push({
          propertyName: column.propertyName,
          caseSensitive: column.filterCaseSensitive,
          exactMatch: column.filterExactMatch,
          startsWith: column.filterStartsWith,
          booleanMap: column.filterBooleanMap,
        });
      }
    });

    return filterRules;
  }
}
