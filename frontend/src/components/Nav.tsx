const LINKS = [
  { href: '#now', label: 'now' },
  { href: '#work', label: 'work' },
  { href: '#log', label: 'log' },
  { href: '#stuff', label: 'stuff' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
        <a href="#now" className="text-heading font-bold text-sm">
          aj<span className="text-amber">.</span>
        </a>
        <nav className="flex gap-5 text-sm font-bold">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-amber underline underline-offset-4 hover:text-heading transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
