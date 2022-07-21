import { hbs } from 'ember-cli-htmlbars';
import { faker } from '@faker-js/faker';

export default {
  title: 'Elements/ui-pager',
  component: 'components/ui-pager/component',

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
    <style>.pagination { margin-top: 0; }</style>

    <UiPager
      @records={{this.records}}
      @pageSize={{this.pageSize}}
      @currentPage={{this.currentPage}}
      @disabled={{this.disabled}}
      @onPageChange={{this.onPageChange}}
      @onPageSizeChange={{this.onPageSizeChange}}
    as |Pager|>
      <div class="row">
        <div class="col-sm-2">
          <Pager.SizeOptions />
        </div>

        <div class="col-sm-5">
          <Pager.Navbar />
        </div>

        <div class="col-sm-5 text-right">
          {{Pager.description}}
        </div>
      </div>

      <table class="table table-striped table-condensed">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>

        <tbody>
          {{#each Pager.pageRecords as |record|}}
            <tr>
              <td>{{record.firstName}}</td>
              <td>{{record.lastName}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </UiPager>
  `,
});

export const Default = Template.bind({});
Default.storyName = 'ui-pager';
