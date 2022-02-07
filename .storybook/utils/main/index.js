const path = require('path');

module.exports = function integrateUiFoundation(parentConfig = {}) {
  parentConfig.stories    = parentConfig.stories || [];
  parentConfig.staticDirs = parentConfig.staticDirs || [];

  const root = path.resolve(__dirname, '../../../');

  // Unshift instead of push to make sure that the assets of an implementing
  // project win out over anything this this is providing.

  parentConfig.stories.unshift(`${root}/addon/**/*.stories.@(js|ts|mdx)`);
  parentConfig.staticDirs.unshift(`${root}/.storybook/static`);

  parentConfig.webpackFinal = (config) => {
    const tsRule = config.module.rules.find(rule => rule.test.exec('foobar.ts'));

    if (tsRule) {
      tsRule.include.push(root);
    }

    return config;
  };

  return parentConfig;
}
