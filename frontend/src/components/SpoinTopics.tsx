import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import type { Topic } from '@/lib/backend-types';

async function fetchInProductionTopics(): Promise<Topic[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('status', 'in_production')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data as Topic[];
}

export function SpoinTopics() {
  const { data: topics, loading } = useSupabaseQuery(fetchInProductionTopics, []);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const canSubmit = !!supabase && title.trim().length > 0 && !submitting;

  async function handleSubmit() {
    if (!supabase || !canSubmit) return;
    setSubmitting(true);
    const { error } = await supabase.from('topics').insert({
      title: title.trim(),
      note: note.trim() || null,
      status: 'suggested',
    });
    setSubmitting(false);
    if (!error) {
      setTitle('');
      setNote('');
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 4000);
    }
  }

  return (
    <div className="mt-3 pt-2.5 border-t border-dashed border-border/70">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 shrink-0 bg-amber" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-amber shrink-0">Live Topics</span>
        <span className="flex-1 border-t border-dashed border-border" />
        {!loading && <span className="text-dim text-[10px] shrink-0">{String(topics?.length ?? 0).padStart(2, '0')}</span>}
      </div>

      {loading && (
        <div className="flex flex-col gap-1.5">
          {[130, 96, 150].map((w, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="w-[5px] h-[5px] rounded-full bg-border" />
              <span className="h-[9px] bg-border rounded-sm animate-pulse" style={{ width: w }} />
            </div>
          ))}
        </div>
      )}

      {!loading && (!topics || topics.length === 0) && (
        <p className="text-[11.5px] text-dim italic py-1">no topics yet, be the first to suggest one</p>
      )}

      {!loading && topics && topics.length > 0 && (
        <div className="flex flex-col">
          {topics.map((t) => (
            <div key={t.id} className="flex items-baseline gap-2 py-1 border-b border-dashed border-border/50 last:border-none">
              <span className="w-[5px] h-[5px] rounded-full bg-amber shadow-[0_0_6px_rgba(217,138,79,0.5)] shrink-0 translate-y-[-1px]" />
              <span className="text-xs font-semibold text-heading">{t.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-dashed border-border">
        <div className="text-[10px] uppercase tracking-wide text-dim font-bold mb-1.5">suggest a topic</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="topic title"
            maxLength={80}
            className="flex-1 min-w-0 bg-surface border border-border text-heading text-xs px-2 py-1.5 placeholder:text-dim focus:outline-none focus:border-amber transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="shrink-0 bg-amber/8 border border-amber/50 text-amber text-[11px] font-bold px-3 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-amber hover:enabled:bg-amber/16 transition-colors"
          >
            suggest
          </button>
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="optional note (why this one?)"
          maxLength={160}
          className="w-full mt-1.5 bg-surface border border-border text-heading text-xs px-2 py-1.5 placeholder:text-dim focus:outline-none focus:border-amber transition-colors"
        />
        {justSubmitted && <p className="text-[10.5px] text-sage mt-1.5">thanks, it's in the queue</p>}
        {!supabase && <p className="text-[10.5px] text-dim mt-1.5">topic suggestions open once the backend is live</p>}
      </div>
    </div>
  );
}
