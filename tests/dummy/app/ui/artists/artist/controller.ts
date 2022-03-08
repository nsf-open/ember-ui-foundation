import type { ArtistRouteModel } from 'dummy/ui/artists/artist/route';
import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class ArtistController extends Controller {
  declare readonly model: ArtistRouteModel;

  @computed('model.{id,name}')
  get breadCrumb() {
    return { label: this.model?.name, model: this.model?.id };
  }
}
