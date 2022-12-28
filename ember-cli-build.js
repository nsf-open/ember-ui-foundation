'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-typedoc': {
      enabled: process.env.STORYBOOK === 'true',
      out: null,
      json: './dist/docs/index.json',
    },

    'ember-cli-storybook': {
      enableAddonDocsIntegration: false,
    },

    addons: {
      exclude: [
        process.env.STORYBOOK === 'true' ? undefined : '@storybook/ember-cli-storybook',
      ].filter(Boolean),
    },
  });

  app.import('node_modules/bootstrap3/dist/css/bootstrap.css');

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
