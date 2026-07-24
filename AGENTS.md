# Repository Instructions

Shared instructions for any AI coding agent (Claude Code, Codex) and for humans.
Claude Code reads these via the `@AGENTS.md` import at the top of `CLAUDE.md`;
Codex reads this file directly. Keep it verified and concise — detailed docs are linked, not pasted.

## Purpose

`okasha.me` — Mostafa Okasha's personal archive: writing, projects, CAD, system
designs, a bookshelf, and an interactive resume. It is a **static site** built with
**Astro 5** + content collections + small vanilla-JS islands, deployed to **GitHub
Pages**. Dark-only, in the site's navy (`#0a192f`) + mint (`#64ffda`) palette.

**The site and its GitHub repository are both public.** Anything committed is published.

## Start here — every new session

When a user says “Continue from the repository handoff. Follow `AGENTS.md`, recover the
current state, and proceed with the documented next task. Do not invent work if the handoff
is stale or ambiguous.”, use this exact recovery protocol before planning or editing:

1. Read this instruction chain, then inspect the checkout:
   - `git status --short`
   - `git branch --show-current`
   - `git log --oneline --decorate -15`
   - `git diff --stat`
   - `git diff --cached --stat`
2. Read [`docs/ai/HANDOFF.md`](docs/ai/HANDOFF.md), the canonical live continuation record.
3. Read [`docs/ai/PROJECT_STATE.md`](docs/ai/PROJECT_STATE.md), the durable project state and
   approved task queue. This repository uses it instead of a separate `docs/current-state.md`.
4. Read every task-specific file named by the handoff, then inspect the relevant code and content.
5. Verify the handoff against the actual branch, commit, working tree, and code. Uncommitted
   changes belong to the checkout where they exist; do not assume another worktree contains them.
6. Continue only the explicit, approved next task when the handoff is present, current, and
   unambiguous. If it is missing, stale, contradictory, or has no approved next task, stop and
   report the discrepancy or required human decision. Do not invent roadmap work.
7. Before stopping, update the handoff with exact progress, validation, remaining work, risks,
   and one concrete next action. Update `PROJECT_STATE.md` too when durable state or the queue
   changed.

For parallel workstreams, keep `HANDOFF.md` as the index and place task-scoped records in
`docs/ai/handoffs/`; each record must identify its branch and commit. Do not have two agents
modify the same checkout concurrently.

## Sources of truth

When sources conflict, prefer the more authoritative *current* source and report the conflict:

1. The running build — `npm run build` (fails on content-schema, import, or type errors)
2. Live code under `src/` and content under `src/content/`
3. [`README.md`](README.md) — surfaces, structure, deploy model
4. This file and [`CLAUDE.md`](CLAUDE.md)
5. [`docs/ai/HANDOFF.md`](docs/ai/HANDOFF.md) — live continuation state for the current workstream
6. [`docs/ai/PROJECT_STATE.md`](docs/ai/PROJECT_STATE.md) — durable current state + approved task queue
7. [`redesign/`](redesign/) — original design handoff (reference; a snapshot, not live spec)

## Repository map

- `src/pages/` — routes. `index`, `about`, `resume`, `skills`, `workshop` (+ `workshop/systems/*`),
  `library/index` + `library/[...slug]`, `library/books/index` + `library/books/[...slug]`,
  `404`, `rss.xml.ts`
- `src/layouts/` — `Base.astro` (head, fonts, meta, mounts `CommandPalette`), `CaseStudy.astro`
- `src/components/` — `Nav`, `Aurora` (WebGL backdrop), `Preloader` (loading galaxy), `CommandPalette` (⌘K), `BookCover`
- `src/content/` — content collections: `library/` (writing) and `books/` (bookshelf), one markdown file each
- `src/content.config.ts` — collection definitions + Zod schemas (the shelf `type` enum, book schema)
- `src/data/` — `shelves.ts` (shelf types/badges/colors), `skills.ts`, `receipts.ts` (resume receipts)
- `src/scripts/` — `backdrop.js` (the WebGL nebula, from the design handoff)
- `src/styles/global.css` — the full design-token system
- `public/` — `CNAME` + symlinks (`images`, `videos`, `resume`, `documents`) to the root media dirs
- `.github/workflows/deploy.yml` — build + deploy to Pages on push to `master`
- `.claude/launch.json` — Claude Code preview/dev server definitions
- `.codex/config.toml` — Codex project baseline; `.codex/rules/safety.rules` — git command guardrails

### Documentation map (what's current, reference, or legacy)

- **Current / source of truth:** `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/ai/*`, all of `src/`, `.github/workflows/deploy.yml`, `package.json`
- **Reference (durable, historical):** `redesign/` — the design handoff (HTML prototypes + `redesign/README.md`). Consult for original intent; it is *not* updated as the site evolves.
- **Legacy, retained for reference, NOT part of the build:** `_includes/`, `_layouts/`, `css/`, `javascripts/`, `_config.yml`, `index.html`, `404.html` (the 2019 Jekyll site). Do not edit these expecting a site change.
- **Ignored build output:** `_site/` (old Jekyll), `dist/`, `.astro/`, `node_modules/`
- **Standalone experiment, unrelated to the site build:** `threejs-himalayas/`

## Environment setup

```bash
npm install          # local (CI uses `npm ci` with the committed package-lock.json)
```

Required tooling: **Node 22** (the version CI uses — see `.github/workflows/deploy.yml`).
No local services, containers, or env vars are required. There is no `.env`.

## Canonical commands

This project has **no separate lint, type-check, or test suite**. `npm run build` is the
validation gate — it type-checks content collections and fails on broken imports or schema
violations. CI runs it on every push to `master`.

```bash
npm run dev        # dev server on :4321 with hot reload
npm run build      # static build into dist/ — THE validation command
npm run preview    # serve the production build (dist/)
```

There are no generation, migration, or contract commands — this is a static content site
with no database, backend, or codegen step.

## Required workflow

For every non-trivial change:

1. Read the relevant page/component/content and its data source before editing.
2. Establish current vs. required behavior.
3. Make the smallest coherent change; reuse existing components, tokens, and patterns.
4. Run `npm run build` and confirm it completes cleanly.
5. If the change is visible in the browser, verify it in a preview (see `CLAUDE.md` for the
   Claude preview workflow; Codex users can `npm run preview` and open `:4321`).
6. Review the final diff for unrelated changes.
7. Report the commands actually run and their results. Never claim the build passed unless it did.

## Scope control

- No unrelated refactoring, renaming, or reorganizing.
- Do not add dependencies without explaining why the existing three (`astro`, `@astrojs/rss`,
  `@astrojs/sitemap`) are insufficient. Keep the dependency surface tiny.
- Preserve unrelated changes in the working tree; do not revert another owner's work.

## Architecture constraints

- Static-first: no SSR, no server runtime (Astro builds static by default). `astro.config.mjs`
  sets `build.format: 'file'` and `trailingSlash: 'never'` — keep internal links extension-less
  and without trailing slashes to match.
- Content is data: a new library entry or book is a markdown file in `src/content/{library,books}/`.
  The shelf, badge, search index, homepage rail, and ⌘K palette all derive from it at build time.
  Schemas live in `src/content.config.ts`; shelf metadata in `src/data/shelves.ts`.
- Islands are vanilla JS. Use `<script>` (module, hot-reloaded) over `<script is:inline>`
  (not reliably hot-reloaded) unless inlining is required.
- Design tokens (colors, fonts, spacing) come from `src/styles/global.css` custom properties —
  reuse them; don't hard-code new palette values.

## Media rules

- **Never delete media.** `images/`, `videos/`, `resume/`, `documents/` live at the repo root and
  are symlinked into `public/`, so 2019 URLs still resolve. Deleting or moving them breaks links.
- Add media under the existing root dirs; it is served from the symlinked `public/` path.

## Security and privacy

The repo and site are public. Therefore:

- **Never commit private personal notes** — health, faith, addiction, sexual, or other sensitive
  self-reflection. When adding book/library content, omit any such passages entirely.
- **Never commit confidential work detail** — internal company codenames, colleague or partner
  names, unpublished figures. Sanitize resume/case-study content (see `src/data/receipts.ts`,
  `src/pages/workshop/systems/*`).
- No secrets, tokens, or credentials in the repo. There are none today; keep it that way.

## Git and collaboration

- Default branch is `master`; pushing it triggers a production deploy.
- **Do not `git push` without the owner's explicit approval** — the owner reviews and pushes.
  Commit locally with clear messages; leave pushing to the human.
- Do not force-push, `git reset --hard`, or `git clean -fdx` — these can destroy uncommitted work
  or untracked media. Stash or inspect instead.
- Claude and Codex must **not** modify the same checkout concurrently. Use separate branches or
  git worktrees for parallel work, one active writer per checkout. See
  [`docs/ai/HANDOFF_TEMPLATE.md`](docs/ai/HANDOFF_TEMPLATE.md).

## AI collaboration (Claude ⇆ Codex)

Both agents share this file and the templates in `docs/ai/`:

- [`docs/ai/HANDOFF.md`](docs/ai/HANDOFF.md) — the **canonical live continuation record**. Read it
  at the start of every session, verify it against Git, and update it before handing off or stopping.
- [`docs/ai/PROJECT_STATE.md`](docs/ai/PROJECT_STATE.md) — the **durable project state**: current repo
  state, completed work, decisions, and the approved next-task queue. Read it during recovery and
  update it when durable state or the queue changes.
- [`docs/ai/TASK_TEMPLATE.md`](docs/ai/TASK_TEMPLATE.md) — copy when spec'ing a new task.
- [`docs/ai/HANDOFF_TEMPLATE.md`](docs/ai/HANDOFF_TEMPLATE.md) — copy to `HANDOFF-<topic>.md` when
  ownership changes or work pauses mid-task.

One model owns implementation at a time; the other may review the diff. Humans approve anything
that pushes, deploys, or is otherwise irreversible.

## Definition of done

- The requested behavior works and is verified (build clean; visible changes previewed).
- No unrelated changes in the diff.
- No private or confidential content, no secrets, no deleted media.
- Content/docs updated if behavior or structure changed.
- `docs/ai/PROJECT_STATE.md` updated if the task queue or state moved.
- Remaining limitations reported.

## Completion report

Report: (1) what changed, (2) why, (3) key files, (4) commands actually run + results,
(5) unresolved risks, (6) recommended next action.

## Code-review priorities

1. Privacy/security — no confidential or private content committed, no secrets exposed
2. Data loss — no deleted/moved media, no destructive git
3. Correctness — build passes, links resolve (extension-less, no trailing slash), islands hydrate
4. Backward compatibility — old media URLs still resolve
5. Scope — diff limited to the task
6. Maintainability with concrete consequence

Do not flag cosmetic preferences unless they violate a rule above.
