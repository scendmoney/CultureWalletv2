# Reducer: Current World Profile

**Goal**: Deterministically derive the "Current World Profile" from a stream of `WORLD_META` events, handling out-of-order delivery, duplicates, and multi-path ingestion (HCS + FoxMQ).

## 1. State Definition
```typescript
interface WorldState {
    headRevision: number;
    headEventId: string | null;
    profile: {
        name: string;
        description: string;
        // ... other profile fields
    };
    isFrozen: boolean;
}
```

## 2. Reducer Function (Pseudocode)

```typescript
function reduceWorldState(currentState: WorldState, event: WorldMetaEvent): WorldState {
    // 1. De-Duplication
    // In a real reducer, we might track a Set of seen eventIds.
    // Ideally, we process events in an ordered log.
    if (event.revision <= currentState.headRevision) {
        // Stale or duplicate. Ignore.
        // NOTE: This assumes purely monotonic revisions (Single Leader Writer).
        // If we support DAG-based concurrent edits, we need vector clocks, 
        // but for "Issuer-First", Single Leader (Revision) is sufficient and safer.
        return currentState;
    }

    // 2. Integrity Check
    if (!verifyContentHash(event)) {
        console.warn("Invalid Content Hash", event.eventId);
        return currentState;
    }

    // 3. Op Application
    switch (event.payload.op) {
        case 'CREATE':
        case 'UPDATE':
            return {
                ...currentState,
                headRevision: event.revision,
                headEventId: event.eventId,
                profile: {
                    ...currentState.profile,
                    ...event.payload.profile // Partial update merge if needed, or full replace
                }
            };
        case 'FREEZE':
            return {
                ...currentState,
                headRevision: event.revision,
                headEventId: event.eventId,
                isFrozen: true
            };
        default:
            return currentState;
    }
}
```

## 3. Resolution Rules (The "Head" Logic)

1.  **Revision Wins**: The event with the highest `revision` number is the authoritative head.
2.  **Tie-Breaking**: If two events have the same `revision` (fork/conflict):
    *   **Consensus Timestamp**: If available (from HCS), lowest timestamp wins (First Write Wins).
    *   **Lexicographical**: If no consensus TS, `eventId` lexicographical sort wins.
3.  **Gap Handling**: If current state is `revision: 5` and we receive `revision: 7`:
    *   *Strict Mode*: Buffer `7` and wait for `6`.
    *   *Eventual Mode* (Recommended for UI): Apply `7` optimistically, assuming `6` will arrive. UI can show "Syncing...".

## 4. Test Vectors

| Sequence | Input Events (Rev) | Result Head Rev | Notes |
| :--- | :--- | :--- | :--- |
| **Genesis** | `[A:1]` | 1 | Basic create |
| **In-Order** | `[A:1, B:2, C:3]` | 3 | Standard flow |
| **Out-of-Order** | `[A:1, C:3, B:2]` | 3 | `C:3` applied, then `B:2` ignored (stale) |
| **Duplicate** | `[A:1, B:2, B:2]` | 2 | Second `B` ignored |
| **Stale Replay** | `[B:2, A:1]` | 2 | `A` ignored |
