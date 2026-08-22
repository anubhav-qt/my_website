import React from 'react';
import Link from 'next/link';
import {
  Clock,
  AlertCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Continuum: Film Studio Continuity OS (WIP) — Anubhav Joshi',
  description:
    'Living architecture specification of Continuum: An AI-native virtual film studio OS modeling movies as persistent Directed Cyclic Multigraphs with ClickHouse MCP & Vertex AI.',
};

export default function ContinuumCaseStudyPage() {
  const changelog = [
    {
      version: 'v0.3.0',
      date: '2026-08-20',
      title: 'ClickHouse MCP & Bounded Cascade Convergence',
      summary:
        'Formalized epoch-based invalidation traversal in ClickHouse. Integrated oscillation detection and content-hash pruning to prevent infinite cycles in cyclic dependencies.',
    },
    {
      version: 'v0.2.1',
      date: '2026-08-14',
      title: 'Multi-Role Portals & Zero-Noise Slicing',
      summary:
        'Designed craft-specific view projections: Producer (budget burn & critical paths), Director (shot coverage & camera blocking), Actor (personal call sheets), and Department work orders.',
    },
    {
      version: 'v0.1.0',
      date: '2026-08-05',
      title: 'Initial Product Spec & Multigraph Contract',
      summary:
        'Established core thesis: Treating movies as persistent state multigraphs rather than prompt-to-video text wrappers.',
    },
  ];

  return (
    <div className="space-y-14 animate-in fade-in duration-300">
      {/* 1. HEADER & HONEST WIP STATUS CALLOUT */}
      <section className="space-y-6 border-b border-[var(--border-subtle)] pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/work"
            className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            ← Back to Work
          </Link>
          <span className="text-[var(--text-muted)] font-mono">/</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Active Architecture Spec</span>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            LIVING WORK IN PROGRESS · PLANNING & SPECIFICATION PHASE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Continuum: The AI-Native Virtual Film Studio OS
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            Treating feature films not as disconnected prompt strings, but as an interconnected, persistent, and verifiable <strong className="text-[var(--text-primary)]">Production State Graph</strong> in ClickHouse Cloud orchestrated by Vertex AI Agent Builder.
          </p>
        </div>

        {/* Honest Planning Phase Callout */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-[var(--text-secondary)] space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>Honest Project State: Active System Architecture</span>
          </div>
          <p className="leading-relaxed">
            Continuum is currently an <strong>in-progress architectural design</strong> for the Google Cloud & ClickHouse Blockbuster Hackathon. It is presented here with complete transparency as an open systems engineering design problem rather than a shipped binary.
          </p>
        </div>
      </section>

      {/* 2. RECENT DATED CHANGELOG */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Living Architecture Changelog (Truthful Frontmatter)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {changelog.map((entry) => (
            <div
              key={entry.version}
              className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  {entry.version}
                </span>
                <span className="text-[var(--text-muted)]">{entry.date}</span>
              </div>
              <h4 className="font-semibold text-xs text-[var(--text-primary)]">{entry.title}</h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{entry.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE SYSTEM ARCHITECTURE SPECIFICATION */}
      <section className="editorial-prose space-y-8 pt-6 border-t border-[var(--border-subtle)]">
        <div>
          <h2>1. The Problem: Communication Decay & Reshoot Costs in Film</h2>
          <p>
            In the generative AI landscape, writing prompt-to-video wrappers produces fleeting novelties. Real filmmaking is a multi-million-dollar coordination system involving hundreds of specialized crafts—screenwriters, line producers, directors of photography, costume supervisors, gaffers, and actors.
          </p>
          <p>
            When a single creative directive changes on set (e.g., moving Scene 4 from a daytime park to a night warehouse), communication decay across departments causes costly reshoots, physical continuity blunders, and blown budgets.
          </p>
        </div>

        <div>
          <h2>2. The Determinism Wall in Continuum: Invalidation vs Blind Regeneration</h2>
          <blockquote>
            When one scene parameter mutates, you do not throw away the movie and regenerate everything from scratch. You compute a bounded invalidation traversal and re-run only the affected dependency subgraph.
          </blockquote>
          <p>
            Continuum treats the entire film as a <strong>Directed Cyclic Multigraph</strong> stored in ClickHouse:
          </p>
          <ul>
            <li>
              <strong>Nodes:</strong> Story Beats, Screenplay Scenes, Characters, Props, Locations, Shots, Call Sheets, and Budget Line Items.
            </li>
            <li>
              <strong>Edges:</strong> Temporal sequence, physical containment, character presence, wardrobe requirements, and budget allocations.
            </li>
            <li>
              <strong>Event Sourcing:</strong> Every human directive, agent proposal, review sign-off, and state mutation is logged as an immutable event in ClickHouse via <code>mcp-clickhouse</code>.
            </li>
          </ul>
        </div>

        <div>
          <h2>3. Bi-Directional Cascade with Fixed-Point Convergence</h2>
          <p>
            A state mutation initiates an epoch-based invalidation traversal:
          </p>
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] font-mono text-xs text-[var(--text-secondary)] space-y-1.5">
            <div>1. Mutation applied: Scene 4.time_of_day = &quot;NIGHT&quot; (content_hash updated)</div>
            <div>2. Forward Cascade: Lighting department work orders &amp; call sheet pickup times flagged DIRTY</div>
            <div>3. Backward Cascade: Budget line item for night-differential labor rates recalculated</div>
            <div>4. Differential Pruning: Unaffected branches (Scenes 1-3, sound design) skipped</div>
            <div>5. Fixed-Point Convergence: Traversal terminates when hash state stabilizes</div>
          </div>
        </div>

        <div>
          <h2>4. Role-Filtered Portals (Zero Noise)</h2>
          <p>
            Instead of dumping raw graph databases onto crew members, Continuum projects tailored slices:
          </p>
          <ul>
            <li><strong>Producer Portal:</strong> Real-time budget burn rate, location permit critical paths, union overtime alerts.</li>
            <li><strong>Director Portal:</strong> Mood boards, camera blocking, shot coverage checklists, and scene pacing curves.</li>
            <li><strong>Actor Portal:</strong> Personal call sheets, exact dialogue line revisions, and wardrobe continuity requirements.</li>
            <li><strong>Craft Portals:</strong> Isolated, checkable work orders for Costume, Sound, Stunts, and Lighting.</li>
          </ul>
        </div>

        <div>
          <h2>5. Technology Stack & Partner Strategy</h2>
          <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)] not-prose">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[10px] text-[var(--text-muted)]">
                  <th className="p-2.5">Layer</th>
                  <th className="p-2.5">Technology</th>
                  <th className="p-2.5">Architectural Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                <tr>
                  <td className="p-2.5 font-bold text-[var(--text-primary)]">Agent Orchestration</td>
                  <td className="p-2.5">Google Cloud Agent Builder (ADK) + Gemini</td>
                  <td className="p-2.5">Multi-agent negotiation, screenplay parsing, and role dispatch</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[var(--text-primary)]">State Ledger</td>
                  <td className="p-2.5">ClickHouse Cloud + ClickHouse MCP</td>
                  <td className="p-2.5">Immutable event stream, node/edge state, and graph vector search</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[var(--text-primary)]">Graph Visualizer</td>
                  <td className="p-2.5">React Flow / @xyflow/react</td>
                  <td className="p-2.5">Interactive production graph canvas and diff viewer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
