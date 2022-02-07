import type { ProjectReflection } from 'typedoc/dist/lib/serialization/schema';
import { buildClassLikeArgumentsTable, buildComponentArgumentsTable } from './controls/ember';
import { getModuleExport } from './typedoc/traversal';
import { getFullCommentText } from './typedoc/stringify';

let foundationDocs: ProjectReflection = { flags: {}, id: -1, name: 'noop', kind: 1 };

try {
  foundationDocs = require('../../../ui-foundation-docs.json');
}
catch (e) {
  console.warn(e.message);
}

/**
 * Finds a module export in one or more ProjectReflection definitions.
 */
export function lookupItem(lookups: ProjectReflection[], itemName: string) {
  if (Array.isArray(lookups)) {
    for (let i = 0; i < lookups.length; i += 1) {
      const project = lookups[i];
      const moduleExport = getModuleExport(project, itemName);

      if (project && moduleExport) {
        return { project, moduleExport };
      }
    }
  }

  return { project: undefined, moduleExport: undefined };
}

/**
 * Returns the full description of the named item.
 */
export function extractItemDescription(lookup: ProjectReflection, itemName: string) {
  const { moduleExport } = lookupItem([lookup, foundationDocs], itemName);
  return moduleExport ? getFullCommentText(moduleExport) : '';
}

/**
 *
 */
export function extractItemArgTypes(lookup: ProjectReflection, itemName: string) {
  const { project, moduleExport } = lookupItem([lookup, foundationDocs], itemName);

  if (!(project && moduleExport)) {
    return {};
  }

  return itemName.includes('components/')
    ? buildComponentArgumentsTable(project, moduleExport)
    : buildClassLikeArgumentsTable(project, moduleExport);
}
