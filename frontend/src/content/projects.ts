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
  secondaryRepoUrl?: { label: string; url: string };
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
    id: 'spoin',
    title: 'Spoin: For the Curious',
    category: 'Flagship',
    featured: true,
    skimDescription:
      'A grounded knowledge feed built around curated knowledge, mastery-based learning, and pre-generated cards. FROG is a custom, faster RAG implementation built specifically for Spoin, with model verification and user feedback on top.',
    deepDescription: [
      'Spoin is a scrollable knowledge feed built around grounded generation and mastery-based learning. Cards are generated ahead of time and served without an LLM call on the read path.',
      'The knowledge layer is the_spoin_universe, a curated source of truth that feeds FROG, a custom and faster RAG implementation built specifically for Spoin. Generation uses broad retrieval, while verification uses precise retrieval against the same knowledge base.',
      'Curricula are built around prerequisites and learning progression rather than isolated topic lists, with separate generation, verification and deterministic validation layers. Users can also report broken cards, bad diagrams, broken art and other issues, which feeds another quality-control loop through the admin panel.',
      '103 ADRs and counting.',
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
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'FROG', 'LLMs', 'Next.js', 'React'],
    team: { note: 'currently building', collaborators: [] },
  },
  {
    id: 'paribelle',
    title: 'PariBelle: Independent Fashion Commerce Ecosystem',
    category: 'Production & Systems',
    featured: true,
    skimDescription:
      'A full commerce ecosystem for independent fashion vendors, from branded storefronts and catalog management to KYC, payments, bookings, fulfillment, promotions, reviews, search, and vendor operations.',
    deepDescription: [
      'PariBelle is a full commerce ecosystem built around independent fashion vendors, rather than just another centralized marketplace.',
      'Vendors can run their own branded storefronts while the platform handles vendor KYC, catalogs, inventory, location management, GST-compliant invoicing, bookings, payments, promotions, reviews, search, referrals, fulfillment and wallet/ledger operations.',
      'The ecosystem also has a separate customer-facing storefront, vendor tooling and the backend systems connecting everything together, with real-time updates and payment infrastructure underneath.',
      '28+ backend modules.',
    ],
    repoUrl: 'https://github.com/anubhav-qt/paribelle-backend',
    secondaryRepoUrl: { label: 'Frontend Repo', url: 'https://github.com/anubhav-qt/paribelle-web' },
    metrics: [
      { label: 'Backend', value: '28 Modules', detail: 'Vendors, bookings, promos, search, wallet' },
      { label: 'Payments', value: 'Razorpay', detail: 'GST/HSN invoicing built in' },
    ],
    tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'Next.js', 'Razorpay', 'TanStack Query', 'Socket.IO'],
    team: { note: 'built with', collaborators: [{ label: '@ajaniljoshi', url: 'https://github.com/ajaniljoshi' }] },
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
    id: 'fraud-vote',
    title: 'Fraud Vote Detection Pipeline: Automated Electoral Roll PDF Audit',
    category: 'Production & Systems',
    featured: false,
    skimDescription: 'Scans PDF electoral rolls and automatically flags fake or duplicate voter registrations.',
    deepDescription:
      "A tool that scans PDF electoral rolls and automatically flags fake or duplicate voter registrations, the same face registered twice under different names, or identical personal details reused, without a human eyeballing thousands of scanned ID cards. It segments each voter card with OpenCV, reads the fields with Google Cloud Vision OCR at 98%+ accuracy, and flags the same face registered twice at a 90%+ similarity threshold, all scored through a fixed formula instead of an LLM's verdict.",
    repoUrl: 'https://github.com/anubhav-qt/fraud-vote-detection',
    metrics: [
      { label: 'OCR Accuracy', value: '98%+', detail: 'Multilingual Hindi/English' },
      { label: 'Face Match', value: '90%+ similarity', detail: 'HOG / CNN / Haar fallback ladder' },
      { label: 'Audit Path', value: '100% Deterministic', detail: 'No stochastic LLMs' },
    ],
    tech: ['Python', 'OpenCV', 'Google Cloud Vision OCR', 'Deep Learning Face Encodings', 'Pandas', 'HTML Reports'],
    audit: {
      problem: 'Catching counterfeit ballots, duplicate voter registrations, and identity spoofing across huge multi-page electoral roll PDFs.',
      constraint:
        "This has to hold up for legal and government audits. An LLM's verdict can drift between runs on the exact same input, which rules it out here.",
      decision:
        'Split extraction from decisioning. OpenCV segments the cards, Google Cloud Vision OCR reads the names at 98%+ accuracy, and face encodings flag a match above a 90% similarity threshold. Two fraud scenarios run side by side: identical personal details registered twice, and the same face registered under different details.',
      whatBroke:
        'A single face detector was not reliable across scan quality. Fixed with a fallback ladder: fast HOG first, a CNN when accuracy matters more, and a Haar cascade as the last resort when both fail.',
    },
  },
  {
    id: 'synthetic-generator',
    title: 'Synthetic Medical Dataset Generator (DCGAN)',
    category: 'AI & Machine Learning',
    featured: false,
    skimDescription: 'Generates fake but realistic chest X-rays to help train medical AI on rare conditions.',
    deepDescription:
      'A generative model that produces fake but realistic chest X-rays for rare pulmonary conditions, where real scans are scarce and mostly locked behind patient privacy, so a diagnostic model has something to train on. A DCGAN trained for 125 epochs on the NIH Chest X-ray dataset generates 256x256 synthetic scans. A handful of anti-mode-collapse tricks, one-sided label smoothing, Gaussian noise injection, a slower discriminator learning rate, gradient clipping, keep the diversity score above 0.35 throughout training instead of collapsing to a handful of repeated images.',
    repoUrl: 'https://github.com/anubhav-qt/synthetic-dataset-generator',
    metrics: [
      { label: 'Evaluation', value: 'FID ~150-180', detail: 'Diversity score 0.35+, no collapse' },
      { label: 'Architecture', value: '125 epochs', detail: '1.8M generator / 2.4M discriminator params' },
    ],
    tech: ['PyTorch', 'DCGAN', 'Torchvision', 'Scikit-Learn', 'Matplotlib'],
    audit: {
      problem: 'Training a diagnostic model on rare pulmonary conditions is hard when the real data is scarce, imbalanced, and mostly off-limits for privacy reasons.',
      constraint: 'Synthetic scans need anatomically plausible lungs, ribs, and pathology, not just something that looks like an X-ray at a glance.',
      decision:
        'Trained a DCGAN, 7 transposed-conv layers generating 256x256 grayscale images, with strided convolutions, batch norm, and LeakyReLU on normalized NIH chest X-rays, then checked quality with FID and a diversity score against the real scans.',
      whatBroke:
        'Early runs suffered discriminator saturation and mode collapse: the generator found a handful of images that fooled the discriminator and stopped exploring. Fixed with one-sided label smoothing, noise injection, a slower discriminator learning rate, and gradient clipping.',
    },
  },
  {
    id: 'amazon-ml',
    title: 'Amazon ML Challenge: Multimodal Price Prediction',
    category: 'AI & Machine Learning',
    featured: false,
    skimDescription: "Predicts an Amazon product's price from nothing but its photo and listing text.",
    deepDescription:
      "A model that predicts an Amazon product's price from nothing but its photo and listing text. Built for a hackathon on 75,000 real listings with a heavily right-skewed price range and a test set stacked with brands the model had never seen. Rather than deep embeddings, it leans on 18 engineered image-quality features (sharpness, composition, color) and 22 engineered text features, feeding an Optuna-tuned ensemble of XGBoost, LightGBM, and a small neural net.",
    repoUrl: 'https://github.com/anubhav-qt/amazon-ml-challenge',
    metrics: [
      { label: 'Ensemble SMAPE', value: '22.49%', detail: 'XGBoost 22.51 / LightGBM 22.75 / NN 24.69' },
      { label: 'Dataset', value: '75,000 listings', detail: '60% unseen brands in the test set' },
    ],
    tech: ['Python', 'XGBoost', 'LightGBM', 'PyTorch', 'Scikit-Learn', 'Optuna', 'Pandas'],
    team: { note: 'Built for a hackathon by a team of 4, as Team Amazon Hunters.', collaborators: [] },
    audit: {
      problem: 'Predicting a product price from a messy catalog entry: noisy titles, missing attributes, and a test set with 60% brands the model had never seen.',
      constraint: 'Deep embeddings need labels and time a hackathon window does not have, and the test set diverges enough from training that overfit brand or packaging features actively hurt.',
      decision:
        'Dropped brand and packaging features entirely instead of imputing them, and leaned on 18 engineered image-quality features plus 22 engineered text features feeding an Optuna-tuned ensemble of XGBoost, LightGBM, and a small neural net.',
      whatBroke:
        "The price target is heavily right-skewed, $0.99 items sitting next to $2,796 industrial gear, which skewed the raw regression. Fixed by log-transforming the target and calibrating the ensemble's output distribution back against the training statistics.",
    },
  },
  {
    id: 'trippinator',
    title: 'Trippinator: Real-Time Audio Visualizer',
    category: 'Open Source',
    featured: true,
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
  {
    id: 'secondary-screen',
    title: 'Secondary Screen: A Second-Monitor Dashboard',
    category: 'Open Source',
    featured: false,
    skimDescription: 'A glanceable second-monitor dashboard: clock, todos, habits, a YouTube player.',
    deepDescription:
      'A dashboard for the portrait monitor off to the side, the one you glance at instead of work on. A clock, a todo list, a week view, habit tracking, and a YouTube player, all in a monochrome terminal theme. No build step, no dependencies, no framework, just HTML, CSS, and JS served by a 40-line Python script, with a Windows launcher that auto-detects the portrait display and puts the window there in fullscreen on login.',
    repoUrl: 'https://github.com/anubhav-qt/secondary-screen',
    metrics: [
      { label: 'Footprint', value: '3 Static Files', detail: 'No build step, no framework' },
      { label: 'Launcher', value: 'Zero-config', detail: 'Auto-detects the portrait monitor' },
    ],
    tech: ['Vanilla JavaScript', 'Python', 'PowerShell', 'localStorage'],
    audit: {
      problem: "Wanted something to glance at on the second monitor, a clock, today's list, the week ahead, without dragging in Electron for what is basically three static files.",
      constraint: "It has to survive a reboot and land on the right monitor without hardcoded coordinates, and it can't lose its stored data by accident.",
      decision:
        'Three static files and a 40-line Python server on localhost, with a PowerShell installer that finds the first non-primary display taller than it is wide and puts the window there, fullscreened, 12 seconds after login so the displays have time to settle.',
      whatBroke:
        'Opening the dashboard as a file:// path instead of through the local server gave it a different, empty localStorage origin, so all the todos and habit data looked like it had vanished. Fixed by always serving it from http://localhost and never opening the file directly.',
    },
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
