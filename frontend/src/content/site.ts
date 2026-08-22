export const PROFILE = {
  name: 'Anubhav Joshi',
  role: 'Backend Engineer (AI & Infrastructure)',
  location: 'Jaipur, India',
  email: 'magicalfizz@gmail.com',
  github: 'https://github.com/anubhav-qt',
  linkedin: 'https://linkedin.com/in/anubhav-qt',
  tagline: "Currently building the async, rate-limited, provably-correct machinery behind AI products — so the model never has to be trusted with anything expensive to get wrong.",
};

export const CURRENTLY_MAKING = {
  title: 'Spoin — CQRS Pipeline & Quota Governor',
  description: '5,004 cards live. Ship it wrong and the ',
  highlight: 'auditor',
  descriptionEnd: ' finds you.',
  tags: [
    { label: 'case study', href: '#work' },
    { label: 'systems', href: '#work' },
  ],
};

export const STACK = [
  'Python',
  'TypeScript',
  'FastAPI',
  'PostgreSQL',
  'Redis',
  'Docker',
  'PyTorch',
  'LangChain',
  'LangGraph',
  'Next.js',
  'GCP',
  'AWS',
  'React Native',
  'Supabase',
];

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'anchorate',
    company: 'Anchorate',
    role: 'Co-Founder & CTO',
    period: 'Jan 2026 — Present',
    bullets: [
      'Runtime policy firewall between AI agents and tools — PII redaction, injection detection, pgvector audit log.',
      'Own architecture and infra (AWS/GCP, Docker, CI/CD) for two shipping products.',
    ],
  },
  {
    id: 'blinkadz',
    company: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 — Apr 2025',
    bullets: [
      '12-agent AI pipeline (Google ADK + FastAPI) cut video ad creation time 95%.',
      'Benchmarked 20 LLMs across 3 production use cases to drive model selection.',
    ],
  },
];

export const EDUCATION = {
  degree: 'B.Tech, Computer Science (AI & ML)',
  school: 'Manipal University Jaipur',
  period: 'Aug 2022 – Jul 2026',
  detail: 'CGPA 9.28/10 · Dean’s List, all 8 semesters',
};
