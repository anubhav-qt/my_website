import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '@/content/projects';
import { CURRENTLY_MAKING, FEATURED_IDS } from '@/content/site';
import { SpoinSimulator } from '../components/simulator/SpoinSimulator';
import { SpoinTopics } from '@/components/SpoinTopics';
import { CommentThread } from '@/components/CommentThread';
import { ProjectDetailBody } from '@/components/ProjectDetailBody';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';

// Spoin only, now: the one project that keeps its full inline accordion on
// /projects itself instead of getting its own page.
function ProjectListItem({ p, isOpen, onToggleOpen }: { p: ProjectItem; isOpen: boolean; onToggleOpen: () => void }) {
  const [simOpen, setSimOpen] = useState(false);
  useViewTracking('project', p.id, isOpen); // still records the view; no longer displayed

  return (
    <li
      id={p.id}
      className={`relative scroll-mt-6 border-l-2 px-3.5 py-3 mb-3 cursor-pointer transition-colors duration-150 ${
        isOpen
          ? 'border-amber/70 bg-surface/60'
          : 'border-amber/30 bg-surface/45 hover:border-amber/70 hover:bg-surface/60'
      }`}
      onClick={onToggleOpen}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(217,138,79,0.04) 0%, transparent 60%)' }}
      />
      <div className="relative flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-heading font-bold text-sm">{p.title.split(':')[0]}</span>
          <span className="text-dim text-[10px] uppercase tracking-wide font-bold">{p.category}</span>
        </div>
        <div className="flex items-center gap-2.5">
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-dim hover:text-amber transition-colors p-1.5 -m-1.5"
              aria-label={`${p.title} on GitHub`}
            >
              <ExternalLink size={12} />
            </a>
          )}
          <ChevronDown
            size={13}
            className={`transition-transform duration-150 ${isOpen ? 'rotate-180 text-amber' : 'text-dim'}`}
          />
        </div>
      </div>

      <p className="relative text-xs text-dim leading-relaxed mt-1">{p.skimDescription}</p>

      {p.team && (
        <p className="relative text-[11px] text-dim mt-1">
          {p.team.note}{' '}
          {p.team.collaborators.map((c, i) => (
            <span key={c.label}>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-amber font-semibold hover:text-heading transition-colors"
                >
                  {c.label}
                </a>
              ) : (
                <span className="text-body font-semibold">{c.label}</span>
              )}
              {i < p.team!.collaborators.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}

      {isOpen && (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {p.id === 'spoin' && (
            <img
              src="/projects/spoin/feed.jpg"
              alt="Spoin's feed, a grounded card with its image source credited underneath"
              className="w-full border border-border/70 mb-2.5"
              loading="lazy"
            />
          )}
          <ProjectDetailBody p={p} />

          {p.id === 'spoin' && (
            <div className="mt-3 pt-2.5 border-t border-dashed border-border/70">
              <button
                onClick={() => setSimOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-heading transition-colors"
              >
                {simOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                <span>{simOpen ? 'Hide the live generation pipeline simulator' : 'Open the live generation pipeline simulator'}</span>
              </button>
              {simOpen && (
                <>
                  <p className="text-[11px] text-dim leading-relaxed mt-2.5">
                    This is the quota governor as it ran during the free-tier Gemini era, when the constraint
                    was 33 stingy API keys rather than a corpus. The win then wasn't a bigger model, it was
                    squeezing 218 cards/min out of a 2D key x model quota grid (ADR-0028) with fallback ladders
                    and per-cell serialization (ADR-0040), instead of blocking on one key at a time. Generation
                    has since moved to Mistral, so read this as history.
                  </p>
                  <div className="mt-2 -mx-1 rounded-lg overflow-hidden border border-border">
                    <SpoinSimulator />
                  </div>
                </>
              )}
              <SpoinTopics />
            </div>
          )}

          <CommentThread targetType="project" targetId={p.id} accent="amber" />
        </div>
      )}
    </li>
  );
}

// A featured project other than Spoin: one line, a link to its own page. The deep
// description, metrics, and audit still exist in the data, they just render on
// /projects/:id now instead of expanding inline here.
function FeaturedProjectRow({ p }: { p: ProjectItem }) {
  return (
    <li id={p.id} className="relative scroll-mt-6 border-l-2 border-amber/50 bg-surface/60 px-3.5 py-3 mb-3">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(217,138,79,0.04) 0%, transparent 60%)' }}
      />
      <div className="relative flex items-baseline justify-between gap-2 flex-wrap">
        <span className="text-heading font-bold text-sm">{p.title.split(':')[0]}</span>
        <Link
          to={`/projects/${p.id}`}
          className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group shrink-0"
        >
          Read the case study
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <p className="relative text-xs text-dim leading-relaxed mt-1">{p.skimDescription}</p>
      {p.tech.length > 0 && (
        <div className="relative flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
          {p.tech.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 border border-border/70 text-body/80 bg-bg/40">
              {t}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

// Everything else: title, one sentence, done. No expand, no page, no metrics.
function OtherProjectRow({ p }: { p: ProjectItem }) {
  return (
    <div id={p.id} className="flex items-baseline gap-3 py-2.5 border-t border-border/60 flex-wrap scroll-mt-6">
      <span className="text-body text-xs font-bold shrink-0">{p.title.split(':')[0]}</span>
      <span className="flex-1 min-w-[140px] text-xs text-dim leading-relaxed">{p.skimDescription}</span>
      {p.repoUrl && (
        <a
          href={p.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim hover:text-amber transition-colors p-1 -m-1 shrink-0"
          aria-label={`${p.title} on GitHub`}
        >
          <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

export default function Projects() {
  useSEO({
    title: 'Projects',
    description: 'Case studies and a runnable simulator, from Spoin, a retrieval-grounded card factory, down to smaller things I have shipped.',
    path: '/projects',
  });

  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);

  const projects = PROJECTS.filter((p) => p.id !== 'secondary-screen');
  const building = CURRENTLY_MAKING[FEATURED_IDS[0]];

  // Spoin keeps its original inline card (audit already dropped in the data itself).
  // The other featured projects get their own page and a compact link-out row here.
  // Everything else is a single line, no expand, no page.
  const otherFeatured = projects.filter((p) => p.featured && p.id !== 'spoin');
  const nonFeatured = projects.filter((p) => !p.featured);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    // Only Spoin still has anything to open inline; every other id (including
    // one that moved to /projects/:id) just needs the scroll.
    if (id === 'spoin') setOpenId('spoin');
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pb-12">
      <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Currently Building</span>
        <span className="hidden sm:block flex-1 border-t border-dashed border-border min-w-[20px]" />
      </div>
      <div className="relative flex flex-col sm:flex-row gap-3 sm:items-center border-l-2 border-amber/50 bg-surface/60 px-3.5 py-3 mb-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(217,138,79,0.05) 0%, transparent 60%)' }}
        />
        <div className="w-24 sm:w-32 shrink-0 flex flex-col gap-1.5">
          <div className="aspect-video border border-border bg-bg/40 p-1 flex gap-1 items-stretch">
            <div className="aspect-square h-full shrink-0 border border-border flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-sage" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex-1 bg-border" />
              <div className="flex-1 bg-border" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-border overflow-hidden">
              <div className="h-full bg-amber" style={{ width: `${building.progress}%` }} />
            </div>
            <span className="text-amber text-[11px] font-bold shrink-0">{building.progress}%</span>
          </div>
        </div>
        <div className="relative min-w-0">
          <p className="text-sm font-bold text-heading leading-snug">{building.title}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
            {building.tags.map((t) => (
              <Link
                key={t.label}
                to={t.href}
                className="text-amber text-xs font-bold underline underline-offset-4 hover:text-heading transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
          <p className="text-xs opacity-80 leading-relaxed mt-1.5">
            {building.description}
            <span className="text-rose">{building.highlight}</span>
            {building.descriptionEnd}
          </p>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Featured</span>
          <span className="flex-1 border-t border-dashed border-border" />
        </div>

        <ul>
          <ProjectListItem
            key="spoin"
            p={projects.find((p) => p.id === 'spoin')!}
            isOpen={openId === 'spoin'}
            onToggleOpen={() => setOpenId(openId === 'spoin' ? null : 'spoin')}
          />
          {otherFeatured.map((p) => (
            <FeaturedProjectRow key={p.id} p={p} />
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Other Projects</span>
          <span className="flex-1 border-t border-dashed border-border" />
        </div>

        <div>
          {nonFeatured.map((p) => (
            <OtherProjectRow key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
