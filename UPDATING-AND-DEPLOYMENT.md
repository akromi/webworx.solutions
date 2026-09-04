# Updating and deployment

**The one thing to know:** anything saved to the `main` branch on GitHub goes
live on https://webworx.solutions within about a minute. There is no build step
and nothing to install. You never need to visit Cloudflare to publish a change.

---

## Option A — Edit in the browser (easiest)

Best for changing wording, fixing a typo, updating a number.

1. Go to https://github.com/akromi/webworx.solutions
2. Click the file you want to change — usually **`index.html`**.
3. Click the **pencil icon** (✏️) at the top right of the file.
4. Make your change. Use **Ctrl+F** to find the text you want to edit.
5. Scroll to the bottom. In **Commit changes**, write a short note about what
   you changed (e.g. "Update phone number").
6. Make sure **"Commit directly to the `main` branch"** is selected.
7. Click **Commit changes**.

Wait about a minute, then reload https://webworx.solutions.
If you don't see the change, hold **Shift** and click reload.

---

## Option B — Edit on your computer

Best for bigger changes, or if you want to preview before publishing.

**First time only — get a copy:**

```bash
git clone https://github.com/akromi/webworx.solutions
cd webworx.solutions
```

**Every time after that:**

```bash
cd webworx.solutions
git pull                      # get the latest version first
```

**Preview your changes before publishing:**

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press **Ctrl+C** in the
terminal to stop it.

> Open the folder with a web server as above — don't double-click
> `index.html`. The page loads its stylesheet from `/assets/...`, which only
> resolves when it's being served.

**Publish:**

```bash
git add .
git commit -m "Short note about what you changed"
git push
```

---

## Checking it deployed

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **webworx-solutions**
2. The **Deployments** tab shows every publish, newest first.
3. A green **Success** means it's live. Red means it failed — click it to read why.

---

## Undoing a change

**If you've published something you want to reverse**, Cloudflare can put the
previous version back immediately:

1. Cloudflare → **webworx-solutions** → **Deployments**
2. Find the last good deployment, click the **⋯** menu on its row
3. Choose **Rollback to this deployment**

That restores the live site straight away. Note it does **not** change the code
on GitHub — the next push will publish whatever is on `main`, so fix the file
there too.

---

## Where things are in `index.html`

Everything is in that one file. Use **Ctrl+F** and search for the text below to
jump to the right place.

| To change | Search for |
|---|---|
| Page title / Google description | `<title>` |
| Big heading on the front page | `hero__title` |
| The paragraph under it | `hero__thesis` |
| Location, clearance, years | `hero__meta` |
| The "build record" panel | `readout__rows` |
| The five number tiles | `bento__tile` |
| Scrolling technology strip | `ticker__set` |
| AidPost and ESMS cards | `showcase__card` |
| The nine capability sections | `cap__btn` |
| The six "Approach" cards | `finding` |
| The eight smaller project cards | `work-grid` |
| Technology lists | `tech-group` |
| Your name, title, bio | `principal` |
| Employment history | `timeline` |
| Email and phone | `contact__actions` |

Colours, spacing and fonts live in `assets/css/styles.css`, near the top under
**Design tokens**.

---

## Two things not to break

**Don't add `style="..."` inside `index.html`**, and **don't add a
`<script>` block** with code directly inside it. The site sends a strict
security policy that blocks both, so they'll silently do nothing. Put styling in
`assets/css/styles.css` and code in `assets/js/main.js` instead.

**Don't lighten the grey text colours** (`--ink-muted`, `--ink-faint` in
`styles.css`). They're set to the lightest shades that still pass the
accessibility contrast standard the site advertises.

Full detail on both is in [README.md](README.md).

---

## If something goes wrong

Roll back in Cloudflare first (see above) so the live site is healthy again,
then sort out the file at your leisure. You cannot permanently break anything —
every version is kept in GitHub's history and can be restored.
