import { MapPin } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedinIcon } from '../components/icons/LinkedinIcon';
import { PROFILE } from '@/content/site';
import { ProfileRail } from '@/components/sections/ProfileRail';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';

export default function Home() {
  return (
    <div>
      <div className="mb-2 inline-block">
        <h1 className="text-heading text-2xl font-bold leading-tight whitespace-nowrap">{PROFILE.name}</h1>
        <p className="text-amber font-semibold text-sm mt-0.5 whitespace-nowrap">{PROFILE.role}</p>
        <div className="flex items-center justify-between gap-3 mt-0.5 w-full">
          <span className="inline-flex items-center gap-1.5 text-dim text-xs whitespace-nowrap">
            <MapPin size={14} />
            {PROFILE.location}
          </span>
          <div className="flex items-center gap-2">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-dim hover:text-amber transition-colors">
              <SiGithub size={16} />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-dim hover:text-amber transition-colors">
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
