# Library templates

Blank forms, one per shelf. **Files in this folder never build** — they exist to be copied.

To start a new entry:

```bash
cp src/content/library/_templates/ml.md src/content/library/my-new-entry.md
```

The file name becomes the URL (`/library/my-new-entry`). Keep `draft: true` while writing:
`npm run dev` shows it on its shelf, stamped DRAFT, with every `✎` placeholder highlighted.
Delete `draft: true` to publish — the production build refuses while any `✎` is left.

Your **planned** entries (from the design handoff) are already placed as drafts in
`src/content/library/` — open http://localhost:4321/drafts to see them all.

Books are a separate collection: see `src/content/books/_templates/book.md`.
