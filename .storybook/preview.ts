// @ts-expect-error - this will exist at runtime
import docs from '../dist/docs/index.json';
import { getComponentDescription } from './utils/typedoc/ember';
import { buildComponentArgumentsTable } from './utils/controls/ember';
import { addHtmlBarHighlighting } from './utils/syntax-highlighting';
import { trimStorySource } from './utils/decorators';


/* ************************ *
   Syntax Highlighting
 * ************************ */
addHtmlBarHighlighting();


/* ************************ *
   Decorators
 * ************************ */
export const decorators = [trimStorySource];


/* ************************ *
   Parameters
 * ************************ */
export const parameters = {
  layout: 'fullscreen',

  actions: { argTypesRegex: "^on[A-Z].*" },

  controls: {
    matchers: {
      color:   /(background|color)$/i,
      date:    /Date$/,
      boolean: /^is[A-Z].*/,
    },

    expanded: false,
    hideNoControlsWarning: true,
  },

  a11y: {
    element: '#root > .ember-view',
    manual:  true,
  },

  backgrounds: {
    disable: true,

    grid: {
      disable: true,
    }
  },

  sidebar: {
    showRoots: true,
  },

  docs: {
    extractComponentDescription(componentName: string) {
      return getComponentDescription(docs, componentName);
    },

    extractArgTypes(componentName: string) {
      return buildComponentArgumentsTable(docs, componentName);
    },
  }
};
