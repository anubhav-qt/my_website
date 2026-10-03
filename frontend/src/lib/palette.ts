import type { CSSProperties } from 'react';

// Breader's book colours for a dark page (index.css), minus its clay, which
// reads as orange. The interface itself stays black and white: colour belongs
// to the things on the page, one each, the way every book in Breader has one.
export const PALETTE = [
  'rose',
  'ochre',
  'sand',
  'sage',
  'moss',
  'green',
  'teal',
  'sky',
  'indigo',
  'lilac',
  'plum',
  'blush',
  'graphite',
] as const;

export type Accent = (typeof PALETTE)[number];

// Sets --c on an element, so its classes can say text-(--c), bg-(--c)/10 and
// so on. Tailwind can't see a class assembled from a variable, but it can see
// one that reads a custom property.
export function tint(accent: Accent): CSSProperties {
  return { '--c': `var(--color-${accent})` } as CSSProperties;
}

// Anything without a colour of its own (a tag, an older project) gets one from
// its name, so it's the same colour everywhere it shows up.
export function accentFor(name: string): Accent {
  let h = 0;
  for (const ch of name.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const PROJECT: Record<string, Accent> = {
  paribelle: 'plum',
  breader: 'lilac',
  spoin: 'green',
  anchorate: 'sky',
  trotter: 'teal',
  trippinator: 'blush',
};

export const projectAccent = (id: string): Accent => PROJECT[id] ?? accentFor(id);

const CAREER: Record<string, Accent> = {
  pde: 'indigo',
  freelance: 'teal',
  anchorate: 'sky',
  blinkadz: 'rose',
};

export const careerAccent = (id: string): Accent => CAREER[id] ?? accentFor(id);
