import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { LOG_ENTRIES } from '@/content/log';
import { CURRENTLY_MAKING } from '@/content/site';
import { SpoinSimulator } from '../components/simulator/SpoinSimulator';

const DOT_COLORS = ['bg-amber', 'bg-sage', 'bg-rose'];
const LOG_VISIBLE_COUNT = 5;

export default function Projects() {
  const location = useLocation();
  const [simOpen, setSimOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [logExpanded, setLogExpanded] = useState(false);

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const visibleLog = logExpanded ? LOG_ENTRIES : LOG_ENTRIES.slice(0, LOG_VISIBLE_COUNT);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    if (rest.some((p) => p.id === id)) setMoreOpen(true);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-8">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-1.5">currently making</div>
        <div className="flex gap-3 items-start">
          <div className="w-32 h-[72px] shrink-0 border border-border bg-surface p-1 flex flex-col gap-1">
            <div className="h-1 bg-border overflow-hidden shrink-0">
              <div className="h-full w-2/3 bg-amber" />
            </div>
            <div className="flex flex-1 gap-1 min-h-0 items-stretch">
              <div className="aspect-square h-full shrink-0 border border-border flex items-center justify-center">
                <div className="w-11 h-11 rounded-full border-2 border-sage" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 bg-border" />
                <div className="flex-1 bg-border" />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-heading leading-snug">{CURRENTLY_MAKING.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {CURRENTLY_MAKING.tags.map((t) => (
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
              {CURRENTLY_MAKING.description}
              <span className="text-rose">{CURRENTLY_MAKING.highlight}</span>
              {CURRENTLY_MAKING.descriptionEnd}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-heading text-lg font-bold mb-4">Featured Work</h2>

        <ul className="space-y-3">
          {featured.map((p, i) => (
            <li key={p.id} id={p.id} className="flex gap-2.5 scroll-mt-6">
              <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${DOT_COLORS[i % DOT_COLORS.length]}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-heading font-bold text-sm">{p.title.split(':')[0]}</span>
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dim hover:text-amber transition-colors"
                      aria-label={`${p.title} on GitHub`}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="text-xs opacity-80 leading-relaxed mt-0.5">{p.skimDescription}</p>

                {p.id === 'spoin' && (
                  <div className="mt-2">
                    <button
                      onClick={() => setSimOpen((v) => !v)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-heading transition-colors"
                    >
                      {simOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>{simOpen ? 'hide the live simulator' : 'open the live simulator'}</span>
                    </button>
                    {simOpen && (
                      <div className="mt-3 -mx-1 rounded-lg overflow-hidden border border-border">
                        <SpoinSimulator />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-amber hover:text-heading transition-colors"
        >
          {moreOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <span>{moreOpen ? 'less' : 'more'}</span>
        </button>

        {moreOpen && (
          <ul className="mt-3 space-y-2 border-t border-border pt-3">
            {rest.map((p) => (
              <li key={p.id} id={p.id} className="flex items-center justify-between gap-2 text-xs scroll-mt-6">
                <span className="font-semibold">{p.title.split(':')[0]}</span>
                {p.repoUrl ? (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim hover:text-amber transition-colors inline-flex items-center gap-1"
                  >
                    <span>source</span>
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="text-dim">internal</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-heading text-lg font-bold mb-2">Log</h2>
        <p className="text-xs opacity-75 mb-4">I write architecture decisions down. Mostly about what broke.</p>

        <ul className="space-y-0.5">
          {visibleLog.map((entry) => (
            <li key={entry.id} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border/60">
              <span className="text-amber text-xs font-semibold truncate">
                ADR-{String(entry.num).padStart(4, '0')}: {entry.title}
              </span>
              <span className="text-dim text-xs shrink-0">{entry.date}</span>
            </li>
          ))}
        </ul>

        {LOG_ENTRIES.length > LOG_VISIBLE_COUNT && (
          <button
            onClick={() => setLogExpanded((v) => !v)}
            className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-amber hover:text-heading transition-colors"
          >
            {logExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <span>{logExpanded ? 'less' : `more (${LOG_ENTRIES.length - LOG_VISIBLE_COUNT})`}</span>
          </button>
        )}
      </section>
    </div>
  );
}
