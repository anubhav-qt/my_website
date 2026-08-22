import { Mail } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedinIcon } from '../icons/LinkedinIcon';
import { PROFILE, STACK, EXPERIENCE, EDUCATION } from '@/content/site';

export function Now() {
  return (
    <section id="now" className="scroll-mt-16 mb-14">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h1 className="text-heading text-2xl font-bold leading-tight">{PROFILE.name}</h1>
          <p className="text-amber font-semibold text-sm mt-0.5">{PROFILE.role}</p>
          <p className="text-dim text-xs mt-0.5">{PROFILE.location}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 border border-rose text-rose text-xs font-bold px-2.5 py-1 rounded-xl shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose" />
          available for hire
        </span>
      </div>

      <div className="flex items-center gap-3 mb-5">
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

      <p className="text-sm leading-relaxed mb-6 max-w-lg">{PROFILE.tagline}</p>

      <div className="mb-7">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-2.5">stack</div>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span key={s} className="bg-surface border border-border text-xs px-2.5 py-1 rounded-xl">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-3">career</div>
        <div className="space-y-4">
          {EXPERIENCE.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold">{e.company}</span>
                <span className="text-dim text-xs">{e.period}</span>
              </div>
              <div className="text-amber text-xs font-semibold mb-1.5">{e.role}</div>
              <ul className="space-y-1">
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
        <div className="text-heading text-xs font-bold uppercase tracking-wide mb-2">education</div>
        <p className="text-xs leading-relaxed">
          <span className="text-heading font-semibold">{EDUCATION.degree}</span> — {EDUCATION.school}
          <br />
          {EDUCATION.period} · {EDUCATION.detail}
        </p>
      </div>
    </section>
  );
}
