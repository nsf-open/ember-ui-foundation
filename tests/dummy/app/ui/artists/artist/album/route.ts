import type { ArtistRouteModel } from 'dummy/ui/artists/artist/route';
import Route from '@ember/routing/route';

export type AlbumRouteModel = ReturnType<AlbumRoute['model']>;

export default class AlbumRoute extends Route {
  model({ album_id }: { album_id: string }) {
    const artist = this.modelFor('artists.artist') as ArtistRouteModel;
    return artist?.discography.find((album) => album.id === album_id);
  }
}
