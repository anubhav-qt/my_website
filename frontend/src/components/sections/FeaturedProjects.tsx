import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { FEATURED_IDS } from '@/content/site';

const FEATURED_PROJECTS = FEATURED_IDS.map((id) => PROJECTS.find((p) => p.id === id)!);

export function FeaturedProjects() {
  const [active, setActive] = useState(0);
  const project = FEATURED_PROJECTS[active];
  const [heroMetric, ...restMetrics] = project.metrics ?? [];

  return (
    <div className="relative">
      {/* Section label ------------- Spoin Continuum */}
      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Featured</span>
        <span className="flex-1 border-t border-dashed border-border" />
        <div className="flex gap-1.5 shrink-0">
          {FEATURED_PROJECTS.map((p, i) => {
            const isActive = active === i;
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                aria-label={p.title}
                aria-pressed={isActive}
                className={`
                  text-xs font-bold px-2.5 py-1 border transition-all duration-200 lowercase
                  ${isActive
                    ? 'border-amber/60 bg-amber/8 text-amber shadow-[0_0_12px_rgba(217,138,79,0.08)]'
                    : 'border-border text-dim hover:text-body hover:border-dim'}
                `}
              >
                {p.title.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main card */}
      <div className="relative border-l-2 border-amber/50 bg-surface/60 px-3.5 py-2.5">
        {/* Top glow accent */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(217,138,79,0.04) 0%, transparent 60%)',
          }}
        />

        {/* Project title row */}
        <div className="relative flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-heading font-bold text-sm lowercase">{project.title.split(':')[0]}</span>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim hover:text-amber transition-colors"
                aria-label={`${project.title} on GitHub`}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <Link
            to={`/projects#${project.id}`}
            className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group"
          >
            case study
            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Description */}
        <p className="relative text-xs text-dim leading-relaxed mt-1">{project.skimDescription}</p>

        {/* Hero metric — big terminal readout */}
        {heroMetric && (
          <div className="relative mt-2.5 pt-2 border-t border-dashed border-border/70">
            <div className="flex items-baseline gap-2.5">
              <span className="text-amber text-xl font-bold leading-none tracking-tight">
                {heroMetric.value}
              </span>
              <span className="text-dim text-[11px] uppercase tracking-widest font-semibold">
                {heroMetric.label}
              </span>
            </div>
            {heroMetric.detail && (
              <p className="text-dim text-[11px] mt-0.5 pl-0.5">{heroMetric.detail}</p>
            )}

            {/* Rest metrics as a scanline row */}
            {restMetrics.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 pt-1.5 border-t border-border/40">
                {restMetrics.map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-[10px] text-dim uppercase tracking-wide leading-tight">
                      {m.label}
                    </span>
                    <span className="text-body text-[12px] font-semibold leading-tight mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tech tags */}
        {project.tech.length > 0 && (
          <div className="relative flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 border border-border/70 text-body/80 bg-bg/40"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
