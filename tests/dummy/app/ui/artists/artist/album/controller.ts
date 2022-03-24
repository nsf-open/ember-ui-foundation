import type { AlbumRouteModel } from 'dummy/ui/artists/artist/album/route';
import Controller from '@ember/controller';
import { computed, set } from '@ember/object';

export default class AlbumController extends Controller {
  declare readonly model: AlbumRouteModel;

  _crumb?: unknown;

  @computed('model.name')
  get breadCrumbs() {
    if (this._crumb) {
      return this._crumb;
    }

    return [{ label: 'Albums', path: 'artists.artist.discography' }, { label: this.model?.name }];
  }

  set breadCrumbs(value: unknown) {
    set(this, '_crumb', value);
  }
}
