import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { WRITEUPS } from '@/content/scratchpad';
import { useSEO } from '@/hooks/useSEO';
import { useViewTracking } from '@/hooks/useViewTracking';
import { CommentThread } from '@/components/CommentThread';
import { Tag } from '@/components/Tag';
import { accentFor, tint } from '@/lib/palette';

export default function ScratchpadEntry() {
  const { slug } = useParams<{ slug: string }>();
  const index = WRITEUPS.findIndex((w) => w.slug === slug);
  const entry = index >= 0 ? WRITEUPS[index] : undefined;
  const prev = index > 0 ? WRITEUPS[index - 1] : undefined;
  const next = index >= 0 && index < WRITEUPS.length - 1 ? WRITEUPS[index + 1] : undefined;
  useViewTracking('scratchpad', slug ?? ''); // still records the view; no longer displayed

  useSEO({
    title: entry ? entry.title : 'Scratchpad',
    description: entry ? entry.dek : 'Nothing here by that name.',
    path: `/scratchpad/${slug ?? ''}`,
  });

  if (!entry) {
    return (
      <div>
        <Link to="/scratchpad" className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mb-4">
          <ChevronLeft size={12} />
          Scratchpad
        </Link>
        <p className="text-dim text-xs">Nothing here by that name.</p>
      </div>
    );
  }

  const accent = accentFor(entry.slug);

  return (
    <div className="pb-12" style={tint(accent)}>
      <Link to="/scratchpad" className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mb-4">
        <ChevronLeft size={12} />
        Scratchpad
      </Link>

      <div>
        <h1 className="font-title text-heading text-[2rem] leading-none pt-1 mb-2.5">{entry.title}</h1>

        <div className="flex items-center gap-x-3 gap-y-2 pb-3.5 border-b border-border mb-5 flex-wrap">
          <span className="font-dot text-(--c) text-[11px]">{entry.date}</span>
          <span className="font-dot text-dim text-[11px]">{entry.readTime}</span>
          {entry.tags.map((t) => (
            <Tag key={t} tag={t} />
          ))}
          <span className="flex-1" />
        </div>

        {entry.body.map((p, i) => (
          <p key={i} className="text-sm text-body leading-relaxed mb-4">
            {p}
          </p>
        ))}

        <CommentThread targetType="scratchpad" targetId={entry.slug} accent={accent} />
      </div>

      <div className="flex flex-col xs:flex-row gap-3 pt-4 border-t border-border">
        {prev ? (
          <Link
            to={`/scratchpad/${prev.slug}`}
            className="tile hover:border-tile-hover flex-1 min-w-0 px-3.5 py-2.5"
          >
            <div className="font-dot text-dim text-[10px] uppercase tracking-widest mb-1">previous</div>
            <div className="font-title text-heading text-[1.1rem] leading-none">{prev.title}</div>
          </Link>
        ) : (
          <div className="flex-1 min-w-0 rounded-[18px] border border-dashed border-border px-3.5 py-2.5">
            <div className="font-dot text-dim text-[10px] uppercase tracking-widest mb-1">previous</div>
            <div className="text-dim text-xs leading-snug">nothing older yet</div>
          </div>
        )}
        {next ? (
          <Link
            to={`/scratchpad/${next.slug}`}
            className="tile hover:border-tile-hover flex-1 min-w-0 px-3.5 py-2.5"
          >
            <div className="font-dot text-dim text-[10px] uppercase tracking-widest mb-1">next</div>
            <div className="font-title text-heading text-[1.1rem] leading-none">{next.title}</div>
          </Link>
        ) : (
          <div className="flex-1 min-w-0 rounded-[18px] border border-dashed border-border px-3.5 py-2.5">
            <div className="font-dot text-dim text-[10px] uppercase tracking-widest mb-1">next</div>
            <div className="text-dim text-xs leading-snug">Nothing newer yet</div>
          </div>
        )}
      </div>

      <Link to="/scratchpad" className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mt-4">
        <ChevronLeft size={12} />
        Scratchpad
      </Link>
    </div>
  );
}
