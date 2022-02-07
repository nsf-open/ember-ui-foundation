import { extractItemArgTypes, extractItemDescription } from './addon-docs';

export { trimStorySource } from './decorators';
export { addHtmlBarHighlighting } from './syntax-highlighting';
export { extractItemDescription, extractItemArgTypes };

export default function storybookPreviewPreset(docs: any, options: Record<string, unknown> = {}) {
  const docsOptions = options.docs || {};
  delete options.docs;

  return Object.assign({
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
      showRoots: false,
    },

    options: {
      storySort: {
        order: ['Welcome', 'Elements', 'Helpers', 'Services', 'Classes'],
      },
    },

    docs: Object.assign({
      extractComponentDescription(itemName: string) {
        return extractItemDescription(docs, itemName);
      },

      extractArgTypes(itemName: string) {
        return extractItemArgTypes(docs, itemName);
      },
    }, docsOptions),
  }, options);
}
