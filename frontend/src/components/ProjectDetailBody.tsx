import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import type { ProjectItem } from '@/content/projects';

// Shared between the inline Spoin accordion on /projects and the standalone
// /projects/:id page every other featured project gets. Same rendering,
// two call sites, so a metrics/audit layout change never has to be made twice.
// Both call sites set the project's colour as --c (lib/palette.ts).
export function ProjectDetailBody({ p, isCaseStudy = false }: { p: ProjectItem; isCaseStudy?: boolean }) {
  const [heroMetric, ...restMetrics] = p.metrics ?? [];
  const textSource = isCaseStudy && p.caseStudyDescription ? p.caseStudyDescription : p.deepDescription;
  const paragraphs = Array.isArray(textSource) ? textSource : [textSource];

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`text-xs text-body leading-relaxed ${i === 0 ? 'mt-3 pt-3 border-t border-dashed border-border' : 'mt-2'}`}
        >
          {paragraph}
        </p>
      ))}

      {p.writeup && (
        <div className="mt-3">
          <Link to={p.writeup.href} className="btn group">
            {p.writeup.title}
            <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      {p.links && p.links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {p.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-dot text-heading text-[12px] underline underline-offset-4 decoration-(--c) hover:opacity-70 transition-opacity"
            >
              {l.label}
              <ArrowUpRight size={11} />
            </a>
          ))}
        </div>
      )}

      {heroMetric && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-border">
          {/* The headline number in big dots, like the volume numbers on Breader's cards. */}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-dot font-black text-(--c) text-[2rem] leading-none tracking-tight">{heroMetric.value}</span>
            <span className="font-dot text-dim text-[11px] uppercase tracking-widest">{heroMetric.label}</span>
          </div>
          {heroMetric.detail && <p className="text-dim text-[11px] mt-1 pl-0.5">{heroMetric.detail}</p>}

          {restMetrics.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-5 gap-y-2.5 mt-3 pt-2.5 border-t border-border">
              {restMetrics.map((m) => (
                <div key={m.label} className="flex flex-col min-w-0">
                  <span className="font-dot text-[10px] text-dim uppercase tracking-wide leading-tight">{m.label}</span>
                  <span className="text-body text-[12px] font-semibold leading-tight mt-0.5">{m.value}</span>
                  <span className="text-dim text-[11px] leading-snug mt-0.5">{m.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {p.tech.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-border">
          {p.tech.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}

      {p.audit && (
        <div className="flex flex-col gap-2 sm:gap-1.5 mt-3 pt-2.5 border-t border-dashed border-border">
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 font-dot text-dim text-[10px] tracking-wide sm:pt-0.5">problem</span>
            <span className="text-body">{p.audit.problem}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 font-dot text-rose text-[10px] tracking-wide sm:pt-0.5">constraint</span>
            <span className="text-body">{p.audit.constraint}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 font-dot text-ochre text-[10px] tracking-wide sm:pt-0.5">decision</span>
            <span className="text-body">{p.audit.decision}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 font-dot text-green text-[10px] tracking-wide sm:pt-0.5">what broke</span>
            <span className="text-body">{p.audit.whatBroke}</span>
          </div>
        </div>
      )}
    </>
  );
}
