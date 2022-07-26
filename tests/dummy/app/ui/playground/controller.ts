import Controller from '@ember/controller';
import { set } from '@ember/object';
import { faker } from '@faker-js/faker';

export default class PlaygroundController extends Controller {
  readonly breadCrumb = { label: 'Component Playground', rewind: 1 };

  public shrinkJumbotron = false;

  public showModal = false;

  toggleJumbotron() {
    set(this, 'shrinkJumbotron', !this.shrinkJumbotron);
  }

  toggleModal() {
    set(this, 'showModal', !this.showModal);
  }

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
  }
}
