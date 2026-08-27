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

export const FEATURED_IDS = ['spoin', 'to-know-thyself'] as const;

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
    description: '11,242 cards live, 61 ADRs deep, pipeline is done. What is left is UI polish, ',
    highlight: 'manually quality-checking cards',
    descriptionEnd: ' in the frontend, and filling out the last topics.',
    tags: [
      { label: 'case study', href: '/projects#spoin' },
    ],
  },
  'to-know-thyself': {
    title: 'to_know_thyself: Personal Memory Archive',
    progress: 5,
    description: 'Nothing built yet. Settling ',
    highlight: 'the storage and provenance layer',
    descriptionEnd: ' first, because the graph on top can always be recomputed and the archive underneath cannot.',
    tags: [
      { label: 'case study', href: '/projects#to-know-thyself' },
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
    period: 'Jan 2026 to August 2026',
    headline: 'Built Anchor8, Cargonto, managed a team of 7, and grown as an engineer.',
    bullets: [
      'My friend Vasu (from my university) offered me to be a cofounder and then we started working on his idea "anchor8". It is a security and governance layer that sat between AI agents and their tools, which constantly monitors, logs, and secures all the autonomous AI agents in a system with as little to no human intervention as possible.',
      'It is still a PyPI SDK package on pip (`pip install anchor8`) and importing it in your agentic workflows is pretty easy: just 3 lines of code of importing and adding the decorator on top of the agent you wanna secure. It can be used for both LangChain and standalone agents, with more frameworks to be added later if this project was continued.',
      'The main problem we reached from this project after months of building was that it sold security and governance for high-risk, fully automated AI systems (like fully autonomous algorithmic trading with AI, AI banking systems, AI healthcare systems, AI law-based systems, etc.) and there were no such products in the market at that time, and even right now, so we decided to hold off/pause the project and work on some other ideas for now.',
      'Anchor8 was the core of the company, without that we were all blank slates with nothing to build, however we still got to another idea "Cargonto" for fully automatic workflows for freight exporters and Customs House Agents (CHAs) about their entire documentation process. However, learning from our previous lack of market research mistake, we were able to verify it within 2 weeks that this won\'t work, especially in India, mainly because most of the bank-related documents are all required as physical copies and for digitization, RBI (Reserve Bank of India) itself has provided designated softwares. So, although we started building it and shipped a few features and frontend locally, we never completed it or deployed it and scrapped it off.',
      'The main learnings and experience I got from this startup was how to operate and manage a team of people (we were a team of 7 while building anchor8), and designing and building on a system-level scale, and not just feature-level.',
      'My past interviews in my 3rd year for Google, Dell, Watchguard, and Namekart were all cleared by me at the technical stages. However, I always lacked the teamwork experience at that time since all my projects were solo, and even the internship I worked in at that time was a very small team of 5 people, so there was not too much in terms of collaboration by my side. That costed me all those interviews (although I do admit I was really arrogant about it at that time and said that I work better alone and prefer to work solo) and Anchorate helped me grow in that area of my life.',
      'I can confidently say now that I have matured as an engineer and working in teams is really worthwhile too haha.',
    ],
  },
  {
    id: 'blinkadz',
    company: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 to Apr 2025',
    headline: 'First internship: LinkedIn APIs, Google ADK video ad pipeline, and open office dev in Jaipur.',
    bullets: [
      'This was my first ever internship and exposure to how professional software is built and shipped. I did this at the start of my 3rd year in college. I actually felt really proud to be working and earning money while still in 3rd year haha.',
      'It was a proper experience. First I was a SDE intern for a month. I shipped various features, integrated APIs of LinkedIn and its marketing-related things (ads, campaigns, etc.). I remember I used to make so many stupid mistakes at that time, especially when the CEO/senior dev was right next to me lol. I used to work right beside him in an open office in Jaipur only, where my college was also there.',
      'The other two months, I got into research first and then implementation of that research to create a full end-to-end video ad creation pipeline using Google Agent Development Kit (which was very recently released at that time, so I had to figure everything out with trial and error lol). I was really proud that I was able to create the entire pipeline and was able to get somewhat good outputs right from the first few improvement iterations.',
      'All the people there were really nice and helpful and I really enjoyed my time there!',
      'The main thing I learned from there were managing my time (I used to attend college lectures in the morning and then afternoon-evening was for my internship) and building production-grade software, while working with others.',
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

