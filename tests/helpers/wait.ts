/**
 * Creates a promise that will take the given number of milliseconds to
 * settle, returning the provided payload. Optionally, it can be told
 * to fail with the same payload.
 */
export default function wait<P>(milliseconds: number, payload: P, reject = false): Promise<P> {
  return new Promise(function (resolveFn, rejectFn) {
    const settle = reject ? rejectFn : resolveFn;
    setTimeout(() => settle(payload), milliseconds);
  });
}
