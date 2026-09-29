/**
 * The career journey shown on /about (and the About rewrite template in
 * src/drafts/pages/about.astro). One copy, so the two cannot drift.
 * Dates here are public claims: the Meta end date is also stated in
 * src/data/receipts.ts and the printable resume — change all three together.
 */
export interface JourneyStop {
  org: string;
  role: string;
  when: string;
  badge?: string;
  color?: string;
  logo?: string;
  bullets: string[];
}

// every stop from the original site, nothing lost
export const JOURNEY: JourneyStop[] = [
  {
    org: 'Meta (Reality Labs)', role: 'Software Engineer', when: 'Nov 2024 — Feb 2026', badge: '∞', color: '#64ffda',
    bullets: [
      'Led the migration of a distributed ML platform, fully rebuilding compute, storage, and networking infrastructure',
      'Rewrote CPU-bound image preprocessing into GPU kernels to achieve a 350x speedup with <1% output drift',
      'Contributed to real-time contextual AI experiences on XR devices by integrating perception & decision models',
    ],
  },
  {
    org: 'MapSight', role: 'Founder', when: 'Apr 2024 — Present', badge: 'MS', color: '#64ffda',
    bullets: [
      'Built a geospatial analytics web app that finds optimal distribution locations for auto parts businesses by analyzing driving time metrics (AWS, React, Python, Flask, DynamoDB)',
      'Used Cosine Similarity, FuzzyWuzzy & Agglomerative Clustering with an LLM to categorize industry locations',
      'Designed an Industry Locations API to ensure all locations within an area stay up to date',
    ],
  },
  {
    org: 'Scale AI', role: 'Software Engineer, AI Training', when: 'Jan 2024 — Nov 2024', badge: 'S', color: '#64ffda',
    bullets: [
      'Wrote 30+ DSA coding problems & solutions and reviewed 230+ submissions (Python, Java, C++)',
      'Worked on 12 LLM RLHF projects across languages & frameworks including C#, .NET, Laravel, Ruby on Rails, Kotlin, Dart & Flutter',
      "Assisted with the RLHF training of Google Gemini's external API capabilities for the trip planning feature",
    ],
  },
  {
    org: 'Capital One', role: 'Senior Software Engineer', when: 'Nov 2019 — Sep 2022', logo: '/images/webp/capitalone.webp',
    bullets: [
      'Analyzed 95 fraud & dispute case states with currency conversion issues and designed full-scale solutions, leading to reduced losses by $2M+/year',
      'Led the Foreign Transaction Fee Enhancement project to cut operational losses by around $1.5M/year',
      'Developed scalable ECS clusters on AWS integrated with CI/CD pipelines, and collaborated on features & REST APIs throughout 10+ Java Spring Boot microservices',
    ],
  },
  {
    org: 'Ericsson', role: 'Software Developer Intern', when: 'Jan — Aug 2018', logo: '/images/webp/ericsson.webp',
    bullets: [
      'Developed 5G Radio features in C++ that helped increase LTE data throughput by 400%',
      'Designed an interactive Bash script that reduced time spent debugging mobile connection logs by 50%',
      'Integrated script with Python Remote Desktop Protocols to automate mobile testing and triple capacity',
    ],
  },
  {
    org: 'McMaster University', role: 'Instructional Assistant Intern', when: 'Aug — Dec 2017', logo: '/images/webp/mcmaster.webp',
    bullets: [
      'Received recognition for highest Instructional Assistant rating voted by all students — 4.6/5',
      'Conducted Engineering Design and Ethics tutorials for 1000+ 1st year students with a team of 3',
      'Mentored students building a project for a disabled client through the Product Development Life Cycle',
    ],
  },
  {
    org: 'QKids Tech.', role: 'Business Development Intern', when: 'May — Aug 2017', logo: '/images/webp/qkids.webp',
    bullets: [
      'Developed a Python based ATS using SQLite and SQL Server that filtered over 5000 candidates',
      'Integrated with Gmail API to automate messaging which saved over 160 hours of sending emails',
      'Optimized string matching algorithms by improving the buffer comparison operations',
    ],
  },
  {
    org: 'King Faisal Hospital', role: 'Biomedical Engineering Intern', when: 'May — Aug 2016', logo: '/images/webp/kfsh.webp',
    bullets: [
      'Analyzed medical equipment with an Oscilloscope to find and repair minor defective components',
      'Composed an Arduino and Circuitry training program for freshmen interns to learn programming',
      'Performed 13 training labs in PLC and FPGA design and documented the labs for future interns',
    ],
  },
];
