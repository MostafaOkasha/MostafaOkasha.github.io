# Repository Handoff — okasha.me

This is the canonical live continuation record for the primary workstream. A fresh agent should
read it after `AGENTS.md`, verify it against Git, then read `PROJECT_STATE.md` and the listed task
documents. Do not rely on conversation history or agent-specific memory.

## Handoff metadata

- Task: none in progress — the last batch of site work is finished, pushed, and live
- Status: Idle / awaiting owner direction
- Current owner: unassigned
- Intended next owner: either agent, or the owner for the content items
- Last updated: 2026-07-31 by Claude
- Branch: `master`
- Current commit: `feb58d8` (`Lightbox: don't leave a focus ring after closing with Esc`)
- `origin/master`: `feb58d8` — **everything is pushed**; nothing is waiting for review
- Working tree expected: clean

Verify with `git status -sb` and `git log -1`. If the tree is dirty or `HEAD` is not `feb58d8`,
someone has worked since this was written — inspect before editing rather than assuming.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — repository rules and the session recovery protocol
- [`docs/ai/PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions on record, approved queue
- [`docs/ai/TASK_TEMPLATE.md`](TASK_TEMPLATE.md) — copy when starting a queue item
- [`docs/ai/handoffs/claude-review.md`](handoffs/claude-review.md) — **closed**, historical only

## Current state

The Astro site is healthy and fully deployed. Recent work, all live:

| Commit | Date | What |
|---|---|---|
| `19087c9` | 07-26 | Review of the Codex handoff system — passed, two doc-coherence fixes |
| `430879e` | 07-26 | Real book covers, 9/10, from owner-approved Open Library |
| `2566d4a` | 07-26 | Star ratings moved below the cover instead of overlaying the art |
| `d39bc38` | 07-28 | Under-construction notice in the homepage hero |
| `419d4ea` | 07-30 | Site-wide image lightbox (`src/components/Lightbox.astro`) |
| `feb58d8` | 07-31 | Lightbox: no stuck focus ring after closing with Esc |

Details and the reasoning behind each are in `PROJECT_STATE.md` ("Recently completed" and
"Known issues / decisions on record"). Nothing is half-finished and no branch is outstanding.

## Validation (last run, 2026-07-31, by Claude)

| Command | Result |
|---|---|
| `npm run build` | Passed — 23 pages |
| `git diff --check` | Passed — clean |
| Browser preview @ 1280×900 and 375×812 | Checked — lightbox, bookshelf, homepage banner |
| Console errors | None on `/`, `/workshop`, `/library/books`, book detail |

## Remaining work

Nothing is in progress. The queue in `PROJECT_STATE.md` is the source of truth; items 1–3 are
**content the owner supplies**, not engineering:

1. Purchase links for the books (`purchase:` frontmatter — the button already renders)
2. Book notes / summaries for the note-less books
3. More library entries (only 3 exist)
4. Remove the temporary homepage under-construction banner once the above is current

## Unresolved risks

- **Cover licensing** — book covers are publisher artwork from Open Library, committed under the
  owner's explicit approval and used as small identifying thumbnails. Each `cover:` line can be
  removed to fall back cleanly if the owner ever wants a stricter basis; no code change needed.
- **Dependabot** — ~6 Astro-core advisories are knowingly unfixed (would need an Astro 5→7 major
  upgrade; judged not worth it for a static, no-SSR, trusted-content site).
- No correctness, privacy, or data-loss risks outstanding.

## Recommended next action

No approved engineering task is queued — this needs a human decision, not an invented one. Ask the
owner which they want:

- supply purchase links and/or book notes (content), or
- start a new feature they name.

If picking up queue item 1 (purchase links), copy `TASK_TEMPLATE.md`, add `purchase:` to the ten
files in `src/content/books/`, run `npm run build`, and preview a book detail route.

## Before stopping

Update this file with the exact owner, branch, commits, working-tree state, completed work,
validation results, remaining work, risks, and one concrete next action. Update `PROJECT_STATE.md`
when durable state, decisions, or the approved queue change. Never claim a command passed unless it
ran successfully.
