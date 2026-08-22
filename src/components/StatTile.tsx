import React from 'react';

/** Big number, no border, no card — ink on paper. */
export function CounterTile({
  value,
  label,
  detail,
  size = 'md',
}: {
  value: string;
  label: string;
  detail?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className={size === 'sm' ? 'text-stat-sm text-[var(--text-primary)]' : 'text-stat text-[var(--text-primary)]'}>
        {value}
      </div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
      {detail && <div className="text-xs text-[var(--text-muted)]">{detail}</div>}
    </div>
  );
}

/** Semicircular gauge — for the latency stat. value/max in the same unit. */
export function GaugeTile({
  value,
  max,
  display,
  label,
  detail,
}: {
  value: number;
  max: number;
  display: string;
  label: string;
  detail?: string;
}) {
  const pct = Math.min(1, value / max);
  const r = 54;
  const circumference = Math.PI * r; // semicircle
  const dash = circumference * pct;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 80" width="140" height="80" aria-hidden="true">
        <path
          d="M 13 70 A 54 54 0 0 1 127 70"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 13 70 A 54 54 0 0 1 127 70"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="flex flex-col gap-0.5 -ml-4">
        <div className="text-stat-sm text-[var(--text-primary)]">{display}</div>
        <div className="text-sm text-[var(--text-secondary)]">{label}</div>
        {detail && <div className="text-xs text-[var(--text-muted)]">{detail}</div>}
      </div>
    </div>
  );
}

/** Horizontal bar-growth comparison — 2 or 3 stages. */
export function BarGrowthTile({
  title,
  bars,
  unit,
}: {
  title: string;
  bars: { label: string; value: number; display: string; highlight?: boolean }[];
  unit?: string;
}) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="space-y-2.5">
      <div className="text-sm text-[var(--text-secondary)]">{title}</div>
      <div className="space-y-2">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-20 shrink-0 text-xs text-[var(--text-muted)]">{b.label}</div>
            <div className="flex-1 h-6 rounded bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full rounded"
                style={{
                  width: `${Math.max(4, (b.value / max) * 100)}%`,
                  background: b.highlight ? 'var(--accent)' : 'var(--border-strong)',
                }}
              />
            </div>
            <div
              className={`w-24 shrink-0 text-xs font-medium text-right ${
                b.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {b.display}
              {unit ? ` ${unit}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
