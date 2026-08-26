import { Fragment, useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  AlertTriangle,
  Zap,
  Layers,
  Cpu,
  Plus,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
  ArrowRight,
  ArrowDown,
  Database,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';
import {
  createInitialState,
  tickSimulation,
  THINKING_LADDER,
  GENERATOR_LADDER,
} from '@/lib/simulator/engine';
import type { SimulationState, KeyConfig, ModelLadderEntry } from '@/lib/simulator/types';

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  poisoned: boolean;
}

export function SpoinSimulator() {
  const [state, setState] = useState<SimulationState>(() => createInitialState());
  const [speedMs, setSpeedMs] = useState<number>(300);
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const [showStaticFallback, setShowStaticFallback] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [lines, setLines] = useState<Line[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const topicRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) setShowStaticFallback(true);
  }, []);

  const handleStep = useCallback(() => {
    setState((prev: SimulationState) => tickSimulation(prev));
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev: SimulationState) => createInitialState({ ...prev.config }));
    setSelectedCellKey(null);
  }, []);

  const toggleRun = useCallback(() => {
    setState((prev: SimulationState) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(() => {
        setState((prev: SimulationState) => {
          if (!prev.isRunning || prev.status === 'completed' || prev.status === 'exhausted_requeued') {
            return { ...prev, isRunning: false };
          }
          return tickSimulation(prev);
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, speedMs]);

  const toggleSerialization = () => {
    setState((prev: SimulationState) => ({
      ...prev,
      config: { ...prev.config, serializeSameCellCalls: !prev.config.serializeSameCellCalls },
    }));
  };

  const handleRunFailureCase = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const failureKeys: KeyConfig[] = [
      { keyIndex: 0, projectId: 'proj-alpha', label: 'Key 0 (Shared Proj-Alpha)' },
      { keyIndex: 1, projectId: 'proj-alpha', label: 'Key 1 (Shared Proj-Alpha)' },
      { keyIndex: 2, projectId: 'proj-alpha', label: 'Key 2 (Shared Proj-Alpha)' },
    ];
    const newState = createInitialState({ keys: failureKeys, serializeSameCellCalls: false });
    newState.isRunning = true;
    setState(newState);
  };

  const handleRunOptimalCase = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const optimalKeys: KeyConfig[] = [
      { keyIndex: 0, projectId: 'proj-alpha', label: 'Key 0 (Proj Alpha)' },
      { keyIndex: 1, projectId: 'proj-beta', label: 'Key 1 (Proj Beta)' },
      { keyIndex: 2, projectId: 'proj-gamma', label: 'Key 2 (Proj Gamma)' },
    ];
    const newState = createInitialState({ keys: optimalKeys, serializeSameCellCalls: true });
    newState.isRunning = true;
    setState(newState);
  };

  const handleAddKey = (isSameProject: boolean) => {
    setState((prev: SimulationState) => {
      const nextIndex = prev.config.keys.length;
      const projectId = isSameProject ? 'proj-alpha' : `proj-${String.fromCharCode(97 + nextIndex)}`;
      const label = `Key ${nextIndex} (${isSameProject ? 'Shared Proj-Alpha' : 'New Project'})`;
      const nextKeys = [...prev.config.keys, { keyIndex: nextIndex, projectId, label }];
      return createInitialState({ ...prev.config, keys: nextKeys });
    });
  };

  const handleForce429 = (cellKey: string) => {
    setState((prev: SimulationState) => {
      const cell = prev.cells[cellKey];
      if (!cell) return prev;
      const updated: SimulationState = { ...prev };
      updated.cells[cellKey] = { ...cell, isPoisoned429: true, rpdSpent: cell.rpdLimit };
      updated.stats.total429BurstErrors += 1;
      updated.events.unshift({
        id: `evt-force-429-${state.tick}-${cellKey}`,
        tick: updated.tick,
        type: 'burst_429',
        message: `Manual 429 injected into [Key ${cell.keyIndex}:${cell.modelId}].`,
      });
      return updated;
    });
  };

  const handleDrainRPD = (cellKey: string) => {
    setState((prev: SimulationState) => {
      const cell = prev.cells[cellKey];
      if (!cell) return prev;
      const updated: SimulationState = { ...prev };
      updated.cells[cellKey] = { ...cell, rpdSpent: cell.rpdLimit };
      return updated;
    });
  };

  const poisonedCellCount = Object.values(state.cells).filter((c) => c.isPoisoned429).length;

  // Groups that had a card looped back (rejected) on the tick just simulated,
  // so the loop-back arrow in their chip can flash instead of staying static.
  const justRejectedGroupIds = useMemo(() => {
    const ids = new Set<string>();
    for (const evt of state.events) {
      if (evt.tick !== state.tick) break;
      if (evt.type === 'card_rejected' && evt.meta?.groupId) ids.add(evt.meta.groupId as string);
    }
    return ids;
  }, [state.events, state.tick]);

  // Recompute the pipeline -> quota-cell connector lines whenever active tasks change.
  // Each line starts at the exact topic/subtopic-group element driving the call.
  useLayoutEffect(() => {
    const recompute = () => {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();
      const next: Line[] = [];

      for (const task of state.activeTasks) {
        if (!task.targetCell) continue;
        const originEl = task.type === 'curriculum' ? topicRefs.current[task.topicId] : task.groupId ? groupRefs.current[task.groupId] : null;
        const cellKey = `${task.targetCell.keyIndex}:${task.targetCell.modelId}`;
        const cellEl = cellRefs.current[cellKey];
        if (!originEl || !cellEl) continue;

        const originRect = originEl.getBoundingClientRect();
        const cellRect = cellEl.getBoundingClientRect();

        next.push({
          id: task.id,
          x1: originRect.left + originRect.width / 2 - containerRect.left,
          y1: originRect.bottom - containerRect.top,
          x2: cellRect.left + cellRect.width / 2 - containerRect.left,
          y2: cellRect.top - containerRect.top,
          color: task.burstTriggered429 ? '#e08a9a' : '#d98a4f',
          poisoned: Boolean(task.burstTriggered429),
        });
      }
      setLines(next);
    };

    const raf = requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', recompute);
    };
  }, [state.activeTasks, state.tick, showAdvanced]);

  const registerTopicRef = (key: string) => (el: HTMLDivElement | null) => {
    topicRefs.current[key] = el;
  };
  const registerGroupRef = (key: string) => (el: HTMLDivElement | null) => {
    groupRefs.current[key] = el;
  };
  const registerCellRef = (key: string) => (el: HTMLDivElement | null) => {
    cellRefs.current[key] = el;
  };

  const cellColor = (cell: SimulationState['cells'][string]) => {
    if (cell.isPoisoned429) return 'bg-rose/70 border-rose text-bg';
    if (cell.rpdSpent >= cell.rpdLimit) return 'bg-dim/20 border-border text-dim';
    if (cell.isLocked) return 'bg-amber/70 border-amber text-bg';
    if (cell.rpmInFlightCount > 0) return 'bg-amber/40 border-amber/60 text-heading';
    return 'bg-sage/10 border-sage/40 text-body';
  };

  return (
    <div
      className="rounded-xl border border-border bg-surface overflow-hidden shadow-xl"
      role="region"
      aria-label="Spoin generation pipeline and quota governor, interactive simulator"
    >
      <div ref={liveRegionRef} className="sr-only" aria-live="polite">
        {state.events[0]?.message || 'Simulator ready'}
      </div>

      {/* Control bar */}
      <div className="px-3 py-2 border-b border-border bg-bg/40 flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <button
          onClick={toggleRun}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 rounded font-bold text-bg transition-colors ${
            state.isRunning ? 'bg-amber hover:bg-amber/80' : 'bg-sage hover:bg-sage/80'
          }`}
          aria-label={state.isRunning ? 'Pause simulation' : 'Start simulation'}
        >
          {state.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {state.isRunning ? 'Pause' : 'Run'}
        </button>
        <button
          onClick={handleStep}
          disabled={state.isRunning || state.status === 'completed'}
          className="flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded border border-border text-body hover:text-heading hover:border-dim disabled:opacity-40 transition-colors"
          title="Advance one tick"
        >
          <StepForward className="w-3 h-3" /> Step
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded border border-border text-body hover:text-heading hover:border-dim transition-colors"
          title="Reset simulation"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>

        <div className="w-px h-4 bg-border mx-0.5" />

        <button
          onClick={toggleSerialization}
          title={
            state.config.serializeSameCellCalls
              ? 'ADR-0040 serialization ON: same (key, model) cell calls are locked sequentially, zero phantom 429s'
              : 'ADR-0040 serialization OFF: concurrent calls can burst a cell past its RPM ceiling'
          }
          className={`flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded font-bold transition-colors ${
            state.config.serializeSameCellCalls
              ? 'bg-amber/15 border border-amber/50 text-amber'
              : 'bg-rose/15 border border-rose/50 text-rose'
          }`}
        >
          <Zap className={`w-3 h-3 ${!state.config.serializeSameCellCalls ? 'animate-pulse' : ''}`} />
          ADR-0040 {state.config.serializeSameCellCalls ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={handleRunFailureCase}
          title="Preset: shared-project keys, serialization off — triggers the ADR-0040 race"
          className="flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded bg-rose/10 border border-rose/30 text-rose hover:bg-rose/20 transition-colors"
        >
          <Flame className="w-3 h-3" /> Failure Case
        </button>
        <button
          onClick={handleRunOptimalCase}
          title="Preset: independent-project keys, serialization on — the fixed path"
          className="flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded bg-sage/10 border border-sage/30 text-sage hover:bg-sage/20 transition-colors"
        >
          <ShieldCheck className="w-3 h-3" /> Fixed
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 text-dim">
            {[
              { label: '1x', ms: 600 },
              { label: '2x', ms: 300 },
              { label: '5x', ms: 100 },
            ].map((spd) => (
              <button
                key={spd.ms}
                onClick={() => setSpeedMs(spd.ms)}
                className={`px-1.5 py-0.5 rounded border ${
                  speedMs === spd.ms ? 'border-amber/50 text-amber' : 'border-transparent hover:text-heading'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-dim hover:text-heading underline underline-offset-2"
          >
            {showAdvanced ? 'hide keys' : 'keys'}
          </button>
          <span
            title="Watch the ADR-0040 bug: toggle serialization off and count the phantom 429s. Lines below trace each in-flight call down to the exact (key, model) cell it acquired."
            className="shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-dim" />
          </span>
        </div>
      </div>

      {showAdvanced && (
        <div className="px-3 py-2 border-b border-border bg-bg/20 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddKey(false)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-body hover:text-heading"
            >
              <Plus className="w-2.5 h-2.5" /> independent key
            </button>
            <button
              onClick={() => handleAddKey(true)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber/30 text-amber hover:bg-amber/10"
            >
              <AlertTriangle className="w-2.5 h-2.5" /> same-project key
            </button>
          </div>
          <button
            onClick={() => setShowStaticFallback(!showStaticFallback)}
            className="flex items-center gap-1 text-dim hover:text-heading"
          >
            <Eye className="w-3 h-3" /> {showStaticFallback ? 'interactive' : 'static'}
          </button>
        </div>
      )}

      {(state.status === 'completed' || state.status === 'exhausted_requeued') && (
        <div
          className={`px-3 py-2 border-b text-[11px] font-mono flex items-center justify-between gap-2 ${
            state.stats.total429BurstErrors > 0
              ? 'bg-rose/10 border-rose/30 text-rose'
              : 'bg-sage/10 border-sage/30 text-sage'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {state.stats.total429BurstErrors > 0 ? (
              <XCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {state.stats.totalCardsAccepted} cards committed · {state.stats.total429BurstErrors} phantom 429s ·{' '}
              {poisonedCellCount} cell(s) poisoned
            </span>
          </div>
          <button onClick={handleReset} className="text-[10px] underline underline-offset-2 hover:text-heading">
            reset
          </button>
        </div>
      )}

      {showStaticFallback ? (
        <div className="p-4 bg-bg/20 text-[11px] font-mono text-body space-y-1">
          <div>Status: <strong className="text-heading">{state.status.toUpperCase()}</strong> (tick {state.tick})</div>
          <div>ADR-0040 serialization: <strong className="text-heading">{state.config.serializeSameCellCalls ? 'ON' : 'OFF'}</strong></div>
          <div>Cards committed: <strong className="text-sage">{state.stats.totalCardsAccepted}</strong></div>
          <div>Phantom 429s: <strong className="text-rose">{state.stats.total429BurstErrors}</strong></div>
        </div>
      ) : (
        <div ref={containerRef} className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {lines.map((line) => {
              const path = `M${line.x1} ${line.y1} L${line.x2} ${line.y2}`;
              return (
                <g key={line.id}>
                  <path d={path} stroke={line.color} strokeWidth={1.25} strokeDasharray="3 3" fill="none" opacity={0.5} />
                  <circle r={2.5} fill={line.color}>
                    <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Pipeline: one swimlane per topic, drawn horizontally, all running in parallel */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5 text-amber" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-heading">LangGraph Pipeline</h3>
              <span className="text-[10px] text-dim ml-auto">{state.activeTasks.length} worker task(s)</span>
            </div>
            <div
              className="flex flex-col items-center gap-0.5 mb-2"
              title="fan_out_topics: START Send()s every topic's resolve_and_plan_topic concurrently, not one at a time."
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-bg/50 text-[9px] font-mono font-bold text-heading">
                <ListChecks className="w-3 h-3 text-amber" />
                {state.topics.length} input topics
              </div>
              <ArrowDown className="w-3 h-3 text-dim" />
              <span className="text-[8px] font-mono text-dim">fan out, all concurrent</span>
            </div>

            <div className="space-y-1.5">
              {state.topics.map((topic) => {
                const isTopicPlanning = topic.status === 'planning';
                return (
                  <div
                    key={topic.id}
                    className={`flex flex-col sm:flex-row items-stretch gap-1.5 p-1.5 rounded-lg border transition-colors ${
                      isTopicPlanning || topic.status === 'generating' ? 'border-border bg-bg/20' : 'border-border/60 bg-transparent'
                    }`}
                  >
                    <div
                      ref={registerTopicRef(topic.id)}
                      title={`resolve_and_plan_topic (thinking pool): ${topic.name}. Generates curriculum, groups subtopics by subtopic_group_id.`}
                      className={`shrink-0 w-full sm:w-[118px] flex flex-col justify-center px-2 py-1 rounded border text-[9px] font-mono transition-colors ${
                        isTopicPlanning ? 'border-amber bg-amber/15 text-amber' : 'border-border text-body'
                      }`}
                    >
                      <span className="font-bold leading-snug break-words">{topic.name}</span>
                      <span className={isTopicPlanning ? 'text-amber' : 'text-dim'}>
                        {isTopicPlanning ? 'curriculum…' : topic.status === 'pending' ? 'queued' : `${topic.groups.filter((g) => g.status === 'completed').length}/${topic.groups.length} groups`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 flex-1">
                      {topic.groups.map((group) => {
                        const stage: 'idle' | 'generate' | 'gate' | 'persist' =
                          group.status === 'completed' ? 'persist' : group.status === 'gating' ? 'gate' : group.status === 'generating' ? 'generate' : 'idle';
                        const justLooped = justRejectedGroupIds.has(group.id);
                        return (
                          <div
                            key={group.id}
                            ref={registerGroupRef(group.id)}
                            title={`${group.name}: tier ${Math.min(group.currentTierIndex + 1, group.tiers.length)}/${group.tiers.length}${
                              group.rejectedCount ? `, ${group.rejectedCount} rejection(s) fed back this tier` : ''
                            }`}
                            className={`flex flex-col gap-1 px-1.5 py-1 rounded border text-[9px] font-mono min-w-[148px] transition-colors ${
                              stage === 'persist'
                                ? 'border-sage/40 bg-sage/5'
                                : stage !== 'idle'
                                ? 'border-amber/40 bg-amber/5'
                                : 'border-border bg-transparent'
                            }`}
                          >
                            <span className="text-body leading-snug break-words">{group.name}</span>

                            <div className="flex items-center gap-1">
                              <span
                                className={`px-1 py-0.5 rounded text-[8px] ${stage === 'generate' ? 'bg-gold text-bg font-bold' : 'bg-bg/60 text-dim'}`}
                              >
                                gen
                              </span>
                              <span className={`flex items-center ${justLooped ? 'text-rose animate-pulse' : 'text-dim'}`} aria-hidden="true">
                                <RotateCcw className="w-2 h-2" />
                              </span>
                              <span
                                className={`px-1 py-0.5 rounded text-[8px] ${stage === 'gate' ? 'bg-amber text-bg font-bold' : 'bg-bg/60 text-dim'}`}
                              >
                                gate
                              </span>
                              <ArrowRight className="w-2 h-2 text-dim" />
                              <span
                                className={`px-1 py-0.5 rounded text-[8px] ${stage === 'persist' ? 'bg-sage text-bg font-bold' : 'bg-bg/60 text-dim'}`}
                              >
                                ✓
                              </span>
                              {group.rejectedCount > 0 && (
                                <span className="text-rose font-bold ml-auto">↺{group.rejectedCount}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-0.5">
                              {group.tiers.map((tier, idx) => (
                                <div
                                  key={tier}
                                  className={`flex-1 h-1 rounded-full ${
                                    idx < group.currentTierIndex || group.status === 'completed'
                                      ? 'bg-sage'
                                      : idx === group.currentTierIndex
                                      ? 'bg-amber'
                                      : 'bg-border'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fan-in: every lane's gate_and_persist converges on Postgres (ADR-0041) */}
            <div className="flex flex-col items-center gap-0.5 mt-3 pt-2.5 border-t border-dashed border-border/60">
              <ArrowDown className="w-3 h-3 text-dim" />
              <span className="text-[8px] font-mono text-dim">fan in, per-group as each finishes</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sage/40 bg-sage/10 text-[9px] font-mono font-bold text-sage">
                <Database className="w-3 h-3" />
                {state.stats.totalCardsAccepted} cards persisted in Postgres
              </div>
            </div>

            {state.feed.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                {state.feed.slice(0, 4).map((item) => (
                  <span
                    key={item.id}
                    title={item.title}
                    className="px-1.5 py-0.5 rounded border border-sage/30 bg-sage/5 text-[9px] font-mono text-sage max-w-[180px] break-words"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quota governor grid */}
          <div className="p-4 bg-bg/20">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-3.5 h-3.5 text-amber" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-heading">Quota Governor</h3>
              <span className="text-[10px] text-dim">{state.config.keys.length} keys</span>
              <span
                title="ADR-0028 search order: model top-down, then key index. Grid exhaustion raises QuotaExhaustedError, which requeues the job as pending, never failed."
                className="ml-auto shrink-0"
              >
                <Info className="w-3 h-3 text-dim" />
              </span>
            </div>

            {(['thinking', 'generator'] as const).map((pool) => {
              const models = pool === 'thinking' ? THINKING_LADDER : GENERATOR_LADDER;
              return (
                <div key={pool} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono">
                    <span className={`px-1 py-0.5 rounded ${pool === 'thinking' ? 'bg-clay/15 text-clay' : 'bg-gold/15 text-gold'}`}>
                      {pool}
                    </span>
                  </div>
                  <div className="overflow-x-auto -mx-1 px-1">
                    <div
                      className="grid gap-1 w-max min-w-full"
                      style={{ gridTemplateColumns: `82px repeat(${state.config.keys.length}, minmax(44px, 1fr))` }}
                    >
                      <div className="sticky left-0 bg-bg z-10" />
                      {state.config.keys.map((k: KeyConfig) => (
                        <div key={k.keyIndex} className="text-center text-[8px] font-mono text-dim truncate" title={k.label}>
                          K{k.keyIndex}
                        </div>
                      ))}
                      {models.map((model: ModelLadderEntry) => (
                        <Fragment key={model.modelId}>
                          <div
                            className="sticky left-0 bg-bg z-10 text-[9px] font-mono text-body truncate pr-1 self-center"
                            title={`${model.name} — RPD ${model.rpdLimit}, RPM ${model.rpmLimit}`}
                          >
                            {model.name.replace('Gemini ', '')}
                          </div>
                          {state.config.keys.map((key: KeyConfig) => {
                            const cellKey = `${key.keyIndex}:${model.modelId}`;
                            const cell = state.cells[cellKey];
                            if (!cell) return <div key={cellKey} />;
                            return (
                              <div
                                key={cellKey}
                                ref={registerCellRef(cellKey)}
                                onClick={() => setSelectedCellKey(cellKey)}
                                title={`Key ${cell.keyIndex} · ${model.name}: ${cell.rpdSpent}/${cell.rpdLimit} RPD, ${cell.rpmWindowCalls.length}/${cell.rpmLimit} RPM`}
                                className={`h-6 rounded border cursor-pointer transition-colors flex items-center justify-center text-[8px] font-mono font-bold ${cellColor(
                                  cell
                                )} ${selectedCellKey === cellKey ? 'ring-2 ring-amber' : ''}`}
                              >
                                {cell.isPoisoned429 ? <XCircle className="w-2.5 h-2.5" /> : ''}
                              </div>
                            );
                          })}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3 text-[9px] font-mono text-dim mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-sage/30 border border-sage/40" /> open</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber/70 border border-amber" /> locked / in-flight</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose/70 border border-rose" /> poisoned (429)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-dim/20 border border-border" /> RPD spent</span>
            </div>

            {selectedCellKey && state.cells[selectedCellKey] && (
              <div className="mt-2 p-2 rounded border border-border bg-surface flex items-center justify-between gap-2 text-[10px] font-mono">
                <span className="text-body">
                  [{selectedCellKey}] {state.cells[selectedCellKey].rpdSpent}/{state.cells[selectedCellKey].rpdLimit} RPD
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleForce429(selectedCellKey)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose text-bg font-bold hover:bg-rose/80"
                    title="Force a false 429 on this cell"
                  >
                    <Flame className="w-2.5 h-2.5" /> 429
                  </button>
                  <button
                    onClick={() => handleDrainRPD(selectedCellKey)}
                    className="px-1.5 py-0.5 rounded border border-border text-body hover:text-heading"
                    title="Drain today's RPD on this cell"
                  >
                    drain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-border bg-bg/40 flex flex-wrap items-center gap-3 text-[10px] font-mono text-dim">
        <span>tick <strong className="text-heading">{state.tick}</strong></span>
        <span>
          <strong
            className={
              state.status === 'completed' ? 'text-sage' : state.status === 'exhausted_requeued' ? 'text-amber' : 'text-body'
            }
          >
            {state.status.replace('_', ' ')}
          </strong>
        </span>
        <span>cards <strong className="text-sage">{state.stats.totalCardsAccepted}</strong></span>
        <span>429s <strong className={state.stats.total429BurstErrors > 0 ? 'text-rose' : 'text-dim'}>{state.stats.total429BurstErrors}</strong></span>
        <span className="ml-auto truncate max-w-xs text-body/70">{state.events[0]?.message || 'standing by'}</span>
      </div>
    </div>
  );
}
