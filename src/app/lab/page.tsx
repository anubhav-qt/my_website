import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FlaskConical, ArrowRight, GitPullRequest, HelpCircle, Sparkles, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lab Notes & Open Systems Investigations',
  description: 'Living workspace of open technical tensions, active benchmarks, and distributed systems RFCs.',
};

interface LabItem {
  id: string;
  title: string;
  category: 'Distributed Systems' | 'Quality Gates' | 'Graph Algorithms' | 'Inference Optimization';
  status: 'Active Investigation' | 'Design RFC' | 'Benchmarking';
  hypothesis: string;
  tension: string;
  currentApproach: string;
  nextExperiment: string;
  relatedDoc?: { title: string; href: string };
}

const LAB_NOTES: LabItem[] = [
  {
    id: 'multi-process-rpm-coordination',
    title: 'Multi-Process Sliding-Window RPM Synchronization',
    category: 'Distributed Systems',
    status: 'Design RFC',
    hypothesis:
      'Replacing the in-process sliding-window deque with a lightweight atomic Redis/Postgres token bucket enables safe concurrency across multiple independent worker containers without bursting provider rate limits.',
    tension:
      'ADR-0028 explicitly rejected per-call DB roundtrips to enforce RPM because a single batch worker was the only process hitting keys. As soon as a second worker container or manual CLI runs concurrently, in-process cell locks (ADR-0040) no longer prevent same-cell collisions.',
    currentApproach:
      'In-process `asyncio.Lock` per cell + 60-second sliding deque window in Python memory.',
    nextExperiment:
      'Benchmarking a pipeline of 3 concurrent worker processes sharing a 10-key pool against an atomic Postgres advisory lock vs Redis sliding-window script to measure network latency overhead vs rate limit safety.',
    relatedDoc: { title: 'ADR-0040 (Per-Cell Serialization)', href: '/work/spoin#adr-0040' },
  },
  {
    id: 'quality-gate-cosine-calibration',
    title: 'Empirical Calibration of the Card Duplicate Cosine Threshold',
    category: 'Quality Gates',
    status: 'Benchmarking',
    hypothesis:
      'The current near-duplicate threshold (0.90 cosine similarity via FastEmbed BAAI/bge-small-en-v1.5) is overly conservative and occasionally rejects legitimate conceptual deep-dives sharing high structural syntax.',
    tension:
      'Setting the threshold too high (>0.94) allows near-verbatim duplicate cards into the feed; setting it too low (<0.88) blocks cards that explain different nuances of the same technical concept (e.g. TCP Handshake vs TCP Teardown).',
    currentApproach:
      'Hardcoded placeholder threshold of 0.90 in `generation/dedup.py` with near-duplicate drafts persisted to `rejected_card` table for evaluation.',
    nextExperiment:
      'Generating an all-pairs similarity matrix across the 5,004 production cards committed during Run 2 to plot the empirical precision/recall curve against human-labeled duplicate pairs.',
    relatedDoc: { title: 'ADR-0030 (Two-Pass Quality Gate)', href: '/work/spoin#adr-0030' },
  },
  {
    id: 'cyclic-multigraph-oscillation-damping',
    title: 'Fixed-Point Convergence & Cycle Damping in Film Production Graphs',
    category: 'Graph Algorithms',
    status: 'Active Investigation',
    hypothesis:
      'Epoch-based content hash invalidations on Directed Cyclic Multigraphs will guarantee termination in under O(V + E) iterations if cyclic feedback edges (e.g. Budget ↔ Shooting Schedule) apply monotonic constraint relaxation.',
    tension:
      'In Continuum, changing Scene 4 location increases budget; increased budget requires shortening shooting days; shortening days compresses scene schedules, potentially creating an infinite evaluation loop.',
    currentApproach:
      'Bounded iteration ceiling (max 10 epochs) with an oscillation detector in ClickHouse tracking visited node hash states.',
    nextExperiment:
      'Formulating the collaborative negotiation agent as a contract net protocol that injects creative compromise options whenever an oscillation cycle is detected.',
    relatedDoc: { title: 'Continuum Architecture Spec', href: '/work/continuum' },
  },
];

export default function LabPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-xs font-mono text-[var(--accent)] font-semibold">
          <FlaskConical className="w-3.5 h-3.5" />
          The Systems Laboratory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Active Inquiries &amp; Architecture RFCs
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
          A living workspace of open technical tensions, active benchmarks, and system design explorations. Not a graveyard of abandoned ideas, but the rigorous edge of current engineering work.
        </p>
      </div>

      {/* Lab Inquiries Grid */}
      <div className="space-y-6">
        {LAB_NOTES.map((note) => (
          <article
            key={note.id}
            id={note.id}
            className="p-5 sm:p-6 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] space-y-4 shadow-xs scroll-mt-20"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)] mb-1">
                  <span>{note.category}</span>
                  <span>·</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {note.status}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">{note.title}</h2>
              </div>
              {note.relatedDoc && (
                <Link
                  href={note.relatedDoc.href}
                  className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{note.relatedDoc.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* 4-Part RFC Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 space-y-1.5">
                <div className="font-mono text-[10px] uppercase font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>The Working Hypothesis</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{note.hypothesis}</p>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 space-y-1.5">
                <div className="font-mono text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>The Architectural Tension</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{note.tension}</p>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 space-y-1.5">
                <div className="font-mono text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Current Production Approach</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed font-mono">{note.currentApproach}</p>
              </div>

              <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                <div className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Next Empirical Experiment</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{note.nextExperiment}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
