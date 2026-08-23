import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { WRITEUPS, MILDLY_INTERESTING_STUFF, RANDOM_IDEAS, LINKS, type CollapsibleEntry } from '@/content/scratchpad';

type Accent = 'amber' | 'gold' | 'sage' | 'clay';

const DOT: Record<Accent, string> = {
  amber: 'bg-amber',
  gold: 'bg-gold',
  sage: 'bg-sage',
  clay: 'bg-clay',
};

const TEXT: Record<Accent, string> = {
  amber: 'text-amber',
  gold: 'text-gold',
  sage: 'text-sage',
  clay: 'text-clay',
};

function SectionHeader({ color, label, count, latest }: { color: Accent; label: string; count: number; latest?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className={`w-1.5 h-1.5 shrink-0 ${DOT[color]}`} />
      <span className={`text-[11px] uppercase tracking-widest font-bold shrink-0 ${TEXT[color]}`}>{label}</span>
      <span className="flex-1 border-t border-dashed border-border" />
      <span className="text-dim text-[11px] shrink-0">
        {String(count).padStart(2, '0')}
        {latest ? ` · ${latest}` : ''}
      </span>
    </div>
  );
}

function CollapsibleList({ entries, accent }: { entries: CollapsibleEntry[]; accent: Accent }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-h-[184px] overflow-y-auto pr-1">
      {entries.map((entry) => {
        const isOpen = openId === entry.id;
        return (
          <div
            key={entry.id}
            className="border-b border-dashed border-border/60 py-1.5 cursor-pointer"
            onClick={() => setOpenId(isOpen ? null : entry.id)}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-dim text-[11px] w-[52px] shrink-0">{entry.date}</span>
              {isOpen ? (
                <ChevronDown size={10} className={`${TEXT[accent]} shrink-0 translate-y-px`} />
              ) : (
                <ChevronRight size={10} className="text-dim shrink-0 translate-y-px" />
              )}
              <span className={`text-xs font-semibold leading-relaxed lowercase ${TEXT[accent]}`}>{entry.title}</span>
            </div>
            {isOpen && (
              <p className="text-xs text-body/90 leading-relaxed mt-1.5 mb-1 pl-[71px]">{entry.body}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const SECTIONS: { key: string; color: Accent; label: string }[] = [
  { key: 'writeups', color: 'amber', label: 'writeups' },
  { key: 'mildly-interesting', color: 'gold', label: 'mildly interesting stuff' },
  { key: 'random-ideas', color: 'sage', label: 'random ideas' },
  { key: 'links', color: 'clay', label: 'links' },
];

export default function Scratchpad() {
  const isEmpty =
    WRITEUPS.length === 0 &&
    MILDLY_INTERESTING_STUFF.length === 0 &&
    RANDOM_IDEAS.length === 0 &&
    LINKS.length === 0;

  return (
    <div>
      <p className="text-xs opacity-75 mb-6">weird and non-weird stuff that came to my mind</p>

      {isEmpty ? (
        <>
          <div className="relative border-l-2 border-amber/35 bg-surface/45 px-4 py-3.5 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-dim text-xs">&gt;</span>
              <span className="text-heading text-sm font-bold">nothing here yet</span>
            </div>
            <p className="text-xs text-body/90 leading-relaxed mt-2">
              The pages that exist are the ones I've finished. This one starts filling up once I stop having a
              reason not to write.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-dim text-[11px] uppercase tracking-widest font-bold shrink-0">What lands here</span>
            <span className="flex-1 border-t border-dashed border-border" />
          </div>

          <div className="flex flex-col gap-2.5">
            {SECTIONS.map((s) => (
              <div key={s.key} className="flex items-baseline gap-3">
                <span className={`w-1.5 h-1.5 shrink-0 ${DOT[s.color]} -translate-y-0.5`} />
                <span className={`text-xs font-bold w-[132px] shrink-0 ${TEXT[s.color]}`}>{s.label}</span>
                <span className="flex-1" />
                <span className="text-dim text-[11px] shrink-0">00</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8">
          {WRITEUPS.length > 0 && (
            <div>
              <SectionHeader color="amber" label="writeups" count={WRITEUPS.length} latest={WRITEUPS[0]?.date} />
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
                {WRITEUPS.map((w) => (
                  <Link
                    key={w.id}
                    to={`/scratchpad/${w.slug}`}
                    className="w-[85vw] max-w-[352px] sm:w-[352px] shrink-0 snap-start flex flex-col border-l-2 border-amber/35 bg-surface/45 px-4 py-3.5 hover:border-amber/70 hover:bg-surface/60 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-heading text-sm font-bold leading-snug lowercase">{w.title}</span>
                      <span className="text-dim text-[11px] shrink-0">{w.date}</span>
                    </div>
                    <p className="text-xs text-dim leading-relaxed mt-1.5">{w.dek}</p>
                    <span className="flex-1 min-h-[13.5px]" />
                    <div className="flex items-center gap-2 pt-1.5 mt-2 border-t border-border/40">
                      {w.tags.map((t) => (
                        <span key={t} className="text-[10px] text-body/80 border border-border/70 bg-bg/40 px-1.5 py-0.5">
                          {t}
                        </span>
                      ))}
                      <span className="flex-1" />
                      <span className="text-dim text-[11px]">{w.readTime}</span>
                      <span className="text-amber text-xs font-bold">read &#8594;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {MILDLY_INTERESTING_STUFF.length > 0 && (
            <div>
              <SectionHeader
                color="gold"
                label="mildly interesting stuff"
                count={MILDLY_INTERESTING_STUFF.length}
                latest={MILDLY_INTERESTING_STUFF[0]?.date}
              />
              <CollapsibleList entries={MILDLY_INTERESTING_STUFF} accent="gold" />
            </div>
          )}

          {RANDOM_IDEAS.length > 0 && (
            <div>
              <SectionHeader color="sage" label="random ideas" count={RANDOM_IDEAS.length} latest={RANDOM_IDEAS[0]?.date} />
              <CollapsibleList entries={RANDOM_IDEAS} accent="sage" />
            </div>
          )}

          {LINKS.length > 0 && (
            <div>
              <SectionHeader color="clay" label="links" count={LINKS.length} latest={LINKS[0]?.date} />
              <div className="max-h-[192px] overflow-y-auto pr-1">
                {LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-dashed border-border/60 py-2 group"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-dim text-[11px] w-[52px] shrink-0">{l.date}</span>
                      <span className="text-clay text-xs font-semibold leading-relaxed group-hover:text-heading group-hover:underline underline-offset-4">
                        {l.title}
                      </span>
                      <ExternalLink size={11} className="text-dim shrink-0 translate-y-px" />
                      <span className="flex-1" />
                      <span className="text-dim text-[11px] shrink-0">{l.domain}</span>
                    </div>
                    <p className="text-[12.5px] text-body/85 leading-relaxed mt-0.5 pl-[71px]">{l.commentary}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
