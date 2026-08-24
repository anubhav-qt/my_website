import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { getSessionId } from '@/lib/session';
import type { TargetType } from '@/lib/backend-types';

async function fetchViewCount(targetType: TargetType, targetId: string): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from('views')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);
  if (error) throw error;
  return count ?? 0;
}

// Records at most one view per (target, browser session) -- the "views" table's
// primary key makes a repeat insert a no-op, so any number of clicks in one
// session collapses to a single view.
export function useViewTracking(targetType: TargetType, targetId: string): number {
  useEffect(() => {
    if (!supabase || !targetId) return;
    supabase
      .from('views')
      .upsert(
        { target_type: targetType, target_id: targetId, session_id: getSessionId() },
        { onConflict: 'target_type,target_id,session_id', ignoreDuplicates: true },
      )
      .then(() => {});
  }, [targetType, targetId]);

  const { data } = useSupabaseQuery(() => fetchViewCount(targetType, targetId), [targetType, targetId]);
  return data ?? 0;
}
