import type { ArtistRouteModel } from 'dummy/ui/artists/artist/route';
import Controller from '@ember/controller';
import { computed, set } from '@ember/object';

export default class ArtistController extends Controller {
  declare readonly model: ArtistRouteModel;

  _crumb?: unknown;

  @computed('model.{id,name}', '_crumb')
  get breadCrumb() {
    if (this._crumb) {
      return this._crumb;
    }

    return { label: this.model?.name, model: this.model?.id };
  }

  set breadCrumb(value: unknown) {
    set(this, '_crumb', value);
  }
}
