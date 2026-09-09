import { useEffect, useState } from 'react';

// Six real Spoin screenshots, tiled into a 6x6 bento grid that fills the
// column's full width at a 16:9 shape (one big tile, two wide banners, two
// small squares, one narrow sliver -- no gaps, no leftover space, no scroll).
// Hover shows a bigger cursor-following preview (desktop/fine-pointer only, a
// hover box makes no sense on a touchscreen); click opens the image in a modal.
const SLIDES: { src: string; slot: string; alt: string; caption: string }[] = [
  {
    src: '/projects/spoin/topic.jpg',
    slot: 'col-start-1 col-end-4 row-start-1 row-end-5',
    alt: 'Topic tier and quiz roadmap',
    caption: "A topic's tier-certification quizzes and curriculum roadmap.",
  },
  {
    src: '/projects/spoin/feed.jpg',
    slot: 'col-start-4 col-end-7 row-start-1 row-end-3',
    alt: 'The card feed',
    caption: 'The feed, grounded and served straight out of Postgres.',
  },
  {
    src: '/projects/spoin/profile.jpg',
    slot: 'col-start-4 col-end-6 row-start-3 row-end-5',
    alt: 'Momentum and streak calendar',
    caption: 'Momentum: a day streak and a calendar of cards read.',
  },
  {
    src: '/projects/spoin/onboarding.jpg',
    slot: 'col-start-6 col-end-7 row-start-3 row-end-5',
    alt: 'Topic onboarding picker',
    caption: 'Onboarding: pick a few topics and a starting difficulty.',
  },
  {
    src: '/projects/spoin/themes.jpg',
    slot: 'col-start-1 col-end-3 row-start-5 row-end-7',
    alt: 'Theme and palette picker',
    caption: 'Five grounds to read in, picked at onboarding or from settings.',
  },
  {
    src: '/projects/spoin/settings.jpg',
    slot: 'col-start-3 col-end-7 row-start-5 row-end-7',
    alt: 'Settings: daily goal and topics',
    caption: 'Settings: daily goal, per-topic difficulty, and the palette.',
  },
];

const PREVIEW_SIZE = 300;

export function SpoinGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Escape closes the modal, same as clicking the backdrop.
  useEffect(() => {
    if (modalIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalIndex]);

  const previewVisible = canHover && hovered !== null && modalIndex === null;
  const previewLeft = Math.min(Math.max(mouse.x + 22, 8), window.innerWidth - PREVIEW_SIZE - 8);
  const previewTop = Math.min(Math.max(mouse.y + 22, 8), window.innerHeight - PREVIEW_SIZE - 8);

  return (
    <div className="relative mb-3">
      <div className="grid grid-cols-6 grid-rows-6 gap-[3px] aspect-[16/9] w-full">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            className={`relative overflow-hidden border border-border/70 hover:border-amber/70 transition-colors cursor-pointer p-0 ${s.slot}`}
            onClick={() => {
              setModalIndex(i);
              setHovered(null);
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseMove={(e) => {
              setHovered(i);
              setMouse({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => setHovered(null)}
            aria-label={`Open ${s.alt}`}
          >
            <img src={s.src} alt={s.alt} className="w-full h-full object-cover block" loading="lazy" />
          </button>
        ))}
      </div>

      {previewVisible && hovered !== null && (
        <div
          className="fixed z-50 border border-amber overflow-hidden pointer-events-none bg-surface shadow-2xl"
          style={{ left: previewLeft, top: previewTop, width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        >
          <img src={SLIDES[hovered].src} alt="" className="w-full h-full object-cover block" />
          <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-bg/90 border-t border-border text-[11px] text-body leading-snug">
            {SLIDES[hovered].caption}
          </div>
        </div>
      )}

      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setModalIndex(null)}
        >
          <div
            className="relative w-full max-w-xl border border-border bg-surface shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SLIDES[modalIndex].src}
              alt={SLIDES[modalIndex].alt}
              className="w-full max-h-[70vh] object-contain bg-bg block"
            />
            <div className="px-3 py-2 border-t border-border text-xs text-body leading-relaxed">
              {SLIDES[modalIndex].caption}
            </div>
            <button
              type="button"
              onClick={() => setModalIndex(null)}
              aria-label="Close"
              className="absolute -top-3.5 -right-3.5 w-7 h-7 flex items-center justify-center bg-bg border border-border text-heading hover:border-amber hover:text-amber transition-colors cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
