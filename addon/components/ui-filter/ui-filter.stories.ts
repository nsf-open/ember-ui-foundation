import { hbs } from 'ember-cli-htmlbars';
import { faker } from '@faker-js/faker';

export default {
  title: 'Elements/ui-filter',
  component: 'components/ui-filter/component',

  parameters: {
    docs: {
      iframeHeight: 450,
    },
  },

  args: {
    filterRules: [
      { propertyKey: 'name', startsWith: true },
      { propertyKey: 'email' },
      { propertyKey: 'phone' },
      { propertyKey: 'address' },
    ],

    filters: [{ label: "Where's Bob", value: 'QUERY name INCLUDES "Bob"' }],

    showClearButton: false,
  },

  argTypes: {
    filters: {
      control: { type: 'array' },
    },

    showClearButton: {
      control: { type: 'boolean' },
    },

    filterRules: {
      control: { type: 'array' },
    },
  },
};

const Template = (context: unknown) => ({
  context: Object.assign(
    {
      get recordSet() {
        const records = [];

        for (let i = 0; i < 100; i += 1) {
          records.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.address.streetAddress(true),
          });
        }

        return records;
      },
    },
    context
  ),

  // language=handlebars
  template: hbs`
    <style>
      .scroll-box {
          max-height: 350px;
          overflow-x: hidden;
          overflow-y: scroll;
          font-size: 90%;
      }
    </style>

    <UiFilter @records={{this.recordSet}} @filterRules={{this.filterRules}} as |Filter|>
        <Filter.Input @filters={{this.filters}} @showClearButton={{this.showClearButton}} />

        <hr />

        <div class="scroll-box">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {{#each Filter.filteredRecords as |record|}}
                <tr>
                  <td>{{record.name}}</td>
                  <td>{{record.email}}</td>
                  <td>{{record.phone}}</td>
                  <td>{{record.address}}</td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
    </UiFilter>
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-filter';
