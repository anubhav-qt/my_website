import { ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/content/site';

export default function Contact() {
  const channels = [
    {
      label: 'email',
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      note: 'Best for engineering roles, systems discussions, or architecture questions.',
    },
    {
      label: 'github',
      value: 'anubhav-qt',
      href: PROFILE.github,
      note: 'Repos, ADRs, pipelines, and open-source contributions.',
    },
    {
      label: 'linkedin',
      value: 'anubhav-qt',
      href: PROFILE.linkedin,
      note: 'Professional network & experience timeline.',
    },
    {
      label: 'location',
      value: PROFILE.location,
      note: 'Open to remote roles worldwide and on-site opportunities.',
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
