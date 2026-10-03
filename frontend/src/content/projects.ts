// Relative, not the @/ alias: scripts/log-content.ts imports this module
// directly under tsx during prebuild, where the Vite alias does not exist.
import liveMetricsData from '../data/live-metrics.json';

export interface ProjectAudit {
  problem: string;
  constraint: string;
  decision: string;
  whatBroke: string;
}

export interface Collaborator {
  label: string;
  url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Flagship' | 'Architecture Spec' | 'Production & Systems' | 'Open Source' | 'AI & Machine Learning';
  skimDescription: string; // one plain sentence: what the thing IS, for someone who's never heard of it
  // opens with what it does for a user, then how it's built. A string[] renders as
  // one <p> per paragraph (used by projects with a dedicated page); a plain string
  // is one paragraph, same as always.
  deepDescription: string | string[];
  caseStudyDescription?: string | string[];
  // detail is required: a number with nothing next to it saying what it means
  // was the single thing readers said they could not parse. See Projects.tsx.
  metrics?: { label: string; value: string; detail: string }[];
  tech: string[];
  repoUrl?: string;
  // Everything else worth linking: the live site, the other repos.
  links?: { label: string; url: string }[];
  // The card on Home: one line, then one-line bullets (Home stays one line per row).
  homeCard?: { summary: string; bullets: string[] };
  caseStudyHref?: string;
  writeup?: { title: string; href: string };
  audit?: ProjectAudit;
  featured?: boolean;
  team?: { note: string; collaborators: Collaborator[] };
}

// Exported for scripts/log-content.ts, which archives the hand-written copy
// separately from the live-metric-merged PROJECTS below. Keeping both means a
// metric refresh never churns the authored-copy history, and the merged rows
// still record what each number actually read at that build.
export const RAW_PROJECTS: ProjectItem[] = [
  {
    id: 'paribelle',
    title: "PariBelle Ecosystem: Software for My Family's Fashion Business",
    category: 'Flagship',
    featured: true,
    skimDescription:
      "The software I built for my family's fashion business: the paribelle.in storefront, POM for orders and operations, and Seelie, an AI agent for the shop.",
    deepDescription: [
      "PariBelle is my family's fashion business, mostly women's clothing like kurtis and coord sets. There's a physical store, and a lot of the business around it was handled manually over WhatsApp and calls, with no proper software running the whole thing. So I built it myself instead of using Shopify.",
      "The storefront went live on paribelle.in in July 2026 and takes real orders. The first version was just the storefront and the core backend needed to sell. Everything after that got added because real orders needed it: payments, inventory, GST/HSN invoices, customer stuff, exchanges, notifications and admin operations. The data model also handles multiple vendors even though it's one store right now, so expanding later isn't annoying.",
      'POM is the operations side, and its own app instead of an /admin page. It pulls in orders from paribelle.in, Amazon, Meesho and Flipkart, and handles the warehouse work, stock, reports, invoices and profit. My family and I use it every day.',
      "Seelie is an AI agent for the shop, inside POM. It helps with shop operations, product photos and videos, Instagram and Meta ads, and routines and memories. It landed on 2nd October, so it's very new.",
      "Since 27th September all of it runs on my ThinkPad, with Vercel, Render and Supabase as the fallback. I'm also exploring whether the same system can run other storefronts.",
    ],
    links: [
      { label: 'paribelle.in', url: 'https://paribelle.in' },
      { label: 'POM repo', url: 'https://github.com/anubhav-qt/pom' },
      { label: 'Storefront repo', url: 'https://github.com/anubhav-qt/paribelle-web' },
      { label: 'Backend repo', url: 'https://github.com/anubhav-qt/paribelle-backend' },
    ],
    homeCard: {
      summary: "I built the software for my family's fashion business: the storefront, POM and Seelie.",
      bullets: [
        'paribelle.in has been live since July 2026, taking real orders.',
        'POM handles orders from paribelle.in, Amazon, Meesho and Flipkart.',
      ],
    },
    tech: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'Drizzle', 'Razorpay', 'TanStack Query', 'Socket.IO', 'Docker', 'Caddy', 'cloudflared'],
    writeup: {
      title: "Writeup: I Built the Software for My Family's Business",
      href: '/scratchpad/i-built-the-software-for-my-familys-business',
    },
  },
  {
    id: 'breader',
    title: 'Breader: An Immersive Web-First E-Reader',
    category: 'Open Source',
    featured: true,
    skimDescription:
      'An immersive web-first e-reader PWA. Free, open source, nothing to install and no sign-up.',
    deepDescription: [
      "Breader is an e-reader that lives on the web. Open breader.site, add a book and read. It's a PWA, so it can go on your home screen and open like an app, and it works offline and syncs when it can.",
      'It takes EPUB, PDF, plain text, Markdown, or text you paste. Your place is saved to the character, not the page. Book turns pages and Modern scrolls, with five themes and five typefaces. Every book fills up with its own colour as you read it, and the library has shelves by genre, series or date.',
      "It reads aloud with voices that run in your browser, and Immersive dims the page and lights up the words at your pace. You can tap a word to tell it how to say it, or bring your own Piper or Kokoro voice.",
      'Your library opens with a key only you hold, or you can log in with email or Google. Anyone can put a book in the Shared Library for everyone to read.',
      "Supabase holds the data, my ThinkPad keeps a live copy and serves it, and a free Render server takes over when the laptop's off. No ads, no subscriptions.",
    ],
    repoUrl: 'https://github.com/anubhav-qt/breader',
    links: [{ label: 'breader.site', url: 'https://breader.site' }],
    homeCard: {
      summary: 'An immersive web-first e-reader PWA. Free and open source.',
      bullets: [
        'Live on breader.site since 26th September 2026.',
        'Immersive dims the page and lights up the words as it reads to you.',
      ],
    },
    tech: ['React', 'TypeScript', 'Vite', 'Hono', 'PostgreSQL', 'Drizzle', 'ONNX Runtime Web', 'Cloudflare R2', 'Docker', 'cloudflared', 'age'],
    writeup: {
      title: 'Writeup: Homelabbing journey begins!',
      href: '/scratchpad/homelabbing-journey-begins',
    },
  },
  {
    id: 'spoin',
    title: 'Spoin: For the Curious',
    category: 'AI & Machine Learning',
    featured: true,
    skimDescription:
      'A grounded knowledge feed built around curated knowledge, mastery-based learning, and pre-generated cards. FROG is a custom, faster RAG implementation built specifically for Spoin, with model verification and user feedback on top.',
    deepDescription: [
      'Spoin is a scrollable knowledge feed built around grounded generation and mastery-based learning. Cards are generated ahead of time and served without an LLM call on the read path.',
      'The knowledge layer is the_spoin_universe, a curated source of truth that feeds FROG, a custom and faster RAG implementation built specifically for Spoin. Generation uses broad retrieval, while verification uses precise retrieval against the same knowledge base.',
      'Curricula are built around prerequisites and learning progression rather than isolated topic lists, with separate generation, verification and deterministic validation layers. Users can also report broken cards, bad diagrams, broken art and other issues, which feeds another quality-control loop through the admin panel.',
      '103 ADRs.',
      'Paused for now. My time is going to PDE, PariBelle and Breader.',
    ],
    caseStudyDescription: [
      "Starting with the constraints that I put on myself: I don't want to pay anything to the LLM providers for as long as possible, so I built a simple load balancer that is LLM-independent. I provide the .env file with a lot of free-tier API keys, and it consumes all the top models first and then the mediocre models, for all the keys in parallel while doing all the generation, keeping Requests Per Minute and Tokens Per Minute limits in mind.",
      'I also wanted the LLM to be as predictable as possible, because predictable outputs are easy to debug and work around. But LLMs are probabilistic in nature, so I created a custom RAG system with a manually curated knowledge base as the single source of truth, also created a custom ASCII arts library with over 200 ASCII arts for the feed to not just be a wall of text but also look interesting visually, and always grounded all the LLM calls with this verified, high-quality data. This reduces the chances of hallucination a lot, and for further verification, I have a card reviewing panel in the /admin route, for the final quality check. Also, there is a "report broken card" feature for each card where users can report cards and I will review and fix them.',
      'The manually curated knowledge corpus is the biggest manual task, which needs to be done without any shortcuts to make sure the content in all the cards is as accurate as possible. But this also opens a lot more doors for future projects. Having a high-quality knowledge corpus to work with can be used to create content not just for Spoin, but for many ambitious projects I have in mind right now. Also, with this, I will be creating a semantic knowledge graph collecting all the related topics and linking them to each other for a special recommender system for Spoin.',
    ],
    caseStudyHref: '/work/spoin',
    writeup: {
      title: 'Writeup: I Lost to Gemini. Fuck You.',
      href: '/scratchpad/i-lost-to-gemini-fuck-you',
    },
    metrics: [
      { label: 'Grounded Throughput', value: '24.85 cards/min', detail: '523 cards in 21m 03s, 2.2x the ungrounded run' },
      { label: 'Architecture', value: '103 ADRs', detail: 'Sole system architect' },
      { label: 'Rate-Limit Shedding', value: '0 HTTP 429s', detail: 'Down from 917 on the free-tier Gemini ladder' },
      { label: 'Read Latency', value: '< 50ms', detail: 'No LLM on the read path' },
      { label: 'Grounding Per Card', value: 'Top 2 chunks', detail: 'Chunk IDs recorded on the card' },
    ],
    homeCard: {
      summary: 'Spoin is a scrollable feed of cards with bite-sized knowledge, for topics you want to learn.',
      bullets: [
        'Paused for now, my time is going to PDE, PariBelle and Breader.',
        'Built a custom fast RAG implementation "frog".',
      ],
    },
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'FROG', 'LLMs', 'Next.js', 'React'],
    team: { note: 'paused', collaborators: [] },
  },
  {
    id: 'anchorate',
    title: 'Anchor8: Cognitive Firewall for AI Agents',
    category: 'Production & Systems',
    featured: true,
    skimDescription:
      'A security and governance layer for autonomous AI agents. It monitors tool calls and enforces policy before risky actions reach the real system.',
    deepDescription: [
      'Anchor8 is a security and governance layer that sits in front of autonomous AI agents and watches what they do in real time.',
      'It monitors tool calls, checks arguments and context, detects suspicious behavior, and can block or escalate high-risk actions before they reach the underlying system.',
      'The SDK is designed to drop into agent workflows with minimal integration while keeping the security layer independent from the agent framework.',
      "Still going. I'm building on it on weekends, making its security checks stronger and faster.",
    ],
    metrics: [
      { label: 'Pipeline', value: '3-Lane Design', detail: 'Observer, Guard, Courtroom' },
      { label: 'Identity', value: 'DID + VCs', detail: 'Know-Your-Agent credentials, kill switch' },
      { label: 'Integration', value: '3 lines', detail: 'LangChain callback handler' },
    ],
    tech: ['Python', 'FastAPI', 'LangChain', 'Redis', 'pgvector', 'DeepSeek', 'Gemini'],
    team: {
      note: 'Built by a 5-person founding team at Anchorate, our first startup.',
      collaborators: [],
    },
  },
  {
    id: 'trotter',
    title: 'Trotter: Deterministic Quantitative Stock Engine',
    category: 'Production & Systems',
    featured: false,
    skimDescription: 'Type in a stock ticker, get a real analysis: a score, a verdict, a target price.',
    deepDescription:
      'Type in a ticker and Trotter gives you a real analysis, a score, a verdict, and a target price, across weekly, monthly, and long-term horizons, without a hallucinated number anywhere in it. Every indicator, momentum, valuation, volume, FinBERT sentiment off Yahoo and Google News, volatility, is computed straight from market data in TypeScript. Gemini 2.5 Flash writes the narrative and estimated targets on top of the fixed scores, with Tavily grounding the industry P/E comparisons in current data, and can nudge a chart pattern into the verdict, but only within a capped range.',
    repoUrl: 'https://github.com/anubhav-qt/trotter',
    metrics: [
      { label: 'Calculations', value: 'Deterministic core', detail: 'Momentum, valuation, volume, volatility in code' },
      { label: 'Horizons', value: '3 timeframes', detail: 'Weekly, monthly, long-term' },
      { label: 'Vision Cap', value: '±10 to 15 pts', detail: 'Chart patterns can nudge, never override' },
    ],
    tech: ['Next.js (App Router)', 'TypeScript', 'FinBERT', 'Gemini 2.5 Flash', 'Tavily Search', 'Vanilla CSS'],
    audit: {
      problem: 'Traders want a fast read across multiple time horizons, without a hallucinated price or a valuation that flips between identical queries.',
      constraint: "LLMs can't be trusted to compute a Bollinger Band or a financial ratio reliably. The answer changes depending on the random seed.",
      decision:
        'A deterministic scoring core computes momentum, valuation, volume, sentiment, and volatility straight from market data across all three horizons. Gemini only ever sees the finished numbers, writes the narrative, and estimates targets on top of them, with results cached per symbol for 10 minutes.',
      whatBroke:
        'Chart vision was initially free to overwrite the quantitative verdict outright, and during volatile setups it would hallucinate right over solid fundamentals. Capped it to a shift of at most 10 to 15 points out of 100 from the baseline score.',
    },
  },
  {
    id: 'trippinator',
    title: 'Trippinator: Real-Time Audio Visualizer',
    category: 'Open Source',
    featured: false,
    skimDescription:
      'An open-source music visualizer that turns whatever is playing on your system into a live audiovisual scene.',
    deepDescription: [
      'Trippinator is an open-source music visualizer built for a second monitor.',
      'It continuously analyzes whatever is playing and turns it into a live audiovisual scene, with multiple visual archetypes, time-varying transitions and a procedural warp system running at high frame rates.',
    ],
    repoUrl: 'https://github.com/anubhav-qt/trippinator',
    metrics: [
      { label: 'Frame Rate', value: '~178 fps', detail: 'Every frame reads the last one back through a warp' },
      { label: 'Song Profiles', value: '3 archetypes', detail: 'pulse, drift, swarm, blended, never switched' },
      { label: 'Warp Motion', value: '6 components', detail: 'Radial, rotation, spiral, shear, turbulence, kick' },
    ],
    tech: ['Rust', 'wgpu', 'egui', 'cpal', 'WASAPI', 'MIDI'],
  },
];

// Overrides RAW_PROJECTS's static metrics with whatever fetch-metrics.mjs
// last pulled from Supabase at build time (see scripts/fetch-metrics.mjs).
// A project with no live rows keeps its hand-written literals.
const liveMetrics = liveMetricsData as Record<string, { label: string; value: string; detail?: string }[]>;

export const PROJECTS: ProjectItem[] = RAW_PROJECTS.map((p) => {
  // A live row refreshes a metric that already exists here, matched by label.
  // It cannot introduce one. Two reasons: the metrics table is upsert-only (the
  // update-metric Edge Function has no delete, see supabase/schema.sql), so a
  // metric renamed or dropped in this file leaves a row behind in Supabase
  // forever and would otherwise keep rendering; and a row pushed without a
  // detail would walk straight past the rule that every number arrives with the
  // sentence saying what it means. Adding a metric means adding it here first.
  const live = liveMetrics[p.id];
  if (!live || !p.metrics) return p;

  return {
    ...p,
    metrics: p.metrics.map((m) => {
      const fresh = live.find((l) => l.label === m.label);
      return fresh?.detail ? { label: m.label, value: fresh.value, detail: fresh.detail } : m;
    }),
  };
});
