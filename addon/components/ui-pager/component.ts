import Component from '@ember/component';
import { action, computed, set } from '@ember/object';
import { gt } from '@ember/object/computed';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * The `UiPager` component takes in an array of _things_ and turns it into
 * multiple smaller, sequential arrays that can be used for rendering, further
 * processing, or whatever else you might need.
 *
 * ```handlebars
 * <UiPager @records={{this.recordSet}} as |Pager|>
 *   {{!-- A <select> with options to control the max size of each page --}}
 *   <Pager.SizeOptions />
 *
 *   {{!-- Options to move around between pages --}}
 *   <Pager.Navbar />
 *
 *   {{#each Pager.pageRecords as |record|}}
 *     {{!-- Iterate through each record in the current slice --}}
 *   {{/each}}
 * </UiPager>
 * ```
 *
 * @yields {string} start          - The ones index of the first record of the current
 *                                  slice within the full recordset.
 * @yields {string} end            - The ones index of the last record of the current
 *                                   slice within the full recordset.
 * @yields {string} total          - The number of records within the full recordset.
 * @yields {number} pageSize       - The maximum number of records that will appear on
 *                                   a single page.
 * @yields {number} currentPage    - The ones index of the current page that is being
 *                                   provided by the component.
 * @yields {boolean} isPaged       - Whether paging is currently happening. This might
 *                                   be false, for example, if there are zero records in
 *                                   the full recordset, or if there is only one page
 *                                   worth or records.
 * @yields {unknown[]} pageRecords - The slice of the full recordset that constitutes the
 *                                   current page.
 * @yields {string} description    - The generated description of the pager state, by
 *                                   default it will read _"{start index} - {end index}
 *                                   of {total record count}"_.
 */
@tagName('')
@layout(template)
export default class UiPager extends Component {
  public static readonly positionalParams = ['records'];

  /**
   * The source array to be paged.
   */
  public declare records: Record<string, unknown>[];

  private _lastRecords?: Record<string, unknown>[];

  /**
   * The maximum number of records that will be put into each page.
   */
  public pageSize: string | number = 10;

  private _lastPageSize?: number;

  /**
   * The 1's-based index of the current page.
   */
  public currentPage: string | number = 1;

  /**
   * An array of objects that get used to populate the page size selector.
   * By default, it provides 10, 50, and "All" options.
   */
  public pageSizes = [
    { value: '10', label: 'Show 10' },
    { value: '50', label: 'Show 50' },
    { value: '-1', label: 'Show All' },
  ];

  /**
   * If true, then the page size options presented will not exceed the length
   * of the record set. For example, if the `pageSizes` provided included 10,
   * 20, 30, 40, and 50, but the provided `records` array only contained 35 items,
   * then only the options for 10, 20, and 30 would be shown. An option with the
   * "Show All" value of -1 is exempt from this.
   */
  public trimSizeOptions = true;

  /**
   * Whether the page selector can be interacted with.
   */
  public disabled = false;

  /**
   * Callback that is uan when the current page changes.
   */
  public onPageChange?: (newPageIndex: number) => void;

  /**
   * Callback that is run when the page size is changed.
   */
  public onPageSizeChange?: (newPageSize: number) => void;

  /**
   * The method used to create the pager's state description. By default, the created
   * string reads _"{start index} - {end index} of {total record count}"_.
   */
  public createDescription = function defaultPagerDescription(
    _page: number,
    start: number,
    end: number,
    total: number
  ) {
    return `${start} - ${end} of ${total}`;
  };

  /**
   * The subset of pageSizes whose value is smaller than the length of the records array.
   */
  @computed('records.[]', 'pageSizes.{[],@each.value}', 'trimSizeOptions')
  protected get availablePageSizes() {
    if (!this.trimSizeOptions) {
      return this.pageSizes;
    }

    return this.pageSizes.filter((option) => {
      const intValue = parseInt(option.value);
      return intValue === -1 || intValue < this.records.length;
    });
  }

  /**
   * The value of `pageSize` always cast as an integer.
   */
  @computed('pageSize')
  protected get intPageSize() {
    return typeof this.pageSize === 'string' ? parseInt(this.pageSize, 10) : this.pageSize ?? 10;
  }

  /**
   * Keeps from having the first option in the list confusingly "selected" if the
   * number of records is changed to less than the page size value while `trimSizeOptions`
   * is enabled.
   *
   * Without a value, select elements visibly display their first option which might give
   * the wrong impression to the user. With `trimSizeOptions` it is possible to lose the
   * option that was selected and cause this visual glitch. The only way it occurs is when
   * the number of records dips below the selected page size, at which point the -1 "Show
   * All" option is applicable. Of course, if there is no "Show All" then you'll have an
   * empty select... developer's choice.
   */
  @computed('trimSizeOptions', 'intPageSize', 'records.[]')
  protected get selectedPageSize() {
    if (!this.trimSizeOptions) {
      return this.intPageSize;
    }

    return this.intPageSize >= this.records.length ? -1 : this.intPageSize;
  }

  /**
   * The value of `currentPage` always cast as an integer.
   */
  @computed('currentPage')
  protected get intCurrentPage() {
    return typeof this.currentPage === 'string'
      ? parseInt(this.currentPage, 10)
      : this.currentPage ?? 1;
  }

  /**
   * True if more than one page of content exists.
   */
  @gt('pageCount', 1)
  protected declare isPaged: boolean;

  /**
   * True if there are pages before the current index.
   */
  @gt('intCurrentPage', 1)
  protected declare hasPrevPage: boolean;

  /**
   * True if there are pages after the current index.
   */
  @computed('intCurrentPage', 'pageCount')
  protected get hasNextPage() {
    return this.intCurrentPage < this.pageCount;
  }

  /**
   * The total number of records across all pages.
   */
  @computed('records.[]')
  protected get recordCount() {
    return this.records?.length ?? 0;
  }

  /**
   * The total number of pages available.
   */
  @computed('recordCount', 'intPageSize')
  protected get pageCount() {
    return Math.ceil(
      this.recordCount / (this.intPageSize === -1 ? this.recordCount : this.intPageSize)
    );
  }

  /**
   * The 1's-based index of the first item in `records` for the current page.
   */
  @computed('recordCount', 'intPageSize', 'intCurrentPage')
  protected get startIndex() {
    if (!this.recordCount) {
      return 0;
    }

    if (this.recordCount <= this.intPageSize) {
      return 1;
    }

    return this.intCurrentPage === 1 ? 1 : this.intPageSize * (this.intCurrentPage - 1) + 1;
  }

  /**
   * The 1's-based index of the last item in `records` for the current page.
   */
  @computed('recordCount', 'intPageSize', 'startIndex')
  protected get endIndex() {
    if (!this.recordCount) {
      return 0;
    }

    // -1 is being used as the "Show 'em all!" indicator
    if (this.intPageSize < 0 || this.recordCount <= this.intPageSize) {
      return this.recordCount;
    }

    const endIdx = this.startIndex + this.intPageSize - 1;

    if (endIdx > this.recordCount) {
      return this.startIndex + (this.recordCount % this.intPageSize) - 1;
    }

    return endIdx;
  }

  /**
   * The records contained in the current page, defined as the subset of `records`
   * between `startIndex` and `endIndex`.
   */
  @computed('records.[]', 'startIndex', 'endIndex')
  protected get pageRecords() {
    return Array.isArray(this.records) && this.startIndex && this.endIndex
      ? this.records.slice(this.startIndex - 1, this.endIndex)
      : null;
  }

  /**
   * The current paging descriptor string.
   */
  @computed('intCurrentPage', 'startIndex', 'endIndex', 'recordCount', 'createDescription')
  protected get description() {
    return (
      this.createDescription?.(
        this.intCurrentPage,
        this.startIndex,
        this.endIndex,
        this.recordCount
      ) ?? ''
    );
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  public init() {
    super.init();
    this._lastRecords = this.records;
    this._lastPageSize = this.intPageSize;
  }

  // There are a few situations where we want to reset to the first page.
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  public didUpdateAttrs() {
    super.didUpdateAttrs();

    if (this.intPageSize !== this._lastPageSize || this.records !== this._lastRecords) {
      this.goToFirstPage();

      this._lastRecords = this.records;
      this._lastPageSize = this.intPageSize;
    }
  }

  /**
   * Navigate to a specific page by providing a 1's-based index.
   */
  @action
  protected goToPage(idx: number) {
    if (idx > 0 && idx <= this.pageCount && idx !== this.intCurrentPage) {
      set(this, 'currentPage', idx);
      this.onPageChange?.(idx);
    }
  }

  /**
   * Navigate to the first page.
   */
  @action
  protected goToFirstPage() {
    this.goToPage(1);
  }

  /**
   * Navigate to the page prior to the current one, if available.
   */
  @action
  protected goToPrevPage() {
    this.goToPage(this.intCurrentPage - 1);
  }

  /**
   * Navigate to the page after the current one, if available.
   */
  @action
  protected goToNextPage() {
    this.goToPage(this.intCurrentPage + 1);
  }

  /**
   * Navigate to the last page.
   */
  @action
  protected goToLastPage() {
    this.goToPage(this.pageCount);
  }

  /**
   * Change the maximum number of records on a page.
   */
  @action
  changePageSize(size: string | number) {
    const intSize = typeof size === 'string' ? parseInt(size, 10) : size;

    if (intSize !== this.intPageSize) {
      const lastPageIndex = this.intCurrentPage;

      set(this, 'currentPage', 1);
      set(this, 'pageSize', intSize);

      this._lastPageSize = intSize;

      this.onPageSizeChange?.(intSize);

      if (lastPageIndex !== 1) {
        this.onPageChange?.(1);
      }
    }
  }
}
