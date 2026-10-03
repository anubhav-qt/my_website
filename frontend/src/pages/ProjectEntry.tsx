import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { PROJECTS } from '@/content/projects';
import { ProjectDetailBody } from '@/components/ProjectDetailBody';
import { CommentThread } from '@/components/CommentThread';
import { SpoinSimulator } from '@/components/simulator/SpoinSimulator';
import { SpoinGallery } from '@/components/SpoinGallery';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';
import { projectAccent, tint } from '@/lib/palette';

// Own page for a featured project, same shape as /scratchpad/:slug: a real
// route, but Nav's "projects" link stays the only, still-underlined nav item
// (see Nav.tsx's end: false).
export default function ProjectEntry() {
  const { id } = useParams<{ id: string }>();
  const p = PROJECTS.find((proj) => proj.id === id);
  const [simOpen, setSimOpen] = useState(false);
  useViewTracking('project', id ?? ''); // still records the view; no longer displayed

  useSEO({
    title: p ? p.title.split(':')[0] : 'Projects',
    description: p ? p.skimDescription : 'Nothing here by that name.',
    path: `/projects/${id ?? ''}`,
  });

  if (!p) {
    return (
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mb-4">
          <ChevronLeft size={12} />
          Projects
        </Link>
        <p className="text-dim text-xs">Nothing here by that name.</p>
      </div>
    );
  }

  return (
    <div className="pb-12" style={tint(projectAccent(p.id))}>
      <Link to="/projects" className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mb-4">
        <ChevronLeft size={12} />
        Projects
      </Link>

      <div>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-x-2.5 gap-y-1 flex-wrap">
            <h1 className="font-title text-heading text-[2rem] leading-none pt-1">
              <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-(--c) mr-2.5 align-middle -translate-y-[0.12em]" />
              {p.title.split(':')[0]}
            </h1>
            <span className="font-dot text-dim text-[10px] uppercase tracking-wider">{p.category}</span>
          </div>
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim hover:text-heading transition-colors p-1.5 -m-1.5"
              aria-label={`${p.title} on GitHub`}
            >
              <SiGithub size={13} />
            </a>
          )}
        </div>

        <p className="text-sm text-dim leading-relaxed mt-2 pb-3.5 border-b border-border mb-4">{p.skimDescription}</p>

        {p.team && (
          <p className="text-[11px] text-dim -mt-2 mb-3">
            {p.team.note}{' '}
            {p.team.collaborators.map((c, i) => (
              <span key={c.label}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
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

        {p.id === 'spoin' && <SpoinGallery />}

        <ProjectDetailBody p={p} isCaseStudy={true} />

        {p.id === 'spoin' && (
          <div className="mt-3 pt-3 border-t border-dashed border-border">
            <button
              onClick={() => setSimOpen((v) => !v)}
              className="btn"
            >
              {simOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span>{simOpen ? 'Hide the live load_balancer simulator' : 'Open the live load_balancer simulator'}</span>
            </button>
            {simOpen && (
              <>
                <p className="text-[11px] text-dim leading-relaxed mt-2.5">
                  The working of my custom load_balancer for concurrent free tier usage of api keys.
                </p>
                <div className="mt-2 -mx-1 rounded-[18px] overflow-hidden border border-tile">
                  <SpoinSimulator />
                </div>
              </>
            )}
            {/* SpoinTopics (live topics + suggest-a-topic) is archived for now, not deleted --
                the component still exists at components/SpoinTopics.tsx, just unmounted here. */}
          </div>
        )}

        <CommentThread targetType="project" targetId={p.id} accent={projectAccent(p.id)} />
      </div>
    </div>
  );
}
