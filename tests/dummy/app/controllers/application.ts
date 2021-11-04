import Controller from '@ember/controller';
import { set } from '@ember/object';

export default class ApplicationController extends Controller {
  public shrinkJumbotron = false;

  toggleJumbotron() {
    set(this, 'shrinkJumbotron', !this.shrinkJumbotron);
  }
}
