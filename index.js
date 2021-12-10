'use strict';
const Funnel = require('broccoli-funnel');
const Path = require('path');

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

  async outputReady({ directory }) {
    if (process.env.STORYBOOK) {
      let TypeDoc;

      try {
        // eslint-disable-next-line node/no-unpublished-require
        TypeDoc = require('typedoc');
      } catch (e) {
        this.ui.writeWarnLine('TypeDoc not installed', undefined, undefined);
        return;
      }

      this.ui.writeInfoLine('Running TypeDoc for Storybook');

      const app = new TypeDoc.Application();

      app.options.addReader(new TypeDoc.TSConfigReader());
      app.options.addReader(new TypeDoc.TypeDocReader());

      app.bootstrap({
        entryPoints: ['./addon'],
        entryPointStrategy: 'expand',
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        disableSources: true,
        logger: this.ui.writeInfoLine.bind(this.ui),
      });

      await app.generateJson(app.convert(), Path.join(directory, 'docs', 'index.json'));
    }
  },
};
