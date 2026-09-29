---
title: "Attention, from scratch, three ways"
description: "✎ My working notes: numpy → einsum → the KV-cache view. With scribbles."
type: ml
topics: [ml, transformers, attention]
date: 2026-09-29  # ✎ set the real publish date
readingTime: 12
draft: true   # delete this line to publish (the build refuses while any ✎ remains)
---

✎ Opening: why implement attention three times, and what each version taught you that the previous one hid.

## 1 · Plain numpy
✎ The loop-level version. Paste the core function and walk through the shapes.

```python
# ✎ your numpy implementation
```

## 2 · einsum
✎ The same thing in one line. What does the einsum string make obvious?

## 3 · The KV-cache view
✎ Why caching keys and values changes the cost of generation, and what that looks like in code.

## What finally made it click
✎ The one diagram, analogy, or bug that made it make sense. A photo of your scribbles works well here.

## Code
✎ Link to a repo or gist.
