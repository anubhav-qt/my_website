import { ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/content/site';

export default function Contact() {
  const channels = [
    {
      label: 'email',
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      note: "Best if you want to talk about a role, a system, or an architecture decision.",
    },
    {
      label: 'github',
      value: 'anubhav-qt',
      href: PROFILE.github,
      note: 'Repos, ADRs, and the pipelines behind them.',
    },
    {
      label: 'linkedin',
      value: 'anubhav-qt',
      href: PROFILE.linkedin,
      note: "Where my work history actually lives.",
    },
    {
      label: 'location',
      value: PROFILE.location,
      note: "Open to remote work, and on-site if it's worth relocating for.",
    },
  ];

  return (
    <div>
      <h2 className="text-heading text-lg font-bold mb-1">Contact</h2>
      <p className="text-xs text-dim mb-4">Direct channels to reach me.</p>

      <div className="border-l-2 border-amber/50 bg-surface/60 p-4 space-y-3">
        {channels.map((c) => (
          <div
            key={c.label}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-border/40 pb-2.5 last:border-b-0 last:pb-0"
          >
            <div>
              <span className="text-amber text-xs font-bold mr-2">{c.label}</span>
              <p className="text-dim text-[11px] mt-0.5">{c.note}</p>
            </div>
            {c.href ? (
              <a
                href={c.href}
                target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-1 text-heading hover:text-amber text-xs font-semibold transition-colors shrink-0"
              >
                {c.value}
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <span className="text-body text-xs font-medium shrink-0">{c.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
