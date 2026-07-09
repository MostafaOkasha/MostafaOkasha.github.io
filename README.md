# okasha.me
## Personal archive — writing, projects, CAD, system designs, and an interactive resume
### Live at: https://www.okasha.me

Rebuilt from scratch in 2026: **Astro 5** + content collections + vanilla-JS islands,
deployed to **GitHub Pages** via Actions. Designed dark-only in the site's original
navy (`#0a192f`) + mint (`#64ffda`) palette. The design handoff lives in [`redesign/`](redesign/).

&nbsp;

## The surfaces

| Route | What it is |
|---|---|
| `/` | Aurora flow-field hero, latest-from-the-archive rail, section index |
| `/library` | Ten shelves of writing — essays, CS curriculum, ML notes, books, papers, ideas, reflections, quotes, spirituality, resource maps |
| `/workshop` | Projects, system-design diagrams (click to zoom), the CAD gallery, photographs |
| `/resume` | The paper resume — every dashed claim opens its receipts. `⌘P`-clean print stylesheet |
| `/skills` | Evidence-backed skill dossiers — click a tool, see where it shipped |
| `⌘K` | Command palette over everything, from any page |

## Writing a new library entry

```bash
# 1. copy a template
cp src/content/library/_templates/reflection-template.md src/content/library/my-new-entry.md
# 2. fill in frontmatter (title, description, type, topics, date) + write markdown
# 3. remove `draft: true`, then:
git add . && git commit -m "New entry" && git push
```

That's it — the shelf, badge, search index, homepage rail, and ⌘K palette all update at
build time. The ten `type` values map to the ten shelves (see `src/data/shelves.ts`).

## Running locally

```bash
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
