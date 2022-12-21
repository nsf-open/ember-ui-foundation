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
   * Text that will be placed within the table's caption element.
   */
  public caption?: string;

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

  /**
   * Whether filtering of the table's contents is enabled. By default, this
   * includes adding some UI to the top control bar such a text input to
   * provide the filter term.
   */
  public filterEnabled = true;

  /**
   * Whether the table's content is to be subdivided into multiple pages. This
   * will also enable some UI elements like the page selector.
   */
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
