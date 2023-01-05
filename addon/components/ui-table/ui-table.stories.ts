import { hbs } from 'ember-cli-htmlbars';
import { faker } from '@faker-js/faker';

export default {
  title: 'Elements/ui-table',
  component: 'components/ui-table/component',

  args: {
    filters: [{ label: 'Hotmail Addresses', value: 'QUERY: email ENDS WITH "@hotmail.com"' }],

    columns: [
      { propertyName: 'name', sortOn: 'name' },
      { propertyName: 'accountType', sortOn: 'accountType' },
      { propertyName: 'email', sortOn: 'email' },
      { propertyName: 'phone' },
    ],
  },

  argTypes: {
    filters: {
      control: { type: 'array' },
    },

    filterRules: {
      control: { type: 'array' },
    },

    columns: {
      control: { type: 'array' },
    },
  },
};

export const Default = (context: unknown) => {
  return {
    context: Object.assign({}, context, {
      get recordSet() {
        const records = [];

        for (let i = 0; i < 100; i += 1) {
          records.push({
            name: faker.name.findName(),
            accountType: faker.helpers.arrayElement(['basic', 'admin']),
            email: faker.internet.email(),
            phone: faker.phone.number('555-###-####'),
          });
        }

        return records;
      },
    }),

    // language=handlebars
    template: hbs`
      <UiTable
        @records={{this.recordSet}}
        @columns={{this.columns}}
        @filters={{this.filters}}
        @filterRules={{this.filterRules}}
        @showFilterClearButton={{this.showFilterClearButton}}
        @filterPlaceholder={{this.filterPlaceholder}}
        @filterTitle={{this.filterTitle}}
        @pagingEnabled={{this.pagingEnabled}}
        @filterEnabled={{this.filterEnabled}}
        @noRecordsText={{this.noRecordsText}}
        @noFilterResultsText={{this.noFilterResultsText}}
      />
    `,
  };
};
Default.storyName = 'ui-table';
