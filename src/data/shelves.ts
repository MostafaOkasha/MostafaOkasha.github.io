import { getCollection } from 'astro:content';
import { CASE_STUDIES } from './case-studies';

/** Shelf definitions: type key → label + badge + color token. */
export const SHELF_TYPES = {
  essay: { label: 'essays & deep dives', badge: 'DEEP DIVE', color: '#64ffda' },
  cs: { label: 'CS curriculum', badge: 'CS NOTES', color: '#7cb7ff' },
  ml: { label: 'ML / AI notes', badge: 'ML NOTES', color: '#d8a3ff' },
  paper: { label: 'paper notes', badge: 'PAPER', color: '#ffd76b' },
  idea: { label: 'open ideas', badge: 'OPEN IDEA', color: '#ffb26b' },
  reflection: { label: 'reflections', badge: 'REFLECTION', color: '#ff8ba3' },
  quote: { label: 'quotes + commentary', badge: 'QUOTE', color: '#B0C6CE' },
  spirit: { label: 'spirituality', badge: 'SPIRIT', color: '#a8e6a3' },
  resources: { label: 'resource maps', badge: 'RESOURCES', color: '#e6d3a3' },
} as const;

export type ShelfType = keyof typeof SHELF_TYPES;

/**
 * Entry dates are authored as bare calendar dates (`2026-07-09`), which parse as
 * UTC midnight. Formatting them with local getters shifts them a day west of
 * Greenwich — so the same content rendered "jul 08" locally (EDT) and "jul 09"
 * in CI (UTC). Always read them in UTC so a date renders as written, everywhere.
 */
export function fmtMeta(date: Date, readingTime?: number): string {
  const mon = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toLowerCase();
  const yr = String(date.getUTCFullYear()).slice(2);
  const rt = readingTime ? `${readingTime} min` : 'note';
  return `${rt} · ${mon} '${yr}`;
}

export function fmtKicker(date: Date): string {
  const mon = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  return `${mon} ${String(date.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Shelf keys that currently hold at least one published entry (plus the
 * synthetic `case` shelf when case studies exist). Build-time only.
 */
export async function liveShelves(): Promise<Set<string>> {
  const entries = await getCollection('library', ({ data }) => !data.draft);
  const live = new Set<string>(entries.map((e) => e.data.type));
  if (CASE_STUDIES.length) live.add('case');
  return live;
}

/**
 * False for a `/library?shelf=X` link whose shelf is empty. Empty shelves are
 * hidden, so such a link silently lands on "everything" — a promise with no
 * destination. Filter these out; they come back on their own when content lands.
 */
export function isLiveLink(href: string, live: Set<string>): boolean {
  const m = href.match(/^\/library\?shelf=([a-z-]+)/);
  return !m || live.has(m[1]);
}
