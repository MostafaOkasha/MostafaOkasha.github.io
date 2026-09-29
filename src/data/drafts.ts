/**
 * Drafts and placeholders — the one rule every template on this site follows.
 *
 * A draft is visible in `npm run dev` (stamped DRAFT, placeholders highlighted)
 * and absent from `npm run build`, so a template can never reach okasha.me:
 *
 *   - library / books markdown:  `draft: true` in frontmatter
 *   - projects / case studies:   `draft: true` on the registry entry
 *   - whole pages:               a file under src/drafts/pages/ (only routed in dev)
 *
 * Placeholder text starts with ✎. The production build FAILS if a ✎ appears
 * anywhere in its output (see astro.config.mjs), so publishing something that
 * still has a placeholder in it is impossible, not just unlikely.
 *
 * Open http://localhost:4321/drafts in `npm run dev` for the full list of what
 * is still a template and exactly which file to edit.
 */

/** true under `npm run dev`, false in every production build */
export const SHOW_DRAFTS = import.meta.env.DEV;

/** the marker every placeholder starts with; search for it to find them all */
export const PLACEHOLDER = '✎';

/** getCollection filter: published entries always, drafts only in dev */
export const visible = ({ data }: { data: { draft?: boolean } }): boolean =>
  SHOW_DRAFTS || !data.draft;

/** the same rule for plain registry objects (projects, case studies) */
export const visibleItem = (item: { draft?: boolean }): boolean => SHOW_DRAFTS || !item.draft;
