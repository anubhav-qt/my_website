import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { PROJECTS, type ProjectItem } from '@/content/projects';
import { CURRENTLY_MAKING, FEATURED_IDS } from '@/content/site';
import { CommentThread } from '@/components/CommentThread';
import { ProjectDetailBody } from '@/components/ProjectDetailBody';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';

// Featured project inline accordion.
function ProjectListItem({ p, isOpen, onToggleOpen }: { p: ProjectItem; isOpen: boolean; onToggleOpen: () => void }) {
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
              <SiGithub size={12} />
            </a>
          )}
          {p.id === 'spoin' && (
            <Link
              to={`/projects/${p.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-amber text-xs font-bold hover:text-heading transition-colors group"
            >
              Case study
              <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
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
          <ProjectDetailBody p={p} />
          <CommentThread targetType="project" targetId={p.id} accent="amber" />
        </div>
      )}
    </li>
  );
}

// Everything else: title, one sentence below it, done. No expand, no page, no metrics.
function OtherProjectRow({ p }: { p: ProjectItem }) {
  return (
    <div id={p.id} className="py-2.5 scroll-mt-6">
      <div className="flex items-start justify-between gap-2">
        <span className="text-body text-xs font-bold">{p.title.split(':')[0]}</span>
        {p.repoUrl && (
          <a
            href={p.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim hover:text-amber transition-colors p-1 -m-1 shrink-0"
            aria-label={`${p.title} on GitHub`}
          >
            <SiGithub size={12} />
          </a>
        )}
      </div>
      <p className="text-xs text-dim leading-relaxed mt-0.5">{p.skimDescription}</p>
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

  // Every featured project expands inline (Spoin included). Everything else is
  // a single static line, no expand, no page.
  const featured = projects.filter((p) => p.featured);
  const nonFeatured = projects.filter((p) => !p.featured);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    if (featured.some((p) => p.id === id)) setOpenId(id);
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
          {featured.map((p) => (
            <ProjectListItem
              key={p.id}
              p={p}
              isOpen={openId === p.id}
              onToggleOpen={() => setOpenId(openId === p.id ? null : p.id)}
            />
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Other Projects</span>
          <span className="flex-1 border-t border-dashed border-border" />
        </div>

        <div className="divide-y divide-border/60">
          {nonFeatured.map((p) => (
            <OtherProjectRow key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
