/**
 * The ⌘K search index. Built once at build time and emitted as /search.json
 * (see src/pages/search.json.ts), which the palette fetches the first time it
 * opens. It used to be inlined into every page via define:vars, which put ~26 KB
 * of duplicated JSON into all 23 pages — over half of the site's total HTML.
 */
import { getCollection } from 'astro:content';
import { SHELF_TYPES, fmtMeta } from './shelves';
import { PROJECTS } from './projects';
import { SKILLS } from './skills';
import { RECEIPTS } from './receipts';
import { CASE_STUDIES, CASE_STUDY_BADGE } from './case-studies';

export interface SearchItem {
  title: string;
  badge: string;
  color: string;
  meta: string;
  url: string;
  haystack: string;
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const entries = (await getCollection('library', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const bookEntries = await getCollection('books', ({ data }) => !data.draft);

  const items = [
    ...entries.map((e) => ({
      title: e.data.title,
      badge: SHELF_TYPES[e.data.type].badge,
      color: SHELF_TYPES[e.data.type].color,
      meta: fmtMeta(e.data.date, e.data.readingTime),
      url: `/library/${e.id}`,
      // include the entry body so search reaches inside articles, not just metadata
      haystack: `${e.data.title} ${e.data.description} ${e.data.topics.join(' ')} ${e.body ?? ''}`
        .toLowerCase()
        .slice(0, 4000),
    })),
    // workshop projects
    ...PROJECTS.map((p) => ({
      title: p.name,
      badge: 'PROJECT',
      color: '#ffb26b',
      meta: p.year,
      url: '/workshop',
      haystack: `${p.name} ${p.desc} ${p.year} project workshop`.toLowerCase(),
    })),
    // system-design case studies
    ...CASE_STUDIES.map((c) => ({
      title: c.title,
      badge: CASE_STUDY_BADGE.badge,
      color: CASE_STUDY_BADGE.color,
      meta: 'case study',
      url: c.url,
      haystack: `${c.title} ${c.description} ${c.kicker} ${c.topics.join(' ')} case study system design`.toLowerCase(),
    })),
    // skill dossiers
    ...SKILLS.map((s) => ({
      title: s.name,
      badge: 'SKILL',
      color: s.color,
      meta: s.yrs,
      url: `/skills#${s.k}`,
      haystack: `${s.name} ${s.yrs} ${s.since} ${s.chips.join(' ')} ${s.timeline
        .map((t) => `${t.when} ${t.what}`)
        .join(' ')} skill`.toLowerCase(),
    })),
    // resume claims — each opens its receipt
    ...Object.entries(RECEIPTS).map(([k, r]) => ({
      title: r.title,
      badge: 'RECEIPT',
      color: '#ffd76b',
      meta: r.label.toLowerCase(),
      url: `/resume#${k}`,
      haystack: `${r.label} ${r.title} ${r.body} resume receipt`.toLowerCase(),
    })),
    ...bookEntries.map((b) => ({
      title: b.data.title,
      badge: 'BOOK',
      color: '#7dead8',
      meta: b.data.author,
      url: `/library/books/${b.id}`,
      haystack: `${b.data.title} ${b.data.author} ${(b.data.description ?? '')} ${b.data.topics.join(' ')}`.toLowerCase(),
    })),
    { title: 'The Library', badge: 'PAGE', color: '#8892b0', meta: 'all shelves', url: '/library', haystack: 'library shelves writing essays notes' },
    { title: 'The Bookshelf', badge: 'PAGE', color: '#8892b0', meta: 'in the library', url: '/library/books', haystack: 'books bookshelf reading list summaries recommended library' },
    { title: 'The Workshop', badge: 'PAGE', color: '#8892b0', meta: 'projects · CAD', url: '/workshop', haystack: 'workshop projects system designs cad photography' },
    { title: 'Resume — with receipts', badge: 'PAGE', color: '#8892b0', meta: 'interactive', url: '/resume', haystack: 'resume cv experience receipts pdf' },
    { title: 'Skills', badge: 'PAGE', color: '#8892b0', meta: 'dossiers', url: '/skills', haystack: 'skills tools python typescript aws dossier' },
  ];
  return items;
}
