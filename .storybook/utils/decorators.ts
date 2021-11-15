import dedent from 'ts-dedent';

/**
 * For story source code display, this cuts out the invocation bits of the
 * template within the story, leaving just the template text itself.
 */
export function trimStorySource(storyFn, context) {
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
}
