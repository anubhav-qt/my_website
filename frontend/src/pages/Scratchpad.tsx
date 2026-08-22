import { SCRATCHPAD_ENTRIES } from '@/content/scratchpad';

export default function Scratchpad() {
  return (
    <div>
      <h2 className="text-heading text-lg font-bold mb-2">Scratchpad</h2>
      <p className="text-xs opacity-75 mb-4">Blogs, half-formed ideas, and notes that didn't make it into an ADR.</p>

      {SCRATCHPAD_ENTRIES.length === 0 ? (
        <p className="text-dim text-xs">nothing here yet — check back soon.</p>
      ) : (
        <ul className="space-y-0.5">
          {SCRATCHPAD_ENTRIES.map((entry) => (
            <li key={entry.id} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border/60">
              <span className="text-amber text-xs font-semibold truncate">{entry.title}</span>
              <span className="text-dim text-xs shrink-0">{entry.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
