import React from 'react';

/**
 * The site's recurring visual motif: scattered circles (generated / stochastic,
 * rendered in --accent) separated by a solid wall from aligned squares
 * (deterministic / proven, rendered in --wall). Used wherever the "determinism
 * wall" thesis recurs — nav identity, ADR entries, the Decision beat of project audits.
 */
export function WallGlyph({ className = '', size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="6" r="1.4" fill="var(--accent)" opacity="0.9" />
      <circle cx="7.5" cy="11" r="1" fill="var(--accent)" opacity="0.6" />
      <circle cx="3.5" cy="16" r="1.2" fill="var(--accent)" opacity="0.75" />
      <rect x="11" y="2" width="2" height="20" fill="var(--wall)" />
      <rect x="16" y="4" width="3" height="3" fill="var(--wall)" />
      <rect x="16" y="10.5" width="3" height="3" fill="var(--wall)" />
      <rect x="16" y="17" width="3" height="3" fill="var(--wall)" />
    </svg>
  );
}
