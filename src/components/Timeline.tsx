'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Zap, Briefcase } from 'lucide-react';
import { TechIconRow } from './TechIcon';

const TIMELINE_ICONS = { ShieldCheck, Zap, Briefcase } as const;

export interface TimelineEntry {
  id: string;
  icon: keyof typeof TIMELINE_ICONS;
  title: string;
  role: string;
  period: string;
  headline: string[]; // <= 2 short bullets, shown always
  details?: string[]; // full bullets, shown on expand
  tech: string[];
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="relative">
      <div
        className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--border-subtle)]"
        aria-hidden="true"
      />
      <div className="space-y-7">
        {entries.map((entry) => {
          const Icon = TIMELINE_ICONS[entry.icon];
          const isOpen = openId === entry.id;
          return (
            <div key={entry.id} className="relative pl-11">
              <div className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-[var(--bg-page)] border-2 border-[var(--border-strong)] flex items-center justify-center text-[var(--accent)]">
                <Icon size={15} className="text-current" />
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="text-h3">{entry.title}</h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">{entry.period}</span>
              </div>
              <div className="text-sm text-[var(--accent)] font-medium mb-2">{entry.role}</div>

              <ul className="space-y-1.5">
                {entry.headline.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="mt-2 w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {entry.details && entry.details.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setOpenId(isOpen ? null : entry.id)}
                    className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                    <span>{isOpen ? 'Show less' : 'Full detail'}</span>
                  </button>
                  {isOpen && (
                    <ul className="mt-2 space-y-1.5 border-l-2 border-[var(--border-subtle)] pl-3">
                      {entry.details.map((line, i) => (
                        <li key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="mt-3">
                <TechIconRow names={entry.tech} size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
