import type { Accent } from '../lib/palette';

export const PROFILE = {
  name: 'Anubhav Joshi',
  role: 'Software Engineer',
  status: 'ML Engineer at Anthology; Generative AI Engineer Trainee at Precision Design & Engineering; previously Co-Founder & CTO at Anchorate.',
  location: 'Jaipur, India',
  email: 'magicalfizz@gmail.com',
  github: 'https://github.com/anubhav-qt',
  linkedin: 'https://linkedin.com/in/anubhav-qt',
  resume: '/resume.pdf',
};

// Home's featured cards, in this order.
export const FEATURED_IDS = ['breader', 'paribelle', 'jello', 'dodo'] as const;

// The ongoing ones: each gets a tab on the card at the top of /projects, in
// this order, and the first is the one it opens on.
export const BUILDING_IDS = ['breader', 'jello', 'dodo'] as const;

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

export const CURRENTLY_MAKING: Record<(typeof BUILDING_IDS)[number], CurrentlyMaking> = {
  breader: {
    title: 'Breader',
    status: '6,600 readers, live since September 2026',
    description: 'An immersive e-reader for books and manga. ',
    highlight: 'Free and open source',
    descriptionEnd: '.',
    tags: [{ label: 'writeup', href: '/scratchpad/homelabbing-journey-begins' }],
  },
  jello: {
    title: 'Jello',
    status: 'Tracks, mixing and an AI partner',
    description: 'A music studio to play, compose, mix and practice on a computer keyboard. ',
    highlight: 'Free and open source',
    descriptionEnd: '.',
    tags: [],
  },
  dodo: {
    title: 'Dodo',
    status: '0.0.1 accepted into modular-community',
    description: 'A web framework for Mojo, with the server, typed app API and database drivers ',
    highlight: 'in one package',
    descriptionEnd: '. AI and GPU work are next.',
    tags: [],
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
      { name: 'Python', usedIn: ['anchorate', 'spoin', 'career-anthology', 'career-pde', 'career-freelance'] },
      { name: 'TypeScript', usedIn: ['paribelle', 'breader', 'jello', 'anchorate', 'trotter', 'career-freelance'] },
      { name: 'Rust', usedIn: ['jello', 'anchorate', 'trippinator'] },
      { name: 'C++', usedIn: ['jello', 'career-anthology'] },
      { name: 'Mojo', usedIn: ['dodo'] },
    ],
  },
  {
    label: 'Backend & AI',
    icon: 'brain',
    accent: 'lilac',
    items: [
      { name: 'FastAPI', usedIn: ['anchorate', 'spoin', 'career-freelance'] },
      { name: 'NestJS', usedIn: ['paribelle'] },
      { name: 'Hono', usedIn: ['breader'] },
      { name: 'LangGraph', usedIn: ['anchorate', 'spoin'] },
      { name: 'SQLAlchemy', usedIn: ['spoin', 'career-freelance'] },
      { name: 'TypeORM', usedIn: ['paribelle'] },
      { name: 'Drizzle', usedIn: ['paribelle', 'breader'] },
      { name: 'OpenCV', usedIn: ['career-pde'] },
      { name: 'PyTorch', usedIn: ['career-pde', 'career-anthology'] },
      { name: 'Triton', usedIn: ['career-anthology'] },
      { name: 'CUDA', usedIn: ['career-anthology'] },
    ],
  },
  {
    label: 'Data',
    icon: 'server',
    accent: 'green',
    items: [
      { name: 'PostgreSQL', usedIn: ['paribelle', 'breader', 'spoin', 'anchorate', 'career-freelance'] },
      { name: 'PgBouncer', usedIn: ['anchorate'] },
      { name: 'pgvector', usedIn: ['paribelle', 'spoin'] },
      { name: 'Redis', usedIn: ['paribelle', 'breader', 'anchorate'] },
      { name: 'Pinecone', usedIn: ['anchorate'] },
    ],
  },
  {
    label: 'Infrastructure',
    icon: 'cloud',
    accent: 'ochre',
    items: [
      { name: 'AWS', usedIn: ['anchorate', 'breader'] },
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
      { name: 'Next.js', usedIn: ['paribelle', 'spoin', 'anchorate', 'career-freelance'] },
      { name: 'React', usedIn: ['paribelle', 'breader', 'spoin', 'anchorate', 'career-freelance'] },
      { name: 'React Native', usedIn: ['career-freelance'] },
      { name: 'Svelte', usedIn: ['jello'] },
      { name: 'Tauri', usedIn: ['jello', 'trotter'] },
      { name: 'Tailwind CSS', usedIn: ['paribelle', 'anchorate', 'career-freelance'] },
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
    id: 'anthology',
    company: 'Anthology',
    role: 'ML Engineer',
    period: 'Oct 2026 to Present',
    headline: 'Inference optimization and GPU benchmarks, freelance and remote, with a team in SF.',
    bullets: [
      'Anthology is part of Polymath, which is backed by Y Combinator. I work remotely with their team in San Francisco, alongside PDE.',
      'I built batched Kokoro-82M inference and a grader that checks both speed and correctness, using PyTorch, CUDA graphs and fused Triton kernels.',
      'The H100 reference runs were 1.44 to 1.50 times the starter speed, with no correctness failures across 3,264 requests.',
    ],
  },
  {
    id: 'pde',
    company: 'Precision Design & Engineering',
    role: 'Generative AI Engineer Trainee',
    period: 'Sep 2026 to Present',
    headline: 'Welga and a custom AI harness for engineering drawings, full-time and on-site.',
    bullets: [
      'I built a custom harness for the extraction and steel detailing work. A new task mostly means adding tools and context now, instead of starting over.',
      'Costs and response times dropped by more than half, and development is about ten times faster. On our internal tasks, less capable models with this harness do better than GPT-6-astra and Claude-Opus-5.5.',
      'Welga, the computer vision algorithm I made in my first two weeks, is being prepared for patenting. We now reuse it across the codebase for new engineering-drawing tasks.',
    ],
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Software Engineer',
    period: 'Sep 2026 to Present',
    headline: 'Paid mobile and web projects alongside PDE, both done solo.',
    bullets: [
      'Pixel to Paint, a storefront for a wall-art brand. The web app is built, the API and admin are next.',
      "Food Hunter, previously Cafe Hopper, is about what people actually order. Scan a restaurant bill and it feeds the bestsellers and bill-verified reviews. Delivered and live.",
      'The mobile app uses React Native and Expo, with a FastAPI and PostgreSQL backend for authentication, bill processing, search and feeds. Hippo helps people find food around their taste.',
    ],
  },
  {
    id: 'anchorate',
    company: 'Anchorate',
    role: 'Co-Founder & CTO',
    period: 'Jan 2026 to Oct 2026',
    headline: 'Ten months, a team of 7, Anchor8 and Cargonto, and a lot of growing as an engineer.',
    bullets: [
      'Cofounded with my friend Vasu. Anchor8 sits between AI agents and their tools and checks every step. The first version is still on pip as `pip install anchor8`.',
      'Ran a team of 7 from January through October 2026, and designed at system level instead of feature level for the first time.',
      'I handled system design, infrastructure and PR reviews. The later Anchor8 design replaces the old chain of LLM checks with a classifier and human review for the cases it is unsure about.',
    ],
    story: '/scratchpad/my-professional-journey-till-now',
  },
  {
    id: 'blinkadz',
    company: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 to Apr 2025',
    headline: 'First internship: LinkedIn APIs, LLM workflows and a Google ADK video ad pipeline in Jaipur.',
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

