'use strict';
const Funnel = require('broccoli-funnel');
const {
  buildFunnelConfig,
  buildInclusionMap,
  describeInclusionMap,
} = require('./component-tree.js');

module.exports = {
  name: require('./package').name,

  prunedComponentFunnel: undefined,

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/font-awesome/css/font-awesome.css');
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.eot', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.svg', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff', { destDir: 'fonts' });
    this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff2', { destDir: 'fonts' });

    const app = this._findHost();
    const options = typeof app.options === 'object' ? app.options : {};
    const addonConfig = options['ember-ui-foundation'] || {};

    if (Array.isArray(addonConfig.include) && addonConfig.include.length) {
      const inclusionMap = buildInclusionMap(addonConfig.include);
      this.prunedComponentFunnel = buildFunnelConfig(inclusionMap);

      console.log(describeInclusionMap(addonConfig.include, inclusionMap));
    }
  },

  contentFor(type, config) {
    if (type === 'body-footer' && config.environment !== 'test') {
      return '<div id="ui-positioning-root"></div>';
    }
  },

  treeForAddon(addonTree) {
    const funnelConfig = {
      exclude: ['**/*.stories.*'],
    };

    if (this.prunedComponentFunnel) {
      funnelConfig.exclude.push(this.prunedComponentFunnel.addon.exclude);
    }

    return this._super.treeForAddon.call(this, new Funnel(addonTree, funnelConfig));
  },

  treeForApp(appTree) {
    const funnelConfig = { exclude: [] };

    if (this.prunedComponentFunnel) {
      funnelConfig.exclude.push(this.prunedComponentFunnel.app.exclude);
    }

    return this._super.treeForApp.call(this, new Funnel(appTree, funnelConfig));
  },
};
