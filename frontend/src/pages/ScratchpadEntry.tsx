import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { WRITEUPS } from '@/content/scratchpad';

export default function ScratchpadEntry() {
  const { slug } = useParams<{ slug: string }>();
  const index = WRITEUPS.findIndex((w) => w.slug === slug);
  const entry = index >= 0 ? WRITEUPS[index] : undefined;
  const prev = index > 0 ? WRITEUPS[index - 1] : undefined;
  const next = index >= 0 && index < WRITEUPS.length - 1 ? WRITEUPS[index + 1] : undefined;

  if (!entry) {
    return (
      <div>
        <Link to="/scratchpad" className="inline-flex items-center gap-1.5 text-dim text-xs hover:text-amber transition-colors mb-4">
          <ChevronLeft size={12} />
          scratchpad
        </Link>
        <p className="text-dim text-xs">nothing here by that name.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link to="/scratchpad" className="inline-flex items-center gap-1.5 text-dim text-xs hover:text-amber transition-colors">
          <ChevronLeft size={11} />
          scratchpad
        </Link>
        <span className="flex-1 border-t border-dashed border-border" />
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 bg-amber inline-block" />
          <span className="text-dim text-[11px] uppercase tracking-widest font-bold">writeup</span>
        </span>
      </div>

      <div>
        <h1 className="text-heading text-xl font-bold leading-snug mb-2 lowercase">{entry.title}</h1>

        <div className="flex items-center gap-3 pb-3 border-b-2 border-border mb-5">
          <span className="text-dim text-[11px]">{entry.date}</span>
          <span className="text-dim text-[11px]">{entry.readTime}</span>
          {entry.tags.map((t) => (
            <span key={t} className="text-[10px] text-body/80 border border-border/70 bg-bg/40 px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>

        {entry.body.map((p, i) => (
          <p key={i} className="text-sm text-body/90 leading-relaxed mb-4">
            {p}
          </p>
        ))}
      </div>

      <div className="flex gap-3 pt-3 border-t-2 border-border">
        {prev ? (
          <Link
            to={`/scratchpad/${prev.slug}`}
            className="flex-1 border-l-2 border-amber/35 bg-surface/45 px-3 py-2 hover:border-amber/70 hover:bg-surface/60 transition-colors"
          >
            <div className="text-dim text-[10px] uppercase tracking-widest font-bold mb-0.5">previous</div>
            <div className="text-body text-xs leading-snug lowercase">{prev.title}</div>
          </Link>
        ) : (
          <div className="flex-1 border-l-2 border-border/80 bg-surface/30 px-3 py-2">
            <div className="text-dim text-[10px] uppercase tracking-widest font-bold mb-0.5">previous</div>
            <div className="text-dim text-xs leading-snug">nothing older yet</div>
          </div>
        )}
        {next ? (
          <Link
            to={`/scratchpad/${next.slug}`}
            className="flex-1 border-l-2 border-amber/35 bg-surface/45 px-3 py-2 hover:border-amber/70 hover:bg-surface/60 transition-colors"
          >
            <div className="text-dim text-[10px] uppercase tracking-widest font-bold mb-0.5">next</div>
            <div className="text-body text-xs leading-snug lowercase">{next.title}</div>
          </Link>
        ) : (
          <div className="flex-1 border-l-2 border-border/80 bg-surface/30 px-3 py-2">
            <div className="text-dim text-[10px] uppercase tracking-widest font-bold mb-0.5">next</div>
            <div className="text-dim text-xs leading-snug">nothing newer yet</div>
          </div>
        )}
      </div>
    </div>
  );
}
