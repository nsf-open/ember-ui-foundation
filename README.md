[![Coverage](https://sonarqube.nsf.gov/api/project_badges/measure?project=nsf-ui-foundation&metric=coverage)](https://sonarqube.nsf.gov/dashboard?id=nsf-ui-foundation)

@nsf/ui-foundation
==============================================================================

The starting point for Ember Application UI libraries at NSF.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.8 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install @nsf/ui-foundation
```


Usage
------------------------------------------------------------------------------



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).


Extending Storybook
------------------------------------------------------------------------------
This project is intended to be extended by application-specific user interface libraries, and to
help integrate Storybook, a couple of utilities have been provided.

To get started, install your needed dependencies. At minimum, we recommend:
```bash
npm i @storybook/ember --save-dev
npm i @storybook/ember-cli-storybook --save-dev
npm i @storybook/addon-essentials --save-dev
npm i @storybook/addon --save-dev
npm i ember-cli-typedoc --save-dev
```

Now comes the configuration.

```javascript
// .storybook/main.js

// Anything that can go in main.js can go here. The `foundations` method augments
// Webpack's config to make it aware of ui-foundation's own story files and other
// assets.

const foundations = require('@nsf/ui-foundation/.storybook/utils/main');

module.exports = foundations({
  stories: [
    '../addon/**/*.stories.@(js|ts|mdx)',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],

  staticDirs: ['../dist'],
});
```

```typescript
// .storybook/preview.ts

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import storybookPreviewPreset, {
  addHtmlBarHighlighting,
  trimStorySource,
} from '@nsf/ui-foundation/.storybook/utils/preview';

// Load the reflection info created by Typedoc. This is the failure friendly 
// version, you can also use import.
let docs = { flags: {}, id: -1, name: 'noop', kind: 1 };

try {
  // eslint-disable-next-line no-undef
  docs = require('../dist/docs/index.json');
}
catch (e) {
  console.warn(e.message);
}

// Adds syntax highlighting for "glimmer", "handlebars", "htmlbars", and "hbs"
// code blocks. Note the import above must be as indicated - it's what Storybook
// uses.
addHtmlBarHighlighting(SyntaxHighlighter);

// This is an optional bit that might come in handly if you want to display the
// source code of stories. This decorator tries to trim the source string to
// only leave behind the handlebars markup itself.
export const decorators = [trimStorySource];

// Sets up several NSF preset config values, and hands your docs off to a custom
// TypeDoc parser that provides controls/argsTable/description support for
// Storybook addon-docs and addon-controls.
export const parameters = storybookPreviewPreset(docs, { /* Additional config */ });
```

```html
<!-- .storybook/preview-body.html -->

<link rel="stylesheet" href="css/preview-body.css"/>
<script src="js/preview-body.js"></script>
```

```javascript
// ember-cli-build.js
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
    // It's not required, but can be nice to not _always_ have TypeDoc
    // running while you work. Note that the json destination matches
    // what's being pulled in .storybook/preview.ts
    
    'ember-cli-typedoc': {
      enabled: process.env.STORYBOOK === 'true',
      out: null,
      json: './dist/docs/index.json',
    },
  });

  return app.toTree();
};
```

```json
// package.json

{
  "scripts": {
    "storybook:build": "STORYBOOK=true ember build && build-storybook",
    "storybook:start": "start-storybook -p 6006 --ci"
  }
}
```
