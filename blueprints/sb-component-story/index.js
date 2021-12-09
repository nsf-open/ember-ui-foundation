module.exports = {
  description: 'Creates a Storybook Story file for the named component.',

  // Don't want Ember CLI doing any other typical addon related blueprint
  // stuff like trying to re-export the created story file inside /app
  supportsAddon() {
    return false;
  },
};
