import React from 'react';

/**
 * The homepage hero graphic. Two zones split by a wall: soft drifting circles
 * (generated / stochastic) on the left, a rigid grid of squares (deterministic /
 * proven) on the right. This is the thesis made visual — replaces a paragraph.
 */
export function WallDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 220"
      className={className}
      role="img"
      aria-label="A wall dividing a field of scattered generated circles from a fixed grid of proven squares"
    >
      <defs>
        <linearGradient id="wall-fade-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Left zone label */}
      <text x="24" y="28" fontSize="11" fontFamily="var(--font-mono)" fill="var(--accent)" letterSpacing="0.08em">
        GENERATED
      </text>

      {/* Scattered drifting circles */}
      <g fill="var(--accent)">
        <circle className="drift-a" cx="60" cy="70" r="7" opacity="0.85" />
        <circle className="drift-b" cx="140" cy="55" r="4.5" opacity="0.55" />
        <circle className="drift-c" cx="95" cy="115" r="9" opacity="0.7" />
        <circle className="drift-a" cx="180" cy="120" r="5" opacity="0.5" style={{ animationDelay: '-1.5s' }} />
        <circle className="drift-b" cx="45" cy="150" r="6" opacity="0.65" />
        <circle className="drift-c" cx="220" cy="70" r="4" opacity="0.45" style={{ animationDelay: '-3s' }} />
        <circle className="drift-a" cx="150" cy="170" r="7" opacity="0.6" style={{ animationDelay: '-5s' }} />
        <circle className="drift-b" cx="255" cy="140" r="5.5" opacity="0.5" />
        <circle className="drift-c" cx="30" cy="100" r="3.5" opacity="0.4" />
      </g>

      {/* The wall */}
      <rect x="308" y="10" width="4" height="200" fill="var(--wall)" />
      <rect x="308" y="10" width="4" height="200" fill="url(#wall-fade-left)" opacity="0.15" />

      {/* Right zone: rigid proven grid */}
      <g fill="var(--wall)">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={352 + col * 44}
              y={40 + row * 40}
              width="22"
              height="22"
              rx="3"
              opacity={0.85 - row * 0.05}
            />
          ))
        )}
      </g>

      <text x="352" y="28" fontSize="11" fontFamily="var(--font-mono)" fill="var(--wall)" letterSpacing="0.08em">
        PROVEN
      </text>
    </svg>
  );
}
