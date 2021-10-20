'use strict';

module.exports = {
  name: require('./package').name,

  shouldIncludeChildAddon(addon) {
    if (addon.name === 'ember-engines-router-service') {
      return !!this.project.findAddonByName('ember-engines');
    }

    return this._super.shouldIncludeChildAddon.apply(this, arguments);
  },
};
