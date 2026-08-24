import { useCallback, useEffect, useState } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Small fetch hook for the handful of read queries this site needs
// (topics list, comments list, metrics). Deliberately not react-query/swr --
// the site has no async-state deps today and this covers the whole surface
// in ~25 lines.
export function useSupabaseQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
): QueryState<T> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => load(), [load, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
