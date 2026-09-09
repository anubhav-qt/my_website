import { useState } from 'react';

// Six real Spoin screenshots in a plain arrow/dot carousel: one image at a
// time inside a full-width slot that holds the artifact's ~40:21 shape, with
// prev/next arrows, a click-through dot row, an "n / 6" counter, and a
// one-line caption below the image. No cursor- or element-position math, so
// nothing here touches the 1.2x page zoom (index.css) the way the old
// hover-preview did.
//
// Filenames are historical and a few of them lie: profile.jpg is the
// request-a-topic modal, settings.jpg is the profile/momentum page. Captions
// and alt text describe what each shot actually shows.
const SLIDES: { src: string; alt: string; caption: string }[] = [
  {
    src: '/projects/spoin/feed.jpg',
    alt: 'The reading view, one card open',
    caption:
      'The reading view. Cards come out of Postgres with a real sourced image, no model on the read path.',
  },
  {
    src: '/projects/spoin/topic.jpg',
    alt: 'A topic opened, showing tier quizzes and its subtopic list',
    caption:
      'A topic opened up: tier quizzes to certify out of, a coverage bar, and every subtopic listed.',
  },
  {
    src: '/projects/spoin/settings.jpg',
    alt: 'The profile page with streak and reading calendar',
    caption:
      'Your profile: a day streak, a calendar of what you read, and all-time card and topic counts.',
  },
  {
    src: '/projects/spoin/themes.jpg',
    alt: 'The card-style picker at onboarding',
    caption:
      'Eleven card styles to read in, set at onboarding and swapped anytime from the rail.',
  },
  {
    src: '/projects/spoin/onboarding.jpg',
    alt: 'Onboarding topic and difficulty picker',
    caption:
      "Pick a few topics and a difficulty for each. That's all it takes to start the feed.",
  },
  {
    src: '/projects/spoin/profile.jpg',
    alt: 'The request-a-topic modal',
    caption:
      "Need a topic that isn't there yet? Request it, and one batched call generates them all.",
  },
];

export function SpoinGallery() {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;
  const active = SLIDES[index];
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <div className="mb-3 w-full">
      <div className="relative border border-border bg-bg overflow-hidden">
        <div className="relative w-full aspect-[40/21] flex items-center justify-center">
          <img
            key={active.src}
            src={active.src}
            alt={active.alt}
            className="max-w-full max-h-full object-contain block"
          />

          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous screenshot"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center bg-bg/70 border border-border text-heading cursor-pointer transition-colors hover:bg-amber/[0.18] hover:border-amber/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next screenshot"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center bg-bg/70 border border-border text-heading cursor-pointer transition-colors hover:bg-amber/[0.18] hover:border-amber/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold tracking-[0.08em] text-dim bg-bg/70 border border-border px-1.5 py-0.5">
            {index + 1} / {count}
          </span>
        </div>

        <div className="px-3.5 pt-2.5 pb-3 border-t border-border">
          <p className="m-0 text-[12.5px] text-body leading-snug">{active.caption}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to screenshot ${i + 1}`}
            aria-current={i === index}
            className="group p-1.5 cursor-pointer leading-none"
          >
            <span
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? 'bg-amber' : 'bg-border group-hover:bg-dim'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
