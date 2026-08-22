export interface ProjectAudit {
  problem: string;
  constraint: string;
  decision: string;
  whatBroke: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Flagship' | 'Architecture Spec' | 'Production & Systems' | 'Open Source' | 'AI & Machine Learning';
  skimDescription: string; // <= 90 chars, leads with the noun or the number
  deepDescription: string;
  metrics?: { label: string; value: string; detail?: string }[];
  tech: string[];
  repoUrl?: string;
  secondaryRepoUrl?: { label: string; url: string };
  caseStudyHref?: string;
  audit?: ProjectAudit;
  featured?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'spoin',
    title: 'Spoin: CQRS Pipeline & Quota Governor',
    tagline: 'LangGraph generation factory, 2D (key × model) quota grid, and zero-LLM read path.',
    category: 'Flagship',
    featured: true,
    skimDescription: 'CQRS knowledge pipeline: 5,004 cards generated at 130/min on $0 quota. <50ms read latency.',
    deepDescription:
      'Engineered an asynchronous content generation engine that isolates expensive frontier LLM calls behind a CQRS wall. The feed read path serves pre-computed, vector-deduplicated cards directly from PostgreSQL with sub-50ms latency. Implemented a 2D QuotaGovernor across 40+ free-tier API keys, dynamic model fallback ladders, and per-cell network serialization (ADR-0040) preventing burst rate-limit errors.',
    caseStudyHref: '/work/spoin',
    metrics: [
      { label: 'Corpus Size', value: '5,004 Cards', detail: '4,157 Questions in Postgres' },
      { label: 'Read Latency', value: '< 50ms', detail: 'Zero LLMs on read path' },
      { label: 'Throughput', value: '130+ cards/min', detail: 'Across 40+ key grid' },
      { label: 'Architecture', value: '33 ADRs', detail: 'Sole system architect' },
    ],
    tech: ['Python', 'LangGraph', 'PostgreSQL', 'pgvector', 'FastAPI', 'Gemini 2.5 Flash', 'FastEmbed', 'Docker'],
    audit: {
      problem: 'Building a rich, interactive educational feed on free-tier LLM quotas without incurring crippling API costs or exposing users to 3–10s generation latencies during card swipes.',
      constraint: 'The read path must never call an LLM (<50ms budget). Generation must survive strict per-project and per-model rate limits without dropping in-flight topic graphs.',
      decision: 'Separated offline content generation from online feed serving via CQRS. Built a 2D (key × model) quota governor with independent thinking and generator fallback ladders, serialized per-cell invocations, and persisted cards per subtopic group as they finish.',
      whatBroke: 'Burst calls to same-project API keys caused cascaded 429 errors and poisoned cells. Fixed via ADR-0040 per-cell mutex locking and removing the obsolete global asyncio.Semaphore(5) bottleneck in ADR-0047.',
    },
  },
  {
    id: 'continuum',
    title: 'Continuum: Film Studio Continuity OS',
    tagline: 'Event-sourced directed state multigraph in ClickHouse MCP & Vertex AI Agent Builder.',
    category: 'Architecture Spec',
    featured: true,
    skimDescription: 'Directed multigraph continuity engine with bi-directional cascade invalidation.',
    deepDescription:
      'System design for an AI-native virtual studio operating system. Represents entire film productions as an immutable event ledger and directed multigraph in ClickHouse. Employs bi-directional cascade invalidation across narrative elements (scripts, character bibles, wardrobe, set continuity) so upstream edits flag downstream inconsistencies without blind, expensive whole-script regenerations.',
    caseStudyHref: '/work/continuum',
    metrics: [
      { label: 'Storage Engine', value: 'ClickHouse MCP', detail: 'Event-sourced ledger' },
      { label: 'Orchestration', value: 'Vertex AI', detail: 'Agent Builder workflows' },
      { label: 'Invalidation', value: 'Bi-directional', detail: 'Graph cascade detection' },
    ],
    tech: ['ClickHouse MCP', 'Vertex AI Agent Builder', 'Event Sourcing', 'Directed Multigraphs', 'Python', 'TypeScript'],
    audit: {
      problem: 'Preventing narrative and physical continuity errors across multi-department film productions spanning thousands of script revisions and asset handoffs.',
      constraint: 'Generative models cannot blindly re-generate 120-page screenplays on small edits without incurring mode drift and losing established director intentions.',
      decision: 'Designed an event-sourced directed multigraph where entities (characters, props, scenes) have strict temporal validity boundaries. Revisions trigger targeted cascade invalidation events rather than mass regenerations.',
      whatBroke: 'Circular dependency loops between character wardrobe revisions and timeline scene sequencing locked graph updates. Fixed by enforcing a strict topological sort on asset dependency chains before evaluating invalidation cascades.',
    },
  },
  {
    id: 'fraud-vote',
    title: 'Fraud Vote: Automated Electoral Roll PDF Audit',
    tagline: 'OpenCV grid segmentation, Google Cloud Vision OCR (98%+ accuracy), and deep face encodings.',
    category: 'Production & Systems',
    featured: true,
    skimDescription: 'Electoral roll audit pipeline: OpenCV segmentation + OCR + 128D biometric face encodings.',
    deepDescription:
      'Constructed an end-to-end automated audit pipeline to detect counterfeit ballots, duplicate voter registrations, and biometric identity anomalies in scanned multi-page electoral roll PDFs. Replaced stochastic LLM verdicts with an algebraic scoring threshold computed from OpenCV contour segmentation, Google Cloud Vision OCR, and 128-dimensional Euclidean biometric face encodings.',
    repoUrl: 'https://github.com/anubhav-qt/fraud-vote-detection',
    metrics: [
      { label: 'OCR Accuracy', value: '98%+', detail: 'Multilingual Hindi/English' },
      { label: 'Biometrics', value: '128-D Euclidean', detail: 'Deep face embeddings' },
      { label: 'Audit Path', value: '100% Deterministic', detail: 'No stochastic LLMs' },
    ],
    tech: ['Python', 'OpenCV', 'Google Cloud Vision OCR', 'Deep Learning Face Encodings', 'Pandas', 'HTML Reports'],
    audit: {
      problem: 'Detecting counterfeit physical ballots, duplicate voter registrations, and identity spoofing across massive multi-page electoral roll PDFs.',
      constraint: 'Generative models cannot be audited in legal or governmental compliance; prompt drift or stochastic sampling could flip a fraud verdict on identical input imagery.',
      decision: 'Separated feature extraction from decisioning: OpenCV contour analysis segments voter cards, Google Cloud Vision OCR extracts names with 98%+ accuracy, and deep face encodings compute 128-dimensional Euclidean distances. The verdict is an auditable algebraic formula.',
      whatBroke: 'Scanning paper ballots under uneven shadows and low-resolution thumbnails caused edge-detection threshold failures and false face-encoding matches. Fixed by introducing adaptive illumination normalization (CLAHE + homomorphic filtering) and clustering face embeddings with a tight cosine margin (<0.45).',
    },
  },
  {
    id: 'trotter',
    title: 'Trotter: Deterministic Quantitative Stock Engine',
    tagline: 'Quantitative market math in TypeScript; multi-modal AI strictly for narrative interpretation.',
    category: 'Production & Systems',
    featured: true,
    skimDescription: 'Quantitative equity engine: deterministic financial math + Gemini 2.5 Flash narrative reasoning.',
    deepDescription:
      'Architected a deterministic quantitative research engine where mathematical indicators (momentum, volatility, volume flows, FinBERT sentiment) are computed directly in TypeScript from raw Yahoo Finance market streams. Gemini 2.5 Flash is restricted to interpreting fixed numerical tensors, completely preventing hallucinated balance sheets or drifting price levels.',
    repoUrl: 'https://github.com/anubhav-qt/trotter',
    metrics: [
      { label: 'Calculations', value: '100% Math-pure', detail: 'TypeScript deterministic engine' },
      { label: 'Latency', value: '< 250ms', detail: 'Cached multi-horizon response' },
      { label: 'LLM Role', value: 'Narrative Only', detail: 'Zero math delegated to LLM' },
    ],
    tech: ['Next.js (App Router)', 'TypeScript', 'FinBERT', 'Gemini 2.5 Flash', 'Tavily Search', 'Vanilla CSS'],
    audit: {
      problem: 'Traders need rapid, multi-horizon stock analysis without hallucinated price levels or fluctuating valuation verdicts across repeat queries.',
      constraint: 'LLMs cannot be trusted to perform accurate statistical math, calculate Bollinger Bands, or estimate financial ratios reliably across random seeds.',
      decision: 'Built a deterministic scoring wall: Momentum, valuation, volume, sentiment (FinBERT), and volatility scores are computed entirely in TypeScript from raw Yahoo Finance market data. Gemini 2.5 Flash receives fixed numbers and only generates qualitative narrative reasoning.',
      whatBroke: 'Computer vision chart bounding boxes initially had permission to overwrite quantitative verdicts. During volatile setups, chart hallucinations overrode solid mathematical fundamentals. Fixed by capping vision overrides to a strict, bounded delta (max ±12%) from the quantitative baseline.',
    },
  },
  {
    id: 'synthetic-generator',
    title: 'Synthetic Medical Dataset Generator (DCGAN)',
    tagline: 'Deep Convolutional GAN architecture for synthetic chest X-ray generation (FID ~150).',
    category: 'AI & Machine Learning',
    featured: false,
    skimDescription: 'Deep Convolutional GAN generating synthetic chest X-rays to counter clinical data scarcity.',
    deepDescription:
      'Engineered a Deep Convolutional Generative Adversarial Network (DCGAN) to produce synthetic chest X-ray imagery for rare pulmonary conditions, addressing patient privacy restrictions and severe dataset imbalance. Evaluated image fidelity using Fréchet Inception Distance (FID ~150) and structural SSIM metrics.',
    repoUrl: 'https://github.com/anubhav-qt/synthetic-dataset-generator',
    metrics: [
      { label: 'Evaluation', value: 'FID ~150', detail: 'Fréchet Inception Distance' },
      { label: 'Architecture', value: 'DCGAN + TTUR', detail: 'Historical gradient clipping' },
    ],
    tech: ['PyTorch', 'DCGAN', 'Torchvision', 'Scikit-Learn', 'Albumentations', 'Matplotlib'],
    audit: {
      problem: 'Training clinical diagnostic models is hindered by extreme data scarcity, patient privacy restrictions, and severe class imbalances in rare pulmonary conditions.',
      constraint: 'Synthetic medical images must preserve anatomically accurate lung boundaries, rib contours, and pathological opacities without mode collapse.',
      decision: 'Trained a Deep Convolutional GAN with strided convolutions, batch normalization, and LeakyReLU activations on normalized chest X-ray datasets. Evaluated generative quality using FID and structural SSIM metrics against clinical ground truth.',
      whatBroke: 'Early training iterations suffered from discriminator saturation and mode collapse, producing blurry, non-diagnostic chest silhouettes. Fixed by adopting two-timescale update rates (TTUR), label smoothing, and historical gradient clipping.',
    },
  },
  {
    id: 'amazon-ml',
    title: 'Amazon ML Challenge: Multimodal Price Prediction',
    tagline: 'Multimodal price prediction ensemble combining visual ResNet CNNs with text embeddings & LightGBM.',
    category: 'AI & Machine Learning',
    featured: false,
    skimDescription: 'Multimodal e-commerce price predictor: ResNet image vectors + FastEmbed + XGBoost / LightGBM.',
    deepDescription:
      'Constructed an end-to-end multimodal price prediction pipeline for complex e-commerce product catalogs. Extracted 512-dimensional visual feature vectors using pretrained ResNet CNNs alongside FastEmbed text representations, training an ensemble of Feed Forward Neural Networks, LightGBM, and XGBoost with Bayesian hyperparameter tuning.',
    repoUrl: 'https://github.com/anubhav-qt/amazon-ml-challenge',
    metrics: [
      { label: 'Target Space', value: 'log1p + Huber', detail: 'Robust outlier loss' },
      { label: 'Ensemble', value: 'ResNet + LightGBM', detail: 'Bayesian tuned' },
    ],
    tech: ['Python', 'PyTorch', 'XGBoost', 'LightGBM', 'Scikit-Learn', 'FastEmbed', 'Pandas'],
    audit: {
      problem: 'Predicting consumer product prices accurately from messy e-commerce catalog entries containing noisy titles, missing attributes, and uncurated thumbnail images.',
      constraint: 'Unimodal text or image models alone fail on complex catalogs where product prices depend on visual brand badges combined with package volume strings.',
      decision: 'Constructed an end-to-end multimodal ensemble pipeline: Extracted 512-dimensional visual feature vectors using pretrained ResNet CNNs alongside FastEmbed text representations. Trained an ensemble combining Feed Forward Neural Networks, LightGBM, and XGBoost.',
      whatBroke: 'Extreme outlier price targets ($0.99 items vs $4,000 industrial hardware) skewed MSE gradients, causing median predictions to drift wildly. Fixed by training models on log1p-transformed target spaces with Huber loss.',
    },
  },
  {
    id: 'paribelle',
    title: 'Paribelle: Multi-Tenant E-Commerce Platform',
    tagline: 'NestJS REST API with Swagger, PostgreSQL with TypeORM pessimistic locking, Next.js 14 frontend.',
    category: 'Production & Systems',
    featured: false,
    skimDescription: 'Multi-tenant commerce engine: NestJS, TypeORM pessimistic locks, Next.js 14 micro-theming.',
    deepDescription:
      'Engineered a scalable multi-tenant e-commerce backend in NestJS and PostgreSQL with TypeORM, featuring dynamic runtime theme customization and Swagger API documentation. Built transactional inventory reservations with pessimistic row locking (`SELECT FOR UPDATE`) to eliminate race conditions during high-concurrency checkouts. Onboarded 48 active pilot users.',
    repoUrl: 'https://github.com/anubhav-qt/paribelle-backend',
    secondaryRepoUrl: { label: 'Frontend Repo', url: 'https://github.com/anubhav-qt/paribelle-web' },
    metrics: [
      { label: 'Pilot Adoption', value: '48 Users', detail: 'Onboarded on live staging' },
      { label: 'Concurrency', value: 'Pessimistic Locks', detail: 'Zero overselling under load' },
    ],
    tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'Next.js 14', 'Zustand', 'TanStack Query', 'Tailwind CSS'],
    audit: {
      problem: 'Supporting independent storefront themes and isolated multi-tenant vendor catalog management without incurring template fragmentation or database race conditions.',
      constraint: 'Vendors need dynamic runtime theme overrides without re-deploying frontend bundles or injecting dangerous unsanitized CSS into shared customer browsing paths.',
      decision: 'Engineered a decoupled backend API in NestJS with PostgreSQL/TypeORM and tenant-isolated database scopes. Built a Next.js 14 frontend with CSS variable tokens that hot-swaps vendor color palettes and branding assets securely on the client.',
      whatBroke: 'Concurrent order checkouts on single-stock artisan items caused inventory overselling under load. Fixed by introducing pessimistic row locking (`SELECT FOR UPDATE`) within transactional order reservation blocks.',
    },
  },
  {
    id: 'secondary-screen',
    title: 'Secondary Screen: Zero-Runtime Display Protocol',
    tagline: '3 static files replacing 300MB of Electron runtimes for ultra-low latency auxiliary display rendering.',
    category: 'Open Source',
    featured: false,
    skimDescription: 'Zero-runtime display streamer: 3 static files replacing 300MB Electron memory bloat.',
    deepDescription:
      'Eliminated heavyweight client-side Electron wrappers completely by engineering a zero-dependency 3-file static delivery system (HTML, CSS, WebSocket JS) delivering raw canvas frames and delta state over low-latency binary WebSockets to auxiliary tablets and secondary monitors.',
    repoUrl: 'https://github.com/anubhav-qt/secondary-screen',
    metrics: [
      { label: 'Client Footprint', value: '3 Static Files', detail: 'Zero framework runtime' },
      { label: 'Memory Savings', value: '> 300MB RAM', detail: 'Vs standard Electron client' },
    ],
    tech: ['Vanilla JavaScript', 'WebSockets', 'HTML5 Canvas', 'Node.js', 'Low-Latency Transport'],
    audit: {
      problem: 'Streaming auxiliary status dashboards, telemetry gauges, and sidecar metrics to external tablets and secondary monitors with near-zero resource footprint.',
      constraint: 'Bundling an Electron or Chromium wrapper on low-power secondary clients consumed >400MB RAM and caused frame drops on low-end hardware.',
      decision: 'Eliminated client-side runtime frameworks completely: Built a zero-dependency 3-file static delivery system (HTML, CSS, WebSocket JS) delivering raw canvas frames and delta state over lightweight binary WebSockets.',
      whatBroke: 'WebSocket reconnect storms during intermittent WiFi dropouts flooded the host server with duplicate frame requests, saturating socket buffers. Fixed by implementing exponential backoff with monotonic sequence packet acknowledgments.',
    },
  },
  {
    id: 'anchorate',
    title: 'Anchorate: Runtime Policy Interception Layer',
    tagline: 'AI agent runtime firewall: PII redaction, prompt injection detection, and pgvector audit logging.',
    category: 'Production & Systems',
    featured: false,
    skimDescription: 'Agent policy firewall: PII redaction, injection detection lanes, pgvector audit log.',
    deepDescription:
      'Built a runtime policy interception layer between autonomous AI agents and their external tool execution environments. Implemented real-time PII redaction, prompt injection detection lanes, and statistical plus pgvector similarity-based anomaly detection over an append-only audit log.',
    metrics: [
      { label: 'Security', value: 'Zero PII Leaks', detail: 'Real-time sanitization layer' },
      { label: 'Audit Trail', value: 'Append-only', detail: 'pgvector similarity tracking' },
    ],
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Redis', 'LangGraph', 'Docker'],
  },
];
