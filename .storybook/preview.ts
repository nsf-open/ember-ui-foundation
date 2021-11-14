// import dedent from 'ts-dedent';

// @ts-expect-error - this will exist at runtime
import docs from '../dist/docs/index.json';
import { buildComponentArgumentsTable } from './utils/argument-types';
import { getComponentDescription } from './utils/typedoc';

import { addHtmlBarHighlighting } from './utils/syntax-highlighting';


/* ************************ *
   Syntax Highlighting
 * ************************ */
addHtmlBarHighlighting();


/* ************************ *
   Storybook Controls
 * ************************ */
// export const argTypesEnhancers = [function (story) {
//   if (typeof story.parameters.component !== 'string') {
//     return story.parameters.argTypes;
//   }

//   return getComponentPublicProperties(docs, story.parameters.component)
//     ?.reduce(function(accumulator, prop) {
//       const argType   = createArgType(prop, docs);
//       const fromStory = story.parameters.argTypes?.[prop.name] || {};
//
//       const merged = argType && fromStory
//
//       accumulator[prop.name] = Object.assign(argType, fromStory);
//       return accumulator;
//     }, {}) ?? story.parameters.argTypes;
// }];


/* ************************ *
   Decorators
 * ************************ */
// export const decorators = [function (storyFn, context) {
//   const source = context.parameters.storySource;
//   const story  = storyFn();
//
//   if (source.transformed) {
//     return story;
//   }
//
//   const startIdx = source.source.indexOf('hbs`') + 4;
//   const endIdx   = source.source.lastIndexOf('`');
//
//   source.transformed = true;
//   source.language    = 'glimmer';
//   source.source      = dedent(source.source.substring(startIdx, endIdx).trim());
//
//   return story;
// }];


/* ************************ *
   Parameters
 * ************************ */

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },

  controls: {
    matchers: {
      color:   /(background|color)$/i,
      date:    /Date$/,
      boolean: /^is[A-Z].*/,
    },

    expanded: true,
  },

  docs: {
    source: {
      language: 'htmlbars',
    },

    extractComponentDescription(componentName: string) {
      return getComponentDescription(docs, componentName);
    },

    extractArgTypes(componentName: string) {
      return buildComponentArgumentsTable(docs, componentName);
    },
  }
};
