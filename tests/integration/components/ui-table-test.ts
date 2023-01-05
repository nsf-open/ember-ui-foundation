import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-table', function (hooks) {
  setupRenderingTest(hooks);

  const filterRules = ['firstName', 'lastName'];

  const columns = [
    { propertyName: 'firstName', sortOn: 'firstName', label: 'First Name' },
    { propertyName: 'lastName', sortOn: 'lastName', label: 'Last Name' },
  ];

  const recordSet = [
    { firstName: 'Herbert', lastName: 'Labadie' },
    { firstName: 'Caleb', lastName: 'Welch' },
    { firstName: 'Lila', lastName: 'Yundt' },
    { firstName: 'Brittany', lastName: 'Kuhic' },
    { firstName: 'Terence', lastName: 'Brakus' },
    { firstName: 'Iris', lastName: 'Feil' },
    { firstName: 'Homer', lastName: 'Dietrich' },
    { firstName: 'Stacy', lastName: 'Dietrich' },
    { firstName: 'Karla', lastName: 'Dietrich' },
    { firstName: 'Clifton', lastName: 'Koelpin' },
    { firstName: 'Olive', lastName: 'Abernathy' },
    { firstName: 'Debra', lastName: 'Feil' },
    { firstName: 'Melody', lastName: 'Kreiger' },
    { firstName: 'Belinda', lastName: 'Emard' },
    { firstName: 'Lyle', lastName: 'Halvorson' },
  ];

  async function renderComponent() {
    // language=handlebars
    await render(hbs`
      <UiTable
        @columns={{this.columns}}
        @records={{this.records}}
        @pagingEnabled={{this.pagingEnabled}}
        @filterEnabled={{this.filterEnabled}}
        @filterRules={{this.filterRules}}
        @showFilterClearButton={{this.showFilterClearButton}}
        @filterPlaceholder={{this.filterPlaceholder}}
        @filterTitle={{this.filterTitle}}
        @noRecordsText={{this.noRecordsText}}
        @noFilterResultsText={{this.noFilterResultsText}}
      />
    `);
  }

  /**
   * Basic Table Display, no results.
   */
  test('ui table display, when there no records displays a row with no records text', async function (assert) {
    this.set('columns', columns);
    this.set('records', recordSet);

    await renderComponent();

    assert.dom('.ui-table').isVisible();
    assert.dom('.ui-table').hasTagName('div');

    assert.strictEqual(recordSet.length, 15, 'Table has 15 rows');

    assert.dom('table thead tr').exists({ count: 1 });

    // No records
    this.set('records', []);
    this.set('noRecordsText', 'No records exist');

    await renderComponent();
    assert.dom('table tbody tr').hasText('No records exist');
  });

  /**
   * Filter Tests.
   */
  test('ui table filter tests, it filters an array using string filter rules', async function (assert) {
    this.set('columns', columns);
    this.set('records', recordSet);
    this.set('filterEnabled', true);
    this.set('filterRules', filterRules);
    this.set('showFilterClearButton', true);
    this.set('filterPlaceholder', 'Filter');
    this.set('filterTitle', 'Filter title');
    this.set('noFilterResultsText', 'Nothing found to display');

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();
    assert.dom('input[type="text"]').hasProperty('placeholder', 'Filter');
    assert.dom('input[type="text"]').hasProperty('title', 'Filter title');

    await fillIn('input[type="text"]', 'Dietrich');
    assert.dom('table tbody tr').exists({ count: 3 });

    await fillIn('input[type="text"]', 'Caleb');
    assert.dom('table tbody tr').exists({ count: 1 });

    await fillIn('input[type="text"]', 'asjd');

    assert.dom('table tbody tr td').hasText('Nothing found to display');

    assert.dom('.input-group button.ui-filter-reset').hasAria('label', 'Reset Filter Input Field');

    await click('.input-group button.ui-filter-reset');

    assert.dom('input[type="text"]').hasNoValue();
  });
});
