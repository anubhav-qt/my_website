import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SpoinSimulator } from '@/components/simulator/SpoinSimulator';
import {
  Zap,
  AlertTriangle,
} from 'lucide-react';
import syncedDocs from '@/data/synced-docs.json';
import { GaugeTile, CounterTile } from '@/components/StatTile';
import { WallGlyph } from '@/components/icons/WallGlyph';

export const metadata: Metadata = {
  title: 'Spoin Case Study: CQRS Pipeline & Quota Governor',
  description:
    'Deep architectural case study of Spoin: LangGraph fan-out, 2D (key × model) quota governor grid, ADR-0040 serialization, and 5,004 verified production cards.',
};

export default function SpoinCaseStudyPage() {
  const adrs = syncedDocs.spoin.adrs;

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* 1. HEADER & RECRUITER 40-SECOND SUMMARY */}
      <section className="space-y-6 border-b border-[var(--border-subtle)] pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/work"
            className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            ← Back to Work
          </Link>
          <span className="text-[var(--text-muted)] font-mono">/</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Flagship Case Study</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Corpus: 5,004 Cards · 4,157 Questions · 40+ API Keys · $0 Paid Quota</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Spoin: The CQRS Knowledge Pipeline
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            A rate-limited, multi-key AI content factory and 2D quota governor grid designed around one non-negotiable rule:{' '}
            <strong className="text-[var(--text-primary)] font-semibold">the feed read path must never touch an LLM</strong>.
          </p>
        </div>

        {/* TL;DR stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <GaugeTile value={50} max={1000} display="<50ms" label="Read latency" detail="Zero LLMs on the read path" />
          <CounterTile value="130+/min" label="Throughput peak" detail="After removing legacy semaphore (ADR-0047)" size="sm" />
          <CounterTile value="99.3%" label="Quality gate pass" detail="Two-pass self-correcting gate (ADR-0030)" size="sm" />
          <CounterTile value="Idempotent" label="Fault recovery" detail="Exhaustion requeues as pending" size="sm" />
        </div>
      </section>

      {/* 2. THE INTERACTIVE CENTERPIECE: SIMULATOR (PLACED IMMEDIATELY UNDER SUMMARY) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Interactive Quota &amp; Pipeline Simulator</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
              Live deterministic simulation of the LangGraph execution pipeline and the (key × model) QuotaGovernor grid.
            </p>
          </div>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)] font-semibold self-start sm:self-auto">
            Live Mechanism · Perturbable
          </span>
        </div>

        {/* The Live Simulator Component */}
        <SpoinSimulator />
      </section>

      {/* 3. PROMOTED BENCHMARK TABLE */}
      <section className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
            Empirical Validation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Benchmark Analysis: Run 1 vs Run 2
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Empirical benchmark comparing throughput across 40+ API keys with and without global asyncio semaphore constraints.
          </p>
        </div>

        <div className="overflow-x-auto border border-[var(--border-strong)] rounded-xl bg-[var(--bg-surface)]">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[10px] text-[var(--text-muted)]">
                <th className="p-3">Metric Dimension</th>
                <th className="p-3">Run 1: Baseline</th>
                <th className="p-3">Run 2: Part A (With Semaphore)</th>
                <th className="p-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">
                  Run 2: Part B (ADR-0047 Unchained)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Card Generation Rate</td>
                <td className="p-3 text-[var(--text-secondary)]">~14.2 cards/min</td>
                <td className="p-3 text-[var(--text-secondary)]">~16.5 cards/min</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">~130+ cards/min ⚡</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Quiz Synthesis Rate</td>
                <td className="p-3 text-[var(--text-secondary)]">~14.1 questions/min</td>
                <td className="p-3 text-[var(--text-secondary)]">~12.2 questions/min</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">~250 questions/min ⚡</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Active Key Pool</td>
                <td className="p-3 text-[var(--text-secondary)]">9 keys</td>
                <td className="p-3 text-[var(--text-secondary)]">18 keys</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">40+ keys (2D Grid)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Phantom 429 Errors</td>
                <td className="p-3 text-rose-500 font-semibold">12 burst errors</td>
                <td className="p-3 text-rose-500 font-semibold">8 burst errors</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">0 (ADR-0040 Fixed)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. ARCHITECTURAL DEEP DIVE PROSE */}
      <section className="editorial-prose space-y-10 pt-8 border-t border-[var(--border-subtle)]">
        {/* Section 1 */}
        <div>
          <h2>1. The Thesis: The Feed Read Path Must Never Touch an LLM</h2>
          <p>
            A swipe in a modern feed is a <strong>~50ms interaction</strong>. An LLM invocation is <strong>2–10 seconds</strong>. These two performance profiles cannot coexist on a single synchronous request path. Building an app that queries a foundation model to serve the next swipe is an architectural antipattern that guarantees jank, unbounded cloud costs, and catastrophic rate limit failures.
          </p>
          <blockquote>
            Spoin is not an app that calls an LLM. It is an offline, asynchronous content factory feeding a Postgres content warehouse, read by a lightweight sub-50ms serving layer with zero runtime model dependencies.
          </blockquote>
          <p>
            This fundamental CQRS separation dictates everything else: cards are not generated personally per user. Instead, high-quality atomic cards are generated at calibrated difficulty tiers (Beginner, Intermediate, Advanced), stored once in the shared corpus, indexed with 384-dimensional FastEmbed embeddings, and served to qualifying users via deterministic ranking and seen-filters.
          </p>
        </div>

        {/* Section 2: SVG PIPELINE DIAGRAM */}
        <div>
          <h2>2. LangGraph Execution &amp; The Three Invariants</h2>
          <p>
            The generation pipeline (implemented as an isolated LangGraph graph) takes topics that have already passed embedding-based canonicalization and dispatches a multi-stage workflow:
          </p>

          {/* Clean Responsive SVG Pipeline Diagram */}
          <div className="my-6 p-4 sm:p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Fig. 1 — Generation Pipeline Execution Flow
            </div>
            <svg
              viewBox="0 0 700 360"
              className="w-full h-auto text-[var(--text-primary)]"
              fill="none"
              stroke="currentColor"
            >
              {/* START Node */}
              <rect x="20" y="20" width="180" height="48" rx="8" className="fill-[var(--bg-subtle)] stroke-[var(--border-strong)]" strokeWidth="1.5" />
              <text x="110" y="48" textAnchor="middle" className="text-xs font-mono font-bold fill-[var(--text-primary)] stroke-none">
                START (Job Claim)
              </text>

              {/* Arrow to resolve_and_plan */}
              <path d="M 200 44 L 270 44" strokeWidth="1.5" stroke="var(--text-muted)" markerEnd="url(#arrow)" />

              {/* resolve_and_plan_topic Node */}
              <rect x="280" y="20" width="380" height="48" rx="8" className="fill-[var(--accent-subtle)] stroke-[var(--accent-border)]" strokeWidth="1.5" />
              <text x="470" y="48" textAnchor="middle" className="text-xs font-mono font-bold fill-[var(--accent)] stroke-none">
                resolve_and_plan_topic (Thinking Pool)
              </text>

              {/* Fan-Out Arrow */}
              <path d="M 470 68 L 470 120" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 160 120 L 580 120" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 160 120 L 160 150" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 370 120 L 370 150" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 580 120 L 580 150" strokeWidth="1.5" stroke="var(--text-muted)" />

              {/* Group 1, Group 2, Group N nodes */}
              <rect x="60" y="150" width="200" height="90" rx="8" className="fill-[var(--bg-subtle)] stroke-[var(--border-strong)]" strokeWidth="1.5" />
              <text x="160" y="175" textAnchor="middle" className="text-xs font-mono font-bold fill-[var(--text-primary)] stroke-none">
                Subtopic Group 1
              </text>
              <text x="160" y="198" textAnchor="middle" className="text-[10px] font-mono fill-[var(--text-muted)] stroke-none">
                Sequential Tiers (builds_on)
              </text>
              <text x="160" y="220" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400 stroke-none">
                Gated &amp; Persisted (ADR-0041)
              </text>

              <rect x="280" y="150" width="180" height="90" rx="8" className="fill-[var(--bg-subtle)] stroke-[var(--border-strong)]" strokeWidth="1.5" />
              <text x="370" y="175" textAnchor="middle" className="text-xs font-mono font-bold fill-[var(--text-primary)] stroke-none">
                Subtopic Group 2
              </text>
              <text x="370" y="198" textAnchor="middle" className="text-[10px] font-mono fill-[var(--text-muted)] stroke-none">
                Sequential Tiers (builds_on)
              </text>
              <text x="370" y="220" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400 stroke-none">
                Gated &amp; Persisted (ADR-0041)
              </text>

              <rect x="480" y="150" width="200" height="90" rx="8" className="fill-[var(--bg-subtle)] stroke-[var(--border-strong)]" strokeWidth="1.5" />
              <text x="580" y="175" textAnchor="middle" className="text-xs font-mono font-bold fill-[var(--text-primary)] stroke-none">
                Subtopic Group N
              </text>
              <text x="580" y="198" textAnchor="middle" className="text-[10px] font-mono fill-[var(--text-muted)] stroke-none">
                Sequential Tiers (builds_on)
              </text>
              <text x="580" y="220" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400 stroke-none">
                Gated &amp; Persisted (ADR-0041)
              </text>

              {/* Fan-In to Final Report */}
              <path d="M 160 240 L 160 280" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 370 240 L 370 280" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 580 240 L 580 280" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 160 280 L 580 280" strokeWidth="1.5" stroke="var(--text-muted)" />
              <path d="M 370 280 L 370 300" strokeWidth="1.5" stroke="var(--text-muted)" />

              {/* gate_and_persist Final Aggregator */}
              <rect x="190" y="300" width="360" height="44" rx="8" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1.5" />
              <text x="370" y="328" textAnchor="middle" className="text-xs font-mono font-bold fill-emerald-600 dark:fill-emerald-400 stroke-none">
                gate_and_persist (Lightweight Fan-in Report Only)
              </text>
            </svg>
          </div>

          <p className="mt-4">
            The visual simulation demonstrates three critical architectural invariants:
          </p>
          <ul>
            <li>
              <strong>Cards go live per group, not per run (ADR-0041):</strong> When a subtopic group completes its two-pass quality gate, its cards and generated quiz questions are immediately committed to Postgres and made live in the user feed. Sibling groups still in-flight never hold back finished content.
            </li>
            <li>
              <strong>Tiers within a group are sequential; groups are concurrent:</strong> Sibling subtopic groups run in parallel, but difficulty tiers within a single concept run sequentially (Beginner → Intermediate → Advanced). The higher tier’s generation prompt receives the actual card bodies of the lower tier as <code>builds_on</code> context, ensuring genuine conceptual progression rather than mechanical paraphrasing.
            </li>
            <li>
              <strong>Fan-in performs zero database writes:</strong> The final <code>gate_and_persist</code> node is strictly lightweight bookkeeping. It aggregates individual subtopic reports into the final GenerationJob report and marks the job complete.
            </li>
          </ul>
        </div>

        {/* Section 3: Quota Grid */}
        <div>
          <h2>3. The 2D Quota Governor Grid (Key × Model)</h2>
          <p>
            Under Google Cloud free-tier constraints, rate limits are enforced <strong>per Google Cloud project</strong> (not per API key minted in that project) and <strong>per model independently</strong>. Rotating across ten API keys that belong to the same project provides zero additional quota. Furthermore, exhausting <code>gemini-2.5-flash</code> leaves <code>gemini-1.5-flash</code> untouched.
          </p>
          <p>
            As codified in <Link href="#adr-0028" className="text-[var(--accent)] font-mono font-semibold hover:underline">ADR-0028</Link>, Spoin models quota as a 2D matrix: <code>(key_index, model) → today&apos;s spend</code> with two independent fallback ladders:
          </p>
          <ul>
            <li>
              <strong>Thinking Pool (gemini-2.5-flash, gemini-1.5-pro):</strong> Reserved for <code>generate_curriculum</code>, <code>match_topics</code>, <code>correct_cards</code>, <code>verify_cards</code>, and quiz grading. If a weak model writes a bad curriculum or makes an incorrect quality gate judgment, the downstream corpus is corrupted.
            </li>
            <li>
              <strong>Generator Pool (gemini-1.5-flash, gemini-1.5-flash-8b):</strong> Dedicated to <code>generate_cards</code> and <code>generate_questions</code> (<Link href="#adr-0029" className="text-[var(--accent)] font-mono hover:underline">ADR-0029</Link>). Card drafting is raw prose that the quality gate will independently inspect, so it utilizes the high-throughput 500 RPD ladder.
            </li>
          </ul>
          <p>
            <strong>Search Order:</strong> The governor searches <em>model-first, then key-first, and never waits</em>. It checks the top model across all configured keys (0..N). If every key is exhausted for that model, it steps down to the next rung in the ladder. Only when the entire grid is spent does it raise <code>QuotaExhaustedError</code>.
          </p>
          <p>
            <strong>Graceful Degradation:</strong> When <code>QuotaExhaustedError</code> is caught at the worker boundary, the job is marked <strong>`pending`</strong> rather than <strong>`failed`</strong>. Because the pipeline is idempotent per topic (<Link href="#adr-0026" className="text-[var(--accent)] font-mono hover:underline">ADR-0026</Link>), the worker automatically resumes exactly where it left off on the next cron pass without human intervention.
          </p>
        </div>

        {/* Section 4: ADR-0040 */}
        <div id="adr-0040-section">
          <h2>4. ADR-0040: The Same-Cell Call Serialization Bug</h2>
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Real Production Incident Analysis</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              During multi-topic execution runs, real 429 errors were observed on cells that the local ledger calculated as having plenty of room. The cause: <code>QuotaGovernor.acquire()</code> granted a cell and returned before the actual HTTP network call fired.
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Because multiple LangGraph subtopic tasks were running concurrently, several tasks acquired the <em>same</em> <code>(key, model)</code> cell at the exact same instant and fired simultaneous HTTP bursts. Google’s server-side rate limiter saw 5+ requests in a 100ms window, triggering real 429s. Even worse, the ledger’s <code>mark_exhausted()</code> handler treated the 429 as permanent daily exhaustion, poisoning the cell and setting <code>requests_spent = rpd</code>—wasting the rest of the day’s budget.
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold text-[var(--text-primary)]">
              Fixed in ADR-0040 by introducing <code>cell_lock(key_index, model) -&gt; asyncio.Lock</code>. Network calls to the <em>same cell</em> queue in FIFO order, while calls across <em>different cells</em> remain fully parallel. Test this behavior in the simulator toggle above!
            </p>
          </div>
        </div>

        {/* Section 5: Quality Gate */}
        <div>
          <h2>5. Two-Pass Self-Correcting Quality Gate (ADR-0030)</h2>
          <p>
            Traditional generation pipelines use <strong>detect-and-reject</strong> gates: an independent judge checks difficulty and topic fit, throwing away the draft if anything is slightly off. Under free-tier constraints, quota is the scarcest resource—discarding an entire card because one paragraph drifted wastes the generation call.
          </p>
          <p>
            <Link href="#adr-0030" className="text-[var(--accent)] font-mono font-semibold hover:underline">ADR-0030</Link> introduced a two-pass, self-correcting gate:
          </p>
          <ol>
            <li>
              <strong>Pass 1 (In-Place Correction):</strong> The model sees the draft alongside the canonical topic definition. <em>Difficulty is withheld.</em> The model rewrites any minor factual errors or topic drift in-place. It never rejects.
            </li>
            <li>
              <strong>Near-Duplicate Detection (Local FastEmbed):</strong> The corrected text is embedded locally with FastEmbed (free, zero API quota). Cosine similarity checks against existing corpus cards and intra-batch candidates. If similarity exceeds <code>0.90</code>, the card is rejected <em>before</em> pass 2, saving quota.
            </li>
            <li>
              <strong>Pass 2 (Verification):</strong> Survivors are evaluated with requested difficulty visible. The model confirms the difficulty tier and provides a final <code>accepted: bool</code> verdict.
            </li>
          </ol>
        </div>
      </section>

      {/* 5. ARCHITECTURAL DECISION RECORDS (ADRS) */}
      <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
            System Design Records
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Architectural Decision Records (ADRs)
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Every major architectural invariant and operational pivot is grounded in an explicit decision record.
          </p>
        </div>

        <div className="space-y-4">
          {adrs.map((adr) => (
            <article
              key={adr.id}
              id={`adr-${adr.id}`}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all scroll-mt-24 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[var(--border-subtle)] pb-2.5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <WallGlyph size={13} />
                  <span className="font-bold text-[var(--accent)]">ADR-{adr.adrNumber.toString().padStart(4, '0')}</span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-primary)] font-semibold">{adr.title.replace(/^ADR-\d+:\s*/, '')}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                    {adr.status}
                  </span>
                  <span>{adr.date}</span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{adr.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
