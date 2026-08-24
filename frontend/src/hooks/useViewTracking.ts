import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { getSessionId } from '@/lib/session';
import { isLikelyBot } from '@/lib/bot';
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
    if (!supabase || !targetId || !record || isLikelyBot()) return;
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

// A dedicated views row, target_type='site' target_id='site', separate from
// every per-content view count. One per session, same dedup-by-primary-key
// behavior as useViewTracking -- this is "how many sessions have opened the
// site", not a sum of every project/writeup view.
const SITE_TARGET_TYPE = 'site';
const SITE_TARGET_ID = 'site';

export function recordSiteVisit() {
  if (!supabase || isLikelyBot()) return;
  supabase
    .from('views')
    .upsert(
      { target_type: SITE_TARGET_TYPE, target_id: SITE_TARGET_ID, session_id: getSessionId() },
      { onConflict: 'target_type,target_id,session_id', ignoreDuplicates: true },
    )
    .then(() => {});
}

async function fetchSiteViews(): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from('views')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', SITE_TARGET_TYPE)
    .eq('target_id', SITE_TARGET_ID);
  if (error) throw error;
  return count ?? 0;
}

// Read-only -- recording happens once via recordSiteVisit() on app mount
// (see App.tsx), not from every component that displays the count.
export function useTotalViews(): number {
  const { data } = useSupabaseQuery(fetchSiteViews, []);
  return data ?? 0;
}
