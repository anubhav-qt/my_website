export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

export type JobStatus = 'idle' | 'running' | 'completed' | 'exhausted_requeued' | 'failed';

export interface ModelLadderEntry {
  modelId: string;
  name: string;
  rpdLimit: number;
  rpmLimit: number;
  pool: 'thinking' | 'generator';
}

export interface KeyConfig {
  keyIndex: number;
  projectId: string; // Same projectId means shared quota
  label: string;
}

export interface CellQuotaState {
  keyIndex: number;
  modelId: string;
  projectId: string;
  rpdLimit: number;
  rpmLimit: number;
  rpdSpent: number; // Persisted daily spend
  rpmInFlightCount: number; // Active in-flight calls to this cell
  rpmWindowCalls: number[]; // Timestamps of recent calls
  isLocked: boolean; // Held when ADR-0040 serialization is active
  isPoisoned429: boolean; // If cell was permanently marked exhausted by a 429
  lastError?: string;
}

export interface GateReport {
  stage: 'structural' | 'pass1_correction' | 'near_duplicate' | 'pass2_verification' | 'accepted';
  correctedTitle?: string;
  reason?: string;
  pass2DifficultyConfirmed?: boolean;
}

export interface SimCard {
  id: string;
  topicId: string;
  groupId: string;
  tier: DifficultyTier;
  title: string;
  body: string;
  status: 'draft' | 'corrected' | 'rejected' | 'accepted' | 'live_in_feed';
  gateReport?: GateReport;
  buildsOnCardId?: string;
}

export interface SimSubtopicGroup {
  id: string;
  topicId: string;
  name: string;
  tiers: DifficultyTier[];
  currentTierIndex: number;
  status: 'pending' | 'generating' | 'gating' | 'completed' | 'failed';
  cards: SimCard[];
  completedAt?: number;
  // Drafts rejected (near-dup at pass 1, or failed pass 2) for the current tier;
  // each loops back into generate_subtopic_cards with the rejection reason fed
  // back as context (ADR-0030 addendum) rather than failing the group.
  rejectedCount: number;
}

export interface SimTopic {
  id: string;
  name: string;
  curriculumGenerated: boolean;
  status: 'pending' | 'planning' | 'generating' | 'persisted' | 'requeued';
  groups: SimSubtopicGroup[];
}

export interface ActiveTask {
  id: string;
  type: 'curriculum' | 'card_gen' | 'pass1_correction' | 'pass2_verification' | 'question_gen';
  topicId: string;
  groupId?: string;
  tier?: DifficultyTier;
  targetCell?: { keyIndex: number; modelId: string };
  pool: 'thinking' | 'generator';
  progress: number; // 0 to 1
  totalTicks: number;
  ticksRemaining: number;
  isBlockedOnLock?: boolean;
  burstTriggered429?: boolean;
}

export interface FeedItem {
  id: string;
  topicName: string;
  groupName: string;
  tier: DifficultyTier;
  title: string;
  summary: string;
  publishedAtTick: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type:
    | 'acquire'
    | 'acquire_failed'
    | 'burst_429'
    | 'cell_lock_wait'
    | 'feed_publish'
    | 'job_requeue'
    | 'group_complete'
    | 'card_rejected';
  message: string;
  meta?: Record<string, unknown>;
}

export interface SimulationConfig {
  seed: number;
  serializeSameCellCalls: boolean; // ADR-0040 toggle
  maxConcurrentCalls: number; // Legacy or bounded concurrency
  keys: KeyConfig[];
  topicsCount: number;
  groupsPerTopic: number;
  tiersPerGroup: number;
  autoRequeueOnQuota: boolean;
}

export interface SimulationState {
  config: SimulationConfig;
  tick: number;
  isRunning: boolean;
  status: JobStatus;
  topics: SimTopic[];
  cells: Record<string, CellQuotaState>; // keyed by `${keyIndex}:${modelId}`
  activeTasks: ActiveTask[];
  feed: FeedItem[];
  events: SimulationEvent[];
  stats: {
    totalCallsAttempted: number;
    totalCallsSucceeded: number;
    total429BurstErrors: number;
    totalCardsGenerated: number;
    totalCardsAccepted: number;
    totalCardsRejected: number;
    requeueCount: number;
  };
  searchCursor?: {
    pool: 'thinking' | 'generator';
    modelIndex: number;
    keyIndex: number;
    decision: 'checking' | 'rejected_rpd' | 'rejected_rpm' | 'rejected_locked' | 'granted' | 'exhausted';
  };
}
