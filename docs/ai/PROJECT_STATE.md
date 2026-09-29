# Project State — okasha.me

The durable, always-current shared state of the project — the state and approved queue any agent
(Claude, Codex) or a returning human can recover from. The primary live continuation record is
[`HANDOFF.md`](HANDOFF.md); **read both before picking up work and update them before you hand off
or stop.** For a parallel workstream or specific mid-task ownership transfer, copy
[`HANDOFF_TEMPLATE.md`](HANDOFF_TEMPLATE.md) to `handoffs/<topic>.md`. New task specs:
[`TASK_TEMPLATE.md`](TASK_TEMPLATE.md). Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

_Last updated: 2026-09-29 by Claude._

## Repository state
- Branch: `master`. Verify with `git status -sb` and `git log -1` — this file does not pin a
  commit hash, because a pinned hash goes stale the moment anyone commits (it already did once).
  `HANDOFF.md` records the exact commit at the last handoff.
- Deploy: pushing `master` → `.github/workflows/deploy.yml` → GitHub Pages (live at www.okasha.me).
  **The owner reviews and pushes; agents do not push.** CI has been green on Astro 7 since `9e0ba3f`.
- Toolchain: Astro **7.3.3**, Node **>=22.12** (`.nvmrc`, `package.json` engines). `npm audit`: 0.

## Recently completed
- Full 2019 Jekyll → Astro rebuild (built on Astro 5, now Astro 7); live via Pages.
- Interactive resume with sanitized receipts; skills dossiers; workshop + system-design pages.
- WebGL `Aurora` backdrop. (The galaxy intro `Preloader` was removed 2026-09-22 at the owner's request — component deleted, not disabled.)
- **Bookshelf**: `books` content collection (10 entries), covers/ratings, star ratings on spines,
  finished sorted by rating. Nested under the Library at `/library/books`; nav, ⌘K palette, and
  back-links all point there; standalone top-level "books" nav item removed.
- **Real book covers** (2026-07-26): 9/10 books show real cover art sourced from Open Library
  (owner-approved source); 1 remains on the deterministic tinted fallback.
- **Site-wide image viewer** (2026-07-30/31, `419d4ea` + `feb58d8`): `src/components/Lightbox.astro`,
  mounted once in `Base.astro`. Vanilla JS (no new dependency, per the scope rules). Replaced the
  workshop's separate diagram-zoom overlay so there is one viewer with one set of behaviors.
  Inset panel over a blurred backdrop (not edge-to-edge), X top-left on all viewports, Escape /
  backdrop / click-outside to close, arrows + ←→ keys + swipe with caption and `n / total`,
  focus trap, focus restored to the trigger, scroll lock, reduced-motion aware.
- **Homepage under-construction notice** (2026-07-28, `d39bc38`): amber `.wip-banner` in the hero
  above the status pill, flagging that content is still being filled in. **Temporary** — remove the
  `.wip-banner` markup + styles in `src/pages/index.astro` when the data is current.
- **Case studies surfaced** (`969c96e`, `1c48902`): the two system-design case studies were missing
  from the homepage rail, Library and RSS because they are `.astro` pages, not collection entries.
  `src/data/case-studies.ts` registers them; pages read their metadata from it via `caseStudy()`.
- **⌘K index moved to `/search.json`** (`dc8a5eb`): it had been inlined into every page (55% of all
  HTML). Total HTML 1,113 KB → 483 KB; homepage 41.8 KB → 14.4 KB.
- **Content templates + draft system** (2026-09-29): every missing piece now has a template in the
  exact place its real content goes, visible only in `npm run dev` (list at `/drafts`). Production
  output was verified byte-identical before and after. Guards: build fails on any leftover `✎` or
  any internal link to an unbuilt page.
- **Deploy artifact 190 MB → 41 MB** (`162cf08`): 25 never-linked originals excluded via
  `archive-only-media.txt`; kept in the repo.
- **No links to empty shelves** (`c8e2577`): homepage tiles, receipts and skill dossiers filter
  `/library?shelf=X` links through `isLiveLink`.

### External audit response (2026-09-22)
An outside review scored content 4/10, search 5/10, a11y 6/10, SEO 6/10. The
engineering half of its findings is now done (`bb0ff49`, `4c4e041`, `da86334`,
`4d82e5c`): canonical host + extension-less canonicals + article metadata and
JSON-LD; palette/mobile-menu dialog semantics, focus trapping and headings;
⌘K now indexes projects, systems, skills, receipts and article bodies;
empty shelves and placeholder cards are hidden. Its preloader finding was
already resolved by `f30f670`.

**Still open from that audit, and blocked on the owner:** the About rewrite,
three flagship case studies (Forge OS / Praxis Forge, LifeKeep, Chamber), the
Meta end-date discrepancy (site says Feb 2026, an earlier note said Jan 2026),
and the 180 MB deploy artifact. (The Astro 5→7 upgrade is done — see the Dependabot entry.)

## Next-task queue
Rough priority order. Promote one to a `TASK_TEMPLATE.md` copy when starting it.

**No task is currently in progress.** Nothing here is started; pick the top item or take owner
direction. Items 1–3 mostly need *content from the owner*, not engineering.

Every item below already has a template in place — run `npm run dev` and open `/drafts` for the
live list with exact files and placeholder counts. The work is replacing `✎` text, not creating files.

1. **First ML / AI entry** — 3 planned: `src/content/library/{agent-memory-patterns,
   attention-from-scratch,eval-driven-development}.md`. Publishing any one brings back the homepage
   AI LAB tile, two skill dossiers and three receipt links.
2. **About rewrite** — `src/drafts/pages/about.astro` (dev: `/drafts/about`); publish by moving it
   over `src/pages/about.astro`. **Plus the Meta end date** (Feb vs Jan 2026): `src/data/journey.ts:20`,
   `src/pages/resume.astro:41`, `resume/resume.pdf`.
3. **Flagship case studies** — `src/drafts/pages/workshop/systems/{forge-os,lifekeep,chamber}.astro`
   + their `draft: true` entries in `src/data/case-studies.ts` and `src/data/projects.ts`.
4. **Retire the under-construction banner** once 1–2 ship (`src/pages/index.astro`, `.wip-banner`).
5. **The rest of the planned Library** (from the design handoff): 12 more drafts across every shelf,
   plus `project-retrospective.md` for the old projects' write-ups.
6. **Books** — drafts for *The Design of Everyday Things* and *Siddhartha*; notes for note-less books;
   buy links; replace the public "Coming soon" text in *Don't Believe Everything You Think*.

## Known issues / decisions on record
- **Book-cover sourcing (2026-07-26):** the owner explicitly approved **Open Library**
  (`covers.openlibrary.org`) as the cover source for this public repo. Covers are publisher
  artwork used as small thumbnails to identify the books; the licensing basis is the owner's
  decision on record. Future covers should come from the same source, be **English retail
  editions**, and be visually checked before committing (reject library-stamped scans, regional
  "not for sale" editions, wrong-language editions, and square audiobook art where a 2:3 cover exists).
- **Star ratings moved off the covers (2026-07-26):** the rating used to be an absolutely
  positioned `.rating-strip` overlaying the bottom of the cover art (fine over the old dark
  placeholder spines, but it hid the printed author name on real covers). It is now a `.rating-row`
  in the card flow, below the title/author — no gradient needed. The "NOTES" ribbon and the
  ★ recommended marker remain deliberate corner overlays on the cover.
- **Lightbox is hand-rolled, on purpose (2026-07-30):** the owner asked for "the best image
  library"; a vanilla island was chosen over PhotoSwipe/GLightbox/Fancybox because `AGENTS.md`
  caps the dependency surface and requires vanilla islands. Do not swap in a library without the
  owner's say-so. It is the **single** image viewer — the workshop's old per-page diagram-zoom
  overlay was deleted in favour of it; do not reintroduce a second overlay.
- **Lightbox focus ring (2026-07-31):** closing with Escape counts as keyboard input to
  `:focus-visible`, so restoring focus to the trigger used to leave a mint ring stuck on the image.
  The viewer now tracks whether it was opened by pointer or by Enter/Space: pointer-opened returns
  focus silently (`.lb-noring`), keyboard-opened keeps the ring (it is the only cue a keyboard user
  has). The ring also shows on `:hover` as the "this expands" affordance. Keep both halves if you
  touch this — removing the ring outright is an accessibility regression.
- **Lightbox never hijacks links:** any image inside an `<a>` is skipped, which is what keeps the
  bookshelf covers navigating to their detail pages. Preserve that guard.
- **Dependabot — RESOLVED 2026-09-22, the old decision was wrong.** The record long claimed an
  Astro 5→7 upgrade was "not worth it for a static site". Verified in this checkout: it is a clean
  upgrade. Astro is now **7.3.3** and `npm audit` reports **0 vulnerabilities** (down from 10:
  1 critical, 7 high, 1 moderate, 1 low). `@astrojs/rss` and `@astrojs/sitemap` needed no change.
  The emitted HTML manifest hashes identically to the Astro 5 baseline, so the upgrade is
  output-neutral. The only blocker was malformed markup in `workshop.astro` that Astro 5 had been
  silently repairing (`88e4721`). **Astro 7 requires Node >=22.12.0** — CI pins `node-version: 22`,
  which satisfies it; do not lower that.
- **Drafts are dev-only, enforced (2026-09-29):** the rule lives in `src/data/drafts.ts`
  (`visible`, `visibleItem`); page templates in `src/drafts/pages/` are routed by the
  `drafts-and-guards` integration only when `command === 'dev'`. Template topics come from the design
  handoff (`redesign/Library.dc.html`, 16 planned entries), not invented. Dev UI must stay out of
  shared CSS (use `DevHint` / `DEV_CSS`) so production output does not change. `_templates/` was
  rebuilt as one blank form per shelf; the old topic stubs became the in-place drafts, and the
  broken `type: book` stub is gone (books are their own collection).
- **Archive-only media (2026-09-25):** `archive-only-media.txt` + the `astro.config.mjs` hook keep
  25 large originals out of the deploy. Chosen by scanning all git history, not current sources:
  56 files unused today were linked by older pages and must stay published. The list is committed
  (not computed) because CI's shallow clone cannot scan history.
- **⌘K index is fetched, not inlined (2026-09-24):** built by `src/data/search-index.ts` and served
  as `/search.json`, loaded on first palette open. Do not move it back into `define:vars` — that
  duplicates it into every page.
- **Case-study registry is the source of truth (2026-09-24):** title / kicker / summary / date live in
  `src/data/case-studies.ts`; pages call `caseStudy(slug)`, which fails the build if unregistered.
- **Dates render in UTC (2026-09-23):** bare frontmatter dates are UTC midnight; `fmtMeta`/`fmtKicker`
  use UTC getters so a date renders as written and local and CI builds agree.
- **GPG on this machine (2026-09-23):** two gpg installs with separate keyrings. The signing key
  `D3B605C66327602A` is only in `/opt/homebrew/bin/gpg`; `/usr/local/bin/gpg` (MacGPG2) lacks it, and
  whichever is first on `PATH` wins. If a commit fails with "No secret key", that is the cause.
- **Legacy Jekyll files** (`_includes/`, `_layouts/`, `css/`, `javascripts/`, `_config.yml`,
  `index.html`, `404.html`) are retained for reference and are not built. Do not delete without the
  owner's say-so (and never delete media).

## Validation baseline
`npm run build` is the gate (no separate lint/type-check/test). CI runs it on every push.
For visible changes, preview the built site on `:4321` (rebuild first) or dev on `:4322`.
