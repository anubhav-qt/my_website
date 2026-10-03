import { ArrowUpRight } from 'lucide-react';

// The live site, right of a project's name on a card that is itself a link to
// the project's page. It sits above the card's stretched link (relative z-10),
// with a little padding so a near miss doesn't open the project instead.
export function LiveSiteLink({ site }: { site: { label: string; url: string } }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 ml-auto shrink-0 -m-1.5 p-1.5 inline-flex items-center gap-0.5 font-dot text-heading text-[12px] underline underline-offset-4 decoration-(--c) hover:opacity-70 transition-opacity"
    >
      {site.label}
      <ArrowUpRight size={11} />
    </a>
  );
}
