# World Studio MVP (Phase 1)

**Status**: LIVE (Stubbed Execution)
**Version**: 1.0.0
**Date**: 2026-01-03

## Overview
World Studio is the "Creator Dashboard" for Culture Wallet, allowing issuers (Artists, Labels, Brands) to define, configure, and publish "Worlds".

A **World** is a sovereign digital context containing:
1.  **Identity** (Profile, Metadata)
2.  **Assets** (Inscribed Files)
3.  **Passes** (Entitlements/Access)

## Feature Scope (Implemented)

### 1. World Identity
*   **Definition**: `WORLD_META` event.
*   **Fields**: Name, Description, Type (Community, Artist, etc.), Visibility.
*   **Infrastructure**: Events submitted to Hedera HCS (Testnet).

### 2. Assets (Inscribed)
*   **Definition**: `WORLD_CONTENT` event.
*   **Mechanism**:
    *   **Staging**: Files uploaded to Vercel Blob (public URLs).
    *   **Inscription**: Hash + URLs submitted to HCS.
    *   **Persistence**: Stored in `world_assets` table.
*   **Stub Note**: "KiloScribe" provider is currently stubbed. Assets are not yet permanently inscribed on Arweave/IPFS via KiloScribe, but are fully usable via Vercel Blob.

### 3. Passes (Entitlements)
*   **Definition**: `WORLD_PASS` event.
*   **Mechanism**:
    *   **Minting**: Issuer defines Pass (Supply, Name).
    *   **Event**: Deterministic `WORLD_PASS` event emitted to HCS.
    *   **State**: Stored in `world_passes` table.
*   **Stub Note**: **No Blockchain Tokenization**.
    *   Passes exist purely as "World State" records.
    *   No HTS tokens are minted.
    *   No payments or transfers are supported.
    *   No claiming flow exists (only Issuer Minting).

## Architecture Reference

| Concept | Event Type | DB Table | HCS Topic |
| :--- | :--- | :--- | :--- |
| **Profile** | `WORLD_META` | `worlds` | `CW_WORLD_META` |
| **Asset** | `WORLD_CONTENT` | `world_assets` | `CW_WORLD_CONTENT` |
| **Pass** | `WORLD_PASS` | `world_passes` | `CW_WORLD_META` (Shared) |

## Hardening & Security
*   **Idempotency**: Pass Minting is idempotent by `(worldId, name)`. Double-clicking "Mint" returns the same pass.
*   **Authorization**: API routes require valid Issuer Context (currently validated via Stub/Regex, ready for Session Auth).
*   **Determinism**: All IDs are ULID (Time-ordered) or deterministic hashes.

## Next Steps (Phase 2+)
1.  **KiloScribe Integration**: Replace stub with real Arweave inscription.
2.  **Tokenization**: Map `WORLD_PASS` events to HTS Token Create transactions.
3.  **Claiming**: Implement User Claim / Purchase flows.
