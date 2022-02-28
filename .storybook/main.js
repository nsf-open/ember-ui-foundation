module.exports = {
  stories: [
    '../stories/*.stories.mdx',
    '../addon/**/*.stories.mdx',
    '../addon/**/*.stories.@(js|ts)',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-cssresources',
  ],

  staticDirs: ['../dist', './static', '../storybook-utilities/static'],
}
