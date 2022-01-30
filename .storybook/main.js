module.exports = {
  stories: [
    '../addon/**/*.stories.mdx',
    '../addon/**/*.stories.@(js|ts)'
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],

  staticDirs: ['../dist'],
}
