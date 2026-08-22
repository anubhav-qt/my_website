import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ArrowDown,
  Database,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  createInitialState,
  tickSimulation,
  THINKING_LADDER,
  GENERATOR_LADDER,
} from '@/lib/simulator/engine';
import type {
  SimulationState,
  SimTopic,
  SimSubtopicGroup,
  DifficultyTier,
  FeedItem,
  KeyConfig,
  ModelLadderEntry,
} from '@/lib/simulator/types';

export function SpoinSimulator() {
  const [state, setState] = useState<SimulationState>(() => createInitialState());
  const [speedMs, setSpeedMs] = useState<number>(300);
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const [showStaticFallback, setShowStaticFallback] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'tree' | 'feed'>('diagram');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Check user prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShowStaticFallback(true);
    }
  }, []);

  const handleStep = useCallback(() => {
    setState((prev: SimulationState) => tickSimulation(prev));
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev: SimulationState) => createInitialState({ ...prev.config }));
  }, []);

  const toggleRun = useCallback(() => {
    setState((prev: SimulationState) => {
      const nextIsRunning = !prev.isRunning;
      return { ...prev, isRunning: nextIsRunning };
    });
  }, []);

  // Tick timer
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
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, speedMs]);

  // Handle ADR-0040 toggle
  const toggleSerialization = () => {
    setState((prev: SimulationState) => ({
      ...prev,
      config: {
        ...prev.config,
        serializeSameCellCalls: !prev.config.serializeSameCellCalls,
      },
    }));
  };

  // Run Failure Case preset (Off serialization + 3 shared project keys)
  const handleRunFailureCase = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const failureKeys: KeyConfig[] = [
      { keyIndex: 0, projectId: 'proj-alpha', label: 'Key 0 (Shared Proj-Alpha)' },
      { keyIndex: 1, projectId: 'proj-alpha', label: 'Key 1 (Shared Proj-Alpha)' },
      { keyIndex: 2, projectId: 'proj-alpha', label: 'Key 2 (Shared Proj-Alpha)' },
    ];
    const newState = createInitialState({
      keys: failureKeys,
      serializeSameCellCalls: false,
    });
    newState.isRunning = true;
    setState(newState);
  };

  // Run Optimal Case preset (On serialization + 3 independent project keys)
  const handleRunOptimalCase = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const optimalKeys: KeyConfig[] = [
      { keyIndex: 0, projectId: 'proj-alpha', label: 'Key 0 (Proj Alpha)' },
      { keyIndex: 1, projectId: 'proj-beta', label: 'Key 1 (Proj Beta)' },
      { keyIndex: 2, projectId: 'proj-gamma', label: 'Key 2 (Proj Gamma)' },
    ];
    const newState = createInitialState({
      keys: optimalKeys,
      serializeSameCellCalls: true,
    });
    newState.isRunning = true;
    setState(newState);
  };

  // Add a new key
  const handleAddKey = (isSameProject: boolean) => {
    setState((prev: SimulationState) => {
      const nextIndex = prev.config.keys.length;
      const projectId = isSameProject ? 'proj-alpha' : `proj-${String.fromCharCode(97 + nextIndex)}`;
      const label = `Key ${nextIndex} (${isSameProject ? 'Shared Proj-Alpha' : 'New Project'})`;
      const nextKeys = [...prev.config.keys, { keyIndex: nextIndex, projectId, label }];
      return createInitialState({
        ...prev.config,
        keys: nextKeys,
      });
    });
  };

  // Force 429 on selected cell
  const handleForce429 = (cellKey: string) => {
    setState((prev: SimulationState) => {
      const cell = prev.cells[cellKey];
      if (!cell) return prev;
      const updated: SimulationState = { ...prev };
      updated.cells[cellKey] = {
        ...cell,
        isPoisoned429: true,
        rpdSpent: cell.rpdLimit,
      };
      updated.stats.total429BurstErrors += 1;
      updated.events.unshift({
        id: `evt-force-429-${Date.now()}`,
        tick: updated.tick,
        type: 'burst_429',
        message: `Manual 429 injected into [Key ${cell.keyIndex}:${cell.modelId}]. Cell marked exhausted.`,
      });
      return updated;
    });
  };

  // Drain RPD on selected cell
  const handleDrainRPD = (cellKey: string) => {
    setState((prev: SimulationState) => {
      const cell = prev.cells[cellKey];
      if (!cell) return prev;
      const updated: SimulationState = { ...prev };
      updated.cells[cellKey] = {
        ...cell,
        rpdSpent: cell.rpdLimit,
      };
      updated.events.unshift({
        id: `evt-drain-${Date.now()}`,
        tick: updated.tick,
        type: 'acquire_failed',
        message: `Drained daily RPD on [Key ${cell.keyIndex}:${cell.modelId}] (${cell.rpdLimit}/${cell.rpdLimit} spent).`,
      });
      return updated;
    });
  };

  const allModels: ModelLadderEntry[] = useMemo(() => [...THINKING_LADDER, ...GENERATOR_LADDER], []);

  // Compute active stages in LangGraph
  const isPlanningActive = state.activeTasks.some((t) => t.type === 'curriculum');
  const isCardGenActive = state.activeTasks.some((t) => t.type === 'card_gen');
  const isPass1Active = state.activeTasks.some((t) => t.type === 'pass1_correction');
  const isPass2Active = state.activeTasks.some((t) => t.type === 'pass2_verification');

  // Count poisoned cells
  const poisonedCellCount = Object.values(state.cells).filter((c) => c.isPoisoned429).length;

  return (
    <div
      className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] overflow-hidden shadow-xl"
      role="region"
      aria-label="Spoin Generation Pipeline and Quota Governor Interactive Simulator"
    >
      {/* Screen Reader Live Announcements */}
      <div ref={liveRegionRef} className="sr-only" aria-live="polite">
        {state.events[0]?.message || 'Simulator ready'}
      </div>

      {/* Top Banner: One-Line Objective */}
      <div className="px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span>
            <strong>Objective:</strong> Watch the ADR-0040 bug in real time — toggle serialization off and count the 429s.
          </span>
        </div>

        {/* 1-Click Presets */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunFailureCase}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 font-bold transition-colors"
            title="Preset: Trigger the ADR-0040 race condition bug"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Run Failure Case</span>
          </button>
          <button
            onClick={handleRunOptimalCase}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/20 font-bold transition-colors"
            title="Preset: Run serialized pipeline across independent keys"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Run Serialized (Fixed)</span>
          </button>
        </div>
      </div>

      {/* Primary Control Bar */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRun}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-white transition-all shadow-sm ${
              state.isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            aria-label={state.isRunning ? 'Pause simulation' : 'Start simulation'}
          >
            {state.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{state.isRunning ? 'Pause' : 'Run'}</span>
          </button>

          <button
            onClick={handleStep}
            disabled={state.isRunning || state.status === 'completed'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] disabled:opacity-40 transition-colors"
            title="Advance 1 step"
            aria-label="Step simulation forward by one tick"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            title="Reset simulation state"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* The ADR-0040 Serialization Switch */}
        <div className="flex items-center gap-3 bg-[var(--bg-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border-strong)]">
          <div className="flex items-center gap-2">
            <Zap
              className={`w-4 h-4 ${
                state.config.serializeSameCellCalls ? 'text-amber-500' : 'text-rose-500 animate-pulse'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[var(--text-primary)] font-mono">
                ADR-0040 Serialization
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                {state.config.serializeSameCellCalls ? 'Locked sequentially (Zero 429s)' : 'Concurrent burst past RPM (Buggy)'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleSerialization}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
              state.config.serializeSameCellCalls
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            aria-pressed={state.config.serializeSameCellCalls}
          >
            {state.config.serializeSameCellCalls ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Speed & Advanced Options */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[10px]">Speed:</span>
            {[
              { label: '1x', ms: 600 },
              { label: '2x', ms: 300 },
              { label: '5x', ms: 100 },
            ].map((spd) => (
              <button
                key={spd.ms}
                onClick={() => setSpeedMs(spd.ms)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                  speedMs === spd.ms
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent)] font-semibold'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
          >
            {showAdvanced ? 'Hide Advanced' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Advanced Drawer */}
      {showAdvanced && (
        <div className="p-3 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Key Management:</span>
            <button
              onClick={() => handleAddKey(false)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Plus className="w-3 h-3" />
              <span>+ Independent Project Key</span>
            </button>
            <button
              onClick={() => handleAddKey(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>+ Same-Project Key (Shares RPM)</span>
            </button>
          </div>

          <button
            onClick={() => setShowStaticFallback(!showStaticFallback)}
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showStaticFallback ? 'Interactive Canvas' : 'Static Fallback Diagram'}</span>
          </button>
        </div>
      )}

      {/* Post-Run Outcome Readout Banner */}
      {(state.status === 'completed' || state.status === 'exhausted_requeued') && (
        <div
          className={`p-3.5 border-b text-xs font-mono flex items-center justify-between gap-3 ${
            state.stats.total429BurstErrors > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {state.stats.total429BurstErrors > 0 ? (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <div>
              <strong>Run Result:</strong>{' '}
              {state.config.serializeSameCellCalls ? (
                <span>
                  <strong>Serialized (ADR-0040):</strong> 0 phantom rate-limit errors,{' '}
                  {state.stats.totalCardsAccepted} cards committed cleanly, 0 cells poisoned.
                </span>
              ) : (
                <span>
                  <strong>Unserialized:</strong> {state.stats.total429BurstErrors} phantom 429 errors,{' '}
                  {poisonedCellCount} cell(s) poisoned due to concurrent burst calls exceeding project limits.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            Reset Run
          </button>
        </div>
      )}

      {/* Static Fallback for Reduced Motion */}
      {showStaticFallback ? (
        <div className="p-6 bg-[var(--bg-subtle)] space-y-6">
          <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              Static Architecture Diagram &amp; Run State Summary
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              This static representation explains the LangGraph pipeline and Quota Governor grid without active animations.
            </p>
            <div className="font-mono text-xs p-4 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-secondary)] space-y-2">
              <div><strong>Status:</strong> {state.status.toUpperCase()} (Tick {state.tick})</div>
              <div><strong>Active API Keys:</strong> {state.config.keys.length} configured</div>
              <div><strong>ADR-0040 Serialization:</strong> {state.config.serializeSameCellCalls ? 'ENABLED' : 'DISABLED'}</div>
              <div><strong>Production Cards Committed:</strong> {state.stats.totalCardsAccepted}</div>
              <div><strong>Phantom 429 Errors:</strong> {state.stats.total429BurstErrors}</div>
              <div><strong>Feed Items Published:</strong> {state.feed.length} items live</div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Two-Half Simulation Canvas */
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
          {/* ======================================================== */}
          {/* LEFT HALF (6 cols): LangGraph Architecture Pipeline Flow */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 p-4 flex flex-col justify-between bg-[var(--bg-surface)]">
            <div>
              {/* Header with accessible tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                    LangGraph Pipeline
                  </h3>
                </div>
                <div role="tablist" className="flex items-center gap-1">
                  <button
                    role="tab"
                    aria-selected={activeTab === 'diagram'}
                    onClick={() => setActiveTab('diagram')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      activeTab === 'diagram'
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent-border)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Flow
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'tree'}
                    onClick={() => setActiveTab('tree')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      activeTab === 'tree'
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent-border)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Topics
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'feed'}
                    onClick={() => setActiveTab('feed')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 ${
                      activeTab === 'feed'
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent-border)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>Feed</span>
                    {state.feed.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-[9px] text-white flex items-center justify-center font-bold">
                        {state.feed.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* TAB 1: Visual Pipeline Flow Diagram */}
              {activeTab === 'diagram' && (
                <div className="space-y-3 font-mono text-xs">
                  {/* Node 1: START */}
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-bold text-[var(--text-primary)]">START (Job Queue Trigger)</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {state.topics.length} topic(s) claimed
                    </span>
                  </div>

                  {/* Fan-Out Connector */}
                  <div className="flex items-center justify-center text-[10px] text-[var(--text-muted)] gap-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Send(topic_id) — Independent Fan-Out</span>
                  </div>

                  {/* Node 2: resolve_and_plan_topic */}
                  <div
                    className={`p-3 rounded-lg border transition-all ${
                      isPlanningActive
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                        : state.topics.some((t) => t.curriculumGenerated)
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPlanningActive
                              ? 'bg-amber-500 animate-ping'
                              : state.topics.some((t) => t.curriculumGenerated)
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-bold text-[var(--text-primary)]">resolve_and_plan_topic</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        Thinking Pool
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed">
                      Generates curriculum with exact-title deduplication. Groups Subtopics across difficulty tiers via <code>subtopic_group_id</code>.
                    </p>
                  </div>

                  {/* Fan-Out Connector */}
                  <div className="flex items-center justify-center text-[10px] text-[var(--text-muted)] gap-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Send(group_id) — Concurrent Subtopic Group Fan-Out</span>
                  </div>

                  {/* Node 3: generate_subtopic_cards & Two-Pass Quality Gate */}
                  <div
                    className={`p-3 rounded-lg border transition-all space-y-2 ${
                      isCardGenActive || isPass1Active || isPass2Active
                        ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCardGenActive || isPass1Active || isPass2Active
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-bold text-[var(--text-primary)]">generate_subtopic_cards</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Generator Pool
                      </span>
                    </div>

                    {/* Quality Gate Inner Pipeline */}
                    <div className="p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2 text-[10px]">
                      <div className="font-bold text-[var(--text-primary)] flex items-center justify-between">
                        <span>Two-Pass Quality Gate (ADR-0030)</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-normal">Sequential builds_on</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div
                          className={`p-1.5 rounded border ${
                            isPass1Active
                              ? 'bg-amber-500/20 text-amber-600 font-bold border-amber-500/40 animate-pulse'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                          }`}
                        >
                          Pass 1: Correction
                        </div>
                        <div className="p-1.5 rounded border bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)]">
                          Local Vector Dedup
                        </div>
                        <div
                          className={`p-1.5 rounded border ${
                            isPass2Active
                              ? 'bg-purple-500/20 text-purple-600 font-bold border-purple-500/40 animate-pulse'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                          }`}
                        >
                          Pass 2: Verify
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fan-In to Persistence */}
                  <div className="flex items-center justify-center text-[10px] text-[var(--text-muted)] gap-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>ADR-0041: Per-Group Live Feed Persistence</span>
                  </div>

                  {/* Node 4: gate_and_persist (Lightweight Fan-in) */}
                  <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-[var(--text-primary)]">
                        Postgres Content Warehouse (Live)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {state.stats.totalCardsAccepted} cards live
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: Active Topics Hierarchy */}
              {activeTab === 'tree' && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {state.topics.map((topic: SimTopic) => (
                    <div
                      key={topic.id}
                      className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              topic.status === 'persisted'
                                ? 'bg-emerald-500'
                                : topic.status === 'generating'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-xs font-semibold text-[var(--text-primary)] font-mono">
                            {topic.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                          {topic.curriculumGenerated ? 'Curriculum Ready' : 'Planning Pass'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.groups.map((group: SimSubtopicGroup) => (
                          <div
                            key={group.id}
                            className={`p-2.5 rounded border transition-all text-xs ${
                              group.status === 'completed'
                                ? 'border-emerald-500/40 bg-emerald-500/5'
                                : group.status === 'generating' || group.status === 'gating'
                                ? 'border-amber-500/50 bg-amber-500/5 shadow-xs'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-medium text-[var(--text-primary)] truncate max-w-[130px]">
                                {group.name}
                              </span>
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                                {group.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 mt-2">
                              {group.tiers.map((tier: DifficultyTier, idx: number) => {
                                const isCurrent = idx === group.currentTierIndex && group.status !== 'completed';
                                const isDone = idx < group.currentTierIndex || group.status === 'completed';
                                return (
                                  <div
                                    key={tier}
                                    className={`flex-1 py-1 px-1.5 rounded text-[10px] font-mono text-center transition-all ${
                                      isDone
                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                                        : isCurrent
                                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/40 animate-pulse'
                                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-transparent'
                                    }`}
                                  >
                                    {tier.slice(0, 3).toUpperCase()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Live Feed */}
              {activeTab === 'feed' && (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {state.feed.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
                      Feed is empty. Cards appear here immediately as subtopic groups complete (ADR-0041).
                    </div>
                  ) : (
                    state.feed.map((item: FeedItem) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--text-primary)]">{item.title}</span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            &lt; 50ms Read Path
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">{item.summary}</p>
                        <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-[var(--text-muted)]">
                          <span>Tier: {item.tier}</span>
                          <span>·</span>
                          <span>Topic: {item.topicName}</span>
                          <span>·</span>
                          <span className="text-emerald-500">Live in Postgres</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Left Footer Info */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
              <span>LangGraph v0.2.x</span>
              <span className="text-[var(--text-primary)] font-bold">
                {state.activeTasks.length} active worker task(s)
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT HALF (6 cols): 2D Quota Governor Grid (Key × Model) */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 p-4 flex flex-col justify-between bg-[var(--bg-subtle)]/40">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                    2D Quota Grid (ADR-0028)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {state.config.keys.length} API Keys Active
                  </span>
                </div>
              </div>

              {/* The 2D Grid Table with responsive overflow */}
              <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
                      <th className="p-2 border-r border-[var(--border-subtle)]">Model Ladder</th>
                      <th className="p-2 border-r border-[var(--border-subtle)]">Pool</th>
                      {state.config.keys.map((k: KeyConfig) => (
                        <th key={k.keyIndex} className="p-2 text-center border-r border-[var(--border-subtle)] last:border-r-0">
                          <div>Key {k.keyIndex}</div>
                          <div className="text-[8px] text-[var(--text-muted)] font-normal truncate max-w-[80px]">
                            {k.projectId}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                    {allModels.map((model: ModelLadderEntry) => (
                      <tr key={model.modelId} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                        <td className="p-2 border-r border-[var(--border-subtle)] font-semibold text-[var(--text-primary)]">
                          <div>{model.name}</div>
                          <div className="text-[9px] text-[var(--text-muted)] font-normal">
                            RPD: {model.rpdLimit} · RPM: {model.rpmLimit}
                          </div>
                        </td>
                        <td className="p-2 border-r border-[var(--border-subtle)] text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] ${
                              model.pool === 'thinking'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {model.pool}
                          </span>
                        </td>

                        {/* Cells for each key */}
                        {state.config.keys.map((key: KeyConfig) => {
                          const cellKey = `${key.keyIndex}:${model.modelId}`;
                          const cell = state.cells[cellKey];
                          if (!cell) return <td key={key.keyIndex} />;

                          const isCursorHere =
                            state.searchCursor &&
                            state.searchCursor.keyIndex === key.keyIndex &&
                            allModels[state.searchCursor.modelIndex]?.modelId === model.modelId;

                          return (
                            <td
                              key={key.keyIndex}
                              onClick={() => setSelectedCellKey(cellKey)}
                              className={`p-2 text-center border-r border-[var(--border-subtle)] last:border-r-0 cursor-pointer transition-all ${
                                selectedCellKey === cellKey
                                  ? 'ring-2 ring-[var(--accent)] bg-[var(--accent-subtle)]'
                                  : ''
                              } ${
                                cell.isPoisoned429
                                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold'
                                  : cell.rpdSpent >= cell.rpdLimit
                                  ? 'bg-slate-800/40 text-slate-500 opacity-60'
                                  : cell.isLocked
                                  ? 'bg-amber-500/20 text-amber-600 font-bold'
                                  : isCursorHere
                                  ? 'bg-amber-500/30 text-amber-600 animate-pulse'
                                  : 'text-[var(--text-secondary)]'
                              }`}
                            >
                              <div className="text-[10px] font-bold">
                                {cell.isPoisoned429 ? (
                                  <span className="flex items-center justify-center gap-0.5 text-rose-500">
                                    <XCircle className="w-3 h-3" /> 429
                                  </span>
                                ) : (
                                  <span>
                                    {cell.rpdSpent}/{cell.rpdLimit}
                                  </span>
                                )}
                              </div>
                              <div className="text-[8px] text-[var(--text-muted)] mt-0.5">
                                {cell.rpmWindowCalls.length} req/min
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cell Inspector & Interventions */}
              {selectedCellKey && state.cells[selectedCellKey] && (
                <div className="mt-3 p-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[var(--text-primary)]">
                      Selected Cell: [{selectedCellKey}]
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      Project: {state.cells[selectedCellKey].projectId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleForce429(selectedCellKey)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono bg-rose-600 text-white hover:bg-rose-700"
                      title="Force false 429 to test ledger poisoning"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Inject 429</span>
                    </button>
                    <button
                      onClick={() => handleDrainRPD(selectedCellKey)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <span>Drain Daily RPD</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Callout: Quota Search Order */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-mono flex items-start gap-2 bg-[var(--bg-surface)] p-2.5 rounded border border-[var(--border-subtle)]">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>ADR-0028 Search Order:</strong> Model top-down, then Key index. When all cells exhaust, <code>QuotaExhaustedError</code> requeues the job as <code>pending</code> (never <code>failed</code>).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Simulator Bottom Status Bar */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex flex-wrap items-center justify-between text-xs font-mono text-[var(--text-muted)] gap-3">
        <div className="flex items-center gap-4">
          <div>
            Tick: <strong className="text-[var(--text-primary)]">{state.tick}</strong>
          </div>
          <div>
            Status:{' '}
            <strong
              className={
                state.status === 'completed'
                  ? 'text-emerald-500'
                  : state.status === 'exhausted_requeued'
                  ? 'text-amber-500'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {state.status.toUpperCase()}
            </strong>
          </div>
          <div>
            Cards Committed:{' '}
            <strong className="text-emerald-500">{state.stats.totalCardsAccepted}</strong>
          </div>
          <div>
            Phantom 429s:{' '}
            <strong className={state.stats.total429BurstErrors > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
              {state.stats.total429BurstErrors}
            </strong>
          </div>
        </div>

        <div className="text-[11px] text-[var(--text-secondary)] truncate max-w-md">
          {state.events[0]?.message || 'Pipeline standing by.'}
        </div>
      </div>
    </div>
  );
}
