import { accentFor, tint } from '@/lib/palette';

// A tag in its own colour, the same one wherever that tag shows up.
export function Tag({ tag }: { tag: string }) {
  return (
    <span style={tint(accentFor(tag))} className="chip text-(--c) bg-(--c)/10">
      {tag}
    </span>
  );
}
