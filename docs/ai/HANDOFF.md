# Repository Handoff — okasha.me

This is the canonical live continuation record for the primary workstream. A fresh agent should
read it after `AGENTS.md`, verify it against Git, then read `PROJECT_STATE.md` and the listed task
documents. Do not rely on conversation history or agent-specific memory.

## Handoff metadata

- Task: Claude review of the handoff system (PASS) → real book covers (implemented)
- Status: Complete — awaiting owner review/push
- Current owner: Claude (finished)
- Intended next owner: Owner (review + push), then either agent for the next queue item
- Last updated: 2026-07-26 by Claude
- Branch: `master`
- Base commit (state received): `e9b6726` (`Prepare Claude review handoff`), which was also `origin/master`
- Current commit: the book-cover commit; verify with `git log -1` (expect 2 local commits ahead of `origin/master`)
- Working tree expected: clean
- Push status: **not pushed** — the owner reviews and pushes

Verify these fields against Git. If they do not match, stop and report before editing.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — repository rules and session recovery protocol
- [`docs/ai/PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions, approved queue
- [`docs/ai/handoffs/claude-review.md`](handoffs/claude-review.md) — review brief + recorded result
- [`src/content.config.ts`](../../src/content.config.ts) — book schema (`cover` optional string)
- [`src/components/BookCover.astro`](../../src/components/BookCover.astro) — cover img vs. tinted fallback

## Current state

The Astro site is on `master`, bookshelf nested at `/library/books`. Both pieces of this transfer
are done:

1. **Handoff-system review — PASS** (details in `handoffs/claude-review.md`). Two documentation
   coherence defects were found and fixed.
2. **Real book covers — implemented.** 9 of 10 books now render real cover art; 1 keeps the
   fallback because no cover exists upstream.

## Completed in this handoff

**Review (commit `19087c9`)**
- Verified Git metadata: `master`, HEAD `e9b6726` (parent `4aa83ad`), tree clean.
- Verified scope: everything since the last product commit `f946bad` touched only `.codex/*`,
  `AGENTS.md`, `CLAUDE.md`, `docs/ai/*` — no product code or media.
- Verified all 19 referenced paths exist; `.codex` config/rules conservative and correctly scoped.
- Fixed: `AGENTS.md` referenced `HANDOFF-<topic>.md` (corrected to `docs/ai/handoffs/<topic>.md`);
  `CLAUDE.md` handoff section now also points at the canonical `HANDOFF.md`.
- Noted: `origin/master` had already been pushed to `e9b6726`, so earlier "not pushed" wording was
  pre-push drift; corrected in the docs.

**Book covers (this commit)**
- Owner approved **Open Library** as the cover source (recorded in `PROJECT_STATE.md` decisions).
- Downloaded 9 covers to `images/covers/` and set `cover:` in 9 of 10 `src/content/books/*.md`.
- Replaced the two placeholder images with genuine cover art.
- Editions were visually checked and bad ones rejected: French Carnegie edition → English retail;
  Nguyen "Special Indian Edition / sale in USA & UK is illegal" → clean standard edition;
  library-stamped "Withdrawn from collection" McGonigal scan → clean retail cover.
- `that-little-voice-in-your-head` intentionally left with **no** `cover:` — Open Library has the
  record but no cover image, and no ISBN variant resolved. It renders the tinted fallback.
- `BookCover.astro` was **not** modified; fallback behavior preserved for future records.

## Validation

| Command | Result |
|---|---|
| `npm run build` | Passed — 23 pages (re-run after the cover change) |
| `git diff --check` | Passed — clean |
| Cover-path existence check (9 paths) | Passed — every `cover:` resolves to a real file |
| DOM check on `/library/books` | Passed — 10 cover slots, **0 broken images**, exactly 1 intentional fallback |
| Preview `/library/books` @ 1280×900 | Checked — real covers render correctly |
| Preview `/library/books` @ 375×812 (mobile) | Checked — 2-column grid, covers crisp |
| Preview `/library/books/12-rules-for-life` | Checked — detail route shows the real cover |

## Remaining work

- Optional: supply a cover for **That Little Voice in Your Head** (Mo Gawdat) if one is wanted;
  none is available via Open Library. Until then the fallback is correct behavior.
- Next approved queue item is **purchase links** (`PROJECT_STATE.md` item 2) — not started.

## Unresolved risks

- **Cover licensing:** covers are publisher artwork obtained from Open Library under the owner's
  explicit approval. Used as small identifying thumbnails. If the owner later wants a stricter
  basis, the covers are isolated in `images/covers/` and each `cover:` line can be removed to fall
  back cleanly — no code change required.
- **Cosmetic (not a defect):** the rating strip / NOTES ribbon overlay cover art and partially cover
  the printed author name on some covers. Left alone deliberately to keep this task scoped.

## Recommended next action

Owner: review the two local commits and push when satisfied. After that, the next approved task is
**purchase links** for the books (`PROJECT_STATE.md` item 2) — the schema already supports
`purchase:` and the detail page already renders a "Buy the book →" button.

## Before stopping

Update this file with the exact owner, branch, commits, working-tree files, completed work,
validation results, remaining work, risks, and one concrete next action. Update `PROJECT_STATE.md`
when the durable state or approved queue changes. Never claim a command passed unless it ran
successfully.
