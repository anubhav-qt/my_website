import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Systems Principles & The Determinism Wall',
  description: 'Core architectural tenets: Determinism boundaries, invalidation cascades, CQRS feed separation, and local vector walls.',
};

interface EvidenceEntry {
  project: string;
  href: string;
  isExternal?: boolean;
  excerpt: string;
  context: string;
}

interface PrincipleItem {
  id: string;
  number: string;
  title: string;
  statement: string;
  evidence: EvidenceEntry[];
}

const PRINCIPLES: PrincipleItem[] = [
  {
    id: 'determinism-boundaries',
    number: '01',
    title: 'Determinism Boundaries',
    statement:
      'Draw a rigid boundary between what must be provable and what is permitted to be generated. Keep the stochastic model strictly on the far side of that boundary.',
    evidence: [
      {
        project: 'Spoin (Flagship)',
        href: '/work/spoin',
        excerpt:
          '"The generator is trusted for taste, never for constraints. Anything that must be true is enforced or independently verified outside the model; anything that merely needs to be good is the model\'s job."',
        context:
          'Difficulty ratings, card archetypes, ASCII viewport limits, and seen-filtering are calculated deterministically outside LLM prompts.',
      },
      {
        project: 'Trotter',
        href: 'https://github.com/anubhav-qt/trotter',
        isExternal: true,
        excerpt:
          '"Investment scores (momentum, valuation, volume, sentiment, volatility) are computed directly from market data in code as pure functions. Gemini is used only to write narrative reasoning on top of fixed scores."',
        context:
          'Searching the same ticker returns byte-for-byte identical quantitative metrics; model narrative is grounded in immutable numbers.',
      },
      {
        project: 'Fraud Vote Detection',
        href: 'https://github.com/anubhav-qt/fraud-vote-detection',
        isExternal: true,
        excerpt:
          '"SIFT keypoint descriptors, OpenCV contour segmentation, and deep face encodings calculate geometric/biometric alignment. The fraud verdict is an algebraic threshold in code; no generative model is trusted with the ballot verdict."',
        context:
          'Auditable computer vision and Euclidean distance metrics replace non-deterministic probabilistic text models in high-stakes governance.',
      },
      {
        project: 'Anchorate (AI Governance)',
        href: '/#anchorate',
        excerpt:
          '"Built a runtime policy interception layer between agents and their tools, with deterministic PII redaction and prompt injection detection lanes prior to execution."',
        context:
          'Enforces security and data compliance policies at the network/tool interface before untrusted agent prompts can trigger state mutations.',
      },
    ],
  },
  {
    id: 'invalidation',
    number: '02',
    title: 'Invalidation vs Blind Regeneration',
    statement:
      'When state changes, re-run only the bounded dependency subgraph that was affected. Never throw away the entire world to regenerate it from scratch.',
    evidence: [
      {
        project: 'Continuum',
        href: '/work/continuum',
        excerpt:
          '"Changing any entity triggers a bounded, epoch-based invalidation traversal upstream and downstream. Uses differential content hashing (content_hash) to prune unaffected branches and an oscillation detector to prevent infinite loops."',
        context:
          'A script change from Day to Night invalidates only lighting work orders and call sheet pickups, leaving the rest of the film intact.',
      },
      {
        project: 'Spoin',
        href: '/work/spoin#adr-0026',
        excerpt:
          '"run_generation_pipeline takes topic_ids that already exist. It is one-shot and idempotent: if curriculum_generated_at is set, it skips straight to loading existing subtopics. Interrupted runs pick up right where they left off."',
        context:
          'From ADR-0026: An aborted run never duplicates already-generated cards; the pipeline checks existing database rows and fills only remaining target shortfalls.',
      },
    ],
  },
  {
    id: 'cqrs-separation',
    number: '03',
    title: 'Strict CQRS Separation in AI Workloads',
    statement:
      'A sub-50ms feed read path and a 5-second LLM generation call cannot coexist on the same request loop. Isolate AI generation to asynchronous batch factories.',
    evidence: [
      {
        project: 'Spoin',
        href: '/work/spoin',
        excerpt:
          '"The feed read path must never touch an LLM. Personalization is selection and ranking over a shared corpus—not generation. The AI lives in the write path. Never the read path."',
        context:
          'Feed candidate generation, seen-filtering, and ranking execute in PostgreSQL in <50ms. Expensive LLMs populate the corpus offline.',
      },
      {
        project: 'Paribelle',
        href: 'https://github.com/anubhav-qt/paribelle-backend',
        isExternal: true,
        excerpt:
          '"Pessimistic row locking (SELECT FOR UPDATE) isolates high-contention checkout state from frontend theme evaluation and catalog reads."',
        context:
          'Separates read-heavy micro-theme projection rendering from transactional state mutations during checkout rushes.',
      },
    ],
  },
  {
    id: 'local-vector-walls',
    number: '04',
    title: 'The Local Vector Wall: Quota is for Intelligence, Not Math',
    statement:
      'Never spend scarce frontier API tokens on embeddings, string formatting, or structural parsing. Execute embeddings and geometric heuristics locally.',
    evidence: [
      {
        project: 'Spoin (ADR-0005 & ADR-0030)',
        href: '/work/spoin#adr-0030',
        excerpt:
          '"Embeddings run locally (FastEmbed), never against a paid/quota\'d API. Quota is reserved for card generation and quality gate judgments. Near-duplicate rejection runs locally before pass 2 verification."',
        context:
          'Local FastEmbed BAAI/bge-small-en-v1.5 embeddings filter near-duplicate drafts before expensive LLM verification calls.',
      },
      {
        project: 'Amazon ML Challenge',
        href: 'https://github.com/anubhav-qt/amazon-ml-challenge',
        isExternal: true,
        excerpt:
          '"Extracted 512-D ResNet visual features and local FastEmbed embeddings prior to LightGBM ensemble training; eliminated runtime cloud dependencies."',
        context:
          'Local feature extraction tensors fed into high-throughput gradient boosting models for price prediction.',
      },
    ],
  },
];

export default function SystemsPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-xs font-mono text-[var(--accent)] font-semibold">
          <Layers className="w-3.5 h-3.5" />
          The Determinism Wall
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Systems Engineering Principles
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
          A codified set of architectural invariants distilled across every system I build. These are not stylistic guidelines—they are hard boundaries between provable state and generative models.
        </p>
      </div>

      {/* Principles List */}
      <div className="space-y-8">
        {PRINCIPLES.map((p) => (
          <article
            key={p.id}
            id={p.id}
            className="p-5 sm:p-6 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] space-y-4 shadow-xs scroll-mt-20"
          >
            {/* Header */}
            <div className="border-b border-[var(--border-subtle)] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-[var(--accent)]">{p.number}</span>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{p.title}</h2>
              </div>
            </div>

            {/* Core Statement */}
            <blockquote className="text-sm sm:text-base font-medium text-[var(--text-primary)] bg-[var(--accent-subtle)] border-l-4 border-[var(--accent)] p-3 rounded-r-lg">
              {p.statement}
            </blockquote>

            {/* Empirical Evidence Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Empirical Grounding in Code &amp; Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {p.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {ev.project}
                        </span>
                        {ev.isExternal ? (
                          <a
                            href={ev.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                          >
                            <span>Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href={ev.href}
                            className="text-[11px] font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                          >
                            <span>Doc</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                        {ev.excerpt}
                      </p>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono border-t border-[var(--border-subtle)] pt-2 mt-2">
                      <strong>Context:</strong> {ev.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
