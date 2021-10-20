import Ember from 'ember';
import { cancel, later, next } from '@ember/runloop';
import { EmberRunTimer } from '@ember/runloop/types';
import { Promise, reject } from 'rsvp';

// @ts-expect-error - Provides a dirty way to force animations in testing environments - looking at you Storybook.
const bypass = !!window.__WAIT_FOR_TRANSITION_END__;

/**
 * Adds a "transitionend" event listener on the provided node. The listener will
 * be removed after one run of the callback, or if the timeout is reached.
 *
 * @function waitForTransitionEnd
 *
 * @param {Element} node    The DOM node to listen for "transitionend" on.
 * @param {number}  timeout
 *
 * @returns {Promise<void>}
 */
export default function waitForTransitionEnd(node: Element, timeout = 0): Promise<void> {
  if (!node) {
    return reject();
  }

  let backup: EmberRunTimer | null;

  if (Ember.testing && !bypass) {
    timeout = 0;
  }

  return new Promise(function (resolve) {
    const done = function (event: Event) {
      if (event) {
        event.stopImmediatePropagation();
      }

      if (backup) {
        cancel(backup);
        backup = null;
      }

      node.removeEventListener('transitionend', done);
      resolve();
    };

    node.addEventListener('transitionend', done, false);

    // Purposefully stick this on the next run loop tick if the timeout
    // is zero. This is mostly a testing convenience.
    backup = timeout === 0 ? next(null, done) : later(null, done, timeout);
  });
}
