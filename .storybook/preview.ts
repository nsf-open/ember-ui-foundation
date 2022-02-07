import theme from './theme';
import storybookPreviewPreset, { addHtmlBarHighlighting, trimStorySource } from './utils/preview';


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
export const decorators = [trimStorySource];


/* ************************ *
   Parameters
 * ************************ */
export const parameters = storybookPreviewPreset(docs, {
  docs: {
    theme,
  },
});
