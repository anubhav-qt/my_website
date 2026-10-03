import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { censorText, censorNickname } from '@/lib/censor';
import { tint, type Accent } from '@/lib/palette';
import type { Comment, TargetType } from '@/lib/backend-types';

// The thread takes the colour of whatever it's under (lib/palette.ts), as --c:
// the label, the thread lines, the collapsed-replies note. The inputs and the
// post button stay black and white like the rest of the interface.
const INPUT =
  'w-full bg-bg border border-tile rounded-lg text-heading placeholder:text-dim focus:outline-none focus:border-tile-hover';

const MAX_NICKNAME_LENGTH = 50;
const MAX_BODY_LENGTH = 2000;
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

const POST_COOLDOWN_MS = 15_000;

export function CommentThread({
  targetType,
  targetId,
  accent,
}: {
  targetType: TargetType;
  targetId: string;
  accent: Accent;
}) {
  const { data: comments, refetch: refetchComments } = useSupabaseQuery(
    () => fetchComments(targetType, targetId),
    [targetType, targetId],
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

  const onCooldown = Date.now() - lastPostedAt < POST_COOLDOWN_MS;

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
    const borderClass = depth === 0 ? 'border-(--c)/40' : depth === 1 ? 'border-(--c)/20' : 'border-border';

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
          <span className="font-dot text-dim text-[10.5px]">{relativeTime(node.created_at)}</span>
          {node.children.length > 0 && (
            <button
              onClick={() => toggleNodeExpansion(node.id, defaultCollapsed)}
              className="font-dot text-[10px] text-dim hover:text-heading transition-colors ml-auto cursor-pointer"
              title={isExpanded ? 'Collapse thread' : 'Expand thread'}
            >
              {isExpanded ? '[-] Hide' : `[+] ${totalRepliesCount} ${totalRepliesCount === 1 ? 'reply' : 'replies'}`}
            </button>
          )}
        </div>

        <p className="text-body text-[12.5px] leading-relaxed mt-0.5 whitespace-pre-wrap break-words">
          {censorText(node.body)}
        </p>

        <div className="flex items-center gap-3 mt-1">
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
            className="font-dot text-[10.5px] text-dim hover:text-heading transition-colors cursor-pointer"
          >
            {replyingTo === node.id ? 'Cancel' : 'Reply'}
          </button>
        </div>

        {replyingTo === node.id && (
          <div className="mt-2 p-2 rounded-xl border border-tile max-w-xl">
            <div className="flex flex-col sm:flex-row gap-1.5">
              <div className="relative w-full sm:w-28 shrink-0">
                <input
                  type="text"
                  maxLength={MAX_NICKNAME_LENGTH}
                  value={activeReplyNick}
                  onChange={(e) => setReplyNickname(e.target.value)}
                  placeholder="Nickname"
                  className={`${INPUT} text-[11.5px] px-2 pt-1.5 pb-5`}
                />
                <span className="absolute right-1.5 bottom-1.5 text-[9px] text-dim/60 pointer-events-none">
                  {activeReplyNick.length}/{MAX_NICKNAME_LENGTH}
                </span>
              </div>
              <div className="relative flex-1 min-w-0">
                <textarea
                  maxLength={MAX_BODY_LENGTH}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Reply..."
                  className={`${INPUT} text-xs px-2 pt-1.5 pb-5 h-[58px] sm:h-[48px] resize-none`}
                />
                <span className="absolute right-2 bottom-1.5 text-[9.5px] text-dim/60 pointer-events-none">
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
                className="btn disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reply
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
                  className="inline-flex items-center gap-1.5 text-[11px] text-(--c) border border-(--c)/35 bg-(--c)/8 hover:bg-(--c)/15 rounded-lg px-2.5 py-1 transition-colors group cursor-pointer"
                >
                  <span className="font-bold">[+]</span>
                  <span>{totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'} collapsed</span>
                  <span className="text-dim text-[10px] group-hover:text-(--c) transition-colors">
                    (might be a deep rabbit hole ahead)
                  </span>
                </button>
              </div>
            ) : (
              <div>
                {defaultCollapsed && (
                  <button
                    onClick={() => toggleNodeExpansion(node.id, defaultCollapsed)}
                    className="my-1 font-dot text-[10.5px] text-dim hover:text-heading transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>[-]</span>
                    <span>Collapse {totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'}</span>
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
    <div className="mt-4" style={tint(accent)}>
      {/* Header with Comments title */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-(--c)" />
        <span className="font-dot text-[10px] uppercase tracking-widest shrink-0 text-(--c)">Comments</span>
        <span className="flex-1 border-t border-dashed border-border min-w-[20px]" />
      </div>

      {/* Main post input box with max character limits & indicators */}
      <div className="p-2.5 rounded-xl border border-tile">
        <div className="flex flex-col sm:flex-row gap-1.5">
          <div className="relative w-full sm:w-28 shrink-0">
            <input
              type="text"
              maxLength={MAX_NICKNAME_LENGTH}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nickname"
              className={`${INPUT} text-[11.5px] px-2 pt-1.5 pb-5`}
            />
            <span className="absolute right-1.5 bottom-1.5 text-[9px] text-dim/60 pointer-events-none">
              {nickname.length}/{MAX_NICKNAME_LENGTH}
            </span>
          </div>
          <div className="relative flex-1 min-w-0">
            <textarea
              maxLength={MAX_BODY_LENGTH}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Say something about this one..."
              className={`${INPUT} text-xs px-2 pt-1.5 pb-5 h-[58px] sm:h-[48px] resize-none`}
            />
            <span className="absolute right-2 bottom-1.5 text-[9.5px] text-dim/60 pointer-events-none">
              {body.length}/{MAX_BODY_LENGTH}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="font-dot text-[10px] text-dim">
            {MAX_BODY_LENGTH - body.length} characters left
          </span>
          <button
            onClick={() => post(null, nickname, body, () => setBody(''))}
            disabled={!supabase || onCooldown || !nickname.trim() || !body.trim()}
            className="btn disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>

      {/* Endless reply chain container with horizontal & vertical scroll */}
      <div className="mt-2 overflow-x-auto overflow-y-visible pb-2 max-w-full">
        <div className="min-w-fit space-y-0.5">
          {tree.map((node) => renderNode(node, 0))}
        </div>
      </div>

      {!supabase && <p className="font-dot text-[10.5px] text-dim mt-2">comments open once the backend is live</p>}
    </div>
  );
}
