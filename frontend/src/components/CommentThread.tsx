import { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { getSessionId } from '@/lib/session';
import { censorText, censorNickname } from '@/lib/censor';
import type { Accent } from '@/content/site';
import type { Comment, TargetType } from '@/lib/backend-types';

// Tailwind's static scanner needs whole, literal class strings -- it can't
// see `` `hover:${TEXT[accent]}` ``. Every combination this component uses is
// spelled out per-accent below instead of assembled from fragments.
interface AccentClasses {
  dot: string;
  text: string;
  border: string;
  border30: string;
  border18: string;
  actionBtn: string;
  replyLink: string;
  likeActive: string;
}

const ACCENT: Record<Accent, AccentClasses> = {
  amber: {
    dot: 'bg-amber',
    text: 'text-amber',
    border: 'border-amber',
    border30: 'border-amber/30',
    border18: 'border-amber/18',
    actionBtn: 'border-amber/50 text-amber bg-amber/8 hover:enabled:border-amber hover:enabled:bg-amber/16',
    replyLink: 'text-dim hover:text-amber',
    likeActive: 'text-amber hover:text-amber',
  },
  gold: {
    dot: 'bg-gold',
    text: 'text-gold',
    border: 'border-gold',
    border30: 'border-gold/30',
    border18: 'border-gold/18',
    actionBtn: 'border-gold/50 text-gold bg-gold/8 hover:enabled:border-gold hover:enabled:bg-gold/16',
    replyLink: 'text-dim hover:text-gold',
    likeActive: 'text-gold hover:text-gold',
  },
  sage: {
    dot: 'bg-sage',
    text: 'text-sage',
    border: 'border-sage',
    border30: 'border-sage/30',
    border18: 'border-sage/18',
    actionBtn: 'border-sage/50 text-sage bg-sage/8 hover:enabled:border-sage hover:enabled:bg-sage/16',
    replyLink: 'text-dim hover:text-sage',
    likeActive: 'text-sage hover:text-sage',
  },
  clay: {
    dot: 'bg-clay',
    text: 'text-clay',
    border: 'border-clay',
    border30: 'border-clay/30',
    border18: 'border-clay/18',
    actionBtn: 'border-clay/50 text-clay bg-clay/8 hover:enabled:border-clay hover:enabled:bg-clay/16',
    replyLink: 'text-dim hover:text-clay',
    likeActive: 'text-clay hover:text-clay',
  },
  rose: {
    dot: 'bg-rose',
    text: 'text-rose',
    border: 'border-rose',
    border30: 'border-rose/30',
    border18: 'border-rose/18',
    actionBtn: 'border-rose/50 text-rose bg-rose/8 hover:enabled:border-rose hover:enabled:bg-rose/16',
    replyLink: 'text-dim hover:text-rose',
    likeActive: 'text-rose hover:text-rose',
  },
};

const MAX_NICKNAME_LENGTH = 50;
const MAX_BODY_LENGTH = 50;
const DEEP_REPLIES_COLLAPSE_THRESHOLD = 3;

interface ThreadNode extends Comment {
  children: ThreadNode[];
}

function buildTree(comments: Comment[]): ThreadNode[] {
  const byId = new Map<string, ThreadNode>(comments.map((c) => [c.id, { ...c, children: [] }]));
  const roots: ThreadNode[] = [];
  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function countDescendants(node: ThreadNode): number {
  let count = 0;
  for (const child of node.children) {
    count += 1 + countDescendants(child);
  }
  return count;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function fetchComments(targetType: TargetType, targetId: string): Promise<Comment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Comment[];
}

interface CommentLikeRow {
  comment_id: string;
  session_id: string;
}

async function fetchCommentLikes(commentIds: string[]): Promise<CommentLikeRow[]> {
  if (!supabase || commentIds.length === 0) return [];
  const { data, error } = await supabase.from('comment_likes').select('comment_id, session_id').in('comment_id', commentIds);
  if (error) throw error;
  return data as CommentLikeRow[];
}

const POST_COOLDOWN_MS = 15_000;

interface LikeState {
  liked: boolean;
  count: number;
  toggle: () => void;
  available: boolean;
}

export function CommentThread({
  targetType,
  targetId,
  accent,
  like,
}: {
  targetType: TargetType;
  targetId: string;
  accent: Accent;
  like: LikeState;
}) {
  const { data: comments, refetch: refetchComments } = useSupabaseQuery(
    () => fetchComments(targetType, targetId),
    [targetType, targetId],
  );
  const commentIds = useMemo(() => (comments ?? []).map((c) => c.id), [comments]);
  const { data: commentLikes, refetch: refetchCommentLikes } = useSupabaseQuery(
    () => fetchCommentLikes(commentIds),
    [commentIds.join(',')],
  );

  const [nickname, setNickname] = useState('');
  const [body, setBody] = useState('');
  const [lastPostedAt, setLastPostedAt] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyNickname, setReplyNickname] = useState('');
  const [replyBody, setReplyBody] = useState('');

  // Track explicit manual expansions and collapses
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const tree = useMemo(() => buildTree(comments ?? []), [comments]);
  const sessionId = useMemo(() => getSessionId(), []);

  const onCooldown = Date.now() - lastPostedAt < POST_COOLDOWN_MS;

  function commentLikeCount(commentId: string): number {
    return (commentLikes ?? []).filter((l) => l.comment_id === commentId).length;
  }

  function commentLikedByMe(commentId: string): boolean {
    return (commentLikes ?? []).some((l) => l.comment_id === commentId && l.session_id === sessionId);
  }

  async function toggleCommentLike(commentId: string) {
    if (!supabase) return;
    if (commentLikedByMe(commentId)) {
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('session_id', sessionId);
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, session_id: sessionId });
    }
    refetchCommentLikes();
  }

  function toggleNodeExpansion(nodeId: string, defaultCollapsed: boolean) {
    if (defaultCollapsed) {
      // Toggle between default (collapsed) and explicitly expanded
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    } else {
      // Toggle between default (expanded) and explicitly collapsed
      setCollapsedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    }
  }

  async function post(parentId: string | null, nick: string, text: string, onDone: () => void) {
    if (!supabase || onCooldown || !nick.trim() || !text.trim()) return;

    // Keep database data intact without altering raw text; only trim and slice to max length
    const rawNick = nick.trim().slice(0, MAX_NICKNAME_LENGTH);
    const rawBody = text.trim().slice(0, MAX_BODY_LENGTH);

    const { error } = await supabase.from('comments').insert({
      target_type: targetType,
      target_id: targetId,
      parent_id: parentId,
      nickname: rawNick,
      body: rawBody,
    });
    if (!error) {
      setLastPostedAt(Date.now());
      onDone();
      refetchComments();
    }
  }

  function renderNode(node: ThreadNode, depth: number) {
    const indentClass = depth === 0 ? '' : depth === 1 ? 'ml-2.5 sm:ml-4' : 'ml-4 sm:ml-6';
    const borderClass = depth === 0 ? ACCENT[accent].border30 : depth === 1 ? ACCENT[accent].border18 : 'border-border';
    const liked = commentLikedByMe(node.id);

    // Only auto-collapse if this node itself has 3+ direct children
    const directChildrenCount = node.children.length;
    const totalRepliesCount = countDescendants(node);
    const defaultCollapsed = directChildrenCount >= DEEP_REPLIES_COLLAPSE_THRESHOLD;
    const isExpanded = defaultCollapsed ? expandedNodes.has(node.id) : !collapsedNodes.has(node.id);

    const activeReplyNick = replyNickname || nickname;

    return (
      <div key={node.id} className={`pl-2.5 py-2 border-l-2 ${borderClass} ${indentClass} min-w-[260px] sm:min-w-[320px]`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-heading text-xs font-bold">{censorNickname(node.nickname)}</span>
          <span className="text-dim text-[10.5px]">{relativeTime(node.created_at)}</span>
          {node.children.length > 0 && (
            <button
              onClick={() => toggleNodeExpansion(node.id, defaultCollapsed)}
              className="text-[10px] text-dim hover:text-heading transition-colors ml-auto cursor-pointer"
              title={isExpanded ? 'collapse thread' : 'expand thread'}
            >
              {isExpanded ? '[-] hide' : `[+] ${totalRepliesCount} ${totalRepliesCount === 1 ? 'reply' : 'replies'}`}
            </button>
          )}
        </div>

        <p className="text-body/90 text-[12.5px] leading-relaxed mt-0.5 whitespace-pre-wrap break-words">
          {censorText(node.body)}
        </p>

        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => toggleCommentLike(node.id)}
            disabled={!supabase}
            className={`flex items-center gap-1 text-[10.5px] font-bold disabled:opacity-40 transition-colors ${
              liked ? ACCENT[accent].likeActive : ACCENT[accent].replyLink
            }`}
          >
            <Heart size={10} fill={liked ? 'currentColor' : 'none'} />
            <span>{commentLikeCount(node.id)}</span>
          </button>
          <button
            onClick={() => {
              if (replyingTo === node.id) {
                setReplyingTo(null);
              } else {
                setReplyingTo(node.id);
                if (!replyNickname && nickname) {
                  setReplyNickname(nickname);
                }
              }
            }}
            className={`text-[10.5px] font-bold ${ACCENT[accent].replyLink} transition-colors cursor-pointer`}
          >
            {replyingTo === node.id ? 'cancel' : 'reply'}
          </button>
        </div>

        {replyingTo === node.id && (
          <div className="mt-2 p-2 bg-surface border-l-2 border-border max-w-xl">
            <div className="flex flex-col sm:flex-row gap-1.5">
              <div className="relative w-full sm:w-28 shrink-0">
                <input
                  type="text"
                  maxLength={MAX_NICKNAME_LENGTH}
                  value={activeReplyNick}
                  onChange={(e) => setReplyNickname(e.target.value)}
                  placeholder="nickname"
                  className="w-full bg-bg border border-border text-heading text-[11.5px] px-1.5 py-1.5 placeholder:text-dim focus:outline-none focus:border-current"
                />
                <span className="absolute right-1 bottom-1 text-[9px] text-dim/60 pointer-events-none">
                  {activeReplyNick.length}/{MAX_NICKNAME_LENGTH}
                </span>
              </div>
              <div className="relative flex-1 min-w-0">
                <textarea
                  maxLength={MAX_BODY_LENGTH}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="reply..."
                  className="w-full bg-bg border border-border text-heading text-xs px-2 py-1.5 h-[46px] sm:h-[34px] resize-none placeholder:text-dim focus:outline-none focus:border-current pb-4"
                />
                <span className="absolute right-1.5 bottom-1 text-[9.5px] text-dim/60 pointer-events-none">
                  {replyBody.length}/{MAX_BODY_LENGTH}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 items-center mt-1.5">
              <button
                onClick={() =>
                  post(node.id, activeReplyNick, replyBody, () => {
                    setReplyBody('');
                    setReplyingTo(null);
                  })
                }
                disabled={onCooldown || !activeReplyNick.trim() || !replyBody.trim()}
                className={`text-[10.5px] font-bold px-2.5 py-1 border ${ACCENT[accent].actionBtn} disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
              >
                reply
              </button>
            </div>
          </div>
        )}

        {/* Children replies handling */}
        {node.children.length > 0 && (
          <div className="mt-1">
            {!isExpanded ? (
              <div className="mt-1.5">
                <button
                  onClick={() => toggleNodeExpansion(node.id, defaultCollapsed)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-amber border border-amber/35 bg-amber/8 hover:bg-amber/16 px-2.5 py-1 transition-colors group cursor-pointer"
                >
                  <span className="font-bold">[+]</span>
                  <span>{totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'} collapsed</span>
                  <span className="text-dim text-[10px] group-hover:text-amber/90 transition-colors">
                    (might be a deep rabbit hole ahead)
                  </span>
                </button>
              </div>
            ) : (
              <div>
                {defaultCollapsed && (
                  <button
                    onClick={() => toggleNodeExpansion(node.id, defaultCollapsed)}
                    className="my-1 text-[10.5px] font-bold text-dim hover:text-amber transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>[-]</span>
                    <span>collapse {totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'}</span>
                  </button>
                )}
                <div className="space-y-0.5">
                  {node.children.map((child) => renderNode(child, depth + 1))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header with Comments title, "my site, my rules" label, count, and like button */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`w-1.5 h-1.5 shrink-0 ${ACCENT[accent].dot}`} />
        <span className={`text-[10px] uppercase tracking-widest font-bold shrink-0 ${ACCENT[accent].text}`}>Comments</span>
        <span className="text-[9.5px] uppercase tracking-wider text-dim/75 border border-border/80 bg-surface/50 px-1.5 py-0.5 shrink-0" title="my site, my rules: endless reply chains with no page redirects">
          my site, my rules
        </span>
        <span className="flex-1 border-t border-dashed border-border min-w-[20px]" />
        <span className="text-dim text-[10px] shrink-0 mr-1">{(comments ?? []).length}</span>
        <button
          onClick={like.toggle}
          disabled={!like.available}
          aria-pressed={like.liked}
          className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 border disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
            like.liked
              ? `${ACCENT[accent].border} ${ACCENT[accent].likeActive} bg-current/10`
              : `border-border text-dim hover:${ACCENT[accent].text} hover:${ACCENT[accent].border}`
          }`}
        >
          <Heart size={13} fill={like.liked ? 'currentColor' : 'none'} />
          <span>{like.count}</span>
        </button>
      </div>

      {/* Main post input box with max character limits & indicators */}
      <div className={`p-2.5 bg-surface border-l-2 ${ACCENT[accent].border}`}>
        <div className="flex flex-col sm:flex-row gap-1.5">
          <div className="relative w-full sm:w-28 shrink-0">
            <input
              type="text"
              maxLength={MAX_NICKNAME_LENGTH}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="nickname"
              className="w-full bg-bg border border-border text-heading text-[11.5px] px-1.5 py-1.5 placeholder:text-dim focus:outline-none focus:border-current"
            />
            <span className="absolute right-1 bottom-1 text-[9px] text-dim/60 pointer-events-none">
              {nickname.length}/{MAX_NICKNAME_LENGTH}
            </span>
          </div>
          <div className="relative flex-1 min-w-0">
            <textarea
              maxLength={MAX_BODY_LENGTH}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="say something about this one..."
              className="w-full bg-bg border border-border text-heading text-xs px-2 py-1.5 h-[48px] sm:h-[38px] resize-none placeholder:text-dim focus:outline-none focus:border-current pb-4"
            />
            <span className="absolute right-1.5 bottom-1 text-[9.5px] text-dim/60 pointer-events-none">
              {body.length}/{MAX_BODY_LENGTH}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] text-dim/70">
            {MAX_BODY_LENGTH - body.length} characters left
          </span>
          <button
            onClick={() => post(null, nickname, body, () => setBody(''))}
            disabled={!supabase || onCooldown || !nickname.trim() || !body.trim()}
            className={`text-[11px] font-bold px-3 py-1 border ${ACCENT[accent].actionBtn} disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
          >
            post
          </button>
        </div>
      </div>

      {/* Endless reply chain container with horizontal & vertical scroll */}
      <div className="mt-2 overflow-x-auto overflow-y-visible pb-2 max-w-full">
        <div className="min-w-fit space-y-0.5">
          {tree.map((node) => renderNode(node, 0))}
        </div>
      </div>

      {!supabase && <p className="text-[10.5px] text-dim mt-2">comments open once the backend is live</p>}
    </div>
  );
}
