import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/content/projects';
import { SpoinSimulator } from '../simulator/SpoinSimulator';

const DOT_COLORS = ['bg-amber', 'bg-sage', 'bg-rose'];

export function Work() {
  const [simOpen, setSimOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="work" className="scroll-mt-16 mb-10">
      <h2 className="text-heading text-lg font-bold mb-4">Featured Work</h2>

      <ul className="space-y-3">
        {featured.map((p, i) => (
          <li key={p.id} className="flex gap-2.5">
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
            <li key={p.id} className="flex items-center justify-between gap-2 text-xs">
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
  );
}
