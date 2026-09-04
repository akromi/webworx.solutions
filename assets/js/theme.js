/* Applied before first paint so the page never flashes the wrong palette.
   Loaded synchronously from <head>; kept in its own file so the Content
   Security Policy can forbid inline script entirely. */
(function () {
  try {
    var t = localStorage.getItem('wwx-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* storage blocked — fall through to the system preference */ }
})();
