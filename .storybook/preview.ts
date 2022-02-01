// @ts-expect-error - this will exist at runtime
import docs from '../dist/docs/index.json';
import { extractItemArgTypes, extractItemDescription } from './utils/addon-docs';
import { addHtmlBarHighlighting } from './utils/syntax-highlighting';
import { trimStorySource } from './utils/decorators';
import theme from './theme';


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

  options: {
    storySort: {
      order: ['Welcome', 'Elements', 'Helpers', 'Services', 'Library'],
    },
  },

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
    showRoots: false,
  },

  docs: {
    theme,

    extractComponentDescription(itemName: string) {
      return extractItemDescription(docs, itemName);
    },

    extractArgTypes(itemName: string) {
      return extractItemArgTypes(docs, itemName);
    },
  }
};
