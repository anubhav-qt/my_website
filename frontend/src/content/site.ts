import type { Accent } from '../lib/palette';

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

// Home's featured cards, in this order. Each one also gets a tab on the
// card at the top of /projects, and the first is the one it opens on.
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

export const CURRENTLY_MAKING: Record<(typeof FEATURED_IDS)[number], CurrentlyMaking> = {
  paribelle: {
    title: 'PariBelle Ecosystem',
    description: 'Live on paribelle.in since July 2026, with POM and Seelie running next to it. I keep ',
    highlight: 'adding things as the business needs them',
    descriptionEnd: '.',
    tags: [
      { label: 'writeup', href: '/scratchpad/i-built-the-software-for-my-familys-business' },
    ],
  },
  breader: {
    title: 'Breader',
    status: 'Live since 26th September 2026',
    description: 'An immersive web-first e-reader PWA. ',
    highlight: 'Free and open source',
    descriptionEnd: '.',
    tags: [{ label: 'writeup', href: '/scratchpad/homelabbing-journey-begins' }],
  },
  spoin: {
    title: 'Spoin',
    status: 'Paused for now',
    description: 'Spoin is a scrollable feed of cards with bite-sized knowledge, ',
    highlight: 'for topics you want to learn',
    descriptionEnd: '.',
    tags: [{ label: 'writeup', href: '/scratchpad/i-lost-to-gemini-fuck-you' }],
  },
};

export interface StackItem {
  name: string;
  // Where it's actually used, checked against the repos: project ids from
  // projects.ts, or `career-` plus an EXPERIENCE id below for work that isn't
  // a project on the site (the same id the career card carries on the page).
  usedIn: string[];
}

export interface StackGroup {
  label: string;
  icon: 'code' | 'server' | 'brain' | 'device' | 'cloud';
  accent: Accent;
  items: StackItem[];
}

export const STACK_GROUPS: StackGroup[] = [
  {
    label: 'Languages',
    icon: 'code',
    accent: 'sky',
    items: [
      { name: 'Python', usedIn: ['anchorate', 'spoin', 'career-pde', 'career-freelance'] },
      { name: 'TypeScript', usedIn: ['paribelle', 'breader', 'trotter', 'career-freelance'] },
      { name: 'Rust', usedIn: ['trippinator'] },
    ],
  },
  {
    label: 'Backend & AI',
    icon: 'brain',
    accent: 'lilac',
    items: [
      { name: 'FastAPI', usedIn: ['anchorate', 'spoin', 'career-freelance'] },
      { name: 'NestJS', usedIn: ['paribelle'] },
      { name: 'LangGraph', usedIn: ['anchorate', 'spoin'] },
      { name: 'SQLAlchemy', usedIn: ['anchorate', 'spoin', 'career-freelance'] },
      { name: 'TypeORM', usedIn: ['paribelle'] },
      { name: 'OpenCV', usedIn: ['anchorate', 'career-pde'] },
      { name: 'PyTorch', usedIn: ['anchorate', 'career-pde'] },
    ],
  },
  {
    label: 'Data',
    icon: 'server',
    accent: 'green',
    items: [
      { name: 'PostgreSQL', usedIn: ['paribelle', 'breader', 'spoin', 'anchorate', 'career-freelance'] },
      { name: 'PgBouncer', usedIn: ['anchorate'] },
      { name: 'pgvector', usedIn: ['paribelle', 'spoin', 'anchorate'] },
      { name: 'Redis', usedIn: ['paribelle', 'anchorate'] },
      { name: 'Pinecone', usedIn: ['anchorate'] },
    ],
  },
  {
    label: 'Infrastructure',
    icon: 'cloud',
    accent: 'ochre',
    items: [
      { name: 'AWS', usedIn: ['anchorate'] },
      { name: 'Docker', usedIn: ['paribelle', 'breader', 'spoin', 'anchorate', 'career-pde', 'career-freelance'] },
      { name: 'Docker Compose', usedIn: ['paribelle', 'breader', 'spoin', 'anchorate', 'career-pde', 'career-freelance'] },
      { name: 'Kubernetes', usedIn: ['anchorate'] },
      { name: 'Linux', usedIn: ['paribelle', 'breader'] },
      { name: 'Caddy', usedIn: ['paribelle', 'career-freelance'] },
      { name: 'cloudflared', usedIn: ['paribelle', 'breader', 'career-freelance'] },
      { name: 'age', usedIn: ['paribelle', 'breader'] },
    ],
  },
  {
    label: 'Frontend',
    icon: 'device',
    accent: 'rose',
    items: [
      { name: 'Next.js', usedIn: ['paribelle', 'spoin', 'trotter', 'career-freelance'] },
      { name: 'React', usedIn: ['paribelle', 'breader', 'spoin', 'trotter', 'career-freelance'] },
      { name: 'React Native', usedIn: ['career-freelance'] },
      { name: 'Tailwind CSS', usedIn: ['paribelle', 'trotter', 'career-freelance'] },
    ],
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

