/* ==========================================================================
   webworx.solutions — progressive enhancement only.
   The page is fully readable and navigable with this file blocked; everything
   here adds convenience on top of working HTML.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Theme toggle
     The pre-paint script in <head> has already applied any stored choice.
     This only handles switching and persisting it.
     ---------------------------------------------------------------------- */

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncToggleLabel() {
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (toggle) {
    syncToggleLabel();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('wwx-theme', next); } catch (e) { /* storage blocked */ }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0e1013' : '#faf9f7');
      syncToggleLabel();
    });
  }

  /* ----------------------------------------------------------------------
     Masthead: draw its bottom rule only once the page has scrolled
     ---------------------------------------------------------------------- */

  var masthead = document.getElementById('masthead');
  if (masthead) {
    var setStuck = function () {
      masthead.setAttribute('data-stuck', window.scrollY > 8 ? 'true' : 'false');
    };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Capability accordion
     Buttons carry aria-expanded and control a panel by id; the panel uses
     the hidden attribute so it stays out of the accessibility tree when
     closed and prints open (see the print styles).
     ---------------------------------------------------------------------- */

  var capButtons = document.querySelectorAll('.cap__btn');

  Array.prototype.forEach.call(capButtons, function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.hidden = open;
    });
  });

  /* Open the first capability so the pattern is discoverable. */
  if (capButtons.length) capButtons[0].click();

  /* ----------------------------------------------------------------------
     Project filters
     Single-select. Buttons are real buttons with aria-pressed, so keyboard
     and screen-reader behaviour is native.
     ---------------------------------------------------------------------- */

  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('#work-grid .card');
  var emptyNote = document.getElementById('empty-note');

  function applyFilter(tag) {
    var shown = 0;

    Array.prototype.forEach.call(cards, function (card) {
      var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      var match = tag === 'all' || tags.indexOf(tag) !== -1;
      card.setAttribute('data-hidden', match ? 'false' : 'true');
      if (match) shown++;
    });

    if (emptyNote) emptyNote.hidden = shown !== 0;
  }

  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(filters, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ----------------------------------------------------------------------
     Scroll reveal
     Skipped entirely when the visitor prefers reduced motion, or when
     IntersectionObserver is unavailable — in both cases the CSS fallback
     leaves everything visible.
     ---------------------------------------------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(revealables, function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Scroll spy — mark the nav link for the section currently in view
     ---------------------------------------------------------------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var visible = new Set();

    var markCurrent = function () {
      var top = null;

      sections.forEach(function (section) {
        if (!visible.has(section.id)) return;
        if (top === null || section.offsetTop < top.offsetTop) top = section;
      });

      navLinks.forEach(function (link) {
        var isCurrent = !!top && link.getAttribute('href') === '#' + top.id;
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      markCurrent();
    }, { rootMargin: '-25% 0px -60% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ----------------------------------------------------------------------
     Bento count-up
     The final value is already in the HTML, so a visitor without JavaScript
     (or with reduced motion) simply sees the number.
     ---------------------------------------------------------------------- */

  var counters = document.querySelectorAll('.bento__num[data-count]');

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    var duration = 900;
    var started = null;

    function frame(now) {
      if (started === null) started = now;
      var t = Math.min((now - started) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);          /* ease-out cubic */
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (!reduceMotion && counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Pointer spotlight
     Publishes the cursor position to the card as --mx / --my. Skipped on
     coarse pointers and under reduced motion, where the CSS layer stays
     transparent because the properties are never set.
     ---------------------------------------------------------------------- */

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer && !reduceMotion) {
    var spotlit = document.querySelectorAll('.card, .finding');

    Array.prototype.forEach.call(spotlit, function (el) {
      el.addEventListener('pointermove', function (event) {
        var box = el.getBoundingClientRect();
        el.style.setProperty('--mx', (event.clientX - box.left) + 'px');
        el.style.setProperty('--my', (event.clientY - box.top) + 'px');
      });
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
