# webworx.solutions

The WEBWorx website — plain HTML, CSS and JavaScript. No framework, no build step,
no dependencies to install. Deployed to **Cloudflare Pages** on the
`webworx.solutions` domain.

**Making a change?** See [UPDATING-AND-DEPLOYMENT.md](UPDATING-AND-DEPLOYMENT.md) — step-by-step instructions
for editing and publishing, in the browser or on your computer.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole site — single page, anchor navigation |
| `UPDATING-AND-DEPLOYMENT.md` | How to edit, publish and roll back the site |
| `assets/css/styles.css` | All styling, organised tokens → reset → primitives → layout → components |
| `assets/js/theme.js` | Applies the stored colour theme before first paint (kept separate so the CSP can forbid inline script) |
| `assets/js/main.js` | Progressive enhancement only — theme toggle, accordion, filters, reveal, scroll-spy, count-up, spotlight |
| `favicon.svg` | The WEBWorx mark |
| `_headers` | Cloudflare Pages response headers — CSP, HSTS, cache policy |
| `_redirects` | `www` → apex, 301 |
| `robots.txt`, `sitemap.xml` | Search-engine basics |

## Local preview

Any static server works. The site uses root-absolute asset paths (`/assets/…`),
so serve the folder rather than opening `index.html` from the file system:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment — Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   select this repository, production branch `main`.
2. Build settings: **no build command**, output directory **`/`** (the repository root).
3. **Custom domains:** add `webworx.solutions` and `www.webworx.solutions`.
   Cloudflare creates the DNS records; `_redirects` sends `www` to the apex.
4. `_headers` and `_redirects` are picked up automatically — no extra configuration.

Every push to `main` deploys production; any other branch gets a preview URL.

## Content policy

`_headers` sets a deliberately strict Content Security Policy:

```
default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'
```

There is **no `'unsafe-inline'`** for either script or style. Two consequences worth
knowing before editing:

- Never add an inline `<script>` — put it in a file under `assets/js/`. The theme
  bootstrap in `assets/js/theme.js` exists for exactly this reason.
- Never add a `style="…"` attribute in the markup. Use a class; the small spacing
  utilities at the end of `styles.css` (`.u-mt`, `.u-mt-lg`, `.u-mb`) cover the
  cases that came up. Setting styles from JavaScript via the CSSOM
  (`el.style.setProperty`) is unaffected — that is how the pointer spotlight works.

Google Fonts is the only permitted off-origin source. Every font stack has a full
system fallback, so the page is complete if that request fails.

## Accessibility

The site is built to the standard it advertises and is verified against it:

- **axe-core, zero violations** in light and dark themes and at mobile width,
  with every capability panel expanded (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
  `best-practice`).
- Semantic landmarks, a skip link, real `<button>` elements for the accordion and
  filters with `aria-expanded` / `aria-pressed`, and `aria-current` on the active
  nav link.
- Closed accordion panels use the `hidden` attribute, so they leave the
  accessibility tree entirely rather than merely being invisible.
- `prefers-reduced-motion` switches off the aurora, ticker, sweep, caret, reveal
  and count-up outright — not merely shortens them.
- **Contrast note:** `--ink-muted` and `--ink-faint` are set to the darkest/lightest
  values that still clear 4.5:1 against `--bg` and `--bg-sunk` in their theme.
  Lightening either (light theme) or darkening either (dark theme) reintroduces a
  serious contrast violation across the ticker, footer, metadata labels and brand
  suffix. Re-run the audit after any palette change.

- **Scroll-reveal is gated behind a `js` class** that `theme.js` sets before first
  paint. The reveal rules start elements at `opacity: 0`, so without that gate a
  visitor with scripting blocked would see blank sections where every finding,
  work card and product spotlight should be. Verified at `opacity: 1` with
  JavaScript disabled, and again under `prefers-reduced-motion`.

The page is fully readable and navigable with JavaScript blocked; `main.js` only
adds convenience.

## Verifying a change

Serve the site, then from a scratch directory:

```bash
npm install @playwright/test @axe-core/playwright axe-core
node a11y.mjs      # axe-core audit, light + dark + mobile
```

Worth checking by hand after layout changes: no horizontal overflow at 390px and
1440px, the hero H1 still fits its grid column beside the readout panel, and the
print stylesheet still renders (decorative layers hidden, capability panels open).

## Content

Capabilities, approach and project descriptions were compiled by reading the
source of 26 repositories — commit history, build configuration, test suites and
architecture documents. Nine of those are private and are described by capability
and technology only: no client identifiers, no source excerpts, no screenshots.
Figures quoted on the page (test-file counts, module counts, workflow counts,
language counts) were measured from those repositories rather than estimated.
