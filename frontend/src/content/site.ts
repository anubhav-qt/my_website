export const PROFILE = {
  name: 'Anubhav Joshi',
  role: 'Backend Engineer',
  status: '2026 CS Graduate; Open to Backend, AI Infrastructure, and Systems Engineering Roles.',
  location: 'Jaipur, India',
  email: 'magicalfizz@gmail.com',
  github: 'https://github.com/anubhav-qt',
  linkedin: 'https://linkedin.com/in/anubhav-qt',
  resume: '/resume.pdf',
};

export const FEATURED_IDS = ['spoin'] as const;

export const CURRENTLY_MAKING: Record<(typeof FEATURED_IDS)[number], {
  title: string;
  progress: number;
  description: string;
  highlight: string;
  descriptionEnd: string;
  tags: { label: string; href: string }[];
}> = {
  spoin: {
    title: 'Spoin: For the Curious',
    progress: 85,
    description: '103 ADRs written and the new custom RAG implementation (frog) tested. Currently ',
    highlight: 'fine-tuning the new harness and doing UI quality checks',
    descriptionEnd: ' of the newly generated cards.',
    tags: [
      { label: 'case study', href: '/projects/spoin' },
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
    label: 'AI/ML',
    icon: 'brain',
    accent: 'rose',
    items: ['FastAPI', 'LangChain', 'LangGraph', 'Google ADK', 'PyTorch'],
  },
  {
    label: 'Databases',
    icon: 'server',
    accent: 'sage',
    items: ['PostgreSQL', 'pgvector', 'Pinecone', 'CockroachDB', 'Redis'],
  },
  {
    label: 'Cloud & DevOps',
    icon: 'cloud',
    accent: 'gold',
    items: ['Docker', 'AWS', 'Google Cloud', 'Vercel', 'Render'],
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
    period: 'Jan 2026 to August 2026',
    headline: 'Built Anchor8, Cargonto, managed a team of 7, and grown as an engineer.',
    bullets: [
      'Cofounded with my friend Vasu. We built Anchor8, a security and governance layer that sits between AI agents and their tools, monitoring and securing every autonomous agent in a system. It is still on pip as `pip install anchor8`.',
      'Ran a team of 7, and designed at system level instead of feature level for the first time.',
      'Paused it after months of building: it sold governance for fully autonomous AI systems that do not exist in the market yet, and we had not checked that first.',
    ],
  },
  {
    id: 'blinkadz',
    company: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 to Apr 2025',
    headline: 'First internship: LinkedIn APIs, Google ADK video ad pipeline, and open office dev in Jaipur.',
    bullets: [
      'First internship, at the start of my 3rd year, sitting next to the CEO in an open office in Jaipur.',
      "Shipped features and integrated LinkedIn's marketing APIs, ads and campaigns.",
      'Then two months of research and then building an end-to-end video ad creation pipeline on Google ADK, which had only just been released, so everything was trial and error.',
    ],
  },
];

export const EDUCATION = {
  degree: 'B.Tech, Computer Science (specialization in AI & ML)',
  school: 'Manipal University Jaipur',
  period: 'Aug 2022 to Jul 2026',
  cgpa: '9.28/10',
  honor: "Dean's List and Student Excellence Award, all 8 semesters",
  note: 'Also spent an entire semester as Vice Chair of the IEEE GRSS (Geoscience and Remote Sensing Society) student chapter.',
};

