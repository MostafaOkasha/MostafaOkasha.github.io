/**
 * System-design case studies.
 *
 * These live as bespoke `.astro` pages under src/pages/workshop/systems/ rather
 * than as markdown in the `library` collection, because each one carries custom
 * layout (diagrams, meta strip, staged walkthrough) that markdown would flatten.
 *
 * That meant they were invisible to everything that reads the collection: the
 * homepage "latest" rail, the Library shelves, and the RSS feed. This registry
 * is the bridge — the pages stay as they are, and the archive can see them.
 *
 * Adding a case study: create the page, then add a row here. `date` is the date
 * the page was authored (git add date), not a guess.
 */
export interface CaseStudyEntry {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  date: Date;
  url: string;
  readingTime: number;
  topics: string[];
}

export const CASE_STUDY_BADGE = { badge: 'CASE STUDY', color: '#7cb7ff' } as const;

export const CASE_STUDIES: CaseStudyEntry[] = [
  {
    slug: 'edge-gateway',
    title: 'An edge gateway for real-time ML, and the ingress controller under it',
    description:
      'Getting live sensor streams from AR devices into models on a locked-down GPU cluster meant two builds: a streaming edge gateway that multiplexes thousands of tunnels over one connection, and a from-scratch Kubernetes ingress controller — because the standard one wasn’t allowed in the cluster.',
    kicker: 'System design · Meta Reality Labs · ML platform',
    date: new Date('2026-07-11'),
    url: '/workshop/systems/edge-gateway',
    readingTime: 5,
    topics: ['systems', 'infrastructure', 'kubernetes', 'http2', 'ml-platform'],
  },
  {
    slug: 'currency-conversion',
    title: 'The $10M currency-conversion gap',
    description:
      'A rounding-and-timing gap in cross-border dispute settlement quietly lost money on a subset of cases. Finding it meant reverse-engineering a 95-state dispute lifecycle; fixing it meant a change that spanned 30+ services and four organizations.',
    kicker: 'System design · Capital One · Fraud & Disputes',
    date: new Date('2026-07-11'),
    url: '/workshop/systems/currency-conversion',
    readingTime: 5,
    topics: ['systems', 'payments', 'fraud', 'distributed-systems'],
  },
];

/**
 * Look up a case study by slug. Every page under src/pages/workshop/systems/
 * reads its title, kicker and summary from here, so the page and the archive
 * listing cannot drift — and a page that isn't registered fails the build
 * instead of silently being missing from the homepage, Library and RSS.
 */
export function caseStudy(slug: string): CaseStudyEntry {
  const entry = CASE_STUDIES.find((c) => c.slug === slug);
  if (!entry) {
    throw new Error(
      `Case study "${slug}" is not registered in src/data/case-studies.ts — add it there so it appears in the archive.`
    );
  }
  return entry;
}
