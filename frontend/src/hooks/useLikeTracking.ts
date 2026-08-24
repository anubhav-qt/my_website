import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { getSessionId } from '@/lib/session';
import type { TargetType } from '@/lib/backend-types';

interface LikeRow {
  session_id: string;
}

async function fetchLikes(targetType: TargetType, targetId: string): Promise<LikeRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('likes').select('session_id').eq('target_type', targetType).eq('target_id', targetId);
  if (error) throw error;
  return data as LikeRow[];
}

// Page-level like, one per (target, browser session). A single hook call is
// the source of truth -- render it once per entry and pass the result down
// to both the read-only top badge and the clickable button, so they never
// drift out of sync with each other.
export function useLikeTracking(targetType: TargetType, targetId: string) {
  const sessionId = useMemo(() => getSessionId(), []);
  const { data: likes, refetch } = useSupabaseQuery(() => fetchLikes(targetType, targetId), [targetType, targetId]);

  const liked = (likes ?? []).some((l) => l.session_id === sessionId);
  const count = (likes ?? []).length;

  async function toggle() {
    if (!supabase) return;
    if (liked) {
      await supabase.from('likes').delete().eq('target_type', targetType).eq('target_id', targetId).eq('session_id', sessionId);
    } else {
      await supabase.from('likes').insert({ target_type: targetType, target_id: targetId, session_id: sessionId });
    }
    refetch();
  }

  return { liked, count, toggle, available: !!supabase };
}
