---
title: "Rebuilding okasha.me from scratch: Jekyll → Astro"
description: "Why the 2019 site had to go, what the new architecture looks like, and how the whole thing deploys for free."
type: essay
topics: [web, astro, meta]
date: 2026-07-09
readingTime: 6
---

This site started in 2019 as a Jekyll one-pager — hero video, parallax, a timeline, and a
whole lot of hardcoded HTML. It served me well for seven years, but it had a structural
problem: **content lived inside markup**. Adding one blog post meant editing a 600-line
include file. So nothing ever got added.

The 2026 rebuild inverts that. The site is now an archive-first system:

- **Astro + content collections** — every entry in the [Library](/library) is a markdown
  file with typed frontmatter (`type`, `topics`, `date`). Drop a file in `src/content/library/`,
  push, and it appears on the right shelf with the right badge. No HTML involved.
- **Vanilla JS islands** — the aurora background on the homepage is ~90 lines of canvas
  code; the resume receipts panel and skill dossiers are tiny inline scripts. No framework
  runtime ships to the browser.
- **GitHub Pages + Actions** — same free hosting as 2019, but the build is a real pipeline
  instead of the legacy Jekyll processor.

## What the old site taught me

Three lessons made it into this design:

1. **Never couple content to layout.** The old experience timeline was unmaintainable
   precisely because every bullet was hand-placed markup.
2. **Performance is a feature you can lose.** At one point the old site shipped a 7.6MB
   hero video and 62 broken lazyload placeholders to every phone. The new budget:
   under 500KB before you scroll.
3. **A personal site should be a *proof-of-work* system**, not a brochure. The
   [resume](/resume) here opens receipts for every claim, and the
   [workshop](/workshop) shows the actual artifacts.

## The stack, exactly

Astro 5, plain CSS custom properties (no Tailwind — the token system is ~30 lines),
IBM Plex Mono + Space Grotesk, a hand-rolled ⌘K palette, and a GitHub Action that
builds and deploys on every push. The full source is
[on GitHub](https://github.com/MostafaOkasha/MostafaOkasha.github.io).
