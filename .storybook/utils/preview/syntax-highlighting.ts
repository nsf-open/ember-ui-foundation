import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
// @ts-expect-error
import { setup } from 'prismjs-glimmer';

/**
 * Adds syntax highlighting support for Glimmer, HtmlBars, and Handlebars to
 * the React Syntax Highlighter's Prism parser.
 */
export function addHtmlBarHighlighting(Highlighter?: typeof SyntaxHighlighter) {
  const htmlbarsNamedWrapper = function(Prism: { languages: Record<string, unknown> }) {
    setup(Prism);

    Prism.languages.handlebars = Prism.languages.glimmer;
    Prism.languages.hbs        = Prism.languages.glimmer;
    Prism.languages.htmlbars   = Prism.languages.glimmer;
  }

  htmlbarsNamedWrapper.displayName = 'handlebars';
  htmlbarsNamedWrapper.aliases     = ['htmlbars', 'handlebars', 'hbs'];

  (Highlighter || SyntaxHighlighter).registerLanguage('handlebars', htmlbarsNamedWrapper);
}
