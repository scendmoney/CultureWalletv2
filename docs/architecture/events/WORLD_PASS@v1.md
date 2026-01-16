# WORLD_PASS Event (v1)

**Schema**: `world.pass@1`
**Topic**: `CW_WORLD_META` (or dedicated Pass topic)
**Settlement**: Hedera HCS

## Purpose
Announces the creation (minting) of a new Access Pass or Entitlement within a World. This creates the "Definition" of the pass.

## JSON Payload Structure

```json
{
  "appId": "culturewallet",
  "type": "WORLD_PASS",
  "version": 1,
  "eventId": "{worldId}:pass:mint:{passId}:{timestamp}",
  "worldId": "world_...",
  "issuerAccountId": "0.0.xxxxx",
  "clientTs": 1234567890,
  "revision": 1,
  "payload": {
    "schema": "world.pass@1",
    "pass": {
      "id": "01ARZ3NDEK...", // ULID
      "name": "VIP Access",
      "description": "...",
      "supply": {
        "type": "FINITE", // or INFINITE
        "cap": 100        // Optional, required if FINITE
      },
      "image_url": "https://...",
      "status": "ACTIVE" // or DRAFT
    }
  },
  "contentHash": "sha256:..."
}
```

## Idempotency Rules
*   **Logical Key**: `(worldId, payload.pass.name)`
    *   A World cannot have two active passes with the exact same name.
    *   Replay of exact same payload is ignored (Duplicate).
*   **Event ID**: Guaranteed unique by timestamp suffix, but Reducers should deduplicate based on Logical Key or explicit `pass.id`.

## Schema Evolution
*   **v0 constraints**: No pricing, no royalties, no on-chain token ID.
*   **v1.1 potential**: Add `hts_token_id` field to map to Hedera Token Service.
*   **v1.2 potential**: Add `price` and `currency` fields.

## Reducer Logic
When processing this event:
1.  Verify signature/hash.
2.  Check if `pass.id` already exists. If yes, ignore (idempotent) or update if `op=UPDATE` (future).
3.  Add entry to `WorldState.passes`.
4.  If `supply.type` is FINITE, initialize `minted_count = 0`.
