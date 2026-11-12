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
    id: 'breader',
    title: 'Breader: An Immersive E-Reader',
    category: 'Flagship',
    featured: true,
    skimDescription:
      'An immersive e-reader for books and manga. Free, open source, nothing to install and no sign-up.',
    deepDescription: [
      "Breader is an e-reader that lives on the web. Open breader.site, add a book and read. It can go on your home screen and open like an app, and it works offline and syncs when it can.",
      'It takes EPUB, PDF, plain text, Markdown, or text you paste. Your place is saved to the character, not the page. Book turns pages and Modern scrolls, with five themes and five typefaces. Every book fills up with its own colour as you read it, and the library has shelves by genre, series or date.',
      'Manga has a shelf of its own. CBZ files open in a reader made for pictures, down the screen or a page at a time. One search covers MangaDex and the sites Breader\'s own Suwayomi reads.',
      'A panel model finds the panels on every manga page, right on your device. Once anyone has read a page, its panels are kept for everyone.',
      "It reads aloud with voices that run in your browser, and Immersive dims the page and lights up the words at your pace. You can tap a word to tell it how to say it, or bring your own Piper or Kokoro voice.",
      'It can make a whole audiobook on your device or on my ThinkPad, keep it as MP3 chapters, and carry on playing when the audiobook dialog is closed. There is also a guide to what the app does and a few tips when a library is empty.',
      'Your library opens with a key only you hold, or you can log in with email or Google. Anyone can put a book in the Shared Library for everyone to read.',
      "Supabase holds the data, my ThinkPad keeps a live copy and serves it, and a free Render server takes over when the laptop's off, with manga from a small AWS server. No ads, no subscriptions.",
      '6,600 people use it now. In local Docker load tests, one API copy handled 1,200 simulated readers at 583 requests a second, with 15 to 17 ms p95 latency and no failures. Those are test-stack numbers, not a claim about every reader on the live site.',
      "I'm now working on a global setup: free Render servers with Supabase read copies in their regions, while the ThinkPad stays the main computer. Readers will pick a server by how quickly it answers, with one database still handling writes. The regional rollout is in progress.",
    ],
    metrics: [
      { label: 'Readers', value: '6,600', detail: 'People using Breader, updated November 8, 2026' },
      { label: 'Local Load Test', value: '583 requests/s', detail: '1,200 simulated readers, one API copy, local Docker test on November 7' },
      { label: 'Local p95 Latency', value: '15 to 17 ms', detail: 'Two after-optimization test runs, with no failures' },
    ],
    repoUrl: 'https://github.com/anubhav-qt/breader',
    links: [{ label: 'breader.site', url: 'https://breader.site' }],
    homeCard: {
      summary: 'An immersive e-reader for books and manga. Free and open source.',
      bullets: [
        'Live since 26th September 2026, now with 6,600 readers.',
        'Books, manga and audiobooks, with voices that run on your device.',
      ],
    },
    tech: ['React', 'TypeScript', 'Vite', 'Hono', 'PostgreSQL', 'Drizzle', 'Redis', 'ONNX Runtime Web', 'Cloudflare R2', 'Docker', 'cloudflared', 'age', 'AWS'],
    writeup: {
      title: 'Writeup: Homelabbing journey begins!',
      href: '/scratchpad/homelabbing-journey-begins',
    },
  },
  {
    id: 'jello',
    title: 'Jello: A Music Studio for My Keyboard',
    category: 'Flagship',
    featured: true,
    skimDescription:
      'A desktop music studio I play from my computer keyboard. Synths, piano, drums and guitar, with tracks, mixing and an AI partner to help make music.',
    deepDescription: [
      'Jello is a desktop music studio for macOS and Windows, played entirely from a computer keyboard. It started as a synth, but now I can build a song across instruments and tracks instead of just playing one sound.',
      'There is a three-oscillator synth, sampled piano and drums, and a guitar made from modeled strings rather than recordings. The piano has different touches and a sustain pedal. The guitar turns the keys into strings and chord shapes, with down and up strums.',
      'Compose follows what I play and suggests what might fit next. I can layer loops of different lengths, record tracks, arrange sections, change keys and automate settings. Songs save themselves as readable text, and the arrangement can render to WAV.',
      'Mix has effect chains for tracks, send buses and the master, with EQ, compression, gate, saturation, chorus, delay, reverb, filter and volume shaping. Effects can listen to other tracks, and the master has a limiter and loudness meters.',
      'One AI agent sits beside the studio, using tools to read and change the song, instruments, arrangement and mix. It can render a phrase and inspect measurements without interrupting what is playing. Its changes arrive as a take I can compare with mine, keep or drop.',
      'Learning happens on my own songs: practice a section in two hand lanes, work through lessons and taste drills, or trade phrases with the AI jam partner. The practice and feedback use the notes and timing Jello measures.',
      'Sketch is the newest part. I hear every sound in a short phrase, describe a song in words, and the agent splits it into parts before it becomes a real song in Compose. There are 15 starting sounds, more than one drum kit, and vocals have started on the engine side.',
      'Svelte and TypeScript in Tauri, Rust for the song and tools, and a C++ audio engine. The first song made fully in it is out: jellybean. Still building it toward the same goal: release my own music using instruments and a studio I wrote myself.',
    ],
    writeup: {
      title: 'Writeup: The start of something big?',
      href: '/scratchpad/the-start-of-something-big',
    },
    repoUrl: 'https://github.com/anubhav-qt/jello',
    homeCard: {
      summary: 'A music studio I play from my computer keyboard, from the first idea to a mixed WAV.',
      bullets: [
        'Synths, piano, drums and modeled guitar, with tracks, sections and effects.',
        'One AI agent helps compose, edit and practice, with takes I can keep or drop.',
      ],
    },
    tech: ['Rust', 'C++', 'TypeScript', 'Svelte', 'Tauri'],
  },
  {
    id: 'dodo',
    title: 'Dodo: A Mojo Web Framework',
    category: 'Open Source',
    featured: true,
    skimDescription:
      'A Mojo web framework with HTTP, typed handlers and database drivers in one package. Pre-alpha, with AI and GPU work next.',
    deepDescription: [
      "Dodo is a web framework for Mojo where your HTTP server, AI models, GPU kernels, computer vision and agents run in one process, in one language. One process is the default, not a rule: models can also run in separate worker processes, or on remote servers.",
      "HTTP/1.1, HTTP/2, TLS, WebSockets and the HTTP client work, along with the typed App API, native database drivers and SQL migrations. Parsers are fuzzed, and blocking handlers have their own thread pool so they don't hold up the server.",
      'I packaged 0.0.1 for modular-community, and PR #447 was merged on November 7. The package was built and tested on macOS ARM64 and Linux ARM64 and x86-64.',
      'Next is profiling the server hot paths, the CLI and MCP tooling, then supervised AI and GPU workers, the agent kit and computer vision.',
      "Started on 26th October 2026, so it's still very new.",
    ],
    repoUrl: 'https://github.com/dodo-mojo/dodo',
    links: [{ label: 'modular-community PR', url: 'https://github.com/modular/modular-community/pull/447' }],
    homeCard: {
      summary: 'A Mojo web framework, with the server, typed app API and database drivers in one package.',
      bullets: [
        '0.0.1 was accepted into modular-community on November 7.',
        'AI, GPU workers and computer vision are next.',
      ],
    },
    tech: ['Mojo', 'pixi'],
  },
  {
    id: 'paribelle',
    title: "PariBelle Ecosystem: Software for My Family's Fashion Business",
    category: 'Production & Systems',
    featured: true,
    skimDescription:
      "The software I built for my family's fashion business: the paribelle.in storefront, POM for orders and operations, and Seelie, an AI agent for the shop.",
    deepDescription: [
      "PariBelle is my family's fashion business, mostly women's clothing like kurtis and coord sets. There's a physical store, and a lot of the business around it was handled manually over WhatsApp and calls, with no proper software running the whole thing. So I built it myself instead of using Shopify.",
      "The storefront went live on paribelle.in in July 2026 and takes real orders. The first version was just the storefront and the core backend needed to sell. Everything after that got added because real orders needed it: payments, inventory, GST/HSN invoices, customer stuff, exchanges, notifications and admin operations. The data model also handles multiple vendors even though it's one store right now, so expanding later isn't annoying. Find Your Pick on paribelle.in is a styling session. It asks who you're shopping for and picks from what's in stock.",
      'POM is the operations side, and its own app instead of an /admin page. Amazon syncs through SP-API, and Flipkart and Meesho orders, returns and settlements come through the seller-portal workflows. It handles dispatch, returns and profit across the channels. My family and I use it every day, and it replaced the INR 42,000 a year SaaS subscription we used to pay for.',
      'Seelie is an AI agent for the shop, inside POM. It helps with shop operations, product photos, Instagram reels, Meta ads, PDFs, and routines and memories. It watches its own draft of a reel before anyone sees it. Posts, ad spend and photoshoots ask first, and every change it makes can be undone.',
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
        'POM replaced our INR 42,000 a year order-management subscription.',
      ],
    },
    tech: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'Drizzle', 'Razorpay', 'TanStack Query', 'Socket.IO', 'Docker', 'Caddy', 'cloudflared'],
    writeup: {
      title: "Writeup: I Built the Software for My Family's Business",
      href: '/scratchpad/i-built-the-software-for-my-familys-business',
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
      '110 architecture decisions are written down in the repo now, including how the corpus, retrieval and generation fit together.',
      'Paused for now. My time is going to PDE, Anthology, PariBelle, Breader and the newer projects.',
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
      { label: 'Grounded Throughput', value: '24.85 cards/min', detail: '523 cards in 21m 03s in the September 7 Astronomy benchmark' },
      { label: 'Architecture', value: '110 ADRs', detail: 'Decision files in the local repo, checked November 8, 2026' },
      { label: 'Rate-Limit Shedding', value: '0 HTTP 429s', detail: 'Down from 917 on the free-tier Gemini ladder' },
      { label: 'Feed Read Path', value: 'No LLM calls', detail: 'Reads stored cards while generation runs separately' },
      { label: 'Grounding Per Card', value: 'Top 2 chunks', detail: 'Chunk IDs recorded on the card' },
    ],
    homeCard: {
      summary: 'Spoin is a scrollable feed of cards with bite-sized knowledge, for topics you want to learn.',
      bullets: [
        'Paused while I work on PDE, Anthology and the newer projects.',
        'Built a custom fast RAG implementation "frog".',
      ],
    },
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'FROG', 'LLMs', 'Next.js', 'React'],
    team: { note: 'paused', collaborators: [] },
  },
  {
    id: 'anchorate',
    title: 'Anchor8: A Control Layer for Autonomous AI Agents',
    category: 'Architecture Spec',
    featured: true,
    skimDescription:
      'A control layer between autonomous AI agents and their tools. One classifier checks every tool call and tool result and says SAFE, DANGEROUS or REVIEW.',
    deepDescription: [
      'Anchor8 sits between an AI agent and its tools. Every tool call going out and every result coming back gets a verdict: SAFE runs, DANGEROUS is blocked and the agent gets feedback so it can carry on without it, and REVIEW goes to a human.',
      'The first version ran every request through lanes of gates, code detectors and LLM debate. That was solving a classification problem like a reasoning problem, so the rebuild is one proprietary classifier with no LLM in the hot path.',
      "Humans only see the cases it isn't sure about, and their decisions become training data for that company's own model, so each company should see fewer reviews over time.",
      'Every step lands in an append-only decision log, hash-chained per company. On top of it, the Harness is a Claude-powered workspace that explains why a step was blocked and can open PRs against your code.',
      'The product design has a Rust gateway, Python services for classification, training and the Harness, and TypeScript and Python SDKs. The separate a8 model repo now has a prototype, a synthetic-data generator and its first training run. The model is not wired into the product yet, and the first synthetic results are not production accuracy.',
    ],
    tech: ['Rust', 'Python', 'TypeScript', 'FastAPI', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'PgBouncer', 'Redis', 'Amazon S3', 'Kubernetes', 'AWS', 'MLflow', 'Claude API'],
    team: {
      note: 'I cofounded Anchorate with Vasu and led its team of 7 from January through October 2026. I designed the system and the later classifier-based rebuild.',
      collaborators: [],
    },
  },
  {
    // Preserve the old id so existing links and content history survive the Bloop rename.
    id: 'trotter',
    title: 'Bloop: A Personal Algorithmic Trading System',
    category: 'Production & Systems',
    featured: false,
    skimDescription: 'A personal trading system for NSE equities, being rebuilt from scratch to run on one PC.',
    deepDescription: [
      'This started as Trotter, the Next.js stock research app. That version is archived as v0.5.0 in the repo, so I can look up its features while rebuilding them.',
      'The current project is Bloop, a Tauri desktop app and the name of its AI agent. The harness is a fork of pi, using models from my own subscriptions through CLIProxyAPI.',
      'The new code is TypeScript on Node 24, with Python for training models. The data, scoring, risk and order engine is still to come.',
    ],
    repoUrl: 'https://github.com/anubhav-qt/bloop',
    tech: ['TypeScript', 'Node.js', 'Tauri', 'Python', 'pi', 'CLIProxyAPI'],
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
      'It runs on Windows and chooses a secondary monitor, portrait or landscape. Every frame samples the last one through a warp and adds new audio-driven light, so the picture keeps a history of what was playing.',
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

// The project's live site, if it has one: the link labelled with its own
// domain (paribelle.in, breader.site), as opposed to its repos.
export function liveSite(p: ProjectItem) {
  return p.links?.find((l) => l.url.replace(/^https?:\/\//, '').replace(/\/$/, '') === l.label);
}

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
