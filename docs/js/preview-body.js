(function () {
  // This disables the bypassing of CSS transition aware promises
  // that speed up testing.
  window.__WAIT_FOR_TRANSITION_END__ = true;

  document.addEventListener('DOMContentLoaded', function () {
    const rootEl = document.getElementById('root');

    if (rootEl) {
      rootEl.classList.add('container');
      rootEl.style.paddingTop = '15px';
    }
  });
})();
