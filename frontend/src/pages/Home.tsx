import { MapPin, FileText } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedinIcon } from '../components/icons/LinkedinIcon';
import { PROFILE } from '@/content/site';
import { ProfileRail } from '@/components/sections/ProfileRail';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { useSEO } from '@/hooks/useSEO';

export default function Home() {
  useSEO({
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: 'Backend engineer working on AI infrastructure. Spoin, Continuum, and the systems in between.',
    path: '/',
  });

  return (
    <div>
      <div className="mb-2">
        {/* Wraps rather than shrinks: below about 320px the name and the resume
            button stop fitting on one line, and since the name cannot break
            (whitespace-nowrap, it is a name) it would otherwise run underneath
            the button. Letting the button drop to a line of its own, still
            pinned right, keeps both readable at full size. */}
        <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1.5">
          <div className="min-w-0">
            <h1 className="text-heading text-xl sm:text-2xl font-bold leading-tight whitespace-nowrap lowercase">{PROFILE.name}</h1>
            <p className="text-amber font-semibold text-[13px] sm:text-sm mt-0.5 whitespace-nowrap lowercase">{PROFILE.role}</p>
          </div>
          <a
            href={PROFILE.resume}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber border border-amber/60 hover:bg-amber/10 px-2 py-1.5 sm:py-1 transition-colors shrink-0 ml-auto"
          >
            <FileText size={12} />
            resume
          </a>
        </div>
        <div className="flex items-center justify-between gap-3 mt-0.5 w-full">
          <span className="inline-flex items-center gap-1.5 text-dim text-xs whitespace-nowrap lowercase">
            <MapPin size={14} />
            {PROFILE.location}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-2 -mr-1.5 sm:mr-0">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-dim hover:text-amber transition-colors flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto"
            >
              <SiGithub size={16} />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-dim hover:text-amber transition-colors flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-2">{PROFILE.status}</p>

      <div className="border-b-2 border-border mb-3" />

      <ProfileRail />

      <div className="mt-2.5" />

      <FeaturedProjects />
    </div>
  );
}
