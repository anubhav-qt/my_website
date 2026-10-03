import { Link } from 'react-router-dom';
import { PROJECTS, liveSite } from '@/content/projects';
import { LiveSiteLink } from '@/components/LiveSiteLink';
import { FEATURED_IDS } from '@/content/site';
import { projectAccent, tint } from '@/lib/palette';

const FEATURED = FEATURED_IDS.map((id) => PROJECTS.find((p) => p.id === id)!);

// No metrics or tech badges here on purpose. A number or a badge wall with
// nothing next to it explaining what it means reads as noise to someone who
// has never heard of the project, which is exactly who the home page is for.
// The deep description, metrics, and tech stack all live on /projects.
export function FeaturedProjects() {
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
        <span className="font-dot text-dim text-[11px] uppercase tracking-widest shrink-0">Featured</span>
        <span className="hidden sm:block flex-1 border-t border-dashed border-border min-w-[20px]" />
      </div>

      <div className="flex flex-col gap-3">
        {FEATURED.map((p) => {
          const site = liveSite(p);
          // Each card has one colour, the way a book does in Breader: the dot
          // by the name, and the edge on hover. The rest stays black and white.
          // The whole card opens the project's page: the name is the link, and
          // its after: box stretches over the card. Only the live site sits above it.
          return (
            <div key={p.id} style={tint(projectAccent(p.id))} className="tile relative hover:border-(--c)/50 px-4 py-3.5">
              <span className="font-dot text-dim text-[10px] uppercase tracking-wider">{p.category}</span>
              {/* When the row runs out of width the site wraps under the name, still on the right. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1">
                <Link
                  to={`/projects/${p.id}`}
                  className="font-title text-heading text-[1.55rem] leading-none after:absolute after:inset-0 after:rounded-[18px]"
                >
                  <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-(--c) mr-2 align-middle -translate-y-[0.12em]" />
                  {p.title.split(':')[0]}
                </Link>
                {site && <LiveSiteLink site={site} />}
              </div>

              {/* The card's copy lives on the project (homeCard), so it gets archived with it. */}
              <p className="text-xs text-body leading-relaxed mt-1.5 line-clamp-2">
                {p.homeCard?.summary ?? p.skimDescription}
              </p>

              {p.homeCard && (
                <ul className="flex flex-col gap-0.5 mt-1.5 text-xs text-dim leading-relaxed list-disc pl-4 marker:text-border">
                  {p.homeCard.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
