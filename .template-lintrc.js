'use strict';

module.exports = {
  extends: 'recommended',

  rules: {
    'no-yield-only': 'off',
    'no-action': 'off',

    // Ember 3.8 cannot handle the angle bracket invocation of
    // namespaced components.
    'no-curly-component-invocation': {
      allow: ['ui-internals/contextual-container', 'ui-modal/dialog'],
    },
  },
};
