import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-filter', function (hooks) {
  setupRenderingTest(hooks);

  const recordSet = [
    {
      name: 'Herbert Labadie',
      email: 'Rashad.Littel63@gmail.com',
      isAdmin: false,
      age: 37,
      hobbies: [],
    },
    {
      name: 'Caleb Welch DDS',
      email: 'Christelle.Schroeder97@hotmail.com',
      isAdmin: true,
      age: 51,
      hobbies: [],
    },
    {
      name: 'Ms. Lila Yundt',
      email: 'Eryn.Barton@yahoo.com',
      isAdmin: true,
      age: 31,
      hobbies: 'camping',
    },
    {
      name: 'Mr. Brittany Kuhic',
      email: 'Amelia51@yahoo.com',
      isAdmin: false,
      age: 20,
      hobbies: ['camping', 'hiking'],
    },
    {
      name: 'Terence Brakus',
      email: 'Jovany.Ferry82@hotmail.com',
      isAdmin: false,
      age: 41,
      hobbies: 'knitting',
    },
    {
      name: 'Iris Feil',
      email: 'Raleigh_Mills5@yahoo.com',
      isAdmin: false,
      age: 37,
      hobbies: ['fishing'],
    },
    {
      name: 'Homer Dietrich',
      email: 'Hershel_Barrows48@gmail.com',
      isAdmin: true,
      age: 24,
      hobbies: ['archery'],
    },
    {
      name: 'Karla Hayes',
      email: 'Daisy18@gmail.com',
      isAdmin: false,
      age: 19,
      hobbies: ['camping', 'cooking'],
    },
    {
      name: 'Stacy Moen',
      email: 'Keeley.Wolf60@yahoo.com',
      isAdmin: false,
      age: 36,
      hobbies: null,
    },
    {
      name: 'Clifton Koelpin',
      email: 'Erick.Herzog49@gmail.com',
      isAdmin: false,
      age: undefined,
      hobbies: undefined,
    },
    {
      name: 'Olive Debra Abernathy',
      email: 'Nellie39@gmail.com',
      isAdmin: false,
      age: null,
      hobbies: false,
    },
    {
      name: 'Debra Feil',
      email: 'Roberta26@hotmail.com',
      isAdmin: true,
      age: 33,
      hobbies: ['baseball'],
    },
    {
      name: 'Ms. Melody Kreiger',
      email: 'Toni85@gmail.com',
      isAdmin: false,
      age: 29,
      hobbies: ['LARP', 'D&D'],
    },
    {
      name: 'Lyle Halvorson II',
      email: 'Rose9@gmail.com',
      isAdmin: false,
      age: 37,
      hobbies: ['water polo'],
    },
    {
      name: 'Mr. Belinda Emard Sr.',
      email: 'Jared.Kuhn@hotmail.com',
      isAdmin: false,
      age: 35,
      hobbies: ['photography'],
    },
  ];

  async function renderComponent() {
    // language=handlebars
    await render(hbs`
      <UiFilter
        @records={{this.recordSet}}
        @filterRules={{this.filterRules}}
        @filterMethod={{this.filterMethod}}
        @updateDelay={{16}}
        @advancedQueryUpdateDelay={{16}}
      as |Filter|>
        <Filter.Input
          @filters={{this.filters}}
          @showClearButton={{this.showClearButton}}
        />

        <table>
          <tbody>
            {{#each Filter.filteredRecords as |record|}}
              <tr>
                <td>{{record.name}}</td>
                <td>{{record.email}}</td>
                <td>{{if record.isAdmin 'Admin' 'Non-Admin'}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </UiFilter>
    `);
  }

  test('it filters an array using string filter rules', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('filterRules', ['name', 'email', 'doesNotExist']);

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();

    await fillIn('input[type="text"]', '@hotmail.com');
    assert.dom('table tbody tr').exists({ count: 4 });

    await fillIn('input[type="text"]', '@noexist.com');
    assert.dom('table tbody tr').doesNotExist();

    await fillIn('input[type="text"]', '');
    assert.dom('table tbody tr').exists({ count: 15 });
  });

  test('it filters an array using object filter rules', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('filterRules', [
      { propertyName: 'name', startsWith: true, caseSensitive: true },
      { propertyName: 'email', exactMatch: true },
      { propertyName: 'isAdmin', exactMatch: true, booleanMap: ['Admin', 'Non-Admin'] },
      'age',
    ]);

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();

    await fillIn('input[type="text"]', '@hotmail.com');
    assert.dom('table tbody tr').doesNotExist();

    await fillIn('input[type="text"]', 'Hershel_Barrows48@gmail.com');
    assert.dom('table tbody tr').exists({ count: 1 });

    await fillIn('input[type="text"]', 'Mr.');
    assert.dom('table tbody tr').exists({ count: 2 });

    await fillIn('input[type="text"]', 'debra');
    assert.dom('table tbody tr').doesNotExist();

    await fillIn('input[type="text"]', 'Debra');
    assert.dom('table tbody tr').exists({ count: 1 });

    await fillIn('input[type="text"]', '37');
    assert.dom('table tbody tr').exists({ count: 3 });

    await fillIn('input[type="text"]', 'Admin');
    assert.dom('table tbody tr').exists({ count: 4 });

    await fillIn('input[type="text"]', 'Non-Admin');
    assert.dom('table tbody tr').exists({ count: 11 });
  });

  test('it filters an array using a custom method', async function (assert) {
    this.set('recordSet', recordSet);

    this.set('filterMethod', function (term: string, records: typeof recordSet) {
      const regex = new RegExp(term, 'i');

      return records.filter((record) => {
        return regex.test(record.name) || regex.test(record.age?.toString() ?? '');
      });
    });

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();

    await fillIn('input[type="text"]', '37');
    assert.dom('table tbody tr').exists({ count: 3 });

    await fillIn('input[type="text"]', 'Mr.');
    assert.dom('table tbody tr').exists({ count: 2 });

    await fillIn('input[type="text"]', 'Non-Admin');
    assert.dom('table tbody tr').doesNotExist();
  });

  test('it filters an array using the query parser', async function (assert) {
    this.set('recordSet', recordSet);

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();

    await fillIn('input[type="text"]', 'QUERY: age EQUALS 37');
    assert.dom('table tbody tr').exists({ count: 3 });

    await fillIn('input[type="text"]', 'QUERY: name DOES NOT START WITH "Lyle"');
    assert.dom('table tbody tr').exists({ count: 14 });

    await fillIn('input[type="text"]', 'QUERY: age EQUALS null OR age EQUALS undefined');
    assert.dom('table tbody tr').exists({ count: 2 });

    await fillIn('input[type="text"]', 'QUERY: name DOES NOT END WITH "Feil"');
    assert.dom('table tbody tr').exists({ count: 13 });

    await fillIn('input[type="text"]', 'QUERY: age EQUALS 37 AND name STARTS WITH "Lyle"');
    assert.dom('table tbody tr').exists({ count: 1 });

    await fillIn('input[type="text"]', 'QUERY: email INCLUDES "hotmail"');
    assert.dom('table tbody tr').exists({ count: 4 });

    await fillIn('input[type="text"]', 'QUERY: hobbies INCLUDES "cooking"');
    assert.dom('table tbody tr').exists({ count: 1 });

    await fillIn(
      'input[type="text"]',
      'QUERY: (isAdmin EQUALS true AND name ENDS WITH "Yundt") OR isAdmin DOES NOT EQUAL true'
    );
    assert.dom('table tbody tr').exists({ count: 12 });

    await fillIn(
      'input[type="text"]',
      'QUERY: (isAdmin EQUALS true AND (name ENDS WITH "Yundt" OR name INCLUDES "ebra Fei")) OR isAdmin DOES NOT EQUAL true'
    );
    assert.dom('table tbody tr').exists({ count: 13 });

    await fillIn('input[type="text"]', 'QUERY: (age EQUALS 37');
    assert.dom('.tooltip-danger').containsText('does not have a closing brace');

    await fillIn('input[type="text"]', 'QUERY: age FOO 37');
    assert.dom('.tooltip-danger').containsText('Unexpected value "FOO"');
  });

  test('it can be given pre-determined filter values', async function (assert) {
    this.set('recordSet', recordSet);
    this.set('filterRules', ['name', 'email']);
    this.set('showClearButton', true);
    this.set('filters', [
      { label: 'People Named Homer', value: 'Homer' },
      { label: 'Non-Hotmail Addresses', value: 'QUERY: email DOES NOT END WITH "@hotmail.com"' },
    ]);

    await renderComponent();

    assert.dom('table tbody tr').exists({ count: 15 });
    assert.dom('input[type="text"]').hasNoValue();

    const menuId = `#${find('.input-group button')?.getAttribute('aria-controls')}`;

    assert.dom('.input-group button').hasText('Filters');
    assert.dom(menuId).exists().isNotVisible();

    await click('.input-group button');

    assert.dom(menuId).isVisible();
    assert.dom(`${menuId} button`).exists({ count: 2 });
    assert.dom(`${menuId} button:nth-child(1)`).hasText('People Named Homer');
    assert.dom(`${menuId} button:nth-child(2)`).hasText('Non-Hotmail Addresses');

    await click(`${menuId} button:nth-child(2)`);

    assert.dom(menuId).exists().isNotVisible();

    assert
      .dom('input[type="text"]')
      .isFocused()
      .hasValue('QUERY: email DOES NOT END WITH "@hotmail.com"');

    assert.dom('table tbody tr').exists({ count: 11 });

    assert
      .dom('.input-group .input-group-btn:last-child button')
      .hasAria('label', 'Reset Filter Input Field');

    await click('.input-group .input-group-btn:last-child button');

    assert.dom('input[type="text"]').hasNoValue();
  });
});
