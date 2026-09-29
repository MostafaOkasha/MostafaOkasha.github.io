/**
 * Workshop projects. Extracted from src/pages/workshop.astro so the ⌘K
 * command palette can index them too (a page-local array is not importable).
 */
import { visibleItem } from './drafts';

export interface Project {
  name: string;
  year: string;
  desc: string;
  img: string | null;
  links: { label: string; href: string; mint: boolean }[];
  /** true = template: shown only in `npm run dev` (see src/data/drafts.ts) */
  draft?: boolean;
}

export const ALL_PROJECTS: Project[] = [
  // ---- TEMPLATES for current flagship work (draft: dev-only) --------------------
  // Replace every ✎ line, add a cover image under images/projects/<Name>/, then
  // delete `draft: true`. Each links to its case-study template in src/drafts/pages/.
  {
    name: 'Forge OS',
    year: '✎ 2025 — now',
    desc: '✎ One sentence: what Forge OS / Praxis Forge is, who it is for, and the one number or outcome that proves it works.',
    img: null,
    links: [{ label: 'case study', href: '/workshop/systems/forge-os', mint: true }],
    draft: true,
  },
  {
    name: 'LifeKeep',
    year: '✎ 2025 — now',
    desc: '✎ One sentence: what LifeKeep (Habit28) does, who uses it, and what makes it different from the obvious alternative.',
    img: null,
    links: [{ label: 'case study', href: '/workshop/systems/lifekeep', mint: true }],
    draft: true,
  },
  {
    name: 'Chamber',
    year: '✎ 2025 — now',
    desc: '✎ One sentence: what Chamber is, the problem it solves, and where it stands today (shipped, beta, in progress).',
    img: null,
    links: [{ label: 'case study', href: '/workshop/systems/chamber', mint: true }],
    draft: true,
  },
  // ---- published ---------------------------------------------------------------
  {
    name: 'MapSight',
    year: '2024 — now',
    desc: 'Geospatial analytics platform — drive-time analysis and location intelligence for auto-parts businesses.',
    img: null,
    links: [
      { label: 'system design', href: '#systems', mint: true },
      { label: 'write-up soon', href: '/library', mint: false },
    ],
  },
  {
    name: 'ChessMate',
    year: '2019',
    desc: 'Autonomous chess robot — vision, engine, SCARA arm. 99% win rate.',
    img: '/images/webp/projects/ChessMate/chessmate1.webp',
    links: [
      { label: 'system design', href: '#systems', mint: true },
      { label: 'retrospective soon', href: '/library', mint: false },
    ],
  },
  {
    name: 'EyeSee',
    year: '1st @ HackPrinceton',
    desc: 'Wearable assistive vision — narrates threats and surroundings for low-vision users in real-time AR.',
    img: '/images/webp/projects/EyeSee/EyeSee2.webp',
    links: [
      { label: 'photos', href: '#photos', mint: true },
      { label: 'build story soon', href: '/library', mint: false },
    ],
  },
  {
    name: 'DRACO',
    year: '2018',
    desc: 'Dual Robotic Arm Control Operation — potentiometer joysticks drive two arms simultaneously, with movement logging for repeatable factory-style patterns.',
    img: '/images/webp/projects/Draco/draco.webp',
    links: [
      { label: 'photos', href: '#design', mint: true },
      { label: 'write-up soon', href: '/library', mint: false },
    ],
  },
  {
    name: 'GlassTasks',
    year: '2018',
    desc: 'Restaurant order management on Google Glass — hands-free heads-up display for kitchen staff.',
    img: '/images/webp/projects/GlassTasks/GlassTasks1.webp',
    links: [
      { label: 'github', href: 'https://github.com/MostafaOkasha', mint: true },
      { label: 'write-up soon', href: '/library', mint: false },
    ],
  },
];

/** Projects visible in this build — drafts only appear in `npm run dev`. */
export const PROJECTS: Project[] = ALL_PROJECTS.filter(visibleItem);
