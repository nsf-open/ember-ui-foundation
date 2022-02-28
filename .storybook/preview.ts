import theme from './theme';
import { withCssResources } from '@storybook/addon-cssresources';
import {
  addHtmlBarHighlighting,
  extractItemArgTypes,
  extractItemDescription,
  trimStorySource,
} from '../storybook-utilities/preview';


/* ************************ *
   Load Docs JSON
 * ************************ */
let docs = { flags: {}, id: -1, name: 'noop', kind: 1 };

try {
  docs = require('../dist/docs/index.json');
}
catch (e) {
  console.warn(e.message);
}


/* ************************ *
   Syntax Highlighting
 * ************************ */
addHtmlBarHighlighting();


/* ************************ *
   Decorators
 * ************************ */
export const decorators = [trimStorySource, withCssResources];


// Using document referrer gets around same origin security exceptions
// when trying to reach into a parent frame.
const topDomain = document.referrer.startsWith(window.location.origin)
  ? './'
  : document.referrer;

const vendorUrl = `${topDomain}assets/vendor.css`;
const dummyUrl = `${topDomain}assets/dummy.css`;


/* ************************ *
   Parameters
 * ************************ */
export const parameters = {
  layout: 'fullscreen',

  actions: {argTypesRegex: "^on[A-Z].*"},

  controls: {
    matchers: {
      color:   /(background|color)$/i,
      date:    /Date$/,
      boolean: /^is[A-Z].*/,
    },

    expanded:              false,
    hideNoControlsWarning: true,
  },

  cssresources: [{
    id: 'Host Theme',
    code: `<link rel="stylesheet" href="${vendorUrl}" />\n<link rel="stylesheet" href="${dummyUrl}" />`,
    picked: true,
  }],

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

  options: {
    storySort: {
      order: ['Welcome', 'Elements', 'Helpers', 'Services', 'Classes'],
    },
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
