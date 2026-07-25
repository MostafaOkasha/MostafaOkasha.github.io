# Claude Review Handoff — Handoff System and Repository State

This is a task-scoped handoff for Claude. It records the work completed in this Codex thread,
the shared agent workflow now in force, the review Claude must perform, and the next approved
product task. Read [`AGENTS.md`](../../../AGENTS.md) first; this document does not replace the
repository instructions.

## Handoff metadata

- Task: Review Codex's handoff-system work, then the next approved site task
- Status: Review
- Current owner: Codex
- Intended next owner: Claude
- Last updated: 2026-07-25 by Codex
- Branch: `master`
- Base commit: `4aa83ad`
- Last completed implementation commit: `4aa83ad`
- Current commit: the handoff commit containing this file; verify with `git log -1`
- Working tree expected: clean after the handoff commit
- Push status: not pushed; owner reviews and pushes

The receiving agent must verify the branch, parent commit, current diff, and working-tree state.
If the checkout is not clean or the current commit is not the handoff commit whose parent is
`4aa83ad`, stop and report the discrepancy before editing. Do not assume another worktree contains
uncommitted changes from this checkout.

## Executive summary

The product codebase was already a functioning Astro 5 static site. The Codex work in this thread
focused on making Claude↔Codex continuation reliable and self-checking. No product code, content,
media, dependency, build configuration, or deployment workflow was changed.

The immediate request is for Claude to review that handoff work and verify that it is coherent,
accurate, build-safe, and followed correctly. Once the review is complete, the next approved
product task is to replace all bookshelf cover fallbacks with real cover images.

## What was already present when this work was recovered

The repository had already completed the major site migration and bookshelf work:

- 2019 Jekyll site rebuilt as Astro 5 with content collections and vanilla-JS islands.
- Static GitHub Pages deployment through `.github/workflows/deploy.yml`.
- Dark navy/mint design system, Aurora backdrop, loading preloader, command palette, resume,
  skills, workshop, library, and system-design pages.
- A `books` content collection with ten book records and book detail routes.
- The bookshelf moved under `/library/books`, with navigation, command-palette, ratings, sorting,
  and back-links wired to that route.
- Two placeholder cover images exist; the remaining eight books intentionally use the deterministic
  tinted spine fallback because they have no `cover:` field.

Relevant product history is visible in the recent commits, especially:

- `e86e864` — dedicated bookshelf
- `aa48e9d` — star ratings on book spines
- `ce4b906` — finished books sorted by rating
- `14cb483` — bookshelf nested under the library
- `f946bad` — bookshelf back-link
- `86df794` — initial handoff-preparation setup
- `4aa83ad` — strengthened cross-agent repository handoff

These commits are historical context, not a request to redo product work.

## Work completed by Codex in this thread

1. Audited the existing repository instructions, AI documentation, Codex configuration, safety
   rules, current Git state, and the supplied handoff guidance from another project.
2. Identified that the repository had `PROJECT_STATE.md` and reusable templates but lacked a
   canonical live `docs/ai/HANDOFF.md` entry point.
3. Added the mandatory “Start here — every new session” protocol to `AGENTS.md`. It requires the
   receiving agent to inspect Git, read the live handoff and durable state, read named task files,
   verify the handoff against the checkout, stop on stale/ambiguous state, and update the handoff
   before stopping.
4. Created `docs/ai/HANDOFF.md` as the primary live continuation record, with metadata, documents
   to read, validation, risks, remaining work, and one approved next action.
5. Strengthened `docs/ai/HANDOFF_TEMPLATE.md` with explicit ownership/commit/tree metadata,
   document lists, validation rules, unresolved risks, and a stop protocol.
6. Corrected stale repository-state wording in `docs/ai/PROJECT_STATE.md` and linked it clearly to
   the live handoff. The durable queue remains the source for approved product work.
7. Kept the workflow appropriate to this repository: no Docker/Postgres, Terraform, or other
   infrastructure handoff rules were added because this is a static site with no such tooling.
8. Ran `npm run build` successfully: 23 static pages built.
9. Verified `git diff HEAD^ --check` and a clean working tree after the handoff documentation
   commit. No push was performed.

## Shared operating system now in force

Every fresh Claude or Codex session should follow this sequence:

```text
read AGENTS.md
→ inspect git status / branch / recent log / unstaged and staged summaries
→ read docs/ai/HANDOFF.md
→ read docs/ai/PROJECT_STATE.md
→ read every document named by the handoff
→ verify handoff metadata against Git and the code
→ continue only the explicit approved task
→ validate the work
→ update HANDOFF.md and PROJECT_STATE.md as needed before stopping
```

Rules that matter for this transfer:

- Do not rely on conversation history or agent-specific memory.
- Do not invent a new roadmap item when the handoff is stale, contradictory, ambiguous, or has no
  approved next task; report the discrepancy or ask for the human decision.
- One agent owns implementation in a checkout at a time. Parallel workstreams use task-scoped
  records under `docs/ai/handoffs/` and must identify their branch and commit.
- Uncommitted changes belong to their original checkout/worktree and must be inspected, not assumed.
- The owner reviews and pushes. Do not push, force-push, or deploy.
- This is a public repository: never add secrets, private self-reflection, confidential work detail,
  or unapproved media.
- `npm run build` is the validation gate. Visible changes also require a preview check.

## Files Claude must read

Read these in order:

1. [`AGENTS.md`](../../../AGENTS.md) — canonical repository rules and recovery protocol.
2. [`CLAUDE.md`](../../../CLAUDE.md) — Claude-specific preview, commit, memory, and handoff rules.
3. [`docs/ai/HANDOFF.md`](../HANDOFF.md) — canonical live handoff/index.
4. [`docs/ai/PROJECT_STATE.md`](../PROJECT_STATE.md) — durable state and approved task queue.
5. This file — review scope and next task.
6. [`.codex/config.toml`](../../../.codex/config.toml) and [`.codex/rules/safety.rules`](../../../.codex/rules/safety.rules) — Codex baseline and Git safety guardrails.
7. [`src/content.config.ts`](../../../src/content.config.ts) — book schema and `cover` behavior.
8. [`src/components/BookCover.astro`](../../../src/components/BookCover.astro) — real-cover and
   fallback rendering.
9. [`src/pages/library/books/index.astro`](../../../src/pages/library/books/index.astro) and
   [`src/pages/library/books/[...slug].astro`](<../../../src/pages/library/books/[...slug].astro>) —
   bookshelf index/detail consumers.
10. [`src/content/books/`](../../../src/content/books/) and [`images/covers/`](../../../images/covers/)
    — current records and media state.

## Required review of Codex's work

Review before beginning the book-cover implementation:

- Confirm the current branch, parent commit, working tree, and handoff metadata match this record.
- Review the diff introduced by the handoff-system commits. Confirm it is limited to the handoff
  instructions/configuration and `docs/ai/*`; no product or media files should have changed.
- Check that `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `PROJECT_STATE.md`, and the templates do not
  contradict one another or require files that do not exist.
- Confirm the one-line continuation prompt works in practice: it should cause a new agent to
  recover state, verify it, and stop rather than inventing work when state is stale.
- Check the links and paths in the handoff documents, including the bracketed book-route filename.
- Review `.codex/config.toml` and `.codex/rules/safety.rules` for conservative behavior and syntax;
  do not add Docker, Postgres, Terraform, or other irrelevant guardrails.
- Run `npm run build` yourself. Do not trust the recorded result without verification.
- Because this handoff changed documentation only, a browser preview is optional for the review;
  if any visible product file was unexpectedly changed, stop and investigate.
- Check public-repository privacy/media rules and report any issue rather than silently broadening
  scope.

If review finds a handoff-system defect, fix only the relevant documentation/configuration, validate
it, and update this handoff plus the canonical handoff. Do not begin unrelated product work during
the review.

## Next approved product task: real book covers

After the review is complete and the state is still current, implement only this task:

- Add real, repository-safe cover images under `images/covers/`.
- Set `cover: /images/covers/<filename>` in every one of the ten files under `src/content/books/`.
- Replace the two placeholder images (`dont-believe-everything-you-think.jpg` and
  `solve-for-happy.jpg`) and the eight missing-cover fallbacks.
- Preserve `BookCover.astro` fallback behavior for future records unless the task genuinely requires
  a narrowly scoped change.
- Do not add purchase links, book notes, new books, or unrelated design refactors in this task.
- Confirm image sources are appropriate for this public repository and do not introduce copyrighted
  or confidential assets without a sound basis/owner approval.
- Run `npm run build`; because this is visible, preview `/library/books` and at least one book detail
  route at `:4321` after rebuilding, and check desktop/mobile layout.

Done means every book renders a real cover, all cover paths resolve, the build passes, and the
visible bookshelf remains coherent and responsive.

## Required stop/update protocol

Before Claude stops:

1. Record the review result and every command actually run.
2. Record any corrections made and their files.
3. Update `docs/ai/HANDOFF.md` with exact Git state, validation, risks, and the next action.
4. Update `docs/ai/PROJECT_STATE.md` if durable state, decisions, or the approved queue changed.
5. If the review passes and book-cover work is not started, leave the book-cover task as the next
   action. If book-cover work is completed, record that and move to the next approved queue item;
   do not invent a new task.
6. Commit locally if Claude made a meaningful change; never push.

## Copy-paste prompt for Claude

```text
Continue from the repository handoff. Follow AGENTS.md, recover the current state, and proceed
with the documented next task. Do not invent work if the handoff is stale or ambiguous.

For this transfer, first read and follow:
docs/ai/handoffs/claude-review.md

Review the Codex handoff-system work and the repository state exactly as that document requests.
Verify the Git metadata, inspect the relevant diffs and files, run the required validation, and
correct any handoff/configuration defect you find. Do not begin unrelated product work during the
review. If the review passes, proceed only with the documented real-book-covers task, then update
docs/ai/HANDOFF.md, docs/ai/PROJECT_STATE.md, and the task-scoped handoff before stopping. Do not
push.
```
