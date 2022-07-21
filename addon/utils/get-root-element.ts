import { runInDebug, warn } from '@ember/debug';
import { getOwner } from '@ember/application';

const RootID = 'ui-positioning-root';

/**
 * Returns the DOM node that contextual elements will be rendered inside. This element is
 * inserted by the addon and sits near the top of the DOM tree.
 */
export default function getRootElement(context: unknown) {
  let root: HTMLElement | null = document.getElementById(RootID) || document.body;

  runInDebug(() => {
    const config = getOwner(context)?.resolveRegistration('config:environment');
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

      root =
        (id
          ? document.getElementById(id)
          : document.querySelector('#ember-testing > .ember-view')) ?? root;

      return;
    }

    warn(`No destination element was found.`, !!root, {
      id: '@nsf-open/ember-ui-foundation.no-destination-element',
    });
  });

  return root;
}
