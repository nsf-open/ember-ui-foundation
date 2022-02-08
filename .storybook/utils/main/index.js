const path = require('path');

module.exports = function integrateUiFoundation(parentConfig = {}) {
  parentConfig.stories    = parentConfig.stories || [];
  parentConfig.staticDirs = parentConfig.staticDirs || [];

  const root = path.resolve(__dirname, '../../../');

  parentConfig.stories.push(`${root}/addon/**/*.stories.@(js|ts|mdx)`);
  parentConfig.staticDirs.push(`${root}/.storybook/static`);

  const originalWebpackFinalFn = typeof parentConfig.webpackFinal === 'function'
    ? parentConfig.webpackFinal
    : undefined;

  parentConfig.webpackFinal = (config) => {
    const tsRule = config.module.rules.find(rule => rule.test.exec('foobar.story.ts'));
    const mdxRule = config.module.rules.find(rule => rule.test.exec('foobar.story.mdx'));

    if (tsRule) {
      tsRule.include = tsRule.include || [];
      tsRule.include.push(root);

      tsRule.exclude = function (filePath) {
        return filePath.includes('/node_modules/') && !filePath.includes('/ui-foundation/');
      };
    }

    if (mdxRule) {
      mdxRule.include = mdxRule.include || [];
      mdxRule.include.push(root);

      mdxRule.exclude = function (filePath) {
        return filePath.includes('/node_modules/') && !filePath.includes('/ui-foundation/');
      };
    }

    // ui-foundation has some .mdx files that Webpack has trouble resolving the dependencies of.

    Object.assign(config.resolve.alias, {
      // eslint-disable-next-line node/no-unpublished-require
      '@storybook/addon-docs': path.dirname(require.resolve('@storybook/addon-docs', { paths: [process.cwd()] })),
    });

    return originalWebpackFinalFn ? originalWebpackFinalFn(config) : config;
  };

  return parentConfig;
}
