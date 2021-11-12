import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import glimmer from 'prismjs-glimmer/src/glimmer';
import dedent from 'ts-dedent';

// @ts-expect-error - this will exist at runtime
import docs from '../dist/docs/index.json';
import { createArgType } from './utils/enhanced-args';
import {
  findChildrenOfKind,
  findComponentDefinition,
  ReflectionKind,
} from './utils/typedoc';


/* ************************ *
   Syntax Highlighting
 * ************************ */

const htmlbarsNamedWrapper = function(Prism) {
  glimmer(Prism);

  Prism.languages.handlebars = Prism.languages.glimmer;
  Prism.languages.hbs        = Prism.languages.glimmer;
  Prism.languages.htmlbars   = Prism.languages.glimmer;
}

htmlbarsNamedWrapper.displayName = 'glimmer';
htmlbarsNamedWrapper.aliases     = ['htmlbars', 'handlebars', 'hbs'];

SyntaxHighlighter.registerLanguage('htmlbars', htmlbarsNamedWrapper);


/* ************************ *
   Storybook Controls
 * ************************ */

export const argTypesEnhancers = [function (story) {
  if (typeof story.parameters.component !== 'string') {
    return story.parameters.argTypes;
  }

  const component = findComponentDefinition(docs, story.parameters.component);

  if (component) {
    return findChildrenOfKind(component, ReflectionKind.Property)
      .filter(function(prop) {
        return !(prop.flags.isExternal || prop.flags.isStatic || prop.flags.isReadonly);
      })
      .reduce(function(accumulator, prop) {
        const argType   = createArgType(prop, docs);
        const fromStory = story.parameters.argTypes?.[prop.name] || {};

        accumulator[prop.name] = Object.assign(argType, fromStory);
        return accumulator;
      }, {});
  }

  return story.parameters.argTypes;
}];


/* ************************ *
   Decorators
 * ************************ */

export const decorators = [function (storyFn, context) {
  const source = context.parameters.storySource;
  const story  = storyFn();

  if (source.transformed) {
    return story;
  }

  const startIdx = source.source.indexOf('hbs`') + 4;
  const endIdx   = source.source.lastIndexOf('`');

  source.transformed = true;
  source.language    = 'glimmer';
  source.source      = dedent(source.source.substring(startIdx, endIdx).trim());

  return story;
}];


/* ************************ *
   Parameters
 * ************************ */

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  docs: {
    source: {
      language: 'htmlbars',
    },

    extractComponentDescription(componentName) {
      const component = findComponentDefinition(docs, componentName);

      if (component) {
        const { shortText, text } = component.comment ?? {};
        return `${shortText} \n ${text}`;
      }

      return undefined;
    },
    // extractArgTypes() { return {}; }
  }
};
