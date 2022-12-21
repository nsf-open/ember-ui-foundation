'use strict';
const Funnel = require('broccoli-funnel');
const {
  buildFunnelConfig,
  buildInclusionMap,
  describeInclusionMap,
} = require('./component-tree.js');

/**
 * @typedef {object} AddonConfig
 *
 * @property {string[]} [include]
 * @property {boolean}  [fontAwesome]
 * @property {string}   [fontDirectory]
 */

module.exports = {
  name: require('./package').name,

  prunedComponentFunnel: undefined,

  runningForTopLevelApp: false,

  fontDirectory: undefined,

  init(parent, project) {
    this._super.init && this._super.init.apply(this, arguments);

    if (parent === project) {
      this.runningForTopLevelApp = true;
    }
  },

  included() {
    this._super.included.apply(this, arguments);

    const app = this._findHost();
    const options = typeof app.options === 'object' ? app.options : {};

    /** @type AddonConfig */
    const addonConfig = options['ember-ui-foundation'] || {};

    if (this.runningForTopLevelApp) {
      if (addonConfig.fontAwesome !== false) {
        const destDir = (this.fontDirectory = addonConfig.fontDirectory || 'fonts');

        this.import('node_modules/font-awesome/css/font-awesome.css');
        this.import('node_modules/font-awesome/fonts/fontawesome-webfont.eot', { destDir });
        this.import('node_modules/font-awesome/fonts/fontawesome-webfont.svg', { destDir });
        this.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf', { destDir });
        this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff', { destDir });
        this.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff2', { destDir });
      }

      if (Array.isArray(addonConfig.include) && addonConfig.include.length) {
        const inclusionMap = buildInclusionMap(addonConfig.include);
        this.prunedComponentFunnel = buildFunnelConfig(inclusionMap);

        console.log(describeInclusionMap(addonConfig.include, inclusionMap));
      }
    }
  },

  contentFor(type, config) {
    if (type === 'body-footer' && config.environment !== 'test') {
      return '<div id="ui-positioning-root"></div>';
    }

    if (type === 'head-footer' && this.fontDirectory) {
      const url = `${config.rootURL}${this.fontDirectory}/fontawesome-webfont`;
      return `<link rel="preload" as="font" href="${url}.woff2?v=4.7.0" type="font/woff2" crossorigin="anonymous">`;
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
