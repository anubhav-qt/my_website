import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { PROJECTS } from '@/content/projects';
import { FEATURED_IDS } from '@/content/site';

const FEATURED = FEATURED_IDS.map((id) => PROJECTS.find((p) => p.id === id)!);

// No metrics or tech badges here on purpose. A number or a badge wall with
// nothing next to it explaining what it means reads as noise to someone who
// has never heard of the project, which is exactly who the home page is for.
// The deep description, metrics, and tech stack all live on /projects.
export function FeaturedProjects() {
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2.5">
        <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Featured</span>
        <span className="hidden sm:block flex-1 border-t border-dashed border-border min-w-[20px]" />
      </div>

      <div className="flex flex-col gap-2.5">
        {FEATURED.map((p) => (
          <div key={p.id} className="relative border-l-2 border-amber/50 bg-surface/60 px-3.5 py-2.5">
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
                <span className="text-heading font-bold text-sm">{p.title.split(':')[0]}</span>
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim hover:text-amber transition-colors"
                    aria-label={`${p.title} on GitHub`}
                  >
                    <SiGithub size={12} />
                  </a>
                )}
              </div>
              <Link
                to={`/projects/${p.id}`}
                className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group"
              >
                {p.caseStudyDescription ? 'Case study' : 'Details'}
                <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* The card's copy lives on the project (homeCard), so it gets archived with it. */}
            <p className="relative text-xs text-dim leading-relaxed mt-1 line-clamp-2">
              {p.homeCard?.summary ?? p.skimDescription}
            </p>

            {p.homeCard && (
              <ul className="relative flex flex-col gap-0.5 mt-1.5 text-xs text-dim leading-relaxed list-disc pl-4">
                {p.homeCard.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
