import { Eye, Heart } from 'lucide-react';

// Read-only views + likes badge, shown near a piece of content's title/date.
// Never clickable -- the heart here only mirrors whatever the clickable
// heart at the bottom (see CommentThread) has set, so both always agree.
export function ContentMeta({ views, liked, likeCount }: { views: number; liked: boolean; likeCount: number }) {
  return (
    <span className="flex items-center gap-2.5 text-dim text-[11px]">
      <span className="flex items-center gap-1">
        <Eye size={11} />
        {views}
      </span>
      <span className={`flex items-center gap-1 ${liked ? 'text-rose' : ''}`}>
        <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
        {likeCount}
      </span>
    </span>
  );
}
