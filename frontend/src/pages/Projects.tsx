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
import { projectAccent, tint } from '@/lib/palette';

// Featured project inline accordion.
function ProjectListItem({ p, isOpen, onToggleOpen }: { p: ProjectItem; isOpen: boolean; onToggleOpen: () => void }) {
  useViewTracking('project', p.id, isOpen); // still records the view; no longer displayed

  return (
    <li
      id={p.id}
      style={tint(projectAccent(p.id))}
      className={`tile relative scroll-mt-6 px-4 py-3.5 mb-3 cursor-pointer ${
        isOpen ? 'border-(--c)/50' : 'hover:border-tile-hover'
      }`}
      onClick={onToggleOpen}
    >
      <div className="relative flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
          <span className="font-title text-heading text-[1.35rem] leading-none">
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-(--c) mr-2 align-middle -translate-y-[0.12em]" />
            {p.title.split(':')[0]}
          </span>
          <span className="font-dot text-dim text-[10px] uppercase tracking-wider">{p.category}</span>
        </div>
        <div className="flex items-center gap-2.5">
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-dim hover:text-heading transition-colors p-1.5 -m-1.5"
              aria-label={`${p.title} on GitHub`}
            >
              <SiGithub size={12} />
            </a>
          )}
          {p.caseStudyDescription && (
            <Link
              to={`/projects/${p.id}`}
              onClick={(e) => e.stopPropagation()}
              className="btn group"
            >
              Case study
              <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <ChevronDown
            size={13}
            className={`transition-transform duration-150 ${isOpen ? 'rotate-180 text-(--c)' : 'text-dim'}`}
          />
        </div>
      </div>

      <p className="relative text-xs text-dim leading-relaxed mt-1.5">{p.skimDescription}</p>

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
                  className="text-heading font-semibold underline-offset-4 hover:underline"
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
          <CommentThread targetType="project" targetId={p.id} accent={projectAccent(p.id)} />
        </div>
      )}
    </li>
  );
}

// Everything else: title, one sentence below it, done. No expand, no page, no metrics.
function OtherProjectRow({ p }: { p: ProjectItem }) {
  return (
    <div id={p.id} style={tint(projectAccent(p.id))} className="py-2.5 scroll-mt-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-title text-heading text-[1.15rem] leading-none">
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-(--c) mr-2 align-middle -translate-y-[0.12em]" />
            {p.title.split(':')[0]}
          </span>
        </div>
        {p.repoUrl && (
          <a
            href={p.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim hover:text-heading transition-colors p-1 -m-1 shrink-0"
            aria-label={`${p.title} on GitHub`}
          >
            <SiGithub size={12} />
          </a>
        )}
      </div>
      <p className="text-xs text-dim leading-relaxed mt-1 pl-3.5">{p.skimDescription}</p>
    </div>
  );
}

export default function Projects() {
  useSEO({
    title: 'Projects',
    description: "What I've built: the PariBelle Ecosystem that runs my family's business, Breader, Spoin, and some smaller things.",
    path: '/projects',
  });

  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);

  const projects = PROJECTS;
  const [buildingId, setBuildingId] = useState<(typeof FEATURED_IDS)[number]>(FEATURED_IDS[0]);
  const building = CURRENTLY_MAKING[buildingId];

  // Every featured project expands inline. Everything else is a single static
  // line, no expand, no page.
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
        {/* Not shrink-0 like the other labels: it's too long for a 240px screen, so it wraps there. */}
        <span className="font-dot text-dim text-[11px] uppercase tracking-widest">Building / Upgrading / Maintaining</span>
        <span className="hidden sm:block flex-1 border-t border-dashed border-border min-w-[20px]" />
        {/* The same rounded-rectangle toggles as the scratchpad filters, one per home page featured project. */}
        <div role="tablist" aria-label="Featured projects" className="flex flex-wrap gap-1">
          {FEATURED_IDS.map((id) => {
            const isActive = buildingId === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                aria-controls="building-card"
                onClick={() => setBuildingId(id)}
                className={`font-dot text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors duration-200 cursor-pointer ${
                  isActive ? 'border-heading bg-heading text-bg' : 'border-tile text-dim hover:text-heading hover:border-tile-hover'
                }`}
              >
                {CURRENTLY_MAKING[id].title}
              </button>
            );
          })}
        </div>
      </div>
      <div
        id="building-card"
        role="tabpanel"
        style={tint(projectAccent(buildingId))}
        className="tile relative px-4 py-3.5 mb-10"
      >
        <p className="font-title text-heading text-[1.35rem] leading-none">{building.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          {building.progress !== undefined ? (
            <div className="flex items-center gap-1.5 w-28">
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-(--c)" style={{ width: `${building.progress}%` }} />
              </div>
              <span className="font-dot text-(--c) text-[11px] shrink-0">{building.progress}%</span>
            </div>
          ) : (
            building.status && <span className="font-dot text-(--c) text-[11px] leading-snug">{building.status}</span>
          )}
          {building.tags.map((t) => (
            <Link
              key={t.label}
              to={t.href}
              className="font-dot text-heading text-[11px] underline underline-offset-4 decoration-(--c) hover:opacity-70 transition-opacity"
            >
              {t.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-body leading-relaxed mt-1.5">
          {building.description}
          <span className="text-(--c)">{building.highlight}</span>
          {building.descriptionEnd}
        </p>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-dot text-dim text-[11px] uppercase tracking-widest shrink-0">Featured</span>
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
          <span className="font-dot text-dim text-[11px] uppercase tracking-widest shrink-0">Other Projects</span>
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
