import { NavLink } from 'react-router-dom';
import { tint, type Accent } from '@/lib/palette';

const LINKS: { to: string; label: string; end: boolean; accent: Accent }[] = [
  { to: '/', label: 'home', end: true, accent: 'rose' },
  { to: '/projects', label: 'projects', end: false, accent: 'sky' },
  { to: '/scratchpad', label: 'scratchpad', end: false, accent: 'lilac' },
  { to: '/contact', label: 'contact', end: true, accent: 'green' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-4 xs:px-5 pt-2">
        {/* Breader's tabs: dotted, grey until hovered or current, and the
            current one sits on a bar in that page's colour. */}
        <nav className="flex items-center flex-wrap gap-x-4 gap-y-1 xs:gap-x-5 sm:gap-x-7 text-[12px] xs:text-[13px] font-dot">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              style={tint(l.accent)}
              className={({ isActive }) =>
                `relative py-2.5 transition-colors ${isActive ? 'text-heading' : 'text-dim hover:text-heading'}`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {/* Doto's last letter carries about 0.1em of blank space after its
                      dots, so a bar to the box's right edge overhangs the word. */}
                  {isActive && <span className="absolute left-0 right-[0.1em] bottom-1 h-0.5 rounded-full bg-(--c)" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
