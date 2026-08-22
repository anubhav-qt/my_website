import { Mail, MapPin } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedinIcon } from '../icons/LinkedinIcon';
import { PROFILE, STACK, CURRENTLY_MAKING, EXPERIENCE, EDUCATION } from '@/content/site';

export function Now() {
  return (
    <section id="now" className="scroll-mt-16 mb-10">
      <div className="mb-3">
        <h1 className="text-heading text-2xl font-bold leading-tight">{PROFILE.name}</h1>
        <p className="text-amber font-semibold text-sm mt-0.5">{PROFILE.role}</p>
        <div className="flex items-center justify-between gap-3 mt-0.5 max-w-xs">
          <span className="inline-flex items-center gap-1.5 text-dim text-xs">
            <MapPin size={14} />
            {PROFILE.location}
          </span>
          <div className="flex items-center gap-3">
            <a href={`mailto:${PROFILE.email}`} aria-label="Email" className="text-dim hover:text-amber transition-colors">
              <Mail size={16} />
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-dim hover:text-amber transition-colors">
              <SiGithub size={16} />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-dim hover:text-amber transition-colors">
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-1.5">currently making</div>
        <div className="flex gap-3 items-start">
          <div className="w-16 h-16 shrink-0 rounded-lg border border-border bg-surface p-1.5 flex flex-col gap-1.5">
            <div className="h-1 rounded-full bg-border overflow-hidden shrink-0">
              <div className="h-full w-2/3 rounded-full bg-amber" />
            </div>
            <div className="flex flex-1 gap-1 min-h-0">
              <div className="flex-[1.4] rounded border border-border flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-sage" />
              </div>
              <div className="flex flex-col gap-1 w-2.5 shrink-0">
                <div className="flex-1 rounded-sm bg-border" />
                <div className="flex-1 rounded-sm bg-border" />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-heading leading-snug">{CURRENTLY_MAKING.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {CURRENTLY_MAKING.tags.map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  className="text-amber text-xs font-bold underline underline-offset-4 hover:text-heading transition-colors"
                >
                  {t.label}
                </a>
              ))}
            </div>
            <p className="text-xs opacity-80 leading-relaxed mt-1.5">
              {CURRENTLY_MAKING.description}
              <span className="text-rose">{CURRENTLY_MAKING.highlight}</span>
              {CURRENTLY_MAKING.descriptionEnd}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4 max-w-lg">{PROFILE.tagline}</p>

      <div className="mb-5">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-2">stack</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
          {STACK.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs">
              <span className="w-1 h-1 shrink-0 bg-dim" />
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-2">career</div>
        <div className="space-y-3">
          {EXPERIENCE.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold">{e.company}</span>
                <span className="text-dim text-xs">{e.period}</span>
              </div>
              <div className="text-amber text-xs font-semibold mb-1">{e.role}</div>
              <ul className="space-y-0.5">
                {e.bullets.map((b, i) => (
                  <li key={i} className="text-xs leading-relaxed pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-dim">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-1.5">education</div>
        <p className="text-xs leading-relaxed">
          <span className="text-heading font-semibold">{EDUCATION.degree}</span> — {EDUCATION.school}
          <br />
          {EDUCATION.period} · {EDUCATION.detail}
        </p>
      </div>
    </section>
  );
}
