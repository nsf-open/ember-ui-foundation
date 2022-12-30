import type UiSorterCriterion from '../../ui-sorter/criterion/component';

import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { computed, get } from '@ember/object';
import { humanize } from '@nsf-open/ember-general-utils';
import template from './template';

@tagName('')
@layout(template)
export default class UiTableTh extends Component {
  public label?: string;

  public propertyName?: string;

  public sortOn?: string;

  public sortDirection?: string;

  public subSortOn?: string;

  public subSortDirection?: string;

  public description?: string;

  public colspan?: string | number;

  public recordSet?: unknown[];

  public showColumnFilter = false;

  protected declare sortCriterion: UiSorterCriterion;

  @computed('sortOn')
  get isSortable() {
    return typeof this.sortOn === 'string';
  }

  @computed('label', 'propertyName')
  get displayName() {
    return (
      this.label ?? (typeof this.propertyName === 'string' ? humanize(this.propertyName, true) : '')
    );
  }

  @computed('recordSet.[]', 'propertyName', 'showColumnFilter')
  get uniqueColumnValues() {
    if (!(this.showColumnFilter && this.recordSet?.length && this.propertyName)) {
      return undefined;
    }

    return new Set(
      this.recordSet.map((item) => get(item, this.propertyName as keyof typeof item)).sort()
    );
  }
}
