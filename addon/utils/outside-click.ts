import { bind } from '@ember/runloop';
import { assert } from '@ember/debug';

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
function isVisible(element?: HTMLElement | null) {
  return (
    !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  );
}

/**
 * Creates a method that will only execute when the target of a click event within the
 * document is not equal to or a child of the provided target argument. In other words,
 * it is a function that lets you know when a click has occurred _somewhere that is not_
 * a specific element.
 *
 * The returned value can be used to remove the event when needed.
 */
export function createOutsideClickListener(
  scope: unknown,
  target: HTMLElement,
  callback: (event: UIEvent) => void
): EventListener {
  assert('An HTMLElement must be provided as the target for an outside click listener.', !!target);
  assert(
    'A callback function must be supplied to handle an outside click event.',
    typeof callback === 'function'
  );

  const listener = function documentClickListener(event: Event) {
    const eventTarget = event.target as Element;

    if (!target.contains(eventTarget) && isVisible(target)) {
      callback.call(scope, event);
    }
  };

  const binding = bind(scope, listener);
  document.addEventListener('click', binding);
  return binding;
}

/**
 * For symmetry, this removes a previously created outside click listener.
 */
export function removeOutsideClickListener(cb: EventListener): void {
  document.removeEventListener('click', cb);
}
