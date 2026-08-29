import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE } from '@/content/site';
import { useSEO } from '@/hooks/useSEO';

const CHANNELS = [
  {
    label: 'github',
    value: 'anubhav-qt',
    href: PROFILE.github,
  },
  {
    label: 'email',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    copyable: true,
  },
  {
    label: 'linkedin',
    value: 'anubhav-qt',
    href: PROFILE.linkedin,
  },
  {
    label: 'resume',
    value: 'resume',
    href: PROFILE.resume,
  },
];

const CONTEXT = [
  { label: 'timezone', value: 'IST, UTC+5:30', accent: 'amber' as const },
  { label: 'open to', value: 'Backend, AI Infrastructure, and Systems Engineering', accent: 'sage' as const },
];

const DOT = {
  amber: 'bg-amber',
  sage: 'bg-sage',
};

const TEXT = {
  amber: 'text-amber',
  sage: 'text-sage',
};

export default function Contact() {
  useSEO({
    title: 'Contact',
    description: `Get in touch with ${PROFILE.name}, open to Backend, AI Infrastructure, and Systems Engineering roles.`,
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
      <div className="border-l-2 border-amber/35 bg-surface/45 px-4 py-3.5 mt-3">
        <div className="flex items-baseline gap-2 mb-3.5">
          <span className="text-dim text-xs">&gt;</span>
          <span className="text-heading text-sm font-bold">reach me</span>
        </div>

        <div className="flex flex-col gap-2">
          {CHANNELS.map((c) => (
            <div key={c.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="text-dim text-xs sm:w-[70px] shrink-0">{c.label}</span>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-1 text-amber hover:text-heading text-sm font-bold transition-colors break-all"
                >
                  {c.value}
                  <ArrowUpRight size={11} className="shrink-0" />
                </a>
                {c.copyable && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-dim hover:text-amber border border-border/70 bg-bg/40 px-1.5 py-1 sm:py-0.5 transition-colors shrink-0"
                  >
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? 'copied' : 'copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border/60 mt-3.5 pt-3 flex flex-col gap-2">
          {CONTEXT.map((c) => (
            <div key={c.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <div className="flex items-baseline gap-2">
                <span className={`w-1.5 h-1.5 shrink-0 -translate-y-0.5 ${DOT[c.accent]}`} />
                <span className={`text-xs font-bold sm:w-[88px] shrink-0 ${TEXT[c.accent]}`}>{c.label}</span>
              </div>
              <span className="flex-1 border-t border-dashed border-border/60 hidden sm:block" />
              <span className="text-body text-xs shrink-0 pl-3.5 sm:pl-0">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
