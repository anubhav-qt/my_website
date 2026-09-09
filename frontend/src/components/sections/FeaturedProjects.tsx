import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { FEATURED_IDS } from '@/content/site';

const FEATURED = PROJECTS.find((p) => p.id === FEATURED_IDS[0])!;

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
            to={`/projects/${FEATURED.id}`}
            className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group"
          >
            Case study
            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Description: an excerpt of the project's own skimDescription paragraph,
            trimmed to fit two lines on this narrow card -- not separate copy. */}
        <p className="relative text-xs text-dim leading-relaxed mt-1 line-clamp-2">
          Spoin is a scrollable feed of cards with bite-sized knowledge, for topics you want to learn.
        </p>

        <ul className="relative flex flex-col gap-0.5 mt-1.5 text-xs text-dim leading-relaxed list-disc pl-4">
          <li>Built a custom fast RAG implementation "frog".</li>
          <li>All the cards are grounded with a manually curated corpus for each topic inside "the_spoin_universe".</li>
        </ul>
      </div>
    </div>
  );
}
