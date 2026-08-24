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
//
// `record` gates whether a view is actually written: the count is always
// fetched and shown, but a new row is only inserted when the caller says the
// visitor actually engaged with this content -- landing on a dedicated page
// counts (that page load only happens via a click), but merely rendering a
// list item does not, so callers on a list (e.g. a project card that's
// collapsed by default) should pass `record` only once the user opens it.
export function useViewTracking(targetType: TargetType, targetId: string, record = true): number {
  useEffect(() => {
    if (!supabase || !targetId || !record) return;
    supabase
      .from('views')
      .upsert(
        { target_type: targetType, target_id: targetId, session_id: getSessionId() },
        { onConflict: 'target_type,target_id,session_id', ignoreDuplicates: true },
      )
      .then(() => {});
  }, [targetType, targetId, record]);

  const { data } = useSupabaseQuery(() => fetchViewCount(targetType, targetId), [targetType, targetId]);
  return data ?? 0;
}

async function fetchTotalViews(): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await supabase.from('views').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

// Site-wide total across every target -- read-only, records nothing.
export function useTotalViews(): number {
  const { data } = useSupabaseQuery(fetchTotalViews, []);
  return data ?? 0;
}
