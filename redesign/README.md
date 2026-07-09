# Handoff: okasha.me — Personal Site Rebuild

## Overview
Complete redesign of Mostafa Okasha's personal website (currently a 2019 static site at okasha.me / MostafaOkasha.github.io). The new site is a personal archive with four surfaces — Home, Library, Workshop, Resume/Skills — designed dark-only in the site's original navy + mint palette. Priorities: jaw-dropping first impression, excellent mobile, fast/lightweight, personality.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. The task is to recreate these designs in a real codebase. No codebase exists yet; the recommended stack (agreed with the owner) is:

- **Astro** with content collections — every Library entry is a markdown file with frontmatter (`type`, `topics`, `date`, `readingTime`); shelves/filters/entry pages generate at build time
- **Vanilla JS canvas** for the animated homepage background (port the `initAurora` function from `Home.dc.html` nearly as-is)
- **Pagefind or Fuse.js** for client-side ⌘K search across all content
- **Plain CSS with custom properties** for tokens (system is small; Tailwind optional)
- **Deploy: GitHub Pages** (existing repo MostafaOkasha.github.io) via GitHub Action, custom domain okasha.me. Cloudflare Pages is an equally good alternative.

Open the `.dc.html` files directly in a browser to see the live designs (they need `support.js`, `image-slot.js`, `ios-frame.jsx`, and `images/` alongside them — all included).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final. Recreate pixel-perfectly. Content (article titles, dates, counts) is realistic placeholder — the real content comes from the owner's markdown files.

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `--navy` | `#0a192f` | page background (all pages) |
| `--navy-raised` | `rgba(17,34,64,0.6–0.8)` | cards, panels (often with `backdrop-filter: blur(4–8px)`) |
| `--mint` | `#64ffda` | accent: links, active states, badges, numbered nav, borders |
| `--mint-border` | `rgba(100,255,218,0.15–0.35)` | hairline borders, dividers (opacity by emphasis) |
| `--text-bright` | `#e6f1ff` | headings, titles |
| `--text-body` | `#B0C6CE` | body copy |
| `--text-muted` | `#8892b0` | metadata, secondary copy |
| `--slate-border` | `#495670` | inactive chip/button borders |
| Type badge colors | essays `#64ffda`, CS `#7cb7ff`, ML `#d8a3ff`, books `#7dead8`, papers `#ffd76b`, ideas `#ffb26b`, reflections `#ff8ba3`, quotes `#B0C6CE`, spirituality `#a8e6a3`, resources `#e6d3a3` | Library entry badges; border = same color at 40% alpha |
| Resume paper | bg `#f6f3ec`, ink `#1c2430`, secondary `#5b6474`, rules `#d9d2c2`, interactive `#0d6e5c` on dashed `#0d8a72` | the one light surface on the site |

### Typography
- **Space Grotesk** (400–700) — all UI text, headings. Hero name: 74px/700/-0.02em. Page titles: 44px/700. Entry titles: 19px/600. Body: 14–18px.
- **IBM Plex Mono** (400–600) — the site's voice: nav links, badges, metadata, section labels (11px, letter-spacing 0.12em, uppercase), paths (`~/library`), counts.
- Google Fonts, weights 400/500/600/700.

### Spacing & shape
- Page padding: 44–48px desktop. Nav bar: 20px vertical padding, sticky, `rgba(10,25,47,0.85)` + blur(8px), bottom border mint 0.18 alpha.
- Radii: cards 12–14px, buttons/inputs 6–8px, pills/chips 999px, resume paper 6px.
- Shadows: resume paper `0 24px 60px rgba(0,0,0,0.5)`; elsewhere rely on borders, not shadows.
- Row dividers: `1px solid rgba(100,255,218,0.12)`.

## Screens / Views

### 1. Home (`Home.dc.html`)
- **Purpose**: first impression + jump-off to everything.
- **Background**: full-viewport canvas "aurora" — 420 particles following a sine flow-field, drawing 1px mint trail segments at 0.05–0.14 alpha over navy; trails fade via a translucent navy fill each frame (`rgba(10,25,47,0.055)`); particles steer away from the cursor within a 150px radius. Port `initAurora()` verbatim. Add `prefers-reduced-motion` fallback: static gradient.
- **Nav**: M logo left (white via `filter: brightness(10)`), right: numbered mono links (`01. library` etc, numbers mint) + `résumé` outline button (1px mint border, 6px radius).
- **Hero (left, max 720px)**: status pill (mint dot pulsing 2s, mono 13px, "currently: building AI things · Toronto") → mono 16px mint "Hi, my name is" → 74px bright name → 74px `#8892b0` "I build things for fun." → 18px body paragraph (max 540px) → CTA row: `explore the archive` outline button + "or press ⌘K" hint → small circular photo (74px, in a 92px broken-circle ring rotated -45°) + mono contact links.
- **Right rail (340px)**: "LATEST FROM THE ARCHIVE" label + 3 cards (raised navy, blur, mint hairline, 8px radius; 11px mono mint category+date, 16px/600 title). Pull the 3 newest entries at build time.
- **Footer index**: 5-column grid of links, each `border-top: 1px mint 0.25`, 12px mono mint label (`01 · WRITING`), 14px body sublabel.

### 2. Library (`Library.dc.html`)
- **Purpose**: ONE system for all 12 content types.
- **Layout**: 280px fixed sidebar + fluid main. Sidebar right border mint 0.15.
- **Shelves (sidebar)**: "SHELVES" mono label; rows = label + count. Active row: `rgba(100,255,218,0.08)` bg, 2px mint left border, bright text, mint count. Inactive: transparent, `#B0C6CE`. Shelf list: everything, essays & deep dives, CS curriculum, ML/AI notes, book summaries, paper notes, open ideas, reflections, quotes + commentary, spirituality, resource maps. Counts derive from content.
- **Search**: mono input, mint `⌕` icon, `⌘K` kbd chip, 1px mint 0.3 border, 8px radius, max-width 460px. Filters title+description live; result count label to the right ("N of M entries").
- **Entry rows**: grid `128px 1fr auto`; type badge (11px mono, colored text + 40%-alpha border, 4px radius, centered), title 19px/600 bright + desc 14px muted, meta right (mono 12px, "18 min · jul '26"). Row divider mint 0.12; hover bg `rgba(100,255,218,0.04)`.
- **Behavior**: shelf click + search compose (AND). Real build: shelf = frontmatter `type`, plus topic tag filters. Entry click → article page (see Article view, below).

### 3. Workshop (`Workshop.dc.html`)
- **Purpose**: projects, system-design diagrams, CAD gallery, photographs.
- **Layout**: max-width 1240px centered. Section labels: 11px mono mint, `01 · PROJECTS` style.
- **Projects**: 3-up card grid; card = 190px cover image + padded body (title 19px/600 + mono mint year/award right, desc 14px, chip links: mint outline `demo video` + slate outline `write-up`). Cards: mint 0.25 border, 14px radius, raised navy bg.
- **System designs**: 3-up cards each containing an inline SVG block diagram (thin 1.2–1.3px strokes, node colors from the badge palette, `#495670` connectors, mono 10px labels) + title + mono caption "· click to zoom". Production: clicking opens a pan/zoom lightbox of the full diagram (SVG scales losslessly).
- **CAD gallery**: 3-column grid, `grid-auto-rows: 170px`, feature items span 2 rows; image cards with bottom gradient caption overlay (`linear-gradient(transparent, rgba(10,25,47,0.9))`), title 15–16px/600 + mono caption.
- **Photographs**: 4-up grid of 220px image slots (design uses a drag-drop placeholder component; production = real photo grid → lightbox).

### 4. Resume (`Resume.dc.html`)
- **Purpose**: pixel-faithful paper resume where every claim opens its receipts.
- **Layout**: grid `minmax(560px,720px) + minmax(360px,460px)`, gap 36px. Right panel `position: sticky; top: 100px`.
- **Paper**: `#f6f3ec` sheet, 44px padding, 6px radius, heavy shadow. Name 32px/700 ink; mono metadata. Section headers: 11px mono, letter-spacing 0.14em, `#8a93a5`, bottom rule `#d9d2c2`. Jobs: bold 16px company + mono date right; 13.5px role; bullet lists 13.5px/1.7.
- **Interactive claims**: dashed spans — `border-bottom: 1.5px dashed #0d8a72; color: #0d6e5c; font-weight: 600; cursor: pointer` (the $10M one also gets `background: rgba(13,138,114,0.14)`). Clicking swaps the receipts panel content (7 proofs in the prototype: $10M story, agents, AI lab, Meta tooling, 5G, ChessMate, EyeSee).
- **Receipts panel**: "RECEIPTS — {LABEL}" mono header; card (mint 0.3 border, raised navy, 12px radius, 24px padding) with 19px title, 14.5px body, 2 pill links (mint outline primary, slate outline secondary); below: dashed-border explainer card; footer: 52px circular photo + "prefer the human version?" link.
- **Header bar**: "anything dashed is clickable" hint + `download PDF` button → `window.print()` with a print stylesheet that shows ONLY the paper, black-on-white, Letter size.

### 5. Skills (`Skills.dc.html`)
- **Purpose**: skills as clickable icons → dossier; system diagrams cross-linked.
- **Layout**: fluid main + 440px right dossier panel (left border mint 0.15, bg `rgba(17,34,64,0.4)`).
- **Skill grid**: 4 columns, max 720px; tile = mono glyph 20px in skill color (`Py`, `TS`, `C++`, `λ`, `⚛`, `◎`, `⚙`, photography glyph), name 13px bright, years 11px mono muted. Selected: mint border + `rgba(100,255,218,0.1)` bg. Hover: mint border.
- **Dossier**: glyph + name (26px/700) + "since YYYY" mono; timeline rows (`78px when + what`, mint 0.12 dividers); "SHIPS WITH" chips (slate outline pills); dashed-border card linking into the Library filtered by that skill's tag.
- **System designs**: same SVG cards as Workshop + a dashed "all diagrams in the workshop →" card.
- Skill data (8 skills incl. timelines) is in `Skills.dc.html`'s script — treat as content, store as data file.

### 6. Article / entry view (not mocked — follow this spec)
Reading view shown in the mobile reference (phone 3 of section `3b`): back-link `← shelf` + "N min left", 3px mint reading-progress bar, 11px mono mint kicker (TYPE · DATE · LENGTH), 30–44px/700 title, body 16–18px/1.75 `#B0C6CE`, bright 600 inline emphasis. Special block: **prompt recipe card** — mint 0.25 border + 3px mint left border, raised navy, mono 12px content, "PROMPT RECIPE — copy & steal" kicker, one-click copy button. Code blocks: same card treatment. Desktop: 680px measure, centered.

## Mobile (reference: section `3b` in `Reference - Explorations….dc.html`)
Breakpoint ~768px. All tap targets ≥ 44px.
- **Home**: pill → mono kicker → 40px stacked headlines → body → full-width outline CTA → section index as full-width rows (mono `01 writing` + `×24 →`, mint 0.2 top borders). Aurora canvas persists (fewer particles, ~150).
- **Menu**: hamburger (two mint lines, 44px box) opens full-screen overlay on `#0d1b33`: rows of `01` mono mint + 38px/700 section name + mono count; footer row github · linkedin · email · `⌘K search`. Close = mint ×.
- **Library**: sidebar becomes a horizontally scrollable shelf-chip row under the search box; entry rows stack (badge + meta on one line, then title, then desc).
- **Resume**: receipts panel becomes a bottom sheet that slides up when a dashed claim is tapped.
- **Skills**: dossier becomes a bottom sheet; skill grid 3-up.
- **Workshop**: all grids collapse to 1–2 columns.

## Interactions & Behavior
- **⌘K command palette**: global; searches all Library entries + pages; mono styling consistent with search input. (Not mocked — style like the Library search dropdown.)
- **Status pill**: pulsing dot (scale 1→1.35, opacity 1→0.55, 2s ease-in-out infinite).
- **Hovers**: links `#B0C6CE → #64ffda`; entry rows get faint mint bg; skill tiles get mint border. Transitions ~150ms ease.
- **Aurora**: continuous rAF; pause when tab hidden; static fallback for `prefers-reduced-motion`.
- **Resume proofs / skill dossiers**: simple selected-key state; instant swap (or 150ms fade).
- **Library**: shelf + search + topic filters compose; state in URL query params so filtered views are shareable.

## State Management
Minimal — this is a static site with islands:
- Library island: `{ shelf, query, topics[] }` → filtered list (data inlined at build).
- Resume island: `{ activeProof }`. Skills island: `{ activeSkill }`.
- Command palette: `{ open, query, results }`.
- No global store needed.

## Content model (frontmatter)
```yaml
title: "Agent memory patterns that actually work"
type: essay | cs | ml | book | paper | idea | reflection | quote | spirit | resources
topics: [ai, agents]
date: 2026-07-02
readingTime: 9   # or compute
```

## Assets
- `images/m-logo.png` — mountain-M logo (renders white via `filter: brightness(10)` on dark; consider exporting a white SVG).
- `images/my-photo.jpg` — portrait (crop `object-position: 50% 20%`).
- `images/projects/…` — ChessMate, EyeSee, GlassTasks photos.
- `images/design/…` — CAD renders (landing gear, SCARA assembly, CNC, Lightning cable, EpiPen case, chair).
- All from the owner's existing site repo (MostafaOkasha/MostafaOkasha.github.io).
- Fonts: Google Fonts (Space Grotesk, IBM Plex Mono).

## Files
| File | What it shows |
|---|---|
| `Home.dc.html` | Final homepage incl. the aurora canvas code to port |
| `Library.dc.html` | Library with working shelf filter + search |
| `Workshop.dc.html` | Projects, system diagrams, CAD gallery, photo grid |
| `Resume.dc.html` | Interactive resume with working proof-panel swap |
| `Skills.dc.html` | Skill grid with working dossier swap (skill data inline) |
| `Reference - Explorations (5a 5b 5c mobile 3b).dc.html` | Design exploration history. Section `3b` = the mobile designs (three phone frames). Sections `5a/5b/5c` = the approved concepts. Other sections are rejected directions — ignore. |
| `support.js`, `image-slot.js`, `ios-frame.jsx` | Runtime for viewing the prototypes only — do not ship |
