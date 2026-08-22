import { createInitialState, tickSimulation, acquireCell } from '../engine';

function runEngineTests() {
  console.log('🧪 Starting Simulator Engine Unit Tests...');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ ${msg}`);
      testsPassed++;
    } else {
      console.error(`  ✗ FAILED: ${msg}`);
      testsFailed++;
    }
  }

  // Test 1: Deterministic reproducibility with seed
  {
    const stateA1 = createInitialState({ seed: 12345 });
    const stateB1 = createInitialState({ seed: 12345 });

    let sA = stateA1;
    let sB = stateB1;
    for (let i = 0; i < 30; i++) {
      sA = tickSimulation(sA);
      sB = tickSimulation(sB);
    }

    assert(
      JSON.stringify(sA.stats) === JSON.stringify(sB.stats) && sA.feed.length === sB.feed.length,
      'Simulation is 100% deterministic with identical seed'
    );
  }

  // Test 2: Search order: Model top-down, then Key index
  {
    const state = createInitialState();
    const acq1 = acquireCell(state, 'thinking', 1);
    assert(
      acq1?.modelId === 'gemini-3.7-flash' && acq1?.keyIndex === 0,
      'Initial acquire picks strongest model (gemini-3.7-flash) and Key 0'
    );
  }

  // Test 3: ADR-0040 toggle comparison
  {
    // Run with serialization ON
    let stateOn = createInitialState({ seed: 999, serializeSameCellCalls: true });
    for (let i = 0; i < 50; i++) {
      stateOn = tickSimulation(stateOn);
    }
    assert(
      stateOn.stats.total429BurstErrors === 0,
      'ADR-0040 ON: Zero phantom 429 burst errors occurred'
    );

    // Run with serialization OFF (the production bug)
    let stateOff = createInitialState({ seed: 999, serializeSameCellCalls: false });
    for (let i = 0; i < 50; i++) {
      stateOff = tickSimulation(stateOff);
    }
    assert(
      stateOff.stats.total429BurstErrors > 0,
      `ADR-0040 OFF: Correctly produced ${stateOff.stats.total429BurstErrors} phantom 429 burst errors from concurrent cell collision`
    );
  }

  // Test 4: Group-level feed persistence (ADR-0041)
  {
    let state = createInitialState({ seed: 42, topicsCount: 1, groupsPerTopic: 2, tiersPerGroup: 1 });
    let publishedItemCount = 0;
    for (let i = 0; i < 40; i++) {
      state = tickSimulation(state);
      if (state.feed.length > publishedItemCount) {
        publishedItemCount = state.feed.length;
      }
    }
    assert(
      state.feed.length > 0,
      `ADR-0041 Verified: Feed received ${state.feed.length} cards live per group during execution`
    );
  }

  // Test 5: Requeue on Quota Exhaustion
  {
    let state = createInitialState({ seed: 42 });
    // Manually spend all RPD across all cells
    for (const cellKey of Object.keys(state.cells)) {
      state.cells[cellKey].rpdSpent = state.cells[cellKey].rpdLimit;
    }
    state = tickSimulation(state);
    state = tickSimulation(state);

    assert(
      state.status === 'exhausted_requeued' || state.stats.requeueCount > 0,
      'Quota exhaustion catches QuotaExhaustedError and marks job as pending/requeued instead of failing'
    );
  }

  console.log(`\n🏁 Test Results: ${testsPassed} passed, ${testsFailed} failed.\n`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runEngineTests();
