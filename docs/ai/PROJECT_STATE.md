# Project State — okasha.me

The durable, always-current shared state of the project — the state and approved queue any agent
(Claude, Codex) or a returning human can recover from. The primary live continuation record is
[`HANDOFF.md`](HANDOFF.md); **read both before picking up work and update them before you hand off
or stop.** For a parallel workstream or specific mid-task ownership transfer, copy
[`HANDOFF_TEMPLATE.md`](HANDOFF_TEMPLATE.md) to `handoffs/<topic>.md`. New task specs:
[`TASK_TEMPLATE.md`](TASK_TEMPLATE.md). Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

_Last updated: 2026-07-31 by Claude._

## Repository state
- Branch: `master` — clean working tree, **fully pushed**: `HEAD` = `origin/master` = `feb58d8`
  (`Lightbox: don't leave a focus ring after closing with Esc`). Verify with `git log -1` and
  `git status -sb`.
- Deploy: pushing `master` → `.github/workflows/deploy.yml` → GitHub Pages (live at okasha.me).
  **The owner reviews and pushes; agents do not push.** Everything through `feb58d8` is live.
- Handoff-system review (Claude, 2026-07-26): **passed** — scope was docs/config only, build green
  (23 pages), `.codex` config conservative. Two coherence fixes applied. That task-scoped record
  ([`handoffs/claude-review.md`](handoffs/claude-review.md)) is closed; do not treat it as live.

## Recently completed
- Full 2019 Jekyll → Astro 5 rebuild; live and deploying via Pages.
- Interactive resume with sanitized receipts; skills dossiers; workshop + system-design pages.
- Loading galaxy `Preloader` + WebGL `Aurora` backdrop.
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

## Next-task queue
Rough priority order. Promote one to a `TASK_TEMPLATE.md` copy when starting it.

**No task is currently in progress.** Nothing here is started; pick the top item or take owner
direction. Items 1–3 mostly need *content from the owner*, not engineering.

1. **Purchase links.** Book schema supports `purchase:` (currently commented out in each
   frontmatter). Add buy/affiliate links per book; `src/pages/library/books/[...slug].astro`
   already renders a "Buy the book →" button when `purchase:` is set — so this is content-only,
   no code change expected.
2. **Fill in book notes.** Several books are intentionally note-less (e.g. "Modern Man in Search of
   a Soul") or "Coming soon" (e.g. "Don't Believe Everything You Think" review/summary). The owner
   adds notes over time; keep private self-reflection passages **out** (public repo).
3. **Grow the Library.** Only 3 library entries exist. New entries are markdown files in
   `src/content/library/` (see `src/content/library/_templates/`); shelves/badges/search/RSS update
   at build time.
4. **Retire the under-construction banner** once the content above is current — remove the
   `.wip-banner` markup and styles from `src/pages/index.astro`.

_Small optional follow-ups:_ a cover for "That Little Voice in Your Head" (none exists on Open
Library — it is the one book still on the tinted fallback); the `README.md` shelf-list touch-up
noted below.

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
