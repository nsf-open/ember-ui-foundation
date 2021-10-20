'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/font-awesome/css/font-awesome.css');
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.eot', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.svg', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff2', { destDir: 'fonts' });
  },

  shouldIncludeChildAddon(addon) {
    if (addon.name === 'ember-engines-router-service') {
      return !!this.project.findAddonByName('ember-engines');
    }

    return this._super.shouldIncludeChildAddon.apply(this, arguments);
  },
};
