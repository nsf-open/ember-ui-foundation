import { setupOnerror, resetOnerror, settled } from '@ember/test-helpers';

/**
 * Sets Ember.onerror to a no-op for the duration of the callback, cleaning
 * up when it completes.
 */
export default async function silenceExceptions(
  callback: (...args: unknown[]) => void | Promise<void>,
  tryCatch = true
) {
  setupOnerror(function () {
    /* Don't look sweet child! */
  });

  if (tryCatch) {
    try {
      await callback();
    } catch (e) {
      /* We're intending for this to throw. */
    }
  } else {
    await callback();
  }

  await settled();

  resetOnerror();
}
