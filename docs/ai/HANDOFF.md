# Repository Handoff — okasha.me

The canonical live continuation record. A fresh agent reads it after `AGENTS.md`, verifies it
against Git, then reads `PROJECT_STATE.md`. Do not rely on conversation history or agent memory.

## Handoff metadata

- Task: review-and-fix pass on the recent batch (done) — next work is content, blocked on the owner
- Status: Complete — awaiting owner review/push, then owner content
- Current owner: unassigned
- Intended next owner: the owner (content), then either agent to build it into pages
- Last updated: 2026-09-24 by Claude
- Branch: `master`
- Current commit: the commit containing this file — verify with `git log -1`; its parent is the
  docs commit after `1c48902`
- `origin/master` at handoff: `969c96e`; everything after it is local and unpushed
- Working tree expected: clean

Verify with `git status -sb` and `git log --oneline -8`. If the tree is dirty or the log does not
end in the commits listed below, someone worked after this was written — inspect before editing.

## Documents to read

- [`AGENTS.md`](../../AGENTS.md) — rules, recovery protocol, and the architecture constraints added
  this pass (case-study registry, no links to empty shelves, UTC dates)
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — durable state, decisions on record, **the reprioritized queue**
- [`handoffs/claude-review.md`](handoffs/claude-review.md) — closed, historical only

## What this pass did

A review of the previous turns' work found defects, most introduced by those turns. Fixed:

| Commit | Fix |
|---|---|
| `dc8a5eb` | ⌘K index moved from inline-on-every-page to one cached `/search.json`. HTML 1,113 → 483 KB |
| `c8e2577` | six links promised an empty "ML" shelf (incl. the homepage AI LAB tile); now filtered at build time |
| `1c48902` | case-study metadata had two copies; the registry is now the single source, unregistered pages fail the build |
| docs commit | `engines` >=22.12, AGENTS.md/README updated for Astro 7, new constraints written down |

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
| CI deploys | green through `969c96e` on Astro 7 |

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

Owner: review and push the local commits. Then supply material for the first ML/AI entry (queue item
1) and confirm the Meta end date (item 2); either agent can then write them up.
