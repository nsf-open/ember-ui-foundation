'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    // Turn off Glimmer component linting to support < Ember 3.15
    'ember/no-classic-components': 'off',
    'ember/require-tagless-components': 'off',
    'ember/no-computed-properties-in-native-classes': 'off',
  },
  overrides: [
    // Typescript
    {
      files: ['./**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        // Turn off Glimmer component linting to support < Ember 3.15
        'ember/no-classic-components': 'off',
        'ember/require-tagless-components': 'off',
        'ember/no-computed-properties-in-native-classes': 'off',
      },
    }, // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './component-tree.js',
        './tree-builder.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
