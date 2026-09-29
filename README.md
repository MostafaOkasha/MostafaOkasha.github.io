# okasha.me
## Personal archive — writing, projects, CAD, system designs, and an interactive resume
### Live at: https://www.okasha.me

[![Deploy to GitHub Pages](https://github.com/MostafaOkasha/MostafaOkasha.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/MostafaOkasha/MostafaOkasha.github.io/actions/workflows/deploy.yml)

Rebuilt from scratch in 2026: **Astro 7** + content collections + vanilla-JS islands,
deployed to **GitHub Pages** via Actions. Designed dark-only in the site's original
navy (`#0a192f`) + mint (`#64ffda`) palette. The design handoff lives in [`redesign/`](redesign/).

&nbsp;

## The surfaces

| Route | What it is |
|---|---|
| `/` | Aurora flow-field hero, latest-from-the-archive rail, section index |
| `/library` | Writing on typed shelves (essays, CS & ML notes, papers, ideas, reflections, quotes, spirituality, resource maps) plus the system-design case studies; empty shelves stay hidden |
| `/library/books` | The bookshelf — reading, read, to-read, with notes on some |
| `/workshop` | Projects, system-design diagrams (click to zoom), the CAD gallery, photographs |
| `/resume` | The paper resume — every dashed claim opens its receipts. `⌘P`-clean print stylesheet |
| `/skills` | Evidence-backed skill dossiers — click a tool, see where it shipped |
| `⌘K` | Command palette over everything, from any page |

## Writing content

Run `npm run dev` and open **http://localhost:4321/drafts** — a dev-only list of every template
on the site (planned Library entries, book notes, case studies, the About rewrite), each with the
exact file to edit and how many placeholders are left.

- **Templates are placed where the real content goes.** Each is a normal file marked
  `draft: true` (or, for whole pages, a file under `src/drafts/pages/`). In `npm run dev` it
  appears in place — stamped DRAFT, every placeholder highlighted — so you see exactly how it
  will read. It never appears in a production build.
- **Placeholders start with `✎`.** Search for it to jump between them.
- **Publish** by replacing every `✎` and deleting `draft: true`. The build refuses while any
  `✎` is left or while anything links to a page that doesn't exist, so an unfinished template
  cannot reach the live site.
- **New entry:** copy a blank form from `src/content/library/_templates/` (one per shelf) or
  `src/content/books/_templates/book.md`.

## Running locally

```bash
nvm use           # Node >=22.12 (see .nvmrc) — Astro 7 will not run on 21
npm install
npm run dev        # dev server on :4321 with hot reload
npm run build      # static build into dist/
npm run preview    # serve the production build
```

Media (`images/`, `videos/`, `resume/`, `documents/`) lives at the repo root and is
symlinked into `public/`, so all URLs from the 2019 site still resolve.

## Structure

```
src/
  pages/           index, library (+[slug]), workshop, resume, skills, 404
  layouts/         Base.astro — head, fonts, meta, ⌘K palette
  components/      Nav, Aurora (canvas), CommandPalette
  content/library/ every published entry, one markdown file each
  data/            shelves, skills dossiers, resume receipts
  styles/          global.css — the full token system
redesign/          the design handoff package (prototypes + README)
.github/workflows/ deploy.yml — build + deploy Pages on push to master
```

The previous Jekyll site's source (`_includes/`, `_layouts/`, `css/`, `javascripts/`)
is retained in-tree for reference and is not part of the build.

## Deploying

Pushes to `master` trigger `.github/workflows/deploy.yml`. One-time setup:
**repo Settings → Pages → Source → "GitHub Actions"**. Custom domain (okasha.me) is
carried in `public/CNAME`; Cloudflare sits in front.

&nbsp;

# License

MIT — see [LICENSE](LICENSE).
