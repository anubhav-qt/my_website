import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { FEATURED_IDS } from '@/content/site';

const FEATURED = PROJECTS.find((p) => p.id === FEATURED_IDS[0])!;

// No metrics here on purpose. A number with nothing next to it explaining what
// it means reads as noise to someone who has never heard of the project, which
// is exactly who the home page is for. Every metric lives on /projects, beside
// the deep description and the problem/constraint/decision it came out of.
export function FeaturedProjects() {
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2.5">
        <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Featured</span>
        <span className="hidden sm:block flex-1 border-t border-dashed border-border min-w-[20px]" />
      </div>

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
            <span className="text-heading font-bold text-sm">{FEATURED.title.split(':')[0]}</span>
            {FEATURED.repoUrl && (
              <a
                href={FEATURED.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim hover:text-amber transition-colors"
                aria-label={`${FEATURED.title} on GitHub`}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <Link
            to={`/projects#${FEATURED.id}`}
            className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group"
          >
            Case study
            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Description */}
        <p className="relative text-xs text-dim leading-relaxed mt-1">{FEATURED.skimDescription}</p>

        {/* Tech tags */}
        {FEATURED.tech.length > 0 && (
          <div className="relative flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
            {FEATURED.tech.map((t) => (
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
