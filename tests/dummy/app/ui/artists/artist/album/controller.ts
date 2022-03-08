import type { AlbumRouteModel } from 'dummy/ui/artists/artist/album/route';
import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class AlbumController extends Controller {
  declare readonly model: AlbumRouteModel;

  @computed('model.name')
  get breadCrumbs() {
    return [{ label: 'Albums', path: 'artists.artist.discography' }, { label: this.model?.name }];
  }
}
