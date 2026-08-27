import { Eye, Heart, MessageSquare } from 'lucide-react';

// Read-only views + likes + comments badge, shown near a piece of content's title/date.
// Never clickable -- the heart here only mirrors whatever the clickable
// heart at the bottom (see CommentThread) has set, so both always agree.
export function ContentMeta({
  views,
  liked,
  likeCount,
  commentCount,
}: {
  views: number;
  liked: boolean;
  likeCount: number;
  commentCount?: number;
}) {
  return (
    <span className="flex items-center gap-2.5 text-dim text-[11px]">
      <span className="flex items-center gap-1" title={`${views} views`}>
        <Eye size={11} />
        {views}
      </span>
      <span className={`flex items-center gap-1 ${liked ? 'text-rose' : ''}`} title={`${likeCount} likes`}>
        <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
        {likeCount}
      </span>
      {typeof commentCount === 'number' && (
        <span className="flex items-center gap-1" title={`${commentCount} comments`}>
          <MessageSquare size={11} />
          {commentCount}
        </span>
      )}
    </span>
  );
}
