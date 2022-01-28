'use strict';
const Funnel = require('broccoli-funnel');

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

  contentFor(type, config) {
    if (type === 'body-footer' && config.environment !== 'test') {
      return '<div id="ui-positioning-root"></div>';
    }
  },

  treeForAddon(addonTree) {
    return this._super.treeForAddon.call(
      this,
      new Funnel(addonTree, { exclude: ['**/*.stories.*'] })
    );
  },
};
