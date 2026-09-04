/* Applied before first paint so the page never flashes the wrong palette.
   Loaded synchronously from <head>; kept in its own file so the Content
   Security Policy can forbid inline script entirely. */
(function () {
  /* Marks the document as script-enabled. Scroll-reveal starts elements at
     zero opacity, so that rule is gated behind this class — without it the
     page would render blank sections to anyone with JavaScript blocked. */
  document.documentElement.classList.add('js');

  try {
    var t = localStorage.getItem('wwx-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* storage blocked — fall through to the system preference */ }
})();
