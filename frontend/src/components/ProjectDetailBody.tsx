import type { ProjectItem } from '@/content/projects';

// Shared between the inline Spoin accordion on /projects and the standalone
// /projects/:id page every other featured project gets. Same rendering,
// two call sites, so a metrics/audit layout change never has to be made twice.
export function ProjectDetailBody({ p }: { p: ProjectItem }) {
  const [heroMetric, ...restMetrics] = p.metrics ?? [];
  const paragraphs = Array.isArray(p.deepDescription) ? p.deepDescription : [p.deepDescription];

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`text-xs text-body/90 leading-relaxed ${i === 0 ? 'mt-2.5 pt-2.5 border-t border-dashed border-border/70' : 'mt-2'}`}
        >
          {paragraph}
        </p>
      ))}

      {heroMetric && (
        <div className="mt-2.5 pt-2 border-t border-dashed border-border/70">
          <div className="flex items-baseline gap-2.5">
            <span className="text-amber text-xl font-bold leading-none tracking-tight">{heroMetric.value}</span>
            <span className="text-dim text-[11px] uppercase tracking-widest font-semibold">{heroMetric.label}</span>
          </div>
          {heroMetric.detail && <p className="text-dim text-[11px] mt-0.5 pl-0.5">{heroMetric.detail}</p>}

          {restMetrics.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-5 gap-y-2 mt-2.5 pt-2 border-t border-border/40">
              {restMetrics.map((m) => (
                <div key={m.label} className="flex flex-col min-w-0">
                  <span className="text-[10px] text-dim uppercase tracking-wide leading-tight">{m.label}</span>
                  <span className="text-body text-[12px] font-semibold leading-tight mt-0.5">{m.value}</span>
                  <span className="text-dim text-[11px] leading-snug mt-0.5">{m.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {p.tech.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
          {p.tech.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 border border-border/70 text-body/80 bg-bg/40">
              {t}
            </span>
          ))}
        </div>
      )}

      {p.audit && (
        <div className="flex flex-col gap-2 sm:gap-1.5 mt-3 pt-2.5 border-t border-dashed border-border/70">
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 text-dim font-bold text-[10px] tracking-wide sm:pt-px">problem</span>
            <span className="text-body/90">{p.audit.problem}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 text-rose font-bold text-[10px] tracking-wide sm:pt-px">constraint</span>
            <span className="text-body/90">{p.audit.constraint}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 text-amber font-bold text-[10px] tracking-wide sm:pt-px">decision</span>
            <span className="text-body/90">{p.audit.decision}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2 text-[11.5px] leading-relaxed">
            <span className="sm:w-[74px] shrink-0 text-sage font-bold text-[10px] tracking-wide sm:pt-px">what broke</span>
            <span className="text-body/90">{p.audit.whatBroke}</span>
          </div>
        </div>
      )}
    </>
  );
}
