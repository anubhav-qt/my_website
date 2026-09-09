import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { ProjectDetailBody } from '@/components/ProjectDetailBody';
import { CommentThread } from '@/components/CommentThread';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';

// Own page for a featured project, same shape as /scratchpad/:slug: a real
// route, but Nav's "projects" link stays the only, still-underlined nav item
// (see Nav.tsx's end: false). Currently used by every featured project except
// Spoin, which keeps its inline accordion on /projects itself.
export default function ProjectEntry() {
  const { id } = useParams<{ id: string }>();
  const p = PROJECTS.find((proj) => proj.id === id);
  useViewTracking('project', id ?? ''); // still records the view; no longer displayed

  useSEO({
    title: p ? p.title.split(':')[0] : 'Projects',
    description: p ? p.skimDescription : 'Nothing here by that name.',
    path: `/projects/${id ?? ''}`,
  });

  if (!p) {
    return (
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-dim text-xs hover:text-amber transition-colors mb-4">
          <ChevronLeft size={12} />
          Projects
        </Link>
        <p className="text-dim text-xs">Nothing here by that name.</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-dim text-xs hover:text-amber transition-colors mb-4">
        <ChevronLeft size={11} />
        Projects
      </Link>

      <div>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-heading text-xl font-bold leading-snug">{p.title.split(':')[0]}</h1>
            <span className="text-dim text-[10px] uppercase tracking-wide font-bold">{p.category}</span>
          </div>
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim hover:text-amber transition-colors p-1.5 -m-1.5"
              aria-label={`${p.title} on GitHub`}
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        <p className="text-sm text-dim leading-relaxed mt-1.5 pb-3 border-b-2 border-border mb-4">{p.skimDescription}</p>

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

        <ProjectDetailBody p={p} />

        <CommentThread targetType="project" targetId={p.id} accent="amber" />
      </div>
    </div>
  );
}
