import { hbs } from 'ember-cli-htmlbars';
import { faker } from '@faker-js/faker';

export default {
  title: 'Elements/ui-sorter',
  component: 'components/ui-sorter/component',

  subcomponents: {
    'Sorter.Criterion': 'components/ui-sorter/criterion/component',
  },

  parameters: {
    docs: {
      iframeHeight: 450,
    },
  },
};

const Template = (context: unknown) => ({
  context: Object.assign({}, context, {
    get records() {
      const records = [];

      for (let i = 0; i < 100; i += 1) {
        records.push({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        });
      }

      return records;
    },
  }),

  // language=hbs
  template: hbs`
    <UiSorter @records={{this.records}} as |Sorter|>
      <p class="text-right">{{Sorter.description}}</p>

      <table class="table table-striped table-condensed">
        <thead>
          <tr>
            <Sorter.Criterion @sortOn="firstName" @direction="descending" as |Criterion|>
                <th
                  onclick={{Criterion.cycleDirection}}
                  aria-sort="{{Criterion.direction}}"
                >
                    {{if Criterion.index (concat Criterion.index '. ')}}First Name <UiIcon @name={{Criterion.iconClass}} />
                </th>
            </Sorter.Criterion>

            <th>Last Name</th>
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
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-sorter';
