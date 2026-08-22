import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { PROJECTS, ProjectItem } from '@/content/projects';
import { WallGlyph } from '@/components/icons/WallGlyph';
import { TechIconRow } from '@/components/TechIcon';

export const metadata: Metadata = {
  title: 'Engineering Work & 4-Beat Audits',
  description: 'Rigorous architectural audits of systems: Problem, Constraint, Decision (The Wall), and What Broke in production.',
};

function FourBeatCard({ project }: { project: ProjectItem }) {
  const audit = project.audit;
  if (!audit) return null;

  return (
    <article
      id={project.id}
      className="p-5 sm:p-6 rounded-xl border border-[var(--border-strong)] space-y-4 scroll-mt-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {project.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{project.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {project.caseStudyHref && (
            <Link href={project.caseStudyHref} className="text-xs text-[var(--accent)] font-medium hover:underline flex items-center gap-1">
              <span>Case study</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {project.secondaryRepoUrl && (
            <a href={project.secondaryRepoUrl.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
              <span>{project.secondaryRepoUrl.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Context: problem + constraint collapsed to one line */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        <span className="text-[var(--text-muted)]">Context — </span>
        {audit.problem} {audit.constraint}
      </p>

      {/* Decision: the dominant beat */}
      <div className="p-4 rounded-lg bg-[var(--accent-subtle)] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent)] uppercase tracking-wide">
          <WallGlyph size={14} />
          <span>The decision</span>
        </div>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{audit.decision}</p>
      </div>

      {/* What broke */}
      <div className="p-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-subtle)] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--danger)] uppercase tracking-wide">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>What broke &amp; the fix</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{audit.whatBroke}</p>
      </div>

      <div className="pt-1 flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)]">Stack</span>
        <TechIconRow names={project.tech} size={16} />
      </div>
    </article>
  );
}

export default function WorkPage() {
  const projectsWithAudit = PROJECTS.filter((p) => p.audit);

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="space-y-2 border-b border-[var(--border-subtle)] pb-6">
        <h1>Engineering work &amp; systems</h1>
        <p className="text-lede text-[var(--text-secondary)] max-w-2xl">
          Every project: the problem, the constraint, the deterministic decision, and what broke in production.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/work/spoin"
          className="p-5 rounded-xl border border-[var(--border-strong)] hover:border-[var(--accent)] transition-colors group space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-[var(--success)] font-medium">
            <span>Flagship case study</span>
            <span>5,004 cards</span>
          </div>
          <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] flex items-center justify-between">
            <span>Spoin: CQRS pipeline &amp; quota governor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">LangGraph generation factory, 2D quota grid, live simulator.</p>
        </Link>

        <Link
          href="/work/continuum"
          className="p-5 rounded-xl border border-[var(--border-strong)] hover:border-[var(--accent)] transition-colors group space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-[var(--warning)] font-medium">
            <span>Architecture spec</span>
            <span>ClickHouse MCP</span>
          </div>
          <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] flex items-center justify-between">
            <span>Continuum: film studio continuity OS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">State multigraph with bi-directional cascade invalidation.</p>
        </Link>
      </div>

      <div className="space-y-6">
        {projectsWithAudit.map((project) => (
          <FourBeatCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
