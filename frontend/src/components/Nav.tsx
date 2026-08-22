import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'home' },
  { to: '/projects', label: 'projects' },
  { to: '/scratchpad', label: 'scratchpad' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-5 pt-3">
        <nav className="flex gap-5 text-sm font-bold border-b-2 border-border pb-[7px]">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `text-amber underline-offset-4 hover:text-heading hover:underline transition-colors ${
                  isActive ? 'underline' : ''
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
