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
  deepDescription: string; // opens with what it does for a user, then how it's built
  metrics?: { label: string; value: string; detail?: string }[];
  tech: string[];
  repoUrl?: string;
  secondaryRepoUrl?: { label: string; url: string };
  caseStudyHref?: string;
  audit?: ProjectAudit;
  featured?: boolean;
  team?: { note: string; collaborators: Collaborator[] };
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'spoin',
    title: 'Spoin: CQRS Pipeline & Quota Governor',
    category: 'Flagship',
    featured: true,
    skimDescription: 'A swipeable feed of bite-sized knowledge cards, pick a topic and learn at your own level.',
    deepDescription:
      "Pick a topic you want to learn, and Spoin gives you a scrollable feed of bite-sized cards at your difficulty level, with an inline AI chat and personal notes to dig deeper on anything that catches your interest. 8,935 cards are live so far. The hard part is generation: an async pipeline keeps expensive LLM calls off the read path entirely, so what you actually swipe through comes straight from Postgres, pre-computed and deduplicated, in under 50ms. Generation itself runs behind a 2D quota grid across 16 verified free-tier API keys, with a fallback ladder per model and per-cell serialization (ADR-0040) so a burst of calls does not trip rate limits.",
    caseStudyHref: '/work/spoin',
    metrics: [
      { label: 'Corpus Size', value: '8,935 Cards', detail: '8,706 Questions in Postgres' },
      { label: 'Read Latency', value: '< 50ms', detail: 'Zero LLMs on read path' },
      { label: 'Throughput', value: '218 cards/min peak', detail: '≈3.6 cards/sec' },
      { label: 'Architecture', value: '57 ADRs', detail: 'Sole system architect' },
      { label: 'Unique Topics', value: '14' },
    ],
    tech: ['Python', 'LangGraph', 'PostgreSQL', 'CockroachDB', 'pgvector', 'FastAPI', 'Next.js', 'React Native', 'Docker'],
    team: { note: 'currently building with', collaborators: [{ label: '@mayanks0ni', url: 'https://github.com/mayanks0ni' }] },
    audit: {
      problem:
        'I wanted a feed with real depth, but free-tier LLM quotas do not stretch far, and nobody wants to wait 3 to 10 seconds for a card while they are mid-swipe.',
      constraint:
        'The read path can never call an LLM (50ms budget), and generation has to survive per-key, per-model rate limits without losing an in-flight topic graph.',
      decision:
        'Split generation from serving with CQRS. Built a 2D quota governor (key × model) with fallback ladders, serialized per cell, and persisted cards as soon as a subtopic group finished instead of waiting on the whole batch.',
      whatBroke:
        'Bursts of calls on the same key kept poisoning cells with cascading 429s, fixed with per-cell locking in ADR-0040 and by ripping out the old global semaphore in ADR-0047. Separately, a card that got shown but never read never actually left the feed, so it could stall forever, until ADR-0050 made an impression consume the card and turn the difficulty cycle over.',
    },
  },
  {
    id: 'continuum',
    title: 'Continuum: Film Studio Continuity OS',
    category: 'Architecture Spec',
    featured: true,
    skimDescription: 'Software that would let a film production track its whole state as one connected graph.',
    deepDescription:
      "A system design for software that treats an entire film production, the script, the cast, the sets, the schedule, as one connected graph instead of scattered documents. Move a scene from a sunny park to a night warehouse, and everyone downstream, wardrobe, continuity, budget, gets flagged automatically instead of finding out on set. Under the hood it's an immutable event ledger and a directed multigraph in ClickHouse, with bi-directional cascade invalidation so an upstream edit flags every downstream inconsistency without forcing a blind regeneration of the whole script.",
    caseStudyHref: '/work/continuum',
    metrics: [
      { label: 'Storage Engine', value: 'ClickHouse MCP', detail: 'Event-sourced ledger' },
      { label: 'Orchestration', value: 'Vertex AI + Gemini Enterprise', detail: 'Agent Builder workflows' },
      { label: 'Invalidation', value: 'Bi-directional', detail: 'Graph cascade detection' },
    ],
    tech: ['ClickHouse MCP', 'Vertex AI Agent Builder', 'Gemini Enterprise', 'Event Sourcing', 'Python', 'TypeScript'],
    team: { note: 'currently building with', collaborators: [{ label: '@mayanks0ni', url: 'https://github.com/mayanks0ni' }] },
    audit: {
      problem:
        'Continuity errors compound fast on a film production: thousands of script revisions and asset handoffs, spread across departments that barely talk to each other.',
      constraint:
        "You can't just regenerate a 120-page screenplay every time something small changes. Models drift, and the director's intent gets lost.",
      decision:
        'An event-sourced multigraph where every entity, character, prop, scene, has strict temporal validity. A revision triggers a targeted cascade of invalidation events instead of a mass regeneration.',
      whatBroke:
        'Circular dependencies between wardrobe revisions and scene timelines locked up graph updates. Fixed by forcing a strict topological sort on the dependency chain before evaluating any cascade.',
    },
  },
  {
    id: 'anchorate',
    title: 'Anchor8: Cognitive Firewall for AI Agents',
    category: 'Production & Systems',
    featured: true,
    skimDescription: "A security layer you drop in front of AI agents so a compromised one can't run wild.",
    deepDescription:
      "Drop Anchor8 in front of an autonomous AI agent and it watches every tool call the agent makes, catching a leaked secret, a prompt injection, or a destructive action before it lands, without adding noticeable latency to the agent's normal work. Fast heuristics, PII regex, injection pattern matching, rolling Z-score anomaly detection in Redis, pgvector similarity against the agent's own history, plus dedicated behavioral, business-logic, and vision/RPA detectors, catch most things in milliseconds. Anything ambiguous escalates to a DualJuror courtroom: two LLM agents arguing worst-case risk versus legitimate use, voting on whether the action goes through. On top of that sits Universal Agent Identity: every agent gets a DID, Know-Your-Agent and safety verifiable credentials, and an instant global kill switch for compromised ones. Ships as SDKs in Python, TypeScript, and Go, with a 3-line LangChain integration. Internal codebase, no public link.",
    metrics: [
      { label: 'Pipeline', value: '3-Lane Design', detail: 'Observer, Guard, Courtroom' },
      { label: 'Identity', value: 'DID + VCs', detail: 'Know-Your-Agent credentials, kill switch' },
      { label: 'Integration', value: '3 lines', detail: 'LangChain callback handler' },
    ],
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Redis', 'DeepSeek', 'Gemini', 'TypeScript', 'Go'],
    team: {
      note: 'Built by a 5-person founding team at Anchorate, our first startup.',
      collaborators: [],
    },
    audit: {
      problem: 'AI agents calling real tools are a black box. You cannot audit, insure, or trust what you cannot see.',
      constraint: 'A security layer that adds real latency on every agent action is dead on arrival. Most checks need to be fast enough to be invisible.',
      decision:
        'Split into three lanes: a fire-and-forget Observer lane for telemetry, a synchronous Guard lane for critical actions, and a DualJuror courtroom for the ambiguous middle, two LLM agents arguing opposite sides and voting. Identity rides on top as DIDs and verifiable credentials, so a compromised agent can be revoked instantly and globally.',
      whatBroke:
        'A brand-new agent has no history, so the pgvector contextual-anomaly check had nothing to compare against and would flag everything it did. Fixed with an explicit cold-start bypass for agents that have not built up enough history yet.',
    },
  },
  {
    id: 'trotter',
    title: 'Trotter: Deterministic Quantitative Stock Engine',
    category: 'Production & Systems',
    featured: true,
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
    id: 'paribelle',
    title: 'Paribelle: Multi-Vendor Marketplace Platform',
    category: 'Production & Systems',
    featured: true,
    skimDescription: 'A multi-vendor online marketplace, vendors run their own storefront, I built the backend.',
    deepDescription:
      "A multi-vendor online marketplace, think a mini Amazon: independent vendors sign up, get KYC-verified, and run their own branded storefront, while the backend handles payments, GST-compliant invoicing, bookings, and fulfillment behind the scenes. The NestJS/TypeORM backend is close to 30 modules deep: vendor KYC and location management, GST/HSN-compliant invoicing, Razorpay payments, bookings, promotions, reviews, search, and a referral system backed by a wallet ledger. Paired with a Next.js 14 storefront (TanStack Query, Zustand, Socket.IO for live updates) that swaps vendor branding at runtime.",
    repoUrl: 'https://github.com/anubhav-qt/paribelle-backend',
    secondaryRepoUrl: { label: 'Frontend Repo', url: 'https://github.com/anubhav-qt/paribelle-web' },
    metrics: [
      { label: 'Backend', value: '28 Modules', detail: 'Vendors, bookings, promos, search, wallet' },
      { label: 'Payments', value: 'Razorpay', detail: 'GST/HSN invoicing built in' },
    ],
    tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'Neon', 'TypeORM', 'Next.js 14', 'Razorpay', 'TanStack Query', 'Socket.IO', 'Vercel', 'Render'],
    team: { note: 'built with', collaborators: [{ label: '@ajaniljoshi', url: 'https://github.com/ajaniljoshi' }] },
    audit: {
      problem: 'Supporting independent vendor storefronts, theming, KYC, location, catalog, on one shared marketplace without the checkout paths colliding.',
      constraint: 'Two orders for the last unit of a product can interleave between a stock check and a stock decrement. A naive read-then-write oversells the item.',
      decision:
        'Every stock reservation is a single conditional UPDATE, it only succeeds while the stock is actually there, run in the same transaction as the sales-count increment, so a rolled-back order cannot inflate either number.',
      whatBroke:
        'A raw SQL fragment referenced the TypeORM property name instead of the actual Postgres column, which took down every order on every payment method the moment stock reservation ran. Fixed by naming the real column in the raw query.',
    },
  },
  {
    id: 'fraud-vote',
    title: 'Fraud Vote Detection Pipeline: Automated Electoral Roll PDF Audit',
    category: 'Production & Systems',
    featured: true,
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
