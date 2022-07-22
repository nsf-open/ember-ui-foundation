import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-sorter', function (hooks) {
  setupRenderingTest(hooks);

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
      <UiSorter @records={{this.recordSet}} as |Sorter|>
        <p class="text-right">{{Sorter.description}}</p>

        <table class="table table-striped table-condensed">
          <thead>
            <tr>
              <Sorter.Criterion
                @sortOn="firstName"
                @name={{this.firstNameDisplayName}}
                @direction={{this.firstNameSortDirection}}
                @subSortOn={{this.firstNameSubSortOn}}
                @subSortDirection={{this.firstNameSubSortDirection}}
              as |Criterion|>
                <th onclick={{Criterion.cycleDirection}} aria-sort="{{Criterion.direction}}">
                    {{if Criterion.index (concat Criterion.index '. ')}}
                    First Name
                    <UiIcon @name={{Criterion.iconClass}} />
                </th>
              </Sorter.Criterion>

              <Sorter.Criterion
                @sortOn="lastName"
                @name={{this.lastNameDisplayName}}
                @direction={{this.lastNameSortDirection}}
                @subSortOn={{this.lastNameSubSortOn}}
                @subSortDirection={{this.lastNameSubSortDirection}}
              as |Criterion|>
                <th onclick={{Criterion.cycleDirection}} aria-sort="{{Criterion.direction}}">
                  {{if Criterion.index (concat Criterion.index '. ')}}
                  Last Name
                  <UiIcon @name={{Criterion.iconClass}} />
                </th>
              </Sorter.Criterion>
            </tr>
          </thead>

            <tbody>
            {{#each Sorter.sortedRecords as |record|}}
                <tr>
                    <td>{{record.firstName}}</td>
                    <td>{{record.lastName}}</td>
                </tr>
            {{/each}}
            </tbody>
        </table>
      </UiSorter>
    `);
  }

  function tableCell(row: number, col: number) {
    return `table tbody tr:nth-child(${row}) td:nth-child(${col})`;
  }

  function tableHeader(col: number) {
    return `table thead tr th:nth-child(${col})`;
  }

  test('it sorts an array', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('firstNameSortDirection', 'none');
    this.set('lastNameSortDirection', 'none');

    await renderComponent();

    // With no sorting in place, the table should show everything in
    // exactly the order provided
    assert.dom('p').hasText('No sorting has been applied');

    assert.dom(tableHeader(1)).hasText('First Name').hasAria('sort', 'none');
    assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort');
    assert.dom(tableHeader(2)).hasText('Last Name').hasAria('sort', 'none');
    assert.dom(`${tableHeader(2)} .fa`).hasClass('fa-sort');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Herbert');
    assert.dom(tableCell(15, 2)).hasText('Halvorson');

    // Ascending first name
    await click(tableHeader(1));

    assert.dom('p').hasText('Sorted on First Name ascending');

    assert.dom(tableHeader(1)).hasText('1. First Name').hasAria('sort', 'ascending');
    assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort-asc');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Belinda');
    assert.dom(tableCell(15, 2)).hasText('Brakus');

    // Descending first name
    await click(tableHeader(1));

    assert.dom('p').hasText('Sorted on First Name descending');

    assert.dom(tableHeader(1)).hasText('1. First Name').hasAria('sort', 'descending');
    assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort-desc');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Terence');
    assert.dom(tableCell(15, 2)).hasText('Emard');

    // Back to default
    await click(tableHeader(1));

    assert.dom('p').hasText('No sorting has been applied');

    assert.dom(tableHeader(1)).hasText('First Name').hasAria('sort', 'none');
    assert.dom(`${tableHeader(1)} .fa`).hasClass('fa-sort');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Herbert');
    assert.dom(tableCell(15, 2)).hasText('Halvorson');

    // Time to try two active sorters
    await click(tableHeader(2));

    assert.dom('p').hasText('Sorted on Last Name ascending');

    await click(tableHeader(2));

    assert.dom(tableCell(11, 1)).hasText('Homer');
    assert.dom(tableCell(11, 2)).hasText('Dietrich');
    assert.dom(tableCell(12, 1)).hasText('Stacy');
    assert.dom(tableCell(12, 2)).hasText('Dietrich');
    assert.dom(tableCell(13, 1)).hasText('Karla');
    assert.dom(tableCell(13, 2)).hasText('Dietrich');

    await click(tableHeader(1));

    assert.dom('p').hasText('Sorted on Last Name descending, First Name ascending');
    assert.dom(tableHeader(1)).hasText('2. First Name');
    assert.dom(tableHeader(2)).hasText('1. Last Name');

    assert.dom(tableCell(11, 1)).hasText('Homer');
    assert.dom(tableCell(11, 2)).hasText('Dietrich');
    assert.dom(tableCell(12, 1)).hasText('Karla');
    assert.dom(tableCell(12, 2)).hasText('Dietrich');
    assert.dom(tableCell(13, 1)).hasText('Stacy');
    assert.dom(tableCell(13, 2)).hasText('Dietrich');

    await click(tableHeader(2));

    assert.dom('p').hasText('Sorted on First Name ascending');
    assert.dom(tableHeader(1)).hasText('1. First Name');
  });

  test('sorts can be configured when the component is initialized', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('firstNameSortDirection', 'none');
    this.set('lastNameSortDirection', 'descending');

    await renderComponent();

    assert.dom('p').hasText('Sorted on Last Name descending');
    assert.dom(tableHeader(2)).hasText('1. Last Name').hasAria('sort', 'descending');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Lila');
    assert.dom(tableCell(15, 2)).hasText('Abernathy');
  });

  test('sub-sorting can be configured', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('firstNameSortDirection', 'none');
    this.set('lastNameSortDirection', 'none');
    this.set('lastNameSubSortOn', 'firstName');

    await renderComponent();

    assert.dom('p').hasText('No sorting has been applied');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Herbert');
    assert.dom(tableCell(15, 2)).hasText('Halvorson');

    // Ascending first name
    await click(tableHeader(2));

    assert.dom(tableCell(3, 1)).hasText('Homer');
    assert.dom(tableCell(3, 2)).hasText('Dietrich');
    assert.dom(tableCell(4, 1)).hasText('Karla');
    assert.dom(tableCell(4, 2)).hasText('Dietrich');
    assert.dom(tableCell(5, 1)).hasText('Stacy');
    assert.dom(tableCell(5, 2)).hasText('Dietrich');

    await click(tableHeader(2));

    assert.dom(tableCell(11, 1)).hasText('Stacy');
    assert.dom(tableCell(11, 2)).hasText('Dietrich');
    assert.dom(tableCell(12, 1)).hasText('Karla');
    assert.dom(tableCell(12, 2)).hasText('Dietrich');
    assert.dom(tableCell(13, 1)).hasText('Homer');
    assert.dom(tableCell(13, 2)).hasText('Dietrich');
  });

  test('sub-sorting can be pinned in a specific direction', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('firstNameSortDirection', 'none');
    this.set('lastNameSortDirection', 'none');
    this.set('lastNameSubSortOn', 'firstName');
    this.set('lastNameSubSortDirection', 'ascending');

    await renderComponent();

    assert.dom('p').hasText('No sorting has been applied');

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom(tableCell(1, 1)).hasText('Herbert');
    assert.dom(tableCell(15, 2)).hasText('Halvorson');

    // Ascending first name
    await click(tableHeader(2));

    assert.dom(tableCell(3, 1)).hasText('Homer');
    assert.dom(tableCell(3, 2)).hasText('Dietrich');
    assert.dom(tableCell(4, 1)).hasText('Karla');
    assert.dom(tableCell(4, 2)).hasText('Dietrich');
    assert.dom(tableCell(5, 1)).hasText('Stacy');
    assert.dom(tableCell(5, 2)).hasText('Dietrich');

    await click(tableHeader(2));

    assert.dom(tableCell(11, 1)).hasText('Homer');
    assert.dom(tableCell(11, 2)).hasText('Dietrich');
    assert.dom(tableCell(12, 1)).hasText('Karla');
    assert.dom(tableCell(12, 2)).hasText('Dietrich');
    assert.dom(tableCell(13, 1)).hasText('Stacy');
    assert.dom(tableCell(13, 2)).hasText('Dietrich');
  });
});
