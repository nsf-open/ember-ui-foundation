import type { ProjectReflection } from 'typedoc/dist/lib/serialization/schema';
import { buildClassLikeArgumentsTable, buildComponentArgumentsTable } from './controls/ember';
import { getModuleExport } from './typedoc/traversal';
import { getFullCommentText } from './typedoc/stringify';

export function extractItemDescription(project: ProjectReflection, itemName: string) {
  const item = getModuleExport(project, itemName);
  return item ? getFullCommentText(item) : '';
}

export function extractItemArgTypes(project: ProjectReflection, itemName: string) {
  const item = getModuleExport(project, itemName);

  if (!item) {
    return {};
  }

  return itemName.includes('components/')
    ? buildComponentArgumentsTable(project, item)
    : buildClassLikeArgumentsTable(project, item);
}
