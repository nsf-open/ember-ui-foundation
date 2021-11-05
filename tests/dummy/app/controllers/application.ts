import Controller from '@ember/controller';
import { set } from '@ember/object';

export default class ApplicationController extends Controller {
  public shrinkJumbotron = false;

  public showModal = false;

  toggleJumbotron() {
    set(this, 'shrinkJumbotron', !this.shrinkJumbotron);
  }

  toggleModal() {
    set(this, 'showModal', !this.showModal);
  }
}
