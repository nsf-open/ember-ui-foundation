import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { click, select, render } from '@ember/test-helpers';
import { faker } from '@faker-js/faker';

module('Integration | Component | ui-pager', function (hooks) {
  setupRenderingTest(hooks);

  /**
   * Create all the test records you'll ever need.
   */
  function generateRecordSet(count = 99) {
    const records = [];

    for (let i = 0; i < count; i += 1) {
      records.push({
        id: i,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      });
    }

    return records;
  }

  /**
   * Returns a pair of query selectors for a specific navbar button.
   */
  function getNavbarButtonSelector(index: string) {
    return { li: `nav li:nth-child(${index})`, a: `nav li:nth-child(${index}) a` };
  }

  /**
   * All navbar buttons have the same structure with only a couple of possible
   * variations. This tests it all. Makes 9 assertions.
   */
  function testNavbarButton(
    assert: Assert,
    index: string,
    { label = '', icon = '', text = '', isDisabled = false, isActive = false }
  ) {
    const { li, a } = getNavbarButtonSelector(index);

    assert.dom(li)[isDisabled ? 'hasClass' : 'doesNotHaveClass']('disabled');
    assert.dom(li)[isActive ? 'hasClass' : 'doesNotHaveClass']('active');

    assert
      .dom(a)
      .hasAttribute('aria-disabled', isDisabled.toString())
      .hasAttribute('aria-current', isActive ? 'page' : 'false')
      .hasAttribute('role', 'button')
      .hasAttribute('title', label)
      .hasAttribute('aria-label', label)
      .hasText(text);

    if (icon) {
      assert.dom(`${a} span[aria-hidden="true"]`).hasClass(icon);
    } else {
      assert.dom(`${a} span[aria-hidden="true"]`).doesNotExist();
    }
  }

  // ******************************
  // Start of tests
  // ******************************

  test('it generates a navigation bar', async function (assert) {
    assert.expect(460);

    this.set('records', generateRecordSet());
    this.set('showPageLinks', true);
    this.set('showPageLinkRangeLabels', false);
    this.set('pageLinkCount', 5);
    this.set('responsive', true);
    this.set('ariaLabel', 'Test navigation bar');
    this.set('disabled', false);

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} @disabled={{this.disabled}} as |Pager|>
        <Pager.Navbar
          @showPageLinks={{this.showPageLinks}}
          @showPageLinkRangeLabels={{this.showPageLinkRangeLabels}}
          @pageLinkCount={{this.pageLinkCount}}
          @responsive={{this.responsive}}
          @ariaLabel={{this.ariaLabel}}
        />
      </UiPager>
    `);

    assert.dom('nav').hasAttribute('aria-label', 'Test navigation bar');

    testNavbarButton(assert, '1', {
      isDisabled: true,
      label: 'Go to first page',
      icon: 'fa-angle-double-left',
    });
    testNavbarButton(assert, '2', {
      isDisabled: true,
      label: 'Go to previous page',
      icon: 'fa-angle-left',
    });
    testNavbarButton(assert, '3', { isActive: true, label: 'Current page, page 1', text: '1' });
    testNavbarButton(assert, '4', { label: 'Go to page 2', text: '2' });
    testNavbarButton(assert, '5', { label: 'Go to page 3', text: '3' });
    testNavbarButton(assert, '6', { label: 'Go to page 4', text: '4' });
    testNavbarButton(assert, '7', { label: 'Go to page 5', text: '5' });
    testNavbarButton(assert, '8', { label: 'Go to next page', icon: 'fa-angle-right' });
    testNavbarButton(assert, '9', { label: 'Go to last page', icon: 'fa-angle-double-right' });

    // Remember, everything is offset because there are first and previous
    // buttons at the beginning of the navbar.

    // Clicks on page 3
    await click(getNavbarButtonSelector('5').a);

    testNavbarButton(assert, '1', { label: 'Go to first page', icon: 'fa-angle-double-left' });
    testNavbarButton(assert, '2', { label: 'Go to previous page', icon: 'fa-angle-left' });
    testNavbarButton(assert, '3', { label: 'Go to page 1', text: '1' });
    testNavbarButton(assert, '5', { isActive: true, label: 'Current page, page 3', text: '3' });

    // Clicks on previous
    await click(getNavbarButtonSelector('2').a);

    testNavbarButton(assert, '5', { label: 'Go to page 3', text: '3' });
    testNavbarButton(assert, '4', { isActive: true, label: 'Current page, page 2', text: '2' });

    // Clicks on first
    await click(getNavbarButtonSelector('1').a);

    testNavbarButton(assert, '4', { label: 'Go to page 2', text: '2' });
    testNavbarButton(assert, '3', { isActive: true, label: 'Current page, page 1', text: '1' });

    // Clicks on next
    await click(getNavbarButtonSelector('8').a);

    testNavbarButton(assert, '3', { label: 'Go to page 1', text: '1' });
    testNavbarButton(assert, '4', { isActive: true, label: 'Current page, page 2', text: '2' });

    // Clicks on last
    await click(getNavbarButtonSelector('9').a);

    testNavbarButton(assert, '3', { label: 'Go to page 6', text: '6' });
    testNavbarButton(assert, '4', { label: 'Go to page 7', text: '7' });
    testNavbarButton(assert, '5', { label: 'Go to page 8', text: '8' });
    testNavbarButton(assert, '6', { label: 'Go to page 9', text: '9' });
    testNavbarButton(assert, '7', { isActive: true, label: 'Current page, page 10', text: '10' });
    testNavbarButton(assert, '8', {
      isDisabled: true,
      label: 'Go to next page',
      icon: 'fa-angle-right',
    });
    testNavbarButton(assert, '9', {
      isDisabled: true,
      label: 'Go to last page',
      icon: 'fa-angle-double-right',
    });

    // Clicks on page 7
    await click(getNavbarButtonSelector('4').a);

    testNavbarButton(assert, '1', { label: 'Go to first page', icon: 'fa-angle-double-left' });
    testNavbarButton(assert, '2', { label: 'Go to previous page', icon: 'fa-angle-left' });
    testNavbarButton(assert, '3', { label: 'Go to page 5', text: '5' });
    testNavbarButton(assert, '4', { label: 'Go to page 6', text: '6' });
    testNavbarButton(assert, '5', { isActive: true, label: 'Current page, page 7', text: '7' });
    testNavbarButton(assert, '6', { label: 'Go to page 8', text: '8' });
    testNavbarButton(assert, '7', { label: 'Go to page 9', text: '9' });
    testNavbarButton(assert, '8', { label: 'Go to next page', icon: 'fa-angle-right' });
    testNavbarButton(assert, '9', { label: 'Go to last page', icon: 'fa-angle-double-right' });

    // No page links
    this.set('showPageLinks', false);

    testNavbarButton(assert, '1', { label: 'Go to first page', icon: 'fa-angle-double-left' });
    testNavbarButton(assert, '2', { label: 'Go to previous page', icon: 'fa-angle-left' });
    testNavbarButton(assert, '3', { label: 'Go to next page', icon: 'fa-angle-right' });
    testNavbarButton(assert, '4', { label: 'Go to last page', icon: 'fa-angle-double-right' });

    // A much more limited number of page links
    this.set('pageLinkCount', 1);
    this.set('showPageLinks', true);

    testNavbarButton(assert, '1', { label: 'Go to first page', icon: 'fa-angle-double-left' });
    testNavbarButton(assert, '2', { label: 'Go to previous page', icon: 'fa-angle-left' });
    testNavbarButton(assert, '3', { isActive: true, label: 'Current page, page 7', text: '7' });
    testNavbarButton(assert, '4', { label: 'Go to next page', icon: 'fa-angle-right' });
    testNavbarButton(assert, '5', { label: 'Go to last page', icon: 'fa-angle-double-right' });

    // More details link text
    this.set('showPageLinkRangeLabels', true);

    testNavbarButton(assert, '3', {
      isActive: true,
      label: 'Current page, page 7',
      text: '61 - 70',
    });

    // Disable everything
    this.set('disabled', true);

    testNavbarButton(assert, '1', {
      isDisabled: true,
      label: 'Go to first page',
      icon: 'fa-angle-double-left',
    });
    testNavbarButton(assert, '2', {
      isDisabled: true,
      label: 'Go to previous page',
      icon: 'fa-angle-left',
    });
    testNavbarButton(assert, '3', {
      isDisabled: true,
      isActive: true,
      label: 'Current page, page 7',
      text: '61 - 70',
    });
    testNavbarButton(assert, '4', {
      isDisabled: true,
      label: 'Go to next page',
      icon: 'fa-angle-right',
    });
    testNavbarButton(assert, '5', {
      isDisabled: true,
      label: 'Go to last page',
      icon: 'fa-angle-double-right',
    });

    // Clicks on first, when disabled nothing should change
    await click(getNavbarButtonSelector('1').a);

    testNavbarButton(assert, '3', {
      isDisabled: true,
      isActive: true,
      label: 'Current page, page 7',
      text: '61 - 70',
    });
  });

  test('it generates descriptive text', async function (assert) {
    this.set('records', generateRecordSet());

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} as |Pager|>
        <Pager.Navbar />
        <div data-test-desc>{{Pager.description}}</div>
      </UiPager>
    `);

    assert.dom('[data-test-desc]').hasText('Showing 1 - 10 of 99');

    // Clicks on last
    await click(getNavbarButtonSelector('9').a);

    assert.dom('[data-test-desc]').hasText('Showing 91 - 99 of 99');

    // It still works with a recordset that is smaller than the page size
    this.set('records', generateRecordSet(3));

    assert.dom('[data-test-desc]').hasText('Showing 1 - 3 of 3');

    // Make sure it does not break when no recordset is provided
    this.set('records', []);

    assert.dom('[data-test-desc]').hasText('Showing 0 - 0 of 0');

    this.set('records', undefined);

    assert.dom('[data-test-desc]').hasText('Showing 0 - 0 of 0');

    this.set('records', generateRecordSet());

    // Update with a custom description builder
    this.set(
      'createDescription',
      function (page: number, start: number, end: number, total: number) {
        return `Page ${page}, records ${start} through ${end} of ${total}`;
      }
    );

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} @createDescription={{this.createDescription}} as |Pager|>
        <Pager.Navbar />
        <div data-test-desc>{{Pager.description}}</div>
      </UiPager>
    `);

    assert.dom('[data-test-desc]').hasText('Page 1, records 1 through 10 of 99');

    // Clicks on last
    await click(getNavbarButtonSelector('9').a);

    assert.dom('[data-test-desc]').hasText('Page 10, records 91 through 99 of 99');

    // Remove the builder function, if that's your jam.
    this.set('createDescription', undefined);

    assert.dom('[data-test-desc]').hasText('');
  });

  test('the size of its pages can be controlled', async function (assert) {
    this.set('records', generateRecordSet());

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} as |Pager|>
        <Pager.SizeOptions />
        <ul>
          {{#each Pager.pageRecords as |record|}}
            <li>{{record.id}} - {{record.firstName}} {{record.lastName}}</li>
          {{/each}}
        </ul>
      </UiPager>
    `);

    assert.dom('select').hasAttribute('aria-label', 'Items to show per page');
    assert.dom('select option').exists({ count: 3 });
    assert.dom('select').hasValue('10');
    assert.dom('ul li').exists({ count: 10 });

    await select('select', '50');
    assert.dom('ul li').exists({ count: 50 });

    await select('select', '-1');
    assert.dom('ul li').exists({ count: 99 });

    // Customizable sizes
    this.set('pageSizes', [
      { value: '20', label: '20 Records' },
      { value: '75', label: '75 Records' },
    ]);
    this.set('pageSize', '75');

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} @pageSize={{this.pageSize}} @pageSizes={{this.pageSizes}} as |Pager|>
        <Pager.SizeOptions />
        <ul>
          {{#each Pager.pageRecords as |record|}}
            <li>{{record.id}} - {{record.firstName}} {{record.lastName}}</li>
          {{/each}}
        </ul>
      </UiPager>
    `);

    assert.dom('select option').exists({ count: 2 });
    assert.dom('select').hasValue('75');
    assert.dom('ul li').exists({ count: 75 });
    assert.dom('select option:nth-child(1)').hasText('20 Records');
    assert.dom('select option:nth-child(2)').hasText('75 Records');

    // It takes numbers too, for convenience
    this.set('pageSize', 20);

    assert.dom('select').hasValue('20');
    assert.dom('ul li').exists({ count: 20 });

    // It should default back to 10
    this.set('pageSize', undefined);
    assert.dom('ul li').exists({ count: 10 });

    // Other configurable options
    this.set('disabled', true);
    this.set('selected', undefined);
    this.set('ariaLabel', 'Hello World');
    this.set('ariaControls', 'Foo');

    // language=handlebars
    await render(hbs`
      <UiPager @records={{this.records}} as |Pager|>
        <Pager.SizeOptions
          @disabled={{this.disabled}}
          @selected={{this.selected}}
          @ariaLabel={{this.ariaLabel}}
          @ariaControls={{this.ariaControls}}
        />
      </UiPager>
    `);

    assert
      .dom('select')
      .hasAttribute('aria-label', 'Hello World')
      .hasAttribute('aria-controls', 'Foo')
      .isDisabled()
      .hasValue('10');
  });
});
