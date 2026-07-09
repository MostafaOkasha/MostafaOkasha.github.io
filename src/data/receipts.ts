/**
 * Resume receipts: every dashed claim on the paper opens one of these.
 * Grounded in the July 2026 resume — update alongside /resume/resume.pdf.
 */
export interface Receipt {
  label: string;
  title: string;
  body: string;
  links: { label: string; href: string; mint: boolean }[];
}

export const RECEIPTS: Record<string, Receipt> = {
  gpu: {
    label: '350X SPEEDUP',
    title: 'CPU-bound preprocessing, rewritten as GPU kernels',
    body:
      'Image preprocessing sat on the CPU in the hot path of an ML pipeline. Rewriting it as GPU kernels bought a 350x speedup — the hard part was proving correctness: output drift had to stay under 1% against the CPU reference across the full input distribution.',
    links: [
      { label: 'ml notes shelf →', href: '/library?shelf=ml', mint: true },
      { label: 'skills: CUDA/GPU', href: '/skills', mint: false },
    ],
  },
  mlplat: {
    label: 'ML PLATFORM MIGRATION',
    title: 'Rebuilding a distributed ML platform in flight',
    body:
      'Led the migration of a distributed ML platform at Meta Reality Labs — compute, storage, and networking rebuilt while 30+ models moved to MIG GPU infrastructure. Memory, scheduling, and scaling issues resolved along the way; CONNECT tunneling via forward proxy doubled cross-network ML throughput.',
    links: [
      { label: 'system designs →', href: '/workshop#systems', mint: true },
      { label: 'ml notes', href: '/library?shelf=ml', mint: false },
    ],
  },
  mapsight: {
    label: 'MAPSIGHT',
    title: 'Geospatial analytics, founded from zero',
    body:
      'MapSight finds optimal distribution locations for auto-parts businesses by analyzing driving-time metrics for every industry-relevant location in an area. Cosine similarity, FuzzyWuzzy and agglomerative clustering — with an LLM in the loop — categorize industry locations. AWS, React, Python, Flask, DynamoDB.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'skills: LLM/agents', href: '/skills', mint: false },
    ],
  },
  gemini: {
    label: 'GOOGLE GEMINI RLHF',
    title: 'Training frontier models to code and plan',
    body:
      "At Scale AI: authored 30+ novel DSA problems and reviewed 230+ submissions to keep the corpus clean; worked across 12 LLM RLHF projects spanning C#, .NET, Laravel, Rails, Kotlin, Dart and Flutter; assisted the RLHF training of Google Gemini's external API capabilities for the trip-planning feature.",
    links: [
      { label: 'ml / ai notes →', href: '/library?shelf=ml', mint: true },
      { label: 'skills dossier', href: '/skills', mint: false },
    ],
  },
  fraud: {
    label: '$2M+/YEAR',
    title: 'The currency-conversion audit',
    body:
      'Analyzed 95 fraud & dispute case states with currency-conversion issues at Capital One, designed full-scale solutions, and presented to four teams to get approvals — reducing losses by over $2M a year. The kind of bug that is nobody’s job to notice.',
    links: [
      { label: 'fraud-rule system design →', href: '/workshop#systems', mint: true },
      { label: 'essays shelf', href: '/library?shelf=essay', mint: false },
    ],
  },
  sred: {
    label: 'SR&ED · $300K+',
    title: 'Making the research case to the government',
    body:
      'Applied for the Scientific Research & Experimental Development (SR&ED) tax incentive for the currency-conversion work — worth $300K+. Writing the technical narrative that survives an auditor is its own engineering discipline.',
    links: [
      { label: 'essays shelf →', href: '/library?shelf=essay', mint: true },
      { label: 'resume PDF', href: '/resume/resume.pdf', mint: false },
    ],
  },
  fiveg: {
    label: 'LIVE CARRIER NETWORKS',
    title: 'C++ where a bad branch drops calls in a city',
    body:
      '5G radio features at Ericsson that helped increase LTE data throughput by 400%, plus an interactive Bash debugging tool that halved time spent in mobile connection logs and Python RDP automation that tripled test capacity.',
    links: [
      { label: 'cs curriculum shelf →', href: '/library?shelf=cs', mint: true },
      { label: 'skills: C++', href: '/skills', mint: false },
    ],
  },
  chess: {
    label: 'CHESSMATE',
    title: 'A robot that wins at chess',
    body:
      'Led a team of 6 to build a SCARA robot that plays chess — computer vision reads the board, an engine picks the move, the arm plays it. ML, OpenCV, AWS. It wins 99% of the time against humans brave enough to sit down.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'pipeline diagram', href: '/workshop#systems', mint: false },
    ],
  },
  eyesee: {
    label: 'EYESEE',
    title: 'Assistive vision, built in 36 hours',
    body:
      'A VR headset that detects nearby threats for the partially sighted and displays them in real-time augmented reality. OpenCV + TensorFlow + Python. Won first place in the VR/AR category at HackPrinceton, April 2017.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'photos', href: '/workshop#photos', mint: false },
    ],
  },
};
