import { hbs } from 'ember-cli-htmlbars';
import { faker } from '@faker-js/faker';

export default {
  title: 'Elements/ui-table',
  component: 'components/ui-table/component',
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

  // language=hbs
  template: hbs`
    <UiTable
      @records={{this.recordSet}}
      @columns={{array
        (hash propertyName="name" sortOn="name")
        (hash propertyName="email" sortOn="email")
        (hash propertyName="phone")
      }}
    />
  `,
});

export const Default = Template.bind({});
