---
title: "How this library works — and how I add to it"
description: "The shelf system: ten content types, one markdown folder, zero friction. A map for readers and a manual for future me."
type: resources
topics: [meta, writing]
date: 2026-07-08
readingTime: 4
---

Everything I publish lives on one of ten shelves:

| Shelf | What goes there |
|---|---|
| **essays & deep dives** | long-form technical writing — OSINT, war stories, engineering |
| **CS curriculum** | my complete computer science notes, field by field |
| **ML / AI notes** | working notes on models, agents, evals, and training |
| **book summaries** | books I finished, with what I underlined |
| **paper notes** | research papers, annotated, with the best per field |
| **open ideas** | ideas I'm giving away — with research on why they would or wouldn't work |
| **reflections** | short escripts about life, categorized |
| **quotes + commentary** | other people's words, my margin notes |
| **spirituality** | writing on openings, meaning, and finding god |
| **resource maps** | curated routes into a field — courses, papers, videos, in order |

## The mechanics

Each entry is a single markdown file:

```yaml
---
title: "Agent memory patterns that actually work"
description: "One-line summary shown on the shelf."
type: ml          # one of the ten shelves
topics: [ai, agents]
date: 2026-07-02
readingTime: 9
---
```

The shelf sidebar, the badges, the search index, the homepage rail, and the ⌘K palette
all generate from these files at build time. Publishing = `git push`.

If you're reading this and want the same setup for your own site, the
[rebuild essay](/library/rebuilding-okasha-me) covers the architecture.
