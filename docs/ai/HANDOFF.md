# Repository Handoff — okasha.me

This is the canonical live continuation record for the primary workstream. A fresh agent should
read it after `AGENTS.md`, verify it against Git, then read `PROJECT_STATE.md` and the listed task
documents. Do not rely on conversation history or agent-specific memory.

## Handoff metadata

- Task: Resume the next approved site task
- Status: Ready
- Current owner: Unassigned
- Intended next owner: Claude or Codex
- Last updated: 2026-07-24 by Codex
- Branch: `master`
- Base commit: `86df794`
- Last completed commit: `86df794`
- Current commit: the handoff commit containing this file; verify with `git log -1`
- Working tree expected: clean

The receiving agent must verify these fields. The handoff commit is expected to be one commit after
`86df794` and contain only the handoff-documentation changes. If the branch, parent commit, or
working-tree expectation does not match, stop and report the discrepancy before editing. A different
worktree may not contain uncommitted changes from this checkout.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — repository rules and session recovery protocol
- [`docs/ai/PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions, and approved queue
- [`src/content.config.ts`](../../src/content.config.ts) — book content schema
- [`src/content/books/`](../../src/content/books/) — current book records
- [`src/components/BookCover.astro`](../../src/components/BookCover.astro) — cover fallback/rendering

## Current state

The Astro site is on `master`, with the bookshelf nested at `/library/books`. The current approved
next task is the first item in `PROJECT_STATE.md`: replace the two placeholder covers and the eight
tinted spine fallbacks with real cover images, then set `cover:` for every book and verify the build.

## Completed in this handoff

- Added the mandatory new-session recovery protocol to `AGENTS.md`.
- Added this canonical live handoff and strengthened the task-scoped handoff template.
- Corrected `PROJECT_STATE.md` so its recorded repository state matches the checkout.
- No product code, content, or media was changed.

## Validation

| Command | Result |
|---|---|
| `npm run build` | Passed — 23 pages built on 2026-07-24 |
| `git diff HEAD^ --check` | Passed |
| `git status --short` | Clean after the handoff commit |

## Remaining work

- Implement the real book-cover task described below.
- Re-run the build and visually verify the bookshelf after the cover change.

## Unresolved risks

- Cover image sources must be appropriate for a public repository and must not introduce
  confidential material or unlicensed assets without the owner's approval.

## Recommended next action

Implement the real book-cover task described in `PROJECT_STATE.md`. Confirm the image sources are
safe for this public repository, preserve the existing media rules, and run `npm run build`.

If that task is no longer approved or the referenced state conflicts with the code or Git history,
stop and report the conflict rather than selecting a different task.

## Before stopping

Update this file with the exact owner, branch, commits, working-tree files, completed work,
validation results, remaining work, risks, and one concrete next action. Update `PROJECT_STATE.md`
when the durable state or approved queue changes. Never claim a command passed unless it ran
successfully.
