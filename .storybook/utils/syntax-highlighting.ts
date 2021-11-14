import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import glimmer from 'prismjs-glimmer/src/glimmer';

/**
 * Adds syntax highlighting support for Glimmer, HtmlBars, and Handlebars to
 * the React Syntax Highlighter's Prism parser.
 */
export function addHtmlBarHighlighting() {
  const htmlbarsNamedWrapper = function(Prism) {
    glimmer(Prism);

    Prism.languages.handlebars = Prism.languages.glimmer;
    Prism.languages.hbs        = Prism.languages.glimmer;
    Prism.languages.htmlbars   = Prism.languages.glimmer;
  }

  htmlbarsNamedWrapper.displayName = 'glimmer';
  htmlbarsNamedWrapper.aliases     = ['htmlbars', 'handlebars', 'hbs'];

  SyntaxHighlighter.registerLanguage('htmlbars', htmlbarsNamedWrapper);
}
