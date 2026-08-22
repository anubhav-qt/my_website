import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { LOG_ENTRIES } from '@/content/log';

const VISIBLE_COUNT = 5;

export function Log() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? LOG_ENTRIES : LOG_ENTRIES.slice(0, VISIBLE_COUNT);

  return (
    <section id="log" className="scroll-mt-16 mb-14">
      <h2 className="text-heading text-lg font-bold mb-2">Log</h2>
      <p className="text-xs opacity-75 mb-4">I write architecture decisions down. Mostly about what broke.</p>

      <ul className="space-y-0.5">
        {visible.map((entry) => (
          <li key={entry.id} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border/60">
            <span className="text-amber text-xs font-semibold truncate">
              ADR-{String(entry.num).padStart(4, '0')}: {entry.title}
            </span>
            <span className="text-dim text-xs shrink-0">{entry.date}</span>
          </li>
        ))}
      </ul>

      {LOG_ENTRIES.length > VISIBLE_COUNT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-amber hover:text-heading transition-colors"
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <span>{expanded ? 'less' : `more (${LOG_ENTRIES.length - VISIBLE_COUNT})`}</span>
        </button>
      )}
    </section>
  );
}
