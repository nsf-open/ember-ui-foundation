import type { ArtistsRouteModel } from 'dummy/ui/artists/route';
import Route from '@ember/routing/route';

export type ArtistRouteModel = ReturnType<ArtistRoute['model']>;

export default class ArtistRoute extends Route {
  model({ artist_id }: { artist_id: string }) {
    const artists = this.modelFor('artists') as ArtistsRouteModel;
    return artists.find((item) => item.id === artist_id);
  }
}
