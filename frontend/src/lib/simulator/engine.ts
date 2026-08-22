import type {
  ActiveTask,
  CellQuotaState,
  DifficultyTier,
  FeedItem,
  KeyConfig,
  ModelLadderEntry,
  SimCard,
  SimSubtopicGroup,
  SimTopic,
  SimulationConfig,
  SimulationEvent,
  SimulationState,
} from './types';

export type {
  ActiveTask,
  CellQuotaState,
  DifficultyTier,
  FeedItem,
  KeyConfig,
  ModelLadderEntry,
  SimCard,
  SimSubtopicGroup,
  SimTopic,
  SimulationConfig,
  SimulationEvent,
  SimulationState,
};

export const THINKING_LADDER: ModelLadderEntry[] = [
  { modelId: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', rpdLimit: 20, rpmLimit: 5, pool: 'thinking' },
  { modelId: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', rpdLimit: 20, rpmLimit: 5, pool: 'thinking' },
  { modelId: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', rpdLimit: 20, rpmLimit: 5, pool: 'thinking' },
];

export const GENERATOR_LADDER: ModelLadderEntry[] = [
  { modelId: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', rpdLimit: 500, rpmLimit: 15, pool: 'generator' },
  { modelId: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', rpdLimit: 500, rpmLimit: 15, pool: 'generator' },
];

// Deterministic Mulberry32 PRNG
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createInitialState(customConfig?: Partial<SimulationConfig>): SimulationState {
  const config: SimulationConfig = {
    seed: 42,
    serializeSameCellCalls: true, // ADR-0040 active by default
    maxConcurrentCalls: 10,
    keys: [
      { keyIndex: 0, projectId: 'proj-alpha', label: 'Key 0 (Project Alpha)' },
      { keyIndex: 1, projectId: 'proj-beta', label: 'Key 1 (Project Beta)' },
      { keyIndex: 2, projectId: 'proj-gamma', label: 'Key 2 (Project Gamma)' },
    ],
    topicsCount: 2,
    groupsPerTopic: 2,
    tiersPerGroup: 3,
    autoRequeueOnQuota: true,
    ...customConfig,
  };

  const cells: Record<string, CellQuotaState> = {};
  const allModels = [...THINKING_LADDER, ...GENERATOR_LADDER];

  for (const key of config.keys) {
    for (const model of allModels) {
      const cellKey = `${key.keyIndex}:${model.modelId}`;
      cells[cellKey] = {
        keyIndex: key.keyIndex,
        modelId: model.modelId,
        projectId: key.projectId,
        rpdLimit: model.rpdLimit,
        rpmLimit: model.rpmLimit,
        rpdSpent: 0,
        rpmInFlightCount: 0,
        rpmWindowCalls: [],
        isLocked: false,
        isPoisoned429: false,
      };
    }
  }

  const topicNames = ['Computer Networking', 'Docker Isolation', 'Operating Systems', 'Distributed Consensus'];
  const groupThemes = [
    ['TCP/IP Handshake', 'BGP Route Reflection', 'TLS 1.3 Key Exchange'],
    ['Cgroup Memory Limits', 'Namespace Isolation', 'Overlay Network Drivers'],
    ['Virtual Memory Paging', 'Lockless Ring Buffers', 'RTOS Interrupt Handling'],
    ['Raft Leader Election', 'Vector Clocks', 'Two-Phase Commit'],
  ];

  const topics: SimTopic[] = [];
  for (let t = 0; t < config.topicsCount; t++) {
    const topicId = `topic-${t + 1}`;
    const groups: SimSubtopicGroup[] = [];
    const tThemes = groupThemes[t % groupThemes.length];

    for (let g = 0; g < config.groupsPerTopic; g++) {
      const groupId = `group-${t + 1}-${g + 1}`;
      const tiers: DifficultyTier[] = ['beginner', 'intermediate', 'advanced'].slice(0, config.tiersPerGroup) as DifficultyTier[];
      groups.push({
        id: groupId,
        topicId,
        name: tThemes[g % tThemes.length] || `Subtopic Group ${g + 1}`,
        tiers,
        currentTierIndex: 0,
        status: 'pending',
        cards: [],
      });
    }

    topics.push({
      id: topicId,
      name: topicNames[t % topicNames.length] || `Topic ${t + 1}`,
      curriculumGenerated: false,
      status: 'pending',
      groups,
    });
  }

  return {
    config,
    tick: 0,
    isRunning: false,
    status: 'idle',
    topics,
    cells,
    activeTasks: [],
    feed: [],
    events: [
      {
        id: 'evt-init',
        tick: 0,
        type: 'acquire',
        message: 'Simulation initialized. Ready to execute LangGraph pipeline.',
      },
    ],
    stats: {
      totalCallsAttempted: 0,
      totalCallsSucceeded: 0,
      total429BurstErrors: 0,
      totalCardsGenerated: 0,
      totalCardsAccepted: 0,
      totalCardsRejected: 0,
      requeueCount: 0,
    },
  };
}

export function acquireCell(
  state: SimulationState,
  pool: 'thinking' | 'generator',
  currentTick: number
): { cellKey: string; keyIndex: number; modelId: string } | null {
  const ladder = pool === 'thinking' ? THINKING_LADDER : GENERATOR_LADDER;
  const keys = state.config.keys;

  // Search order: Model first (top-down), then Key index (0..N)
  for (let mIdx = 0; mIdx < ladder.length; mIdx++) {
    const model = ladder[mIdx];
    for (let kIdx = 0; kIdx < keys.length; kIdx++) {
      const key = keys[kIdx];
      const cellKey = `${key.keyIndex}:${model.modelId}`;
      const cell = state.cells[cellKey];
      if (!cell) continue;

      // Skip poisoned cells (permanently exhausted by 429 today)
      if (cell.isPoisoned429) continue;

      // Check RPD
      if (cell.rpdSpent >= cell.rpdLimit) continue;

      // Clean old RPM window (1 minute = 60 ticks)
      const windowCutoff = Math.max(0, currentTick - 60);
      const recentCalls = cell.rpmWindowCalls.filter((t) => t > windowCutoff);
      cell.rpmWindowCalls = recentCalls;

      // Check RPM limit
      if (recentCalls.length >= cell.rpmLimit) continue;

      // If ADR-0040 serialization is ON, verify cell lock
      if (state.config.serializeSameCellCalls && cell.isLocked) {
        // Cell is currently executing a live call, skip or queue
        continue;
      }

      // Cell granted!
      state.searchCursor = {
        pool,
        modelIndex: mIdx,
        keyIndex: kIdx,
        decision: 'granted',
      };

      return { cellKey, keyIndex: key.keyIndex, modelId: model.modelId };
    }
  }

  state.searchCursor = {
    pool,
    modelIndex: ladder.length - 1,
    keyIndex: keys.length - 1,
    decision: 'exhausted',
  };

  return null;
}

export function tickSimulation(prevState: SimulationState): SimulationState {
  const state: SimulationState = JSON.parse(JSON.stringify(prevState));
  state.tick += 1;
  const rng = createPRNG(state.config.seed + state.tick * 997);

  // 1. Advance active tasks & handle ADR-0040 cell bursts / completion
  const remainingTasks: ActiveTask[] = [];

  for (const task of state.activeTasks) {
    if (!task.targetCell) {
      // Try to acquire cell
      const acquired = acquireCell(state, task.pool, state.tick);
      if (acquired) {
        task.targetCell = { keyIndex: acquired.keyIndex, modelId: acquired.modelId };
        const cellKey = acquired.cellKey;
        const cell = state.cells[cellKey];

        state.stats.totalCallsAttempted += 1;
        cell.rpdSpent += 1;
        cell.rpmWindowCalls.push(state.tick);
        cell.rpmInFlightCount += 1;

        if (state.config.serializeSameCellCalls) {
          cell.isLocked = true;
        } else {
          // BUG SIMULATION (ADR-0040 OFF):
          // If multiple concurrent tasks hit the same cell without a lock, burst limit is exceeded
          if (cell.rpmInFlightCount > 2 || (cell.rpmWindowCalls.length > cell.rpmLimit && rng() < 0.8)) {
            task.burstTriggered429 = true;
            cell.isPoisoned429 = true;
            cell.rpdSpent = cell.rpdLimit; // Ledger poisoned to full RPD
            state.stats.total429BurstErrors += 1;
            state.events.unshift({
              id: `evt-429-${state.tick}-${task.id}`,
              tick: state.tick,
              type: 'burst_429',
              message: `🚨 Phantom 429 Burst on [Key ${cell.keyIndex}:${cell.modelId}]. Ledger poisoned. Same-cell serialization is OFF.`,
            });
          }
        }

        state.events.unshift({
          id: `evt-acq-${state.tick}-${task.id}`,
          tick: state.tick,
          type: 'acquire',
          message: `Acquired [Key ${acquired.keyIndex}:${acquired.modelId}] for ${task.type} (${task.pool} pool)`,
        });
      } else {
        // Could not acquire cell due to quota exhaustion
        remainingTasks.push(task);
        continue;
      }
    }

    // Advance task duration
    task.ticksRemaining -= 1;
    task.progress = Math.min(1, (task.totalTicks - task.ticksRemaining) / task.totalTicks);

    if (task.ticksRemaining <= 0) {
      // Task finished! Release cell lock and in-flight count
      if (task.targetCell) {
        const cellKey = `${task.targetCell.keyIndex}:${task.targetCell.modelId}`;
        const cell = state.cells[cellKey];
        if (cell) {
          cell.rpmInFlightCount = Math.max(0, cell.rpmInFlightCount - 1);
          if (state.config.serializeSameCellCalls) {
            cell.isLocked = false;
          }
        }
      }

      if (task.burstTriggered429) {
        // Failed due to un-serialized 429 burst
        state.stats.totalCardsRejected += 1;
        continue;
      }

      state.stats.totalCallsSucceeded += 1;

      // Handle specific task completion logic
      handleTaskCompletion(state, task, rng);
    } else {
      remainingTasks.push(task);
    }
  }

  state.activeTasks = remainingTasks;

  // 2. Dispatch next LangGraph steps
  dispatchGraphTasks(state, rng);

  // 3. Evaluate overall job status & exhaustion handling
  checkSimulationStatus(state);

  return state;
}

function handleTaskCompletion(state: SimulationState, task: ActiveTask, rng: () => number) {
  const topic = state.topics.find((t) => t.id === task.topicId);
  if (!topic) return;

  if (task.type === 'curriculum') {
    topic.curriculumGenerated = true;
    topic.status = 'generating';
    // Subtopic groups now ready for concurrent fan-out
    for (const grp of topic.groups) {
      grp.status = 'generating';
    }
  } else if (task.type === 'card_gen' && task.groupId && task.tier) {
    const group = topic.groups.find((g) => g.id === task.groupId);
    if (!group) return;

    state.stats.totalCardsGenerated += 1;
    const cardId = `card-${group.id}-${task.tier}-${state.tick}`;
    const prevTierCard = group.cards.find((c) => c.status === 'accepted');

    const draftCard: SimCard = {
      id: cardId,
      topicId: topic.id,
      groupId: group.id,
      tier: task.tier,
      title: `${group.name}: ${task.tier.toUpperCase()} Concept`,
      body: `Verified micro-concept explaining ${group.name} with concrete mechanics and code semantics.`,
      status: 'draft',
      buildsOnCardId: prevTierCard?.id,
    };

    group.cards.push(draftCard);
    group.status = 'gating';

    // Spawn Pass 1 Correction (thinking pool)
    state.activeTasks.push({
      id: `task-p1-${cardId}`,
      type: 'pass1_correction',
      topicId: topic.id,
      groupId: group.id,
      tier: task.tier,
      pool: 'thinking',
      progress: 0,
      totalTicks: 3,
      ticksRemaining: 3,
    });
  } else if (task.type === 'pass1_correction' && task.groupId && task.tier) {
    const group = topic.groups.find((g) => g.id === task.groupId);
    const card = group?.cards.find((c) => c.tier === task.tier && c.status === 'draft');
    if (group && card) {
      card.status = 'corrected';
      card.title = `[Corrected] ${card.title}`;
      card.gateReport = {
        stage: 'pass1_correction',
        correctedTitle: card.title,
        reason: 'In-place factual and topic alignment refined without discarding draft.',
      };

      // Intra-batch and local FastEmbed near-duplicate check (Local, 0 ticks)
      const isDuplicate = rng() < 0.05; // 5% chance in simulation
      if (isDuplicate) {
        card.status = 'rejected';
        card.gateReport.stage = 'near_duplicate';
        card.gateReport.reason = 'Cosine similarity exceeded card_duplicate_threshold (0.90).';
        state.stats.totalCardsRejected += 1;
        state.events.unshift({
          id: `evt-dedup-${state.tick}`,
          tick: state.tick,
          type: 'acquire_failed',
          message: `Near-duplicate rejected on ${card.title} (Local FastEmbed check).`,
        });
      } else {
        // Spawn Pass 2 Verification (thinking pool)
        state.activeTasks.push({
          id: `task-p2-${card.id}`,
          type: 'pass2_verification',
          topicId: topic.id,
          groupId: group.id,
          tier: task.tier,
          pool: 'thinking',
          progress: 0,
          totalTicks: 3,
          ticksRemaining: 3,
        });
      }
    }
  } else if (task.type === 'pass2_verification' && task.groupId && task.tier) {
    const group = topic.groups.find((g) => g.id === task.groupId);
    const card = group?.cards.find((c) => c.tier === task.tier && c.status === 'corrected');
    if (group && card) {
      card.status = 'accepted';
      state.stats.totalCardsAccepted += 1;
      card.gateReport = {
        stage: 'accepted',
        pass2DifficultyConfirmed: true,
      };

      // Move to next tier sequentially in this group
      group.currentTierIndex += 1;

      if (group.currentTierIndex >= group.tiers.length) {
        // Group complete! Trigger ADR-0041 Per-group persist & feed publish
        group.status = 'completed';
        group.completedAt = state.tick;

        // Publish live feed items immediately
        for (const c of group.cards.filter((x) => x.status === 'accepted')) {
          c.status = 'live_in_feed';
          const feedItem: FeedItem = {
            id: `feed-${c.id}`,
            topicName: topic.name,
            groupName: group.name,
            tier: c.tier,
            title: c.title,
            summary: c.body,
            publishedAtTick: state.tick,
          };
          state.feed.unshift(feedItem);
        }

        state.events.unshift({
          id: `evt-grp-comp-${state.tick}-${group.id}`,
          tick: state.tick,
          type: 'feed_publish',
          message: `🎉 Group "${group.name}" completed & published live to feed (ADR-0041 per-group persistence).`,
        });
      } else {
        group.status = 'generating';
      }
    }
  }
}

function dispatchGraphTasks(state: SimulationState, _rng: () => number) {
  // Topic planning fan-out
  for (const topic of state.topics) {
    if (topic.status === 'pending') {
      topic.status = 'planning';
      state.activeTasks.push({
        id: `task-plan-${topic.id}`,
        type: 'curriculum',
        topicId: topic.id,
        pool: 'thinking',
        progress: 0,
        totalTicks: 4,
        ticksRemaining: 4,
      });
      return; // Dispatch in sequence or concurrent
    }

    if (topic.status === 'generating') {
      // Subtopic groups concurrent dispatch
      for (const group of topic.groups) {
        if (group.status === 'generating') {
          const currentTier = group.tiers[group.currentTierIndex];
          const hasActiveTask = state.activeTasks.some((t) => t.groupId === group.id);
          if (currentTier && !hasActiveTask) {
            state.activeTasks.push({
              id: `task-card-${group.id}-${currentTier}`,
              type: 'card_gen',
              topicId: topic.id,
              groupId: group.id,
              tier: currentTier,
              pool: 'generator', // Card writing runs on cheap high-volume generator pool
              progress: 0,
              totalTicks: 4,
              ticksRemaining: 4,
            });
          }
        }
      }

      // Check if all groups for this topic finished
      const allGroupsDone = topic.groups.every((g) => g.status === 'completed');
      if (allGroupsDone && topic.groups.length > 0) {
        topic.status = 'persisted';
        state.events.unshift({
          id: `evt-top-done-${state.tick}-${topic.id}`,
          tick: state.tick,
          type: 'group_complete',
          message: `Topic "${topic.name}" fully completed across all subtopic groups. Final fan-in reports aggregated.`,
        });
      }
    }
  }
}

function checkSimulationStatus(state: SimulationState) {
  const allTopicsDone = state.topics.every((t) => t.status === 'persisted');
  if (allTopicsDone) {
    state.status = 'completed';
    state.isRunning = false;
    return;
  }

  // Check if active tasks are stuck due to total quota exhaustion
  if (state.activeTasks.length > 0 && state.activeTasks.every((t) => !t.targetCell)) {
    // Check if both ladders are exhausted
    const thinkingAvail = acquireCell(state, 'thinking', state.tick);
    const generatorAvail = acquireCell(state, 'generator', state.tick);

    if (!thinkingAvail && !generatorAvail) {
      if (state.config.autoRequeueOnQuota) {
        state.status = 'exhausted_requeued';
        state.isRunning = false;
        state.stats.requeueCount += 1;
        state.events.unshift({
          id: `evt-requeue-${state.tick}`,
          tick: state.tick,
          type: 'job_requeue',
          message: `⚠️ QuotaExhaustedError caught. Requeued GenerationJob as PENDING (not failed). Resumes idempotently on next cycle.`,
        });
      }
    }
  }
}
