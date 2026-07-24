# LLM Handoff — <short title>

Use `docs/ai/HANDOFF.md` for the primary workstream. Copy this file to
`docs/ai/handoffs/<topic>.md` only for an additional parallel workstream or a specific
mid-task ownership transfer. Update it before stopping; never write a result that was not
actually verified.

## Handoff metadata

- Task:
- Status: Proposed | Ready | In Progress | Review | Blocked | Complete
- Current owner:
- Intended next owner:
- Last updated: `YYYY-MM-DD` by `<agent>`
- Branch:
- Base commit:
- Last completed commit:
- Current commit:
- Working tree expected: clean | dirty (list the expected files)

The receiving agent must verify every Git field above. A dirty tree is valid only when the
listed files and their purpose match the handoff.

## Task
- Task / issue:
- Current owner:
- Receiving owner:

## Repository state
- Base branch: `master`
- Working branch:
- Base commit:
- Current commit:
- PR (if any):
- Working tree: clean | dirty (list files)

## Objective
The precise outcome being implemented.

## Completed
- What changed and why
- Which acceptance criteria are satisfied

## Files changed
- `path` — reason

## Documents to read
- `AGENTS.md`
- `docs/ai/PROJECT_STATE.md`
- `path/to/task-specific-document` — why it is relevant

## Decisions made
- **Decision:** …
  - **Evidence:** (build output, code, screenshot)
  - **Alternatives rejected:** … — why

## Validation
| Command | Result |
|---|---|
| `npm run build` | Passed / Failed / Not run |
| preview `:4321` (or `:4322`) | Checked / Not checked |

> Never write "Passed" unless the command was actually run successfully.

## Remaining work
- Incomplete criteria / known limitations / follow-ups

## Unresolved risks
- Correctness / compatibility / privacy / operational / spec uncertainty

## Recommended next action
One concrete next step for the receiving owner.

If no approved implementation task exists, say so and identify the human decision required.
Do not create a new roadmap item in this field.

## Stop protocol

Before handing off or ending the task:

1. Record what changed, what remains, and the exact current Git state.
2. Record only commands actually run and their results.
3. Update `docs/ai/PROJECT_STATE.md` when durable state, decisions, or the approved queue changed.
4. Leave one concrete next action, or explicitly record that human direction is required.
