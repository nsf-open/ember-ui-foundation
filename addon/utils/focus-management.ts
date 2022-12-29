import { KeyCodes } from '@nsf-open/ember-ui-foundation/constants';

/**
 * A query selector for commonly focusable elements.
 */
const FocusableElementSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[href]',
].join(', ');

/**
 * Query for the focusable descendants of a given element. For convenience,
 * the first and last elements are made available as well.
 */
function getFocusableElementsOf(container: Element | Document) {
  const focusable = container.querySelectorAll(FocusableElementSelector) as NodeListOf<HTMLElement>;

  return {
    elements: [...focusable],
    first: focusable[0],
    last: focusable[focusable.length - 1],
  };
}

/**
 * Retrieve the focusable element after `startingWith`, within a given `container`.
 * It is assumed that `startingWith` is a descendent of `container`. If not, then a next
 * focusable cannot be determined and undefined will be returned.
 *
 * To avoid potentially sticking the tab key to a single element, if the _only_ focusable
 * element within `container` is `startingWith` then undefined will also be returned.
 */
function getNextFocusableElement(container: Element | Document, startingWith?: HTMLElement) {
  if (!startingWith) {
    return undefined;
  }

  const { elements } = getFocusableElementsOf(container);
  const currentIndex = elements.indexOf(startingWith);

  if (currentIndex === -1) {
    return undefined;
  }

  if (currentIndex === 0 && elements.length === 1) {
    return undefined;
  }

  return currentIndex < elements.length ? elements[currentIndex + 1] : elements[0];
}

/**
 * "FlowThrough" focus is designed for positioned elements such as popovers that have
 * focusable content, but are not rendered inline with the tab flow. Given a container
 * and an "origin" element - most typically the triggering element that caused the
 * container to be made visible - this will attach event listeners to manage tab and
 * tab + shift keyboard inputs to make it seem as though the container is inline.
 */
export function manageFlowThroughFocus(container?: Element, origin?: HTMLElement) {
  if (!(container && origin)) {
    return function noop() {
      /* Nothing to be done. */
    };
  }

  const handleOriginKeydown = function focusOriginKeydownListener(event: KeyboardEvent) {
    if (!event.shiftKey && event.key === KeyCodes.Tab) {
      getFocusableElementsOf(container).first?.focus();
      event.preventDefault();
    }
  };

  const afterOrigin = getNextFocusableElement(document, origin) ?? origin;

  const handleAfterOriginKeydown = function focusAfterOriginKeydownListener(event: KeyboardEvent) {
    if (event.shiftKey && event.key === KeyCodes.Tab) {
      getFocusableElementsOf(container).last?.focus();
      event.preventDefault();
    }
  };

  const handleContainerKeydown = function focusContainerKeydownListener(event: KeyboardEvent) {
    if (event.key === KeyCodes.Tab) {
      const { first, last } = getFocusableElementsOf(container);

      if (!event.shiftKey && last === document.activeElement) {
        getNextFocusableElement(document, origin)?.focus();
        event.preventDefault();
        return;
      }

      if (event.shiftKey && first === document.activeElement) {
        origin?.focus();
        event.preventDefault();
      }
    }
  };

  origin.addEventListener('keydown', handleOriginKeydown);
  afterOrigin.addEventListener('keydown', handleAfterOriginKeydown);
  container.addEventListener('keydown', handleContainerKeydown);

  return function releaseFocusManagement(returnFocus = true) {
    origin.removeEventListener('keydown', handleOriginKeydown);
    afterOrigin.removeEventListener('keydown', handleAfterOriginKeydown);
    container.removeEventListener('keydown', handleContainerKeydown);

    if (returnFocus) {
      origin.focus();
    }
  };
}

/**
 * "Capture" focus is exactly what it sounds like - focus is captured within the provided container.
 * When the last focusable element in the container is reached, the next tab will cause focus
 * to wrap back around to the first focusable element. Tab + shift behaves the same in the
 * other direction.
 */
export function manageCaptureFocus(container?: Element, origin?: HTMLElement) {
  if (!container) {
    return function noop() {
      /* Nothing to be done. */
    };
  }

  getFocusableElementsOf(container).first?.focus();

  const handleContainerKeydown = function focusContainerKeydownListener(event: KeyboardEvent) {
    if (event.key === KeyCodes.Tab) {
      const { first, last } = getFocusableElementsOf(container);

      if (!event.shiftKey && last === document.activeElement) {
        first.focus();
        event.preventDefault();
        return;
      }

      if (event.shiftKey && first === document.activeElement) {
        last.focus();
        event.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleContainerKeydown);

  return function releaseFocusManagement(returnFocus = true) {
    container.removeEventListener('keydown', handleContainerKeydown);

    if (origin && returnFocus) {
      origin.focus();
    }
  };
}
