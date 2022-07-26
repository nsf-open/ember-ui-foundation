import type UiSorterCriterion from '../../ui-sorter/criterion/component';

import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import template from './template';

@tagName('')
@layout(template)
export default class UiTableTh extends Component {
  public label?: string;

  public sortOn?: string;

  public sortDirection?: string;

  public subSortOn?: string;

  public subSortDirection?: string;

  public description?: string;

  public colspan?: string | number;

  protected declare SortCriterion: UiSorterCriterion;

  protected declare resizeObserver: ResizeObserver;

  @computed('sortOn')
  get isSortable() {
    return typeof this.sortOn === 'string';
  }
}
