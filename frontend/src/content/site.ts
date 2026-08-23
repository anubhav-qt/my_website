export const PROFILE = {
  name: 'Anubhav Joshi',
  role: 'Backend Engineer',
  status: '2026 CS Graduate; Open to Backend, AI Infrastructure, and Systems Engineering Roles.',
  location: 'Jaipur, India',
  email: 'magicalfizz@gmail.com',
  github: 'https://github.com/anubhav-qt',
  linkedin: 'https://linkedin.com/in/anubhav-qt',
};

export const FEATURED_IDS = ['spoin', 'continuum'] as const;

export const CURRENTLY_MAKING: Record<(typeof FEATURED_IDS)[number], {
  title: string;
  progress: number;
  description: string;
  highlight: string;
  descriptionEnd: string;
  tags: { label: string; href: string }[];
}> = {
  spoin: {
    title: 'Spoin: CQRS Pipeline & Quota Governor',
    progress: 90,
    description: '10,047 cards live, 52 ADRs deep, pipeline is done. What is left is UI polish, ',
    highlight: 'manually quality-checking cards',
    descriptionEnd: ' in the frontend, and filling out the last topics.',
    tags: [
      { label: 'case study', href: '/projects#spoin' },
      { label: 'systems', href: '/projects#spoin' },
    ],
  },
  continuum: {
    title: 'Continuum: Film Studio Continuity OS',
    progress: 25,
    description: 'Event ledger and multigraph design are drafted, ',
    highlight: 'the multi-agent orchestration layer',
    descriptionEnd: ' is still being worked out before any of this is built.',
    tags: [
      { label: 'case study', href: '/projects#continuum' },
      { label: 'architecture', href: '/projects#continuum' },
    ],
  },
};

export type Accent = 'amber' | 'sage' | 'rose' | 'clay' | 'gold';

export interface StackGroup {
  label: string;
  icon: 'code' | 'server' | 'brain' | 'device' | 'cloud';
  accent: Accent;
  items: string[];
}

export const STACK_GROUPS: StackGroup[] = [
  {
    label: 'Languages',
    icon: 'code',
    accent: 'amber',
    items: ['Python', 'TypeScript'],
  },
  {
    label: 'AI & Frameworks',
    icon: 'brain',
    accent: 'rose',
    items: ['FastAPI', 'PyTorch', 'Google ADK', 'LangGraph', 'MCP'],
  },
  {
    label: 'Data & Persistence',
    icon: 'server',
    accent: 'sage',
    items: ['PostgreSQL', 'Neon', 'Redis', 'pgvector / Pinecone', 'CockroachDB'],
  },
  {
    label: 'Cloud & DevOps',
    icon: 'cloud',
    accent: 'gold',
    items: ['Google Cloud', 'Docker', 'Vercel', 'Render'],
  },
  {
    label: 'UI/UX',
    icon: 'device',
    accent: 'clay',
    items: ['Next.js', 'React Native'],
  },
];

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  headline: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'anchorate',
    company: 'Anchorate',
    role: 'Co-Founder & CTO',
    period: 'Jan 2026 to Present',
    headline: 'Two products built and scrapped, still looking for the next problem worth solving.',
    bullets: [
      'Built Anchor8, a policy layer that sat between AI agents and their tools: PII redaction, prompt injection detection, and anomaly detection over an append only audit log using pgvector similarity. Packaged it as a PyPI SDK with a three line LangChain integration. Scrapped it once it was clear the market for it was not there yet.',
      'Also built Cargonto, which turned invoice photos and packing lists into structured freight paperwork. Scrapped that one too.',
      'Ran AWS and GCP infra, Docker, and CI/CD for both while they were live. Still CTO here, currently figuring out what to build next.',
    ],
  },
  {
    id: 'blinkadz',
    company: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 to Apr 2025',
    headline: 'Where I learned an AI pipeline is mostly orchestration, not model magic.',
    bullets: [
      'Built a 12 agent pipeline on Google ADK and FastAPI that cut video ad creation time by 95 percent. Most of the effort went into clean handoffs between agents, not making any single one smarter.',
      'Automated LinkedIn campaign setup through their Marketing API, which mostly meant learning to live with rate limits and retries.',
      'Wrote Playwright suites for the modules I trusted least, got coverage to 90 percent, and stopped dreading deploys.',
      'Benchmarked 20 LLMs across production use cases to pick models for avatar and video generation. First time I understood model choice as a cost and latency call as much as a quality one.',
    ],
  },
];

export const EDUCATION = {
  degree: 'B.Tech, Computer Science (Artificial Intelligence and Machine Learning)',
  school: 'Manipal University Jaipur',
  period: 'Aug 2022 to Jul 2026',
  cgpa: '9.28/10',
  honor: "Dean's List and Student Excellence Award, all 8 semesters",
  note: 'Also spent a good chunk of the degree as Vice Chair of the IEEE GRSS student chapter.',
};
