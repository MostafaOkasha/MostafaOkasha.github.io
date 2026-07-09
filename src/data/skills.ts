/**
 * Skill dossiers — every entry is evidence-backed by a role or project
 * on the resume. Update when the resume updates.
 */
export interface Skill {
  k: string;
  glyph: string;
  color: string;
  name: string;
  yrs: string;
  since: string;
  timeline: { when: string; what: string }[];
  chips: string[];
  lib: string;
  libHref: string;
}

export const SKILLS: Skill[] = [
  {
    k: 'py', glyph: 'Py', color: '#64ffda', name: 'Python', yrs: '9 yrs', since: 'since 2017',
    timeline: [
      { when: '2017', what: 'QKids — ATS that filtered 5,000+ candidates (SQLite, Gmail API)' },
      { when: '2019', what: 'ChessMate — OpenCV vision + AWS pipeline' },
      { when: '2019–22', what: 'Capital One — fraud analysis, the $2M/year audit' },
      { when: '2024', what: 'Scale AI — 30+ DSA problems authored, 230+ reviewed' },
      { when: 'now', what: 'MapSight — Flask APIs, geospatial processing, clustering' },
    ],
    chips: ['numpy', 'flask', 'pytorch', 'opencv'],
    lib: 'Python threads through most of the CS and ML shelves.',
    libHref: '/library?q=python',
  },
  {
    k: 'cpp', glyph: 'C++', color: '#ffd76b', name: 'C++', yrs: '8 yrs', since: 'since 2018',
    timeline: [
      { when: '2018', what: 'Ericsson — 5G radio features on live carrier networks (+400% LTE throughput)' },
      { when: '2019', what: 'McMaster — embedded & real-time systems coursework' },
      { when: '2024', what: 'Scale AI — DSA problem authoring & review' },
    ],
    chips: ['embedded', 'rtos', '5G RAN'],
    lib: 'The networking notes come straight from the Ericsson era.',
    libHref: '/library?shelf=cs',
  },
  {
    k: 'java', glyph: 'Jv', color: '#7cb7ff', name: 'Java', yrs: '7 yrs', since: 'since 2019',
    timeline: [
      { when: '2019–22', what: 'Capital One — features & REST APIs across 10+ Spring Boot microservices' },
      { when: '2022', what: 'Micro-frontend/services migration of the Customer Management app' },
      { when: '2024', what: 'Scale AI — RLHF coding projects' },
    ],
    chips: ['spring boot', 'microservices', 'REST'],
    lib: 'The distributed-systems notes lean on this era.',
    libHref: '/library?shelf=cs',
  },
  {
    k: 'ts', glyph: 'TS', color: '#7cb7ff', name: 'TypeScript', yrs: '5 yrs', since: 'since 2021',
    timeline: [
      { when: '2021–22', what: 'Capital One — internal dashboards & tooling' },
      { when: '2024', what: 'MapSight — React frontend' },
      { when: 'now', what: 'This site — Astro + islands, twice rebuilt' },
    ],
    chips: ['react', 'node', 'astro', 'vite'],
    lib: 'The site-rebuild essay is a TypeScript deep dive.',
    libHref: '/library/rebuilding-okasha-me',
  },
  {
    k: 'react', glyph: '⚛', color: '#ff8ba3', name: 'React', yrs: '5 yrs', since: 'since 2021',
    timeline: [
      { when: '2021–22', what: 'Capital One — micro-frontend platform work' },
      { when: '2024–now', what: 'MapSight — the entire analytics UI' },
    ],
    chips: ['hooks', 'canvas', 'next.js', 'vue'],
    lib: 'Frontend notes live on the CS shelf.',
    libHref: '/library?shelf=cs',
  },
  {
    k: 'aws', glyph: 'λ', color: '#d8a3ff', name: 'AWS', yrs: '7 yrs', since: 'since 2019',
    timeline: [
      { when: '2019–22', what: 'Capital One — ECS clusters + CI/CD, container deployment docs used org-wide' },
      { when: '2023', what: 'Solutions Architect Associate certification' },
      { when: 'now', what: 'MapSight — DynamoDB, ECS, the boring parts done right' },
    ],
    chips: ['ecs', 'dynamodb', 'lambda', 's3'],
    lib: 'Deployment patterns are written up as resource maps.',
    libHref: '/library?shelf=resources',
  },
  {
    k: 'llm', glyph: '◎', color: '#7dead8', name: 'LLM / agents', yrs: '3 yrs', since: 'since 2023',
    timeline: [
      { when: '2024', what: "Scale AI — RLHF across 12 projects incl. Google Gemini's trip-planning APIs" },
      { when: '2024', what: 'MapSight — LLM-in-the-loop location categorization' },
      { when: '2024–26', what: 'Meta Reality Labs — contextual AI on XR devices, perception + decision models' },
    ],
    chips: ['rlhf', 'evals', 'rag', 'agents'],
    lib: 'The ML / AI shelf is entirely this skill.',
    libHref: '/library?shelf=ml',
  },
  {
    k: 'gpu', glyph: '▦', color: '#ffb26b', name: 'CUDA / GPU', yrs: '2 yrs', since: 'since 2024',
    timeline: [
      { when: '2024–26', what: 'Meta — CPU preprocessing → GPU kernels, 350x speedup, <1% drift' },
      { when: '2025', what: '30+ models migrated to MIG GPU infrastructure' },
      { when: '2025', what: 'Benchmarking & eval pipelines for latency and throughput' },
    ],
    chips: ['cuda', 'triton', 'mig', 'kernels'],
    lib: 'The performance notes are on the ML shelf.',
    libHref: '/library?shelf=ml',
  },
  {
    k: 'cad', glyph: '⚙', color: '#e6d3a3', name: 'CAD / NX', yrs: '10 yrs', since: 'since 2014',
    timeline: [
      { when: '2014–19', what: 'McMaster — landing gear, SCARA arm, desktop CNC' },
      { when: 'always', what: 'EpiPen case & other 3D-printed daily drivers' },
    ],
    chips: ['nx', 'inventor', '3d printing', 'laser cutting'],
    lib: 'All CAD work is in the Workshop design gallery.',
    libHref: '/workshop#design',
  },
  {
    k: 'photo', glyph: '▣', color: '#B0C6CE', name: 'Photography', yrs: '10 yrs', since: 'since 2016',
    timeline: [
      { when: '2016–now', what: 'Travel & street — the archive is being digitized' },
      { when: 'soon', what: 'A photo section lands in the Workshop' },
    ],
    chips: ['travel', 'street'],
    lib: 'Photo stories will live in the Workshop.',
    libHref: '/workshop#photos',
  },
];
