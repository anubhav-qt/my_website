import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE } from '@/content/site';
import { useSEO } from '@/hooks/useSEO';
import { tint, type Accent } from '@/lib/palette';

const CHANNELS = [
  {
    label: 'GitHub',
    value: 'anubhav-qt',
    href: PROFILE.github,
    accent: 'graphite',
  },
  {
    label: 'Email',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    copyable: true,
    accent: 'rose',
  },
  {
    label: 'LinkedIn',
    value: 'anubhav-qt',
    href: PROFILE.linkedin,
    accent: 'sky',
  },
  {
    label: 'Resume',
    value: 'resume',
    href: PROFILE.resume,
    accent: 'ochre',
  },
] satisfies { label: string; value: string; href: string; copyable?: boolean; accent: Accent }[];

const CONTEXT = [
  { label: 'Timezone', value: 'IST, UTC+5:30', accent: 'sky' as const },
  { label: 'Open to', value: 'Freelancing and Software Engineering roles', accent: 'green' as const },
];

export default function Contact() {
  useSEO({
    title: 'Contact',
    description: `Get in touch with ${PROFILE.name}, open to freelancing.`,
    path: '/contact',
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pb-12">
      <div className="tile px-4 py-4 mt-3">
        <h1 className="font-title text-heading text-[1.6rem] leading-none mb-3.5">Reach me</h1>

        <div className="flex flex-col gap-2">
          {CHANNELS.map((c) => (
            <div key={c.label} style={tint(c.accent)} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-dot text-dim text-[12px] sm:w-[70px] shrink-0">{c.label}</span>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-1 text-heading text-sm font-bold underline-offset-4 hover:underline break-all"
                >
                  {c.value}
                  <ArrowUpRight size={11} className="shrink-0 text-(--c)" />
                </a>
                {c.copyable && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 font-dot text-[10px] text-dim hover:text-heading border border-tile hover:border-tile-hover rounded-md px-1.5 py-1 transition-colors shrink-0"
                  >
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border mt-4 pt-3.5 flex flex-col gap-2">
          {CONTEXT.map((c) => (
            <div key={c.label} style={tint(c.accent)} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <div className="flex items-baseline gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 -translate-y-0.5 bg-(--c)" />
                <span className="font-dot text-[12px] sm:w-[88px] shrink-0 text-(--c)">{c.label}</span>
              </div>
              <span className="flex-1 border-t border-dashed border-border hidden sm:block" />
              <span className="text-body text-xs shrink-0 pl-3.5 sm:pl-0">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
