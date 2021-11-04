'use strict';

module.exports = {
  extends: 'recommended',

  rules: {
    'no-yield-only': 'off',
    'no-action': 'off',

    // Ember 3.8 cannot handle the angle bracket version of this.
    'no-curly-component-invocation': {
      allow: ['ui-internals/contextual-container'],
    },
  },
};
