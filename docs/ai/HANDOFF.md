# Repository Handoff — okasha.me

This is the canonical live continuation record for the primary workstream. A fresh agent should
read it after `AGENTS.md`, verify it against Git, then read `PROJECT_STATE.md` and the listed task
documents. Do not rely on conversation history or agent-specific memory.

## Handoff metadata

- Task: Claude review of the handoff system (done) → real book covers (blocked, needs owner assets)
- Status: Review complete; next product task Blocked on a human decision
- Current owner: Claude → returning to owner for a decision
- Intended next owner: Owner (supply/approve cover assets), then Claude implements
- Last updated: 2026-07-26 by Claude
- Branch: `master`
- Base commit (before this review): `e9b6726`
- Current commit: the Claude-review commit containing this update; verify with `git log -1`
- Working tree expected: clean after the review commit

The receiving agent must verify these fields. The review commit is expected to be one commit after
`e9b6726` and contain only handoff-documentation + two coherence fixes (`AGENTS.md`, `CLAUDE.md`).
If the branch, parent commit, or working-tree expectation does not match, stop and report the
discrepancy before editing.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — repository rules and session recovery protocol
- [`docs/ai/PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions, and approved queue
- [`docs/ai/handoffs/claude-review.md`](handoffs/claude-review.md) — the review brief + review result
- [`src/content.config.ts`](../../src/content.config.ts) — book content schema (`cover` is optional string)
- [`src/content/books/`](../../src/content/books/) — current book records
- [`src/components/BookCover.astro`](../../src/components/BookCover.astro) — cover img vs. tinted fallback

## Current state

The Astro site is on `master`, bookshelf nested at `/library/books`. Claude has completed the
review of Codex's handoff-system work (see below) and applied two documentation-coherence fixes.
The next approved product task — real book covers — is **blocked** pending a human decision on how
to source repository-safe cover images (see "Unresolved risks" / "Recommended next action").

## Completed in this handoff (Claude review)

- **Verified Git metadata:** branch `master`, HEAD `e9b6726` (parent `4aa83ad`), working tree clean.
  Note: `origin/master` is now at `e9b6726` — the owner already pushed the earlier handoff commits
  (expected; the owner reviews and pushes). Earlier docs' "not pushed / one commit ahead" wording
  was pre-push drift, now corrected.
- **Verified scope:** the entire diff since the last product commit `f946bad` touches only
  `.codex/*`, `AGENTS.md`, `CLAUDE.md`, and `docs/ai/*` — no product code, content, or media.
- **Verified references:** all 19 paths named across the handoff docs exist; the bracketed
  `[...slug].astro` route link resolves. 10 book records confirmed (2 placeholder covers, 8 fallbacks).
- **Verified config:** `.codex/config.toml` (on-request / workspace-write) and
  `.codex/rules/safety.rules` (git guardrails only) are conservative and correctly scoped — no
  Docker/Postgres/Terraform rules, matching this repo's stack.
- **Fixed two coherence defects:**
  - `AGENTS.md` "AI collaboration" said copy the template to `HANDOFF-<topic>.md`; corrected to
    `docs/ai/handoffs/<topic>.md` to match every other reference and the actual convention.
  - `CLAUDE.md` "Handing off to Codex" referenced only `PROJECT_STATE.md`; now also points at the
    canonical live `HANDOFF.md`.

## Validation

| Command | Result |
|---|---|
| `npm run build` | Passed — 23 pages built on 2026-07-26 (run by Claude) |
| `git diff --check` | Passed — clean |
| Referenced-path check | Passed — all handoff/code paths exist |

## Remaining work

- **Real book covers (blocked).** Set `cover:` for all ten `src/content/books/*.md` and add the
  images under `images/covers/`. Blocked because real covers are copyrighted publisher artwork and
  must not be committed to this public repo without owner-provided files or explicit approval of a
  license-safe source. Setting `cover:` to non-existent files would render broken images (worse than
  the current clean fallback), so no `cover:` fields were changed.

## Unresolved risks

- **Copyright / public-repo assets:** sourcing real covers is the flagged risk. Needs the owner to
  either drop owned/licensed cover files into `images/covers/`, or approve a specific license-safe
  source, before implementation.

## Recommended next action

Owner decision required: provide or approve repository-safe cover images (see PROJECT_STATE.md
task 1). Once the image files exist under `images/covers/`, Claude sets `cover: /images/covers/<file>`
in each of the ten book records, runs `npm run build`, and previews `/library/books` + a detail
route on desktop/mobile. If covers are deferred, the next queue item (purchase links) is unaffected
but was not started, to keep this transfer scoped to the reviewed task.

## Before stopping

Update this file with the exact owner, branch, commits, working-tree files, completed work,
validation results, remaining work, risks, and one concrete next action. Update `PROJECT_STATE.md`
when the durable state or approved queue changes. Never claim a command passed unless it ran
successfully.
