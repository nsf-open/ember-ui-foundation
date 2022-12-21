const chalk = require('chalk');

/**
 * @typedef {object} ComponentDescriptor
 *
 * @property {string}   name
 * @property {string[]} [requires]
 * @property {string[]} [otherReqs]
 */

/**
 * @typedef {object} Result
 *
 * @property {string} name
 * @property {string} [includedBy]
 */

/**
 * @typedef {object} ResultSet
 *
 * @property {Map<string, Result>} components
 * @property {Map<string, Result>} otherReqs
 */

/** @type ComponentDescriptor[] */
const ComponentTree = [
  {
    name: 'ui-alert',
  },
  {
    name: 'ui-alert-block',
    requires: ['ui-alert'],
    otherReqs: ['lib/MessageManager.ts'],
  },
  {
    name: 'ui-async-block',
    otherReqs: ['components/-internals/async-aware-component.ts'],
  },
  {
    name: 'ui-bread-crumbs',
  },
  {
    name: 'ui-button',
    requires: ['ui-inline-text-icon-layout', 'ui-tooltip'],
    otherReqs: ['components/-internals/async-aware-component.ts'],
  },
  {
    name: 'ui-collapse',
  },
  {
    name: 'ui-filter',
    requires: ['ui-button', 'ui-menu', 'ui-tooltip'],
    otherReqs: ['lib/QueryParser.ts'],
  },
  {
    name: 'ui-heading',
  },
  {
    name: 'ui-icon',
  },
  {
    name: 'ui-inline-text-icon-layout',
    requires: ['ui-icon'],
  },
  {
    name: 'ui-load-indicator',
    requires: ['ui-icon'],
  },
  {
    name: 'ui-lorem',
  },
  {
    name: 'ui-menu',
    requires: ['ui-button', '-internals/contextual-container'],
  },
  {
    name: 'ui-modal',
    otherReqs: ['components/-internals/modal-container.ts'],
  },
  {
    name: 'ui-pager',
  },
  {
    name: 'ui-panel',
    requires: ['ui-button', 'ui-alert-block', 'ui-collapse', 'ui-async-block'],
  },
  {
    name: 'ui-popper',
  },
  {
    name: 'ui-progress-bar',
    otherReqs: ['lib/ProgressComponent.ts', 'lib/ProgressItem.ts', 'lib/ProgressManager.ts'],
  },
  {
    name: 'ui-sorter',
    otherReqs: ['lib/SortRule.ts'],
  },
  {
    name: 'ui-stepflow',
    requires: ['ui-progress-bar', 'ui-button', 'ui-panel'],
  },
  {
    name: 'ui-tab-panel',
  },
  {
    name: 'ui-table',
    requires: ['ui-sorter', 'ui-filter', 'ui-pager', 'ui-menu', 'ui-tooltip'],
  },
  {
    name: 'ui-tabs',
  },
  {
    name: 'ui-tooltip',
    requires: ['-internals/contextual-container', 'ui-popper'],
  },
  {
    name: '-internals/contextual-container',
  },
];

/**
 * @param {string[]} names
 * @param {ResultSet} resultSet
 * @param {string} [requiredBy]
 *
 * @returns {ResultSet}
 */
function walkTree(names, resultSet, requiredBy) {
  for (const name of names) {
    const entry = ComponentTree.find((item) => item.name === name);

    if (!entry || resultSet.components.has(name)) {
      continue;
    }

    resultSet.components.set(name, { name, includedBy: requiredBy });

    if (Array.isArray(entry.otherReqs)) {
      entry.otherReqs.forEach((req) =>
        resultSet.otherReqs.set(req, { name: req, includedBy: requiredBy })
      );
    }

    if (Array.isArray(entry.requires) && entry.requires.length) {
      walkTree(entry.requires, resultSet, requiredBy ? `${requiredBy}/${entry.name}` : entry.name);
    }
  }

  return resultSet;
}

/**
 * @param {string[]} names
 *
 * @returns {ResultSet}
 */
function buildInclusionMap(names) {
  return walkTree(names.sort(), { components: new Map(), otherReqs: new Map() });
}

/**
 *
 * @param {ResultSet} resultSet
 */
function buildFunnelConfig(resultSet) {
  const componentRegex = new RegExp(`components/(${[...resultSet.components.keys()].join('|')}).*`);

  return {
    addon: {
      exclude(resource) {
        // Intentionally flipping the match.
        return resource.startsWith('components/') && !componentRegex.test(resource);
      },
    },

    app: {
      exclude(resource) {
        // Intentionally flipping the match.
        return resource.startsWith('components/') && !componentRegex.test(resource);
      },
    },
  };
}

/**
 * @param {string[]} requested
 * @param {ResultSet} resultSet
 *
 * @returns {string}
 */
function describeInclusionMap(requested, resultSet) {
  const introText =
    '@mynsf-open/ember-ui-foundation has been configured to only include some \n' +
    'of its components. It is possible that additional components have been includes \n' +
    'to satisfy the dependencies of what was requested. Here is a list of what has \n' +
    'been added to the build.';

  const rows = [
    introText,
    '',
    `${chalk.green('Requested')} | ${chalk.yellow('Dependency')} | ${chalk.gray('Reason')}`,
    '',
  ];

  requested.sort();

  for (const name of requested) {
    const required = [];

    resultSet.components.forEach((item) => {
      if (item.includedBy && item.includedBy.startsWith(name)) {
        required.push(item);
      }
    });

    rows.push(` - ${chalk.green(name)}`);

    required
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((item) => {
        const itemName = chalk.yellow(item.name.startsWith('-') ? `ui${item.name}` : item.name);
        const reason = chalk.gray(`(${item.includedBy})`);

        rows.push(`   -- ${itemName} ${reason}`);
      });

    rows.push('');
  }

  return rows.join('\n');
}

module.exports = {
  buildInclusionMap,
  buildFunnelConfig,
  describeInclusionMap,
};
