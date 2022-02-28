import type { ProjectReflection } from 'typedoc/dist/lib/serialization/schema';
import { getModuleExport } from './typedoc/traversal';
import { getFullCommentText } from './typedoc/stringify';
import {
  buildClassLikeArgumentsTable,
  buildComponentArgumentsTable,
} from './controls/ember';

/**
 * Finds a module export in one or more ProjectReflection definitions.
 */
export function lookupItem(lookup: ProjectReflection | ProjectReflection[], itemName: string) {
  const lookups = Array.isArray(lookup) ? lookup : [lookup];

  for (let i = 0; i < lookups.length; i += 1) {
    const project = lookups[i];
    const moduleExport = getModuleExport(project, itemName);

    if (project && moduleExport) {
      return { project, moduleExport };
    }
  }

  return { project: undefined, moduleExport: undefined };
}

/**
 * Returns the full description of the named item.
 */
export function extractItemDescription(
  lookup: ProjectReflection | ProjectReflection[],
  itemName: string
) {
  const { moduleExport } = lookupItem(lookup, itemName);
  return moduleExport ? getFullCommentText(moduleExport) : '';
}

/**
 *
 */
export function extractItemArgTypes(
  lookup: ProjectReflection | ProjectReflection[],
  itemName: string
) {
  const { project, moduleExport } = lookupItem(lookup, itemName);

  if (!(project && moduleExport)) {
    return {};
  }

  return itemName.includes('components/')
    ? buildComponentArgumentsTable(project, moduleExport)
    : buildClassLikeArgumentsTable(project, moduleExport);
}
