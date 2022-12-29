import getOwner from './get-owner';
import { runInDebug, warn } from '@ember/debug';

const RootID = 'ui-positioning-root';

/**
 * Returns the DOM node that contextual elements will be rendered inside. This element is
 * inserted by the addon and sits near the top of the DOM tree.
 */
export default function getRootElement(context: unknown) {
  let root = document.getElementById(RootID);

  runInDebug(() => {
    const config = getOwner(context)?.resolveRegistration<{ environment: string } | undefined>(
      'config:environment'
    );
    const isTest = config?.environment === 'test';

    if (isTest) {
      const TEST_HELPER = '@ember/test-helpers/dom/get-root-element';
      let id;

      // @ts-expect-error - This will exist at runtime
      if (requirejs.has(TEST_HELPER)) {
        try {
          // @ts-expect-error - This will exist at runtime
          id = requirejs(TEST_HELPER).default().id;
        } catch (ex) {
          // noop
        }
      }

      const testContainer = id
        ? document.getElementById(id)
        : document.querySelector('#ember-testing > .ember-view');

      if (testContainer) {
        if (!root) {
          root = document.createElement('div');
          root.id = RootID;
        }

        testContainer.prepend(root);
      }

      return;
    }

    /* istanbul ignore next */
    warn(`No destination element was found, falling back to document.body.`, !!root, {
      id: '@nsf-open/ember-ui-foundation.no-destination-element',
    });
  });

  return root ?? document.body;
}
