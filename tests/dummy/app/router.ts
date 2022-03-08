import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('playground');

  this.route('artists', function () {
    this.route('artist', { path: ':artist_id' }, function () {
      this.route('discography');
      this.route('album', { path: ':album_id' });
    });
  });
});
