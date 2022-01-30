import type {
  DeclarationReflection,
  ProjectReflection,
} from 'typedoc/dist/lib/serialization/schema';

import { findChildByName, findChildrenByKind } from './traversal';
import { getFullCommentText, kebabCase, classyCase } from './stringify';
import { ReflectionKind } from './types';

/**
 * Looks through the project's modules for one whose name matches the provided
 * argument based on a few typical patterns for component layout in Ember addons
 * and folder/file naming.
 */
export function findComponentModule(
  project: ProjectReflection,
  componentName: string
): DeclarationReflection | undefined {
  const dashedName = kebabCase(componentName);
  const classyName = classyCase(componentName);

  const lookups = [
    `components/${dashedName}/component`,
    `components/${dashedName}`,
    `components/${classyName}/component`,
    `components/${classyName}`,
  ];

  const module = findChildByName(project, lookups);

  if (!module) {
    console.warn(`COMPONENT NOT FOUND IN DOCS. Searched \n[\n  "${lookups.join('",\n  "')}"\n]`);
  }

  return module ?? undefined;
}

/**
 * Returns the default export of a component module.
 */
export function findComponentDefinition(
  project: ProjectReflection,
  componentName: string
): DeclarationReflection | undefined {
  const module = findComponentModule(project, componentName);

  return module
    ? findChildByName(module, 'default')
    : undefined;
}

/**
 * Looks up and returns the full description text of the component.
 */
export function getComponentDescription(project: ProjectReflection, componentName: string): string {
  const component = findComponentDefinition(project, componentName);
  return component ? getFullCommentText(component) : '';
}

/**
 * Returns all the writable public properties of a component. For the sake of Storybook
 * arg table and controls, a "public" property here excludes readonly props.
 */
export function getComponentPublicProperties(component: DeclarationReflection) {
  return findChildrenByKind(component, ReflectionKind.Property)
    .filter(function(prop) {
      return !(
        prop.flags.isExternal
        || prop.flags.isStatic
        || prop.flags.isReadonly
        || prop.flags.isPrivate
        || prop.flags.isProtected
      );
    });
}
