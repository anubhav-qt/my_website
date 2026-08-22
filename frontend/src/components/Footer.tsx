const BADGES = [
  { text: 'NO LLM\nREAD PATH', color: 'text-rose' },
  { text: 'POSTGRES\nFOREVER', color: 'text-sage' },
  { text: 'IPv6\nREADY', color: 'text-amber' },
];

export function Footer() {
  return (
    <footer className="border-t border-border pt-6 pb-2">
      <div className="flex gap-2 flex-wrap mb-3">
        {BADGES.map((b) => (
          <span
            key={b.text}
            className={`w-[88px] h-[31px] rounded bg-surface border border-border flex flex-col items-center justify-center text-[8px] font-bold text-center leading-tight ${b.color}`}
          >
            {b.text.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        ))}
      </div>
      <p className="text-dim text-[11px]">site built with react + vite. backend coming, in fastapi.</p>
    </footer>
  );
}
