import type Component from '@ember/component';
import type { TestContext } from 'ember-test-helpers';

/**
 * Returns an active component instance with the provided id from
 * the view registry.
 */
export default function lookupComponent<C extends Component = Component>(
  context: TestContext,
  id: string
): C {
  const registry = context.owner.lookup('-view-registry:main') as Record<string, C>;
  return registry[id];
}
