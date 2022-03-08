'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

const devDependenciesForEach = {
  '@storybook/ember': null,
  '@storybook/ember-cli-storybook': null,
  '@storybook/addon-a11y': null,
  '@storybook/addon-essentials': null,
};

function makeScenario(name, emberSourceVersion, hash = undefined) {
  const result = Object.assign({ name }, hash || {});

  if (result.npm) {
    if (result.npm.devDependencies) {
      result.npm.devDependencies = Object.assign(
        {},
        devDependenciesForEach,
        result.npm.devDependencies
      );
    } else {
      result.npm.devDependencies = Object.assign({}, devDependenciesForEach);
    }
  } else {
    result.npm = {
      devDependencies: Object.assign({}, devDependenciesForEach),
    };
  }

  if (emberSourceVersion && !('ember-source' in result.npm.devDependencies)) {
    result.npm.devDependencies['ember-source'] = emberSourceVersion;
  }

  return result;
}

module.exports = async function () {
  return {
    scenarios: [
      makeScenario('ember-lts-3.8', '~3.8.1', {
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      }),

      makeScenario('ember-lts-3.12', '~3.12.4', {
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      }),

      makeScenario('ember-lts-3.16', '~3.16.3'),
      makeScenario('ember-lts-3.20', '~3.20.7'),

      makeScenario('ember-current-lts', 'lts', {
        npm: {
          dependencies: {
            'ember-auto-import': '^2',
          },

          devDependencies: {
            webpack: '^5',
          },
        },
      }),

      makeScenario('ember-release', await getChannelURL('release'), {
        npm: {
          dependencies: {
            'ember-auto-import': '^2',
          },

          devDependencies: {
            webpack: '^5',
          },
        },
      }),

      makeScenario('ember-default-with-jquery', undefined, {
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^1.1.0',
          },
        },
      }),

      makeScenario('ember-classic', '~3.28.0', {
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      }),

      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
