import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import type { TargetType } from '@/lib/backend-types';

const CACHE_PREFIX = 'comment-count:';

function readCachedCount(key: string): number {
  if (typeof localStorage === 'undefined') return 0;
  const n = Number(localStorage.getItem(CACHE_PREFIX + key));
  return Number.isFinite(n) ? n : 0;
}

function writeCachedCount(key: string, value: number) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CACHE_PREFIX + key, String(value));
}

export async function fetchCommentCount(targetType: TargetType, targetId: string): Promise<number> {
  if (!supabase || !targetId) return 0;
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .is('deleted_at', null);
  if (error) throw error;
  return count ?? 0;
}

/**
 * Returns the exact live comment count for a given target, with localStorage caching
 * to prevent zero-flashing while client fetch resolves.
 */
export function useCommentTracking(targetType: TargetType, targetId: string): number {
  const cacheKey = `${targetType}:${targetId}`;
  const [count, setCount] = useState(() => readCachedCount(cacheKey));

  const { data } = useSupabaseQuery(() => fetchCommentCount(targetType, targetId), [targetType, targetId]);

  useEffect(() => {
    if (data === null || data === undefined) return;
    setCount(data);
    writeCachedCount(cacheKey, data);
  }, [data, cacheKey]);

  return count;
}
