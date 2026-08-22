import syncedDocs from '@/data/synced-docs.json';

export interface LogEntry {
  id: string;
  num: number;
  title: string;
  date: string;
  summary: string;
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export const LOG_ENTRIES: LogEntry[] = syncedDocs.spoin.adrs
  .map((a) => ({
    id: `adr-${String(a.adrNumber).padStart(4, '0')}`,
    num: a.adrNumber,
    title: a.title.replace(/^ADR-\d+:\s*/, ''),
    date: formatDate(a.date),
    summary: a.summary,
  }))
  .sort((a, b) => b.num - a.num);
