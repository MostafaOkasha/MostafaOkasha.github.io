/**
 * Resume receipts: every dashed claim on the paper opens one of these.
 * Grounded in the July 2026 resume — update alongside /resume/resume.pdf.
 *
 * NOTE: everything here is sanitized. No internal project/service codenames,
 * no colleague or partner names — only the public-safe technical essence.
 */
export interface Receipt {
  label: string;
  title: string;
  body: string;
  links: { label: string; href: string; mint: boolean }[];
}

export const RECEIPTS: Record<string, Receipt> = {
  // ---- Meta (Reality Labs) ----
  gpu: {
    label: '350X SPEEDUP',
    title: 'CPU-bound preprocessing, rewritten as GPU kernels',
    body:
      "Another team's real-time demo was weeks away and crawling — a vision model spent 2–3 seconds per frame, almost all of it in an 8-stage CPU preprocessing pipeline (the Bayer conversion alone was ~2s). Nobody on either team had rewritten image ops as GPU kernels before. I took it on: re-implemented the whole pipeline deterministically on the GPU, built a benchmarking harness against their existing data, and held output drift under 1% while cutting preprocessing 350x. The model itself was already 30ms — the win was everything around it.",
    links: [
      { label: 'ml notes shelf →', href: '/library?shelf=ml', mint: true },
      { label: 'skills: CUDA/GPU', href: '/skills', mint: false },
    ],
  },
  ingress: {
    label: 'CUSTOM INGRESS LAYER',
    title: 'A Kubernetes ingress controller, built from scratch',
    body:
      "Cluster restrictions blocked the standard NGINX ingress controller, so I built a lightweight one. A Python sidecar (control plane) watches the Kubernetes API over a long-lived stream, keeps an in-memory cache of ingress objects, renders NGINX config from a Jinja2 template, writes it atomically, hashes to skip no-op reloads, and hot-reloads NGINX (the data plane) with zero downtime — plus batching, periodic reconciliation, RBAC, and annotation translation. Same reconciliation pattern as the official controller, deliberately scoped to what the environment actually needed.",
    links: [
      { label: 'system designs →', href: '/workshop#systems', mint: true },
      { label: 'skills: Kubernetes', href: '/skills', mint: false },
    ],
  },
  gateway: {
    label: 'EDGE GATEWAY · 2× THROUGHPUT',
    title: 'From a simple redirector to a real edge gateway',
    body:
      'Evolved a request router into a proper streaming edge gateway: conditional forward-proxy routing, a persistent HTTP/2 connection cache (100 client tunnels over one TLS session instead of 100 handshakes), WebSocket tunneling over HTTP CONNECT, octet-stream forwarding without buffering, and end-to-end backpressure. Clean split between control plane (auth, routing) and data plane (fast byte forwarding). Cross-network ML traffic throughput roughly doubled.',
    links: [
      { label: 'system designs →', href: '/workshop#systems', mint: true },
      { label: 'cs: networking notes', href: '/library?shelf=cs', mint: false },
    ],
  },
  mlplat: {
    label: 'ML PLATFORM MIGRATION',
    title: 'Rebuilding a distributed ML platform in flight',
    body:
      'Led the migration of a distributed ML platform — compute, storage, and networking rebuilt while 30+ models moved to partitioned (MIG) GPU infrastructure and the cluster itself moved between network environments. Along the way: fixed readiness probes so cold-start models report ready only after their first real inference, untangled a model-throttling bug whose runaway multiplier could stall a model for hours, and resolved memory, scheduling, and scaling issues across 100+ deployments.',
    links: [
      { label: 'system designs →', href: '/workshop#systems', mint: true },
      { label: 'ml notes', href: '/library?shelf=ml', mint: false },
    ],
  },

  // ---- MapSight ----
  mapsight: {
    label: 'MAPSIGHT',
    title: 'Geospatial analytics, founded from zero',
    body:
      'MapSight finds optimal distribution locations by analyzing driving-time metrics across every industry-relevant business in an area. The client renders thousands of markers and drawings, so I moved it to Next.js SSR (from React) for smooth performance; the backend is Python + Flask on AWS using Shapely, GeoPandas and scikit-learn. Cosine similarity, FuzzyWuzzy and agglomerative clustering — with an LLM in the loop — categorize and de-duplicate locations. Now productizing per-city industry data.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'skills: React / geospatial', href: '/skills', mint: false },
    ],
  },

  // ---- Scale AI ----
  gemini: {
    label: 'GOOGLE GEMINI RLHF',
    title: 'Training frontier models to code and plan',
    body:
      "Authored 30+ novel DSA problems and solutions not in the existing corpus, and reviewed 230+ submissions to keep quality high. Worked across 12 LLM RLHF projects in languages I'd never shipped before — C#/.NET, PHP/Laravel, Ruby/Rails, Kotlin/Android, Dart/Flutter — mentoring teammates along the way, and assisted the RLHF training of Google Gemini's external API for the trip-planning feature.",
    links: [
      { label: 'ml / ai notes →', href: '/library?shelf=ml', mint: true },
      { label: 'skills dossier', href: '/skills', mint: false },
    ],
  },

  // ---- Capital One ----
  fraud: {
    label: 'CURRENCY CONVERSION · $10M / 5YR',
    title: 'The currency-conversion audit',
    body:
      'A currency-conversion rounding gap sat across 95 fraud & dispute case states — money quietly lost on millions of cross-border cases. I wrote a program that crawled the data, mapped every state relationship, and generated a finite-state machine of the business logic, then designed the fix and presented it to four teams (accounting/ledgers, the card network, the mainframe partner, and the case-status team) to get buy-in. Reduced losses by $2M+/year — $10M+ over five years — and I pushed to always rebill customers to the dollar, even when it opened harder edge cases.',
    links: [
      { label: 'fraud-rule system design →', href: '/workshop#systems', mint: true },
      { label: 'essays shelf', href: '/library?shelf=essay', mint: false },
    ],
  },
  ftf: {
    label: '$1.5M/YEAR · PROMOTION',
    title: 'Two years, one overlooked fee',
    body:
      "It started as a bug I found as a fresh grad. Chasing it down revealed the real problem: the platform was built for a market that doesn't charge foreign-transaction fees, so the logic was missing across 10–20 services. Over two years I led the fix end-to-end — wearing both engineer and product-owner hats, aligning teams across two countries, and obsessively testing 90+ scenarios so the release was clean. Cut operational losses by $1.5M+/year and earned a promotion to Senior Software Engineer.",
    links: [
      { label: 'essays shelf →', href: '/library?shelf=essay', mint: true },
      { label: 'resume PDF', href: '/resume/resume.pdf', mint: false },
    ],
  },
  sred: {
    label: 'SR&ED · $300K+',
    title: 'Making the research case to the government',
    body:
      'Worked with external tax consultants to apply for the Scientific Research & Experimental Development (SR&ED) incentive for the currency-conversion work — worth $300K+. Writing a technical narrative that survives an auditor is its own engineering discipline.',
    links: [
      { label: 'essays shelf →', href: '/library?shelf=essay', mint: true },
      { label: 'resume PDF', href: '/resume/resume.pdf', mint: false },
    ],
  },
  aws: {
    label: 'FIRST CLOUD PLATFORM',
    title: 'The team had no AWS experience. So I learned it.',
    body:
      'My first real cloud project — and no one on the team (the tech lead had left) had deployed to AWS. I stood up autoscaling ECS clusters wired into CI/CD, handled the PCI-data security requirements, and stress-tested for concurrent users before degradation. Then I documented the whole thing, built templates, ran knowledge-transfer sessions, and onboarded other teams deploying their own services — later leading a clean ownership handoff of the container.',
    links: [
      { label: 'system designs →', href: '/workshop#systems', mint: true },
      { label: 'skills: AWS', href: '/skills', mint: false },
    ],
  },
  microfrontend: {
    label: 'MICRO-FRONTEND MIGRATION',
    title: 'Six devs, ten-plus teams, one legacy migration',
    body:
      "Helped migrate a large customer-management application to a micro-frontend/services architecture — bringing a market that was still on the legacy system onto the new AWS platform with its own regional business logic. Six developers, 10+ teams each owning a microservice: I lived in their docs and codebases, built and modified REST APIs (Vue.js + Java Spring Boot), and got changes reviewed across all of them.",
    links: [
      { label: 'skills: React / Spring →', href: '/skills', mint: true },
      { label: 'essays shelf', href: '/library?shelf=essay', mint: false },
    ],
  },
  hackathon: {
    label: '1ST — COMPANY-WIDE HACKATHON',
    title: 'A copilot in the side panel, before it was cool',
    body:
      'With a team of 3, built an agent that surfaces the right documentation to case agents based on the exact screen they were on — a contextual assistant living in the website side panel. I came up with the idea and aligned the team on the product vision. Won 1st place, most innovative, across a company-wide hackathon (Vue, AWS, Node.js). Three hackathons total: 1st in one, awards in the others.',
    links: [
      { label: 'skills: LLM / agents →', href: '/skills', mint: true },
      { label: 'open ideas shelf', href: '/library?shelf=idea', mint: false },
    ],
  },

  // ---- Ericsson ----
  fiveg: {
    label: 'LIVE CARRIER NETWORKS',
    title: 'C++ where a bad branch drops calls in a city',
    body:
      "Hired as a backend intern writing 5G code, then borrowed by a testing team physically validating the new phone 5G chips — 6am-to-midnight days. Had to learn telecom from scratch: MIMO, antennas, angle-of-arrival, SNR, baseband, multithreaded C++. Helped increase LTE throughput by 400%, and built a Bash + MATLAB testing rig that cut log-debugging time in half and — via Python remote-desktop automation — tripled test capacity by removing the need for people stationed everywhere.",
    links: [
      { label: 'cs curriculum shelf →', href: '/library?shelf=cs', mint: true },
      { label: 'skills: C++', href: '/skills', mint: false },
    ],
  },

  // ---- McMaster ----
  mcmaster: {
    label: '330+ STUDENTS',
    title: 'Teaching a first-year class to build for a real client',
    body:
      'Full-time instructional assistant leading 330+ first-year engineering students designing a product for a client with disabilities. I spent real time with the client to understand her needs, then guided the students through the whole build. Highest IA rating that year, voted by all students (4.6/5) — and one student turned her winning project into a company that’s doing well today. I still mentor a dozen-plus of them.',
    links: [
      { label: 'reflections shelf →', href: '/library?shelf=reflection', mint: true },
      { label: 'about me', href: '/about', mint: false },
    ],
  },

  // ---- Projects ----
  chess: {
    label: 'CHESSMATE',
    title: 'A robot that wins at chess — and a team that almost didn’t',
    body:
      'Led a team of 6 to build a SCARA robot that plays chess: OpenCV reads the board, an engine picks the move, the arm plays it (ROS, PySerial, AWS server, multiplayer interface). The harder part was people — three teammates with very different stakes. I ran 1:1s, scoped the project to everyone’s real constraints, and mentored two who’d never coded into actually contributing. Also designed and 3D-printed the board and gripper. Wins ~99% of the time.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'pipeline diagram', href: '/workshop#systems', mint: false },
    ],
  },
  eyesee: {
    label: 'EYESEE · 1ST @ HACKPRINCETON',
    title: 'Assistive vision, built in 36 hours',
    body:
      'A headset that detects nearby threats for partially-sighted users and surfaces them in real-time augmented reality. I owned the hardware hack — a Logitech cam, lenses from a Google Cardboard, an LCD, and the server connection — while the team trained the models (OpenCV + TensorFlow). We interviewed partially-sighted users to understand what actually helps: blurred edges, unclear objects, border thickness. First place, VR/AR category.',
    links: [
      { label: 'see it in the workshop →', href: '/workshop', mint: true },
      { label: 'photos', href: '/workshop#photos', mint: false },
    ],
  },
  flappy: {
    label: 'GODOT · 40 DAYS',
    title: 'A game engine, learned from scratch',
    body:
      'I just really wanted to build a game. Learned Godot, GDScript, scenes, 2D/3D and graphics from zero and rebuilt Flappy Bird end-to-end, shipping it on Android. 40 days, every single day.',
    links: [
      { label: 'workshop →', href: '/workshop', mint: true },
      { label: 'skills', href: '/skills', mint: false },
    ],
  },
  beneficent: {
    label: 'BENEFICENT RELIEF',
    title: 'Transparency for charitable giving',
    body:
      'A donation money-tracking transparency system for interest-free lending — donors can see applicants and choose exactly who receives their money, and follow where it goes. Built around the idea that trust in giving comes from visibility.',
    links: [
      { label: 'open ideas shelf →', href: '/library?shelf=idea', mint: true },
      { label: 'about me', href: '/about', mint: false },
    ],
  },
};
