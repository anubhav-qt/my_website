import { NavLink } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useTotalViews } from '@/hooks/useViewTracking';

const LINKS = [
  { to: '/', label: 'home', end: true },
  { to: '/projects', label: 'projects', end: true },
  { to: '/scratchpad', label: 'scratchpad', end: false },
  { to: '/contact', label: 'contact', end: true },
];

export function Nav() {
  const totalViews = useTotalViews();

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-5 pt-3">
        <nav className="flex items-center flex-wrap gap-x-3 gap-y-1 sm:gap-x-5 text-[13px] sm:text-sm font-bold border-b-2 border-border pb-[7px]">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-amber underline-offset-4 hover:text-heading hover:underline transition-colors py-1.5 sm:py-0 ${
                  isActive ? 'underline' : ''
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <span className="flex-1" />
          <span className="flex items-center gap-1 text-dim text-[10px] sm:text-[11px] font-normal border border-border px-1.5 py-0.5 shrink-0">
            <Eye size={11} />
            {totalViews}
          </span>
        </nav>
      </div>
    </header>
  );
}
