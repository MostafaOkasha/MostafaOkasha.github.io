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
- **Real book covers** (2026-07-26): 9/10 books show real cover art sourced from Open Library
  (owner-approved source); 1 remains on the deterministic tinted fallback.
- **Site-wide image viewer** (2026-07-27): `src/components/Lightbox.astro`, mounted once in
  `Base.astro`. Vanilla JS (no new dependency, per the scope rules). Replaced the workshop's
  separate diagram-zoom overlay so there is one viewer with one set of behaviors.

## Next-task queue
Rough priority order. Promote one to a `TASK_TEMPLATE.md` copy when starting it.

1. ~~**Real book covers.**~~ **DONE 2026-07-26.** Owner approved Open Library as the cover source.
   9 of 10 books now carry real covers in `images/covers/` with `cover:` set in their records
   (the two placeholders were replaced with genuine cover art). **"That Little Voice in Your Head"
   keeps the tinted fallback** — Open Library has the record but no cover image for it, and no ISBN
   variant resolved. Editions were hand-checked: the French Carnegie, the "Indian edition / illegal
   for USA & UK sale" Nguyen, and the library-stamped McGonigal scans were rejected in favour of
   clean English retail editions. _Follow-up (optional):_ supply a cover for that one remaining book.
2. **Purchase links.** Book schema supports `purchase:` (currently commented out in frontmatter).
   Add buy/affiliate links per book; the book page renders a "Buy the book →" button.
3. **Fill in book notes.** Several books are intentionally note-less (e.g. "Modern Man in Search of
   a Soul") or "Coming soon" (e.g. "Don't Believe Everything You Think" review/summary). The owner
   adds notes over time; keep private self-reflection passages **out** (public repo).
4. **Grow the Library.** Only 3 library entries exist. New entries are markdown files in
   `src/content/library/` (see `src/content/library/_templates/`); shelves/badges/search/RSS update
   at build time.

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
