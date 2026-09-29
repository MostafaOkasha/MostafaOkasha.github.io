# Repository Handoff — okasha.me

The canonical live continuation record. A fresh agent reads it after `AGENTS.md`, verifies it
against Git, then reads `PROJECT_STATE.md`. Do not rely on conversation history or agent memory.

## Handoff metadata

- Task: content templates + dev-only draft system (done); remaining work is the owner filling them in
- Status: Complete — awaiting owner review/push, then owner content
- Current owner: unassigned
- Intended next owner: the owner (content), then either agent to build it into pages
- Last updated: 2026-09-29 by Claude
- Branch: `master`
- Current commit: the commit containing this file — verify with `git log -1`
- `origin/master` at handoff: `face663`; everything after it is local and unpushed
- Working tree expected: clean

Verify with `git status -sb` and `git log --oneline -8`. If the tree is dirty or the log does not
end in the commits listed below, someone worked after this was written — inspect before editing.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — rules, recovery protocol, and the architecture constraints added
  this pass (case-study registry, no links to empty shelves, UTC dates)
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions on record, **the reprioritized queue**
- [`handoffs/claude-review.md`](handoffs/claude-review.md) — closed, historical only

## Latest pass (2026-09-29): templates for everything missing

Owner asked for placeholders showing where each missing piece goes and how it will look.
- `src/data/drafts.ts` — the rule: drafts visible in `npm run dev`, absent from production.
- Templates in their final locations: 15 Library drafts (the 16 entries planned in the design
  handoff, minus one that already shipped as a case study, plus a project-retrospective), 2 book
  drafts, 3 case-study pages + project cards, the About rewrite (`/drafts/about`).
- Dev-only hints: book notes / buy links, Workshop photo + Creative AI slots, project write-ups.
- `/drafts` dashboard (dev only): every template, gap and fact-to-confirm, with exact files.
- Build guards: leftover `✎` → fail; internal link to an unbuilt page → fail.
- Also fixed: article header date was still local-time (`d5bcf5a`); `_templates/` had a broken
  `type: book` stub.

| Check | Result |
|---|---|
| Production output vs pre-change snapshot | byte-identical (35 text files hashed, 229-file list) |
| `✎` in production output | 0 |
| Publish a draft with placeholders left | build fails, names the files |
| Un-draft a project card without moving its case study | build fails on the dead link |
| Guards on today's site | pass; 706 internal links inspected |
| Dev: every `/drafts` link | 33/33 return 200 |
| Dev: live `/about` | unchanged (no banner); rewrite only at `/drafts/about` |
| Console errors (dev) | none |

## Earlier pass: review and fixes

A review of the previous turns' work found defects, most introduced by those turns. Fixed:

| Commit | Fix |
|---|---|
| `dc8a5eb` | ⌘K index moved from inline-on-every-page to one cached `/search.json`. HTML 1,113 → 483 KB |
| `c8e2577` | six links promised an empty "ML" shelf (incl. the homepage AI LAB tile); now filtered at build time |
| `1c48902` | case-study metadata had two copies; the registry is now the single source, unregistered pages fail the build |
| `9003bcc` | `engines` >=22.12, AGENTS.md/README updated for Astro 7, new constraints written down |
| `162cf08` | deploy artifact 190 MB → 41 MB: 25 never-linked originals kept in repo, excluded from `dist/` |

Earlier in the same session (already pushed through `969c96e`): case studies surfaced on the homepage
rail, Library and RSS; dates render in UTC; `.nvmrc`; Astro 7.3.3 with 0 vulnerabilities.

## Validation (2026-09-24, by Claude)

| Check | Result |
|---|---|
| `npm run build` | Passed — 23 pages + `/search.json` |
| ⌘K: requests on page load / first open / reopen | 0 / 1 (`/search.json`) / 0 |
| ⌘K: `MapSight`, `GPU`, `ingress` | all resolve; case study ranks first for GPU and ingress |
| Built site: `/library?shelf=` links to a missing shelf | none |
| `/skills#llm` vs `/skills#aws` | dead note hidden vs live note kept |
| Unregistered case-study page (throwaway) | build fails with the expected message |
| Console errors (home, skills, resume) | none |
| CI deploys | green through `1118097` on Astro 7 |
| Media exclusion | 25 files out of `dist/`, 0 removed from repo; 159 ever-linked files all still in `dist/` |
| Media on 8 page types | 79 references, all HTTP 200 |
| Safety rails | page using an archived file → build fails; `../canary` entry → aborts, canary kept |

## Remaining work

See `PROJECT_STATE.md` → Next-task queue. The top item changed: **one published ML/AI entry** is now
the highest-leverage content on the site — it restores the hidden AI LAB tile, two skill dossiers and
three receipt links automatically.

## Unresolved risks

- The homepage currently has **no AI section at all** (the tile is hidden because the shelf is empty),
  while the hero says "these days I build AI applications". Honest, but a visible gap until item 1 ships.
- Eight open Dependabot PRs predate the Astro 7 upgrade and are likely superseded (`npm audit` is 0).
  Closing them is an owner action.
- GPG: two keyrings on this machine — see the decision in `PROJECT_STATE.md` if signing fails.

## Recommended next action

Owner: review and push, then run `npm run dev` and open `/drafts`. Start with one ML/AI entry and
the Meta end date. Either agent can help turn rough notes into a template's final text — but never
invent facts to fill a `✎`; ask the owner.
