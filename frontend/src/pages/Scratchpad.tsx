import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { WRITEUPS, MILDLY_INTERESTING_STUFF, RANDOM_IDEAS, LINKS, type WriteupEntry, type CollapsibleEntry, type LinkEntry, type Audience } from '@/content/scratchpad';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';
import { CommentThread } from '@/components/CommentThread';
import { Tag } from '@/components/Tag';
import { accentFor, tint, type Accent } from '@/lib/palette';

function parseDateDMY(dateStr: string): number {
  const parts = dateStr.split(/[/.-]/).map(Number);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).getTime();
  }
  return new Date(dateStr).getTime() || 0;
}

function SectionHeader({ color, label, count, latest }: { color: Accent; label: string; count: number; latest?: string }) {
  return (
    <div style={tint(color)} className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-(--c)" />
      <span className="font-dot text-[11px] uppercase tracking-widest shrink-0 text-(--c)">{label}</span>
      <span className="flex-1 border-t border-dashed border-border min-w-[20px]" />
      <span className="font-dot text-dim text-[11px] shrink-0">
        {String(count).padStart(2, '0')}
        {latest ? ` · ${latest}` : ''}
      </span>
    </div>
  );
}

function WriteupCard({ w }: { w: WriteupEntry }) {
  useViewTracking('scratchpad', w.slug, false); // still records the view; no longer displayed

  return (
    <Link
      to={`/scratchpad/${w.slug}`}
      style={tint(accentFor(w.slug))}
      className="tile hover:border-(--c)/50 w-[85vw] max-w-[352px] sm:w-[352px] shrink-0 snap-start flex flex-col px-4 py-3.5 group"
    >
      <span className="font-dot text-(--c) text-[11px]">{w.date}</span>
      <span className="font-title text-heading text-[1.35rem] leading-none mt-1.5">{w.title}</span>
      <p className="text-xs text-dim leading-relaxed mt-2">{w.dek}</p>
      <span className="flex-1 min-h-[13.5px]" />
      <div className="flex items-end gap-2 pt-2.5 mt-2 border-t border-border">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {w.tags.map((t) => (
            <Tag key={t} tag={t} />
          ))}
        </div>
        <span className="btn shrink-0">
          Read
          <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function CollapsibleRow({ entry, accent, isOpen, onToggleOpen }: { entry: CollapsibleEntry; accent: Accent; isOpen: boolean; onToggleOpen: () => void }) {
  useViewTracking('scratchpad', entry.id, isOpen); // still records the view; no longer displayed

  return (
    <div data-row={entry.id} style={tint(accent)} className="border-b border-dashed border-border">
      <div data-row-head className="flex flex-wrap items-baseline gap-x-2 gap-y-1 cursor-pointer py-1.5" onClick={onToggleOpen}>
        <span className="font-dot text-dim text-[11px] w-[62px] sm:w-[78px] shrink-0">{entry.date}</span>
        {isOpen ? (
          <ChevronDown size={10} className="text-(--c) shrink-0 translate-y-px" />
        ) : (
          <ChevronRight size={10} className="text-dim shrink-0 translate-y-px" />
        )}
        <span className="text-xs font-semibold leading-relaxed text-(--c)">{entry.title}</span>
        <span className="flex-1" />
      </div>
      {isOpen && (
        <div className="pl-3 sm:pl-[97px] pr-1 pb-1.5">
          <p className="text-xs text-body leading-relaxed mb-1">{entry.body}</p>
          <CommentThread targetType="scratchpad" targetId={entry.id} accent={accent} />
        </div>
      )}
    </div>
  );
}

// Mildly interesting stuff, random ideas and links each show five entries and
// scroll inside for the rest. The box is sized to that section's own first five
// rows as they look closed, so links, which carry their commentary, get a
// taller box than the one-line sections. Only a row's data-row-head counts,
// never what opens under it, so opening an entry scrolls inside the box
// instead of resizing it.
const VISIBLE_ROWS = 5;

function FiveRowBox({ ids, openId, children }: { ids: string[]; openId: string | null; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  const fits = ids.length <= VISIBLE_ROWS;
  const key = ids.join(' ');

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box || fits) {
      setHeight(undefined);
      return;
    }
    const rows = Array.from(box.querySelectorAll<HTMLElement>('[data-row]')).slice(0, VISIBLE_ROWS);
    const measure = () => {
      // offsetHeight rounds each row to a whole pixel, which adds up to a
      // clipped last row, so this reads fractional heights instead. Above
      // 880px getBoundingClientRect reports zoomed pixels, so they're scaled
      // back into the unzoomed ones the height is set in.
      const zoom = box.getBoundingClientRect().width / box.offsetWidth || 1;
      const total = rows.reduce((sum, row) => {
        const head = row.querySelector<HTMLElement>('[data-row-head]')!;
        return sum + head.getBoundingClientRect().height / zoom + parseFloat(getComputedStyle(row).borderBottomWidth);
      }, 0);
      setHeight(Math.ceil(total));
    };
    measure();
    // Rows rewrap when the width changes, and again once the fonts land.
    const observer = new ResizeObserver(measure);
    rows.forEach((row) => observer.observe(row.querySelector('[data-row-head]')!));
    return () => observer.disconnect();
  }, [key, fits]);

  // An entry opened near the bottom would open out of sight, so bring it to the top.
  useEffect(() => {
    const box = ref.current;
    if (!box || fits || !openId) return;
    const row = box.querySelector<HTMLElement>(`[data-row="${openId}"]`);
    if (row) box.scrollTo({ top: row.offsetTop, behavior: 'smooth' });
  }, [openId, fits]);

  return (
    <div ref={ref} style={{ height }} className={`relative pr-1 ${fits ? '' : 'overflow-y-auto'}`}>
      {children}
    </div>
  );
}

function CollapsibleList({ entries, accent }: { entries: CollapsibleEntry[]; accent: Accent }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <FiveRowBox ids={entries.map((e) => e.id)} openId={openId}>
      {entries.map((entry) => (
        <CollapsibleRow
          key={entry.id}
          entry={entry}
          accent={accent}
          isOpen={openId === entry.id}
          onToggleOpen={() => setOpenId(openId === entry.id ? null : entry.id)}
        />
      ))}
    </FiveRowBox>
  );
}

function LinkRow({ link, isOpen, onToggleOpen }: { link: LinkEntry; isOpen: boolean; onToggleOpen: () => void }) {
  useViewTracking('scratchpad', link.id, isOpen); // still records the view; no longer displayed

  return (
    <div data-row={link.id} style={tint('sky')} className="border-b border-dashed border-border">
      <div data-row-head className="py-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 cursor-pointer group" onClick={onToggleOpen}>
          <span className="font-dot text-dim text-[11px] w-[62px] sm:w-[78px] shrink-0">{link.date}</span>
          {isOpen ? (
            <ChevronDown size={10} className="text-(--c) shrink-0 translate-y-px" />
          ) : (
            <ChevronRight size={10} className="text-dim shrink-0 translate-y-px" />
          )}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-(--c) text-xs font-semibold leading-relaxed hover:underline underline-offset-4"
          >
            {link.title}
          </a>
          <span className="flex-1" />
          <span className="font-dot text-dim text-[11px] shrink-0">{link.domain}</span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-dim hover:text-heading transition-colors shrink-0 p-1.5 -m-1.5"
            aria-label={`open ${link.title}`}
          >
            <ExternalLink size={11} className="translate-y-px" />
          </a>
        </div>
        <p className="text-[12.5px] text-body leading-relaxed mt-0.5 pl-3 sm:pl-[97px]">{link.commentary}</p>
      </div>
      {isOpen && (
        <div className="pl-3 sm:pl-[97px] pr-1 pb-2">
          <CommentThread targetType="scratchpad" targetId={link.id} accent="sky" />
        </div>
      )}
    </div>
  );
}

const SECTIONS: { key: string; color: Accent; label: string }[] = [
  { key: 'writeups', color: 'lilac', label: 'Writeups' },
  { key: 'mildly-interesting', color: 'ochre', label: 'Mildly Interesting Stuff' },
  { key: 'random-ideas', color: 'green', label: 'Random Ideas' },
  { key: 'links', color: 'sky', label: 'Links' },
];

const FILTER_OPTIONS: { value: Audience; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'non-technical', label: 'Non-Technical' },
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
              font-dot text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors duration-200
              ${isActive
                ? 'border-heading bg-heading text-bg'
                : 'border-tile text-dim hover:text-heading hover:border-tile-hover'}
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

  // Always sort writeups recent-first
  const filteredWriteups = WRITEUPS
    .filter((w) => matches(w.audience))
    .sort((a, b) => parseDateDMY(b.date) - parseDateDMY(a.date));

  const filteredMildlyInteresting = MILDLY_INTERESTING_STUFF.filter((e) => matches(e.audience));
  const filteredRandomIdeas = RANDOM_IDEAS.filter((e) => matches(e.audience));
  const filteredLinks = LINKS.filter((l) => matches(l.audience));

  return (
    <div className="pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Narrow screens skip the tagline and keep just the filters. */}
        <p className="hidden sm:block text-xs opacity-75">weird and non-weird stuff that came to my mind</p>
        {!isEmpty && <AudienceFilterBar selected={selectedAudiences} onToggle={toggleAudience} />}
      </div>

      {isEmpty ? (
        <>
          <div className="tile relative px-4 py-3.5 mb-6">
            <span className="font-title text-heading text-[1.35rem] leading-none">Nothing here yet</span>
            <p className="text-xs text-body leading-relaxed mt-2">
              The pages that exist are the ones I've finished. This one starts filling up once I stop having a
              reason not to write.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-dot text-dim text-[11px] uppercase tracking-widest shrink-0">What lands here</span>
            <span className="flex-1 border-t border-dashed border-border" />
          </div>

          <div className="flex flex-col gap-2.5">
            {SECTIONS.map((s) => (
              <div key={s.key} style={tint(s.color)} className="flex items-baseline gap-3">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-(--c) -translate-y-0.5" />
                <span className="text-xs font-bold w-[132px] shrink-0 text-(--c)">{s.label}</span>
                <span className="flex-1" />
                <span className="font-dot text-dim text-[11px] shrink-0">00</span>
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
              <SectionHeader color="lilac" label="writeups" count={filteredWriteups.length} latest={filteredWriteups[0]?.date} />
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
                {filteredWriteups.map((w) => (
                  <WriteupCard key={w.id} w={w} />
                ))}
              </div>
            </div>
          )}

          {filteredMildlyInteresting.length > 0 && (
            <div>
              <SectionHeader
                color="ochre"
                label="mildly interesting stuff"
                count={filteredMildlyInteresting.length}
                latest={filteredMildlyInteresting[0]?.date}
              />
              <CollapsibleList entries={filteredMildlyInteresting} accent="ochre" />
            </div>
          )}

          {filteredRandomIdeas.length > 0 && (
            <div>
              <SectionHeader color="green" label="random ideas" count={filteredRandomIdeas.length} latest={filteredRandomIdeas[0]?.date} />
              <CollapsibleList entries={filteredRandomIdeas} accent="green" />
            </div>
          )}

          {filteredLinks.length > 0 && (
            <div>
              <SectionHeader color="sky" label="links" count={filteredLinks.length} latest={filteredLinks[0]?.date} />
              <FiveRowBox ids={filteredLinks.map((l) => l.id)} openId={openLinkId}>
                {filteredLinks.map((l) => (
                  <LinkRow
                    key={l.id}
                    link={l}
                    isOpen={openLinkId === l.id}
                    onToggleOpen={() => setOpenLinkId(openLinkId === l.id ? null : l.id)}
                  />
                ))}
              </FiveRowBox>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
