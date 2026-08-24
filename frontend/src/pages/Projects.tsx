import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { CURRENTLY_MAKING, FEATURED_IDS } from '@/content/site';
import { SpoinSimulator } from '../components/simulator/SpoinSimulator';
import { useSEO } from '@/hooks/useSEO';

export default function Projects() {
  useSEO({
    title: 'Projects',
    description: 'Case studies and a runnable simulator: Spoin, a CQRS pipeline and quota governor, and Continuum, a film studio continuity OS.',
    path: '/projects',
  });

  const location = useLocation();
  const [simOpen, setSimOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [buildingIdx, setBuildingIdx] = useState(0);

  const projects = PROJECTS.filter((p) => p.id !== 'secondary-screen');
  const buildingId = FEATURED_IDS[buildingIdx];
  const building = CURRENTLY_MAKING[buildingId];

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    if (projects.some((p) => p.id === id)) setOpenId(id);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-3">
        <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Currently Building</span>
        <span className="flex-1 border-t border-dashed border-border" />
        <div className="flex gap-1.5 shrink-0">
          {FEATURED_IDS.map((id, i) => {
            const isActive = buildingIdx === i;
            const p = PROJECTS.find((proj) => proj.id === id);
            return (
              <button
                key={id}
                onClick={() => setBuildingIdx(i)}
                aria-label={p?.title}
                aria-pressed={isActive}
                className={`
                  text-xs font-bold px-2.5 py-1 border transition-all duration-200 lowercase
                  ${isActive
                    ? 'border-amber/60 bg-amber/8 text-amber shadow-[0_0_12px_rgba(217,138,79,0.08)]'
                    : 'border-border text-dim hover:text-body hover:border-dim'}
                `}
              >
                {p?.title.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative flex gap-3 items-center border-l-2 border-amber/50 bg-surface/60 px-3.5 py-3 mb-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(217,138,79,0.05) 0%, transparent 60%)' }}
        />
        <div className="w-32 shrink-0 flex flex-col gap-1.5">
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
          <p className="text-sm font-bold text-heading leading-snug lowercase">{building.title}</p>
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
          <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">Projects</span>
          <span className="flex-1 border-t border-dashed border-border" />
        </div>

        <ul>
          {projects.map((p) => {
            const isOpen = openId === p.id;
            const [heroMetric, ...restMetrics] = p.metrics ?? [];
            return (
              <li
                key={p.id}
                id={p.id}
                className={`relative scroll-mt-6 border-l-2 px-3.5 py-3 mb-3 cursor-pointer transition-colors duration-150 ${
                  isOpen
                    ? 'border-amber/70 bg-surface/60'
                    : 'border-amber/30 bg-surface/45 hover:border-amber/70 hover:bg-surface/60'
                }`}
                onClick={() => setOpenId(isOpen ? null : p.id)}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(217,138,79,0.04) 0%, transparent 60%)' }}
                />
                <div className="relative flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-heading font-bold text-sm lowercase">{p.title.split(':')[0]}</span>
                    <span className="text-dim text-[10px] uppercase tracking-wide font-bold">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-dim hover:text-amber transition-colors"
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
                    <p className="text-xs text-body/90 leading-relaxed mt-2.5 pt-2.5 border-t border-dashed border-border/70">
                      {p.deepDescription}
                    </p>

                    {heroMetric && (
                      <div className="mt-2.5 pt-2 border-t border-dashed border-border/70">
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-amber text-xl font-bold leading-none tracking-tight">{heroMetric.value}</span>
                          <span className="text-dim text-[11px] uppercase tracking-widest font-semibold">{heroMetric.label}</span>
                        </div>
                        {heroMetric.detail && <p className="text-dim text-[11px] mt-0.5 pl-0.5">{heroMetric.detail}</p>}

                        {restMetrics.length > 0 && (
                          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 pt-1.5 border-t border-border/40">
                            {restMetrics.map((m) => (
                              <div key={m.label} className="flex flex-col">
                                <span className="text-[10px] text-dim uppercase tracking-wide leading-tight">{m.label}</span>
                                <span className="text-body text-[12px] font-semibold leading-tight mt-0.5">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
                      {p.tech.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 border border-border/70 text-body/80 bg-bg/40">
                          {t}
                        </span>
                      ))}
                    </div>

                    {p.audit && (
                      <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-dashed border-border/70">
                        <div className="flex gap-2 text-[11.5px] leading-relaxed">
                          <span className="w-[74px] shrink-0 text-dim font-bold text-[10px] tracking-wide pt-px">problem</span>
                          <span className="text-body/90">{p.audit.problem}</span>
                        </div>
                        <div className="flex gap-2 text-[11.5px] leading-relaxed">
                          <span className="w-[74px] shrink-0 text-rose font-bold text-[10px] tracking-wide pt-px">constraint</span>
                          <span className="text-body/90">{p.audit.constraint}</span>
                        </div>
                        <div className="flex gap-2 text-[11.5px] leading-relaxed">
                          <span className="w-[74px] shrink-0 text-amber font-bold text-[10px] tracking-wide pt-px">decision</span>
                          <span className="text-body/90">{p.audit.decision}</span>
                        </div>
                        <div className="flex gap-2 text-[11.5px] leading-relaxed">
                          <span className="w-[74px] shrink-0 text-sage font-bold text-[10px] tracking-wide pt-px">what broke</span>
                          <span className="text-body/90">{p.audit.whatBroke}</span>
                        </div>
                      </div>
                    )}

                    {p.id === 'spoin' && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-border/70">
                        <button
                          onClick={() => setSimOpen((v) => !v)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-heading transition-colors"
                        >
                          {simOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                          <span>{simOpen ? 'hide the live generation pipeline simulator' : 'open the live generation pipeline simulator'}</span>
                        </button>
                        {simOpen && (
                          <>
                            <p className="text-[11px] text-dim leading-relaxed mt-2.5">
                              Free-tier Gemini keys cap out fast, so the win here wasn't a bigger model, it was squeezing
                              135+ cards/min out of a 2D key x model quota grid (ADR-0028) with fallback ladders and
                              per-cell serialization (ADR-0040), instead of blocking on one key at a time.
                            </p>
                            <div className="mt-2 -mx-1 rounded-lg overflow-hidden border border-border">
                              <SpoinSimulator />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
