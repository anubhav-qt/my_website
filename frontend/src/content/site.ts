export const PROFILE = {
  name: 'Anubhav Joshi',
  role: 'Software Engineer',
  status: 'Generative AI Engineer Trainee at Precision Design & Engineering; Co-Founder & CTO at Anchorate; Open to Freelancing.',
  location: 'Jaipur, India',
  email: 'magicalfizz@gmail.com',
  github: 'https://github.com/anubhav-qt',
  linkedin: 'https://linkedin.com/in/anubhav-qt',
  resume: '/resume.pdf',
};

// Home's featured cards, in this order. The first one is also the
// "Currently Building" card at the top of /projects.
export const FEATURED_IDS = ['paribelle', 'breader', 'spoin'] as const;

export interface CurrentlyMaking {
  title: string;
  // A percentage draws the progress bar. Without one, `status` is shown in its place.
  progress?: number;
  status?: string;
  description: string;
  highlight: string;
  descriptionEnd: string;
  tags: { label: string; href: string }[];
}

export const CURRENTLY_MAKING: Partial<Record<(typeof FEATURED_IDS)[number], CurrentlyMaking>> = {
  paribelle: {
    title: 'PariBelle Ecosystem',
    status: 'Built, Upgrading and Maintaining',
    description: 'Live on paribelle.in since July 2026, with POM and Seelie running next to it. I keep ',
    highlight: 'adding things as the business needs them',
    descriptionEnd: '.',
    tags: [
      { label: 'writeup', href: '/scratchpad/i-built-the-software-for-my-familys-business' },
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
    items: ['Python', 'TypeScript', 'Rust'],
  },
  {
    label: 'Backend & AI',
    icon: 'brain',
    accent: 'rose',
    items: ['FastAPI', 'NestJS', 'LangGraph', 'SQLAlchemy', 'TypeORM', 'OpenCV', 'PyTorch'],
  },
  {
    label: 'Data',
    icon: 'server',
    accent: 'sage',
    items: ['PostgreSQL', 'PgBouncer', 'pgvector', 'Redis', 'Pinecone'],
  },
  {
    label: 'Infrastructure',
    icon: 'cloud',
    accent: 'gold',
    items: ['AWS', 'Docker', 'Docker Compose', 'Kubernetes', 'Linux', 'Caddy', 'cloudflared', 'age'],
  },
  {
    label: 'Frontend',
    icon: 'device',
    accent: 'clay',
    items: ['Next.js', 'React', 'React Native', 'Tailwind CSS'],
  },
];

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  headline: string;
  bullets: string[];
  // The scratchpad writeup that tells this one in full, if there is one.
  story?: string;
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'pde',
    company: 'Precision Design & Engineering',
    role: 'Generative AI Engineer Trainee',
    period: 'Sep 2026 to Present',
    headline: 'Generative AI for document and engineering work, full-time and on-site.',
    bullets: [
      'In my first two weeks I created Welga, an algorithm.',
      'Welga is currently in discussion for potential patenting.',
    ],
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Software Engineer',
    period: 'Sep 2026 to Present',
    headline: 'Two paid projects alongside PDE, both done solo.',
    bullets: [
      'Pixel to Paint, a storefront for a wall-art brand. The web app is built, the API and admin are next.',
      "Cafe Hopper, an app for seeing what people really buy, by scanning real bills. More entries of the same thing means it's a bestseller. Delivered and live.",
      'Cafe Hopper also has a discover page, Hippo to recommend stuff based on your taste, a feed for foodies, and a foodie badge for cafe hoppers with more than 10,000 Instagram followers.',
    ],
  },
  {
    id: 'anchorate',
    company: 'Anchorate',
    role: 'Co-Founder & CTO',
    period: 'Jan 2026 to Present',
    headline: 'Built Anchor8, Cargonto, managed a team of 5, and grown as an engineer.',
    bullets: [
      'Cofounded with my friend Vasu. We built Anchor8, a security and governance layer that sits between AI agents and their tools, monitoring and securing every autonomous agent in a system. It is still on pip as `pip install anchor8`.',
      'Ran a team of 5, and designed at system level instead of feature level for the first time.',
      "Still going. Weekends I'm building on Anchor8, making its security checks stronger and faster. Weeknights are for managing the team, system design, infra and PR reviews.",
    ],
    story: '/scratchpad/my-professional-journey-till-now',
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
    story: '/scratchpad/my-professional-journey-till-now',
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

