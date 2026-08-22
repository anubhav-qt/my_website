import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#now', label: 'now' },
  { href: '#work', label: 'work' },
  { href: '#log', label: 'log' },
  { href: '#scratchpad', label: 'scratchpad' },
  { href: '#stuff', label: 'stuff' },
];

export function Nav() {
  const [active, setActive] = useState(LINKS[0].href);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActive(`#${topMost.target.id}`);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-5 pt-3">
        <nav className="flex gap-5 text-sm font-bold border-b-2 border-border pb-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-amber underline-offset-4 hover:text-heading hover:underline transition-colors ${
                active === l.href ? 'underline' : ''
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
