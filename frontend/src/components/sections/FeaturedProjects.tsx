import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { PROJECTS } from '@/content/projects';
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
        {FEATURED.map((p) => (
          // Each card has one colour, the way a book does in Breader: the big
          // dotted letter, and the edge on hover. The rest stays black and white.
          <div key={p.id} style={tint(projectAccent(p.id))} className="tile hover:border-(--c)/50 flex gap-4 px-4 py-3.5">
            {/* Below 380px the letter would squeeze the text, so it goes. */}
            <span
              aria-hidden="true"
              className="hidden xs:block font-dot font-black text-[3.4rem] leading-[0.82] tracking-tight shrink-0 pt-1 text-(--c)"
            >
              {p.title.charAt(0)}
            </span>

            <div className="min-w-0 flex-1">
              <span className="font-dot text-dim text-[10px] uppercase tracking-wider">{p.category}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-title text-heading text-[1.55rem] leading-none">{p.title.split(':')[0]}</span>
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim hover:text-heading transition-colors"
                    aria-label={`${p.title} on GitHub`}
                  >
                    <SiGithub size={12} />
                  </a>
                )}
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

              <div className="flex justify-end mt-2.5">
                <Link to={`/projects/${p.id}`} className="btn group">
                  {p.caseStudyDescription ? 'Case study' : 'Details'}
                  <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
