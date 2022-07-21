import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { layout, tagName } from '@ember-decorators/component';
import template from './template';

/**
 * The UiPagerNavbar provides a button group containing first, last, previous, next,
 * and discrete page selectors based on the current state of the parent UiPager.
 */
@tagName('')
@layout(template)
export default class UiPagerNavbar extends Component {
  /**
   * If true, discrete page navigation options will be shown between the previous and
   * next options. If false, then only the first, previous, next, and last navigators
   * will be shown.
   */
  public showPageLinks = true;

  /**
   * Toggles between the two label types that a discrete navigation option can have. The
   * default (false) is a simple number denoting the page that the option navigates to. When
   * true, a range will be shown that indicates the individual records on the page. e.g. "1 - 10",
   * "11 - 20", etc.
   */
  public showPageLinkRangeLabels = false;

  /**
   * The max number of discrete page navigation options to display at one time. Only
   * odd numbers are used, so if an even number is provided here it will have 1 added.
   */
  public pageLinkCount = 5;

  /**
   * When true, the navbar will hide its discrete page links at the small breakpoint.
   */
  public responsive = true;

  /**
   * The `aria-label` attribute for the parent nav.
   */
  public ariaLabel?: string;

  protected disabled = false;

  protected currentPage = 1;

  protected pageCount = 0;

  protected pageSize = 10;

  protected recordCount = 0;

  protected hasPrevPage = false;

  protected hasNextPage = false;

  protected declare goToPage: (pageIdx: number) => void;

  protected declare goToFirstPage: () => void;

  protected declare goToPrevPage: () => void;

  protected declare goToNextPage: () => void;

  protected declare goToLastPage: () => void;

  @computed('disabled', 'hasPrevPage')
  protected get disablePrevButtons() {
    return this.disabled || !this.hasPrevPage;
  }

  @computed('disabled', 'hasNextPage')
  protected get disableNextButtons() {
    return this.disabled || !this.hasNextPage;
  }

  @computed('showPageLinks', 'pageLinkCount', 'pageCount', 'pageSize', 'recordCount', 'currentPage')
  protected get pageNumbers() {
    if (!this.showPageLinks) {
      return null;
    }

    const current = this.currentPage;
    const size = this.pageSize;
    const total = this.recordCount;
    const results = [];

    // The most generic assumption is that we will list all available
    // pages. So the first is 1, and the last is whatever our total page
    // count might be.
    let start = 1;
    let end = this.pageCount;
    let max = this.pageLinkCount;

    // If there are more pages than we're configured to display at once
    // then it is time to suck in our start/end boundaries, centering
    // on whatever the currently selected page is.
    if (end > max) {
      if (max % 2 !== 0) {
        max -= 1;
      }

      start = current - Math.ceil(max / 2);
      end = current + Math.floor(max / 2);

      const adjustStart = 1 - start;

      if (adjustStart > 0) {
        start += adjustStart;
        end += adjustStart;
      }

      const adjustEnd = end - this.pageCount;

      if (adjustEnd > 0) {
        start -= adjustEnd;
        end -= adjustEnd;
      }
    }

    // With our constricted range of pages figured out, we can now go
    // through and generate an object containing the info of each. This
    // then gets used by the template to make some UI goodness.
    for (let i = start; i <= end; i += 1) {
      const item = {
        idx: i,
        isCurrent: i === current,
        start: 0,
        end: 0,
        range: '',
      };

      item.start = (i - 1) * size + 1;
      item.end = item.start + size - 1;

      if (item.end > total) {
        item.end = total;
      }

      item.range = `${item.start} - ${item.end}`;
      results.push(item);
    }

    return results;
  }

  @action
  protected handleNavigation(keyOrIndex: string | number, event: Event) {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    switch (keyOrIndex) {
      case 'first':
        return this.goToFirstPage();
      case 'prev':
        return this.goToPrevPage();
      case 'next':
        return this.goToNextPage();
      case 'last':
        return this.goToLastPage();
    }

    if (typeof keyOrIndex === 'number') {
      this.goToPage(keyOrIndex);
    }
  }
}
