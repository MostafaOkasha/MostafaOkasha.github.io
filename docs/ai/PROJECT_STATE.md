# Project State — okasha.me

The durable, always-current shared state of the project — the state and approved queue any agent
(Claude, Codex) or a returning human can recover from. The primary live continuation record is
[`HANDOFF.md`](HANDOFF.md); **read both before picking up work and update them before you hand off
or stop.** For a parallel workstream or specific mid-task ownership transfer, copy
[`HANDOFF_TEMPLATE.md`](HANDOFF_TEMPLATE.md) to `handoffs/<topic>.md`. New task specs:
[`TASK_TEMPLATE.md`](TASK_TEMPLATE.md). Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

_Last updated: 2026-07-26 by Claude._

## Repository state
- Branch: `master` — clean. `origin/master` was at `e9b6726` (`Prepare Claude review handoff`) at
  the start of this review; the owner had already pushed the handoff-system commits. Claude then
  added a local review commit (two doc-coherence fixes + this update) that is **not pushed**.
- Verify the current commit with `git log -1`; its parent is `e9b6726`.
- Deploy: pushing `master` → `.github/workflows/deploy.yml` → GitHub Pages (live at okasha.me).
  **The owner reviews and pushes; agents do not push.**
- Handoff-system review (Claude, 2026-07-26): **passed** — scope was docs/config only, build green
  (23 pages), `.codex` config conservative. Two coherence fixes applied (see `HANDOFF.md`).

## Recently completed
- Full 2019 Jekyll → Astro 5 rebuild; live and deploying via Pages.
- Interactive resume with sanitized receipts; skills dossiers; workshop + system-design pages.
- Loading galaxy `Preloader` + WebGL `Aurora` backdrop.
- **Bookshelf**: `books` content collection (10 entries), covers/ratings, star ratings on spines,
  finished sorted by rating. Nested under the Library at `/library/books`; nav, ⌘K palette, and
  back-links all point there; standalone top-level "books" nav item removed.

## Next-task queue
Rough priority order. Promote one to a `TASK_TEMPLATE.md` copy when starting it.

1. **Real book covers.** _(Blocked — needs owner assets/approval as of 2026-07-26.)_
   `images/covers/dont-believe-everything-you-think.jpg` and `solve-for-happy.jpg` are placeholder
   art; the other 8 books have no `cover:` and render the tinted spine fallback (`BookCover.astro`).
   Adding real covers requires image files under `images/covers/` — but real book covers are
   copyrighted publisher artwork, and this is a public repo, so they must be **owner-provided
   (owned/licensed)** or a **license-safe source explicitly approved** by the owner. Do not commit
   downloaded copyrighted covers, and do not set `cover:` to files that don't exist (that renders
   broken images). _Done when_ every book shows a real, repository-safe cover and the build passes.
2. **Purchase links.** Book schema supports `purchase:` (currently commented out in frontmatter).
   Add buy/affiliate links per book; the book page renders a "Buy the book →" button.
3. **Fill in book notes.** Several books are intentionally note-less (e.g. "Modern Man in Search of
   a Soul") or "Coming soon" (e.g. "Don't Believe Everything You Think" review/summary). The owner
   adds notes over time; keep private self-reflection passages **out** (public repo).
4. **Grow the Library.** Only 3 library entries exist. New entries are markdown files in
   `src/content/library/` (see `src/content/library/_templates/`); shelves/badges/search/RSS update
   at build time.

## Known issues / decisions on record
- **Dependabot:** ~6 Astro-core alerts remain open; the fix needs an Astro 5→7 major upgrade,
  judged not worth it for a static, no-SSR, trusted-content site. Two `dependabot/*` branches exist
  on the remote. Leave unless deliberately revisiting.
- **README staleness (minor):** `README.md` still lists "books" among the ten `/library` shelves,
  but books is now the nested `/library/books` subpage. Human-facing; touch up when convenient.
- **Legacy Jekyll files** (`_includes/`, `_layouts/`, `css/`, `javascripts/`, `_config.yml`,
  `index.html`, `404.html`) are retained for reference and are not built. Do not delete without the
  owner's say-so (and never delete media).

## Validation baseline
`npm run build` is the gate (no separate lint/type-check/test). CI runs it on every push.
For visible changes, preview the built site on `:4321` (rebuild first) or dev on `:4322`.
