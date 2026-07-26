@AGENTS.md

# Claude Code — tool-specific instructions

The shared repository facts, commands, and engineering rules live in `AGENTS.md` (imported
above). This file only adds behavior specific to Claude Code. Do not duplicate `AGENTS.md` here.

## Preview / dev servers

Use the Browser-pane preview tools, never a raw shell server. Server definitions are in
[`.claude/launch.json`](.claude/launch.json):

- `astro` — `astro preview` on **:4321** (serves the built `dist/`; **rebuild before previewing**
  to see changes — it is not hot-reloaded)
- `astro-dev` — `astro dev` on **:4322** (hot reload)

`preview_start` with `{ name: "astro" }` (or `"astro-dev"`), then verify visible changes per the
preview verification workflow before ending a turn.

## Committing

- Commit locally on `master` with clear messages after each meaningful piece of work.
- **Never `git push`** — the owner reviews and pushes. (This is stricter than `AGENTS.md`'s
  "no push without approval": for Claude, the standing instruction is simply do not push.)
- End commit messages with the `Co-Authored-By` trailer configured for this environment.

## Memory

Claude Code keeps persistent, file-based memory outside this repo (under the user's
`~/.claude/.../memory/`). It is Claude-specific and **not** part of the repository — never rely on
it for facts another agent (Codex) or a human would need. Durable, shared facts belong in
`AGENTS.md`, `README.md`, or `docs/ai/`.

## Handing off to Codex

Before a handoff (or when usage limits are near), update the canonical live record
[`docs/ai/HANDOFF.md`](docs/ai/HANDOFF.md) — and [`docs/ai/PROJECT_STATE.md`](docs/ai/PROJECT_STATE.md)
when durable state or the approved queue changed — with current state, what's done, and the next
task, so Codex (or a fresh session) can pick up cleanly. See `AGENTS.md` → "AI collaboration".
