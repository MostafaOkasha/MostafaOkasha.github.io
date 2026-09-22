/**
 * Workshop projects. Extracted from src/pages/workshop.astro so the ⌘K
 * command palette can index them too (a page-local array is not importable).
 */
export interface Project {
  name: string;
  year: string;
  desc: string;
  img: string | null;
  links: { label: string; href: string; mint: boolean }[];
}

export const PROJECTS: Project[] = [
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
