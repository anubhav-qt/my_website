import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { WRITEUPS, MILDLY_INTERESTING_STUFF, RANDOM_IDEAS, LINKS, type CollapsibleEntry, type LinkEntry, type Audience } from '@/content/scratchpad';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';
import { useLikeTracking } from '@/hooks/useLikeTracking';
import { ContentMeta } from '@/components/ContentMeta';
import { CommentThread } from '@/components/CommentThread';

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

function CollapsibleRow({ entry, accent, isOpen, onToggleOpen }: { entry: CollapsibleEntry; accent: Accent; isOpen: boolean; onToggleOpen: () => void }) {
  const views = useViewTracking('scratchpad', entry.id, isOpen);
  const like = useLikeTracking('scratchpad', entry.id);

  return (
    <div className="border-b border-dashed border-border/60 py-1.5">
      <div className="flex items-baseline gap-2 cursor-pointer" onClick={onToggleOpen}>
        <span className="text-dim text-[11px] w-[78px] shrink-0">{entry.date}</span>
        {isOpen ? (
          <ChevronDown size={10} className={`${TEXT[accent]} shrink-0 translate-y-px`} />
        ) : (
          <ChevronRight size={10} className="text-dim shrink-0 translate-y-px" />
        )}
        <span className={`text-xs font-semibold leading-relaxed lowercase ${TEXT[accent]}`}>{entry.title}</span>
        <span className="flex-1" />
        <ContentMeta views={views} liked={like.liked} likeCount={like.count} />
      </div>
      {isOpen && (
        <div className="pl-[97px] pr-1">
          <p className="text-xs text-body/90 leading-relaxed mt-1.5 mb-1">{entry.body}</p>
          <CommentThread targetType="scratchpad" targetId={entry.id} accent={accent} like={like} />
        </div>
      )}
    </div>
  );
}

function CollapsibleList({ entries, accent }: { entries: CollapsibleEntry[]; accent: Accent }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-h-none overflow-y-auto pr-1">
      {entries.map((entry) => (
        <CollapsibleRow
          key={entry.id}
          entry={entry}
          accent={accent}
          isOpen={openId === entry.id}
          onToggleOpen={() => setOpenId(openId === entry.id ? null : entry.id)}
        />
      ))}
    </div>
  );
}

function LinkRow({ link, isOpen, onToggleOpen }: { link: LinkEntry; isOpen: boolean; onToggleOpen: () => void }) {
  const views = useViewTracking('scratchpad', link.id, isOpen);
  const like = useLikeTracking('scratchpad', link.id);

  return (
    <div className="border-b border-dashed border-border/60 py-2">
      <div className="flex items-baseline gap-2 cursor-pointer group" onClick={onToggleOpen}>
        <span className="text-dim text-[11px] w-[78px] shrink-0">{link.date}</span>
        {isOpen ? (
          <ChevronDown size={10} className="text-clay shrink-0 translate-y-px" />
        ) : (
          <ChevronRight size={10} className="text-dim shrink-0 translate-y-px" />
        )}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-clay text-xs font-semibold leading-relaxed hover:text-heading hover:underline underline-offset-4"
        >
          {link.title}
        </a>
        <ExternalLink size={11} className="text-dim shrink-0 translate-y-px" />
        <span className="flex-1" />
        <span className="text-dim text-[11px] shrink-0">{link.domain}</span>
        <ContentMeta views={views} liked={like.liked} likeCount={like.count} />
      </div>
      <p className="text-[12.5px] text-body/85 leading-relaxed mt-0.5 pl-[97px]">{link.commentary}</p>
      {isOpen && (
        <div className="pl-[97px] pr-1">
          <CommentThread targetType="scratchpad" targetId={link.id} accent="clay" like={like} />
        </div>
      )}
    </div>
  );
}

const SECTIONS: { key: string; color: Accent; label: string }[] = [
  { key: 'writeups', color: 'amber', label: 'writeups' },
  { key: 'mildly-interesting', color: 'gold', label: 'mildly interesting stuff' },
  { key: 'random-ideas', color: 'sage', label: 'random ideas' },
  { key: 'links', color: 'clay', label: 'links' },
];

const FILTER_OPTIONS: { value: Audience; label: string }[] = [
  { value: 'technical', label: 'technical' },
  { value: 'non-technical', label: 'non-technical' },
];

// No "all" pill: none selected (or both selected) both mean "show
// everything". Only one selected narrows the list.
function AudienceFilterBar({ selected, onToggle }: { selected: Set<Audience>; onToggle: (v: Audience) => void }) {
  return (
    <div className="flex gap-1 shrink-0">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = selected.has(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            aria-pressed={isActive}
            className={`
              text-[11px] font-bold px-2.5 py-1 border transition-all duration-200 lowercase
              ${isActive
                ? 'border-amber/60 bg-amber/8 text-amber shadow-[0_0_12px_rgba(217,138,79,0.08)]'
                : 'border-border text-dim hover:text-body hover:border-dim'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Scratchpad() {
  useSEO({
    title: 'Scratchpad',
    description: 'Weird and non-weird stuff: writeups, half-formed ideas, and links worth remembering.',
    path: '/scratchpad',
  });

  const isEmpty =
    WRITEUPS.length === 0 &&
    MILDLY_INTERESTING_STUFF.length === 0 &&
    RANDOM_IDEAS.length === 0 &&
    LINKS.length === 0;

  const [openLinkId, setOpenLinkId] = useState<string | null>(null);
  const [selectedAudiences, setSelectedAudiences] = useState<Set<Audience>>(new Set());
  const toggleAudience = (v: Audience) =>
    setSelectedAudiences((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  const matches = (audience: Audience) => selectedAudiences.size === 0 || selectedAudiences.has(audience);

  const filteredWriteups = WRITEUPS.filter((w) => matches(w.audience));
  const filteredMildlyInteresting = MILDLY_INTERESTING_STUFF.filter((e) => matches(e.audience));
  const filteredRandomIdeas = RANDOM_IDEAS.filter((e) => matches(e.audience));
  const filteredLinks = LINKS.filter((l) => matches(l.audience));

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-xs opacity-75">weird and non-weird stuff that came to my mind</p>
        {!isEmpty && <AudienceFilterBar selected={selectedAudiences} onToggle={toggleAudience} />}
      </div>

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
          {filteredWriteups.length === 0 &&
            filteredMildlyInteresting.length === 0 &&
            filteredRandomIdeas.length === 0 &&
            filteredLinks.length === 0 && (
              <p className="text-dim text-xs italic">nothing matches that filter yet</p>
            )}

          {filteredWriteups.length > 0 && (
            <div>
              <SectionHeader color="amber" label="writeups" count={filteredWriteups.length} latest={filteredWriteups[0]?.date} />
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
                {filteredWriteups.map((w) => (
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

          {filteredMildlyInteresting.length > 0 && (
            <div>
              <SectionHeader
                color="gold"
                label="mildly interesting stuff"
                count={filteredMildlyInteresting.length}
                latest={filteredMildlyInteresting[0]?.date}
              />
              <CollapsibleList entries={filteredMildlyInteresting} accent="gold" />
            </div>
          )}

          {filteredRandomIdeas.length > 0 && (
            <div>
              <SectionHeader color="sage" label="random ideas" count={filteredRandomIdeas.length} latest={filteredRandomIdeas[0]?.date} />
              <CollapsibleList entries={filteredRandomIdeas} accent="sage" />
            </div>
          )}

          {filteredLinks.length > 0 && (
            <div>
              <SectionHeader color="clay" label="links" count={filteredLinks.length} latest={filteredLinks[0]?.date} />
              <div className="pr-1">
                {filteredLinks.map((l) => (
                  <LinkRow
                    key={l.id}
                    link={l}
                    isOpen={openLinkId === l.id}
                    onToggleOpen={() => setOpenLinkId(openLinkId === l.id ? null : l.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
