# World Studio: MVP Review & Production Roadmap

**Date:** January 3, 2026
**Status:** MVP Frozen / Ready for Phase 2
**Scope:** Phase 1 (Identity, Assets, Entitlements)

---

## 1. Executive Summary
**"Culture First, Chain Second."**

We have successfully completed the **World Studio MVP**. This phase focused on creating the "Sovereign Container" for culture—allowing creators to define their World, staging assets, and creating entitlement definitions (Passes)—without getting bogged down in immediate blockchain complexities.

The system is now **fully event-driven**. Every action in the Studio emits a canonical event (`WORLD_META`, `WORLD_CONTENT`, `WORLD_PASS`) to Hedera Consensus Service (HCS), ensuring that the "State of the World" is distinct from the database that displays it.

**Current State:**
*   **UI:** Frozen & Polished (High Contrast, Mobile Responsive).
*   **Logic:** Stubbed & Deterministic (API -> HCS -> DB).
*   **Infrastructure:** Neon (Postgres), Hedera Testnet (HCS), Vercel Blob (Staging).

---

## 2. Sprint Accomplishments (Phase 1)

### Phase 1A: Identity ( The Container)
*   **Objective:** Define "What is a World?"
*   **Shipped:**
    *   `/studio/[worldId]` Shell & Navigation.
    *   `WORLD_META` Event Schema (Name, Description, Type, Visibility).
    *   HCS Submission Pipeline (Meta Topic).
    *   Postgres `worlds` table (Read Model).

### Phase 1B: Assets (The Expression)
*   **Objective:** "Inscribe" culture into the World.
*   **Shipped:**
    *   **Staging Pipeline:** Vercel Blob integration for performant image hosting.
    *   **Inscription Stub:** `WORLD_CONTENT` events linking Content Hash + Staged URL.
    *   **Asset Manager UI:** Grid view, upload flow, "Inscribed" status indicators.
    *   **KiloScribe Prep:** Client stubbed for Arweave integration.

### Phase 1C: Entitlements (The Access)
*   **Objective:** Define "Who belongs here?"
*   **Shipped:**
    *   **Pass Minting Stub:** Server-side deterministic minting of `WORLD_PASS` events.
    *   **Pass Manager UI:** Two-column layout (Create + List).
    *   **Hardening:** Idempotency enforcement, UNIQUE constraints, Failure hygiene.
    *   **Tashi Alignment:** `world.pass@1` canonical schema.

---

## 3. Architecture Review: The "Stubbed Loop"
We built a "Hollow Shell" that behaves exactly like the production system, but with centralized shortcuts for speed.

**The Flow:**
1.  **Creator Action** (UI) -> **Next.js API** (Server)
2.  **API** -> **Build Envelope** (Canonical Schema) -> **Hash**
3.  **API** -> **Submit to HCS** (The "Truth")
4.  **API** -> **Write to Neon** (The "View")

**Why this wins:**
*   We validated the **Data Model** without building a decentralized Indexer.
*   We validated the **UX** without needing Wallet signatures for every click.
*   We ensured **Forward Compatibility** because the *Events* on HCS are real.

---

## 4. Roadmap: MVP to Production

Moving forward, we peel away the "Stubbed" layers and replace them with "Sovereign" infrastructure.

### Phase 2: Verifiable Truth (The "Tashi" Phase)
*   **Goal:** Remove the "API writes to DB" shortcut.
*   **Action:**
    1.  **Deploy Tashi Node:** A lightweight reducer that listens to HCS.
    2.  **Switch API:** API *only* submits to HCS. It does *not* write to Neon.
    3.  **The Loop:** Tashi listens to HCS -> Validates -> Updates Neon.
    4.  **Real Inscription:** Un-stub KiloScribe. Uploads go to Arweave, not just Vercel Blob.

### Phase 3: Materialization (The "Chain" Phase)
*   **Goal:** Turn "Definitions" into "Assets".
*   **Action:**
    1.  **Token Factory:** When Tashi sees a `WORLD_PASS` event, it triggers an HTS Token Create transaction.
    2.  **Metadata Binding:** Map `WORLD_CONTENT` hashes to HTS Token Metadata JSON.
    3.  **Wallet Connect:** Require Creator Signatures for critical state changes (Publishing).

### Phase 4: Economy (The "Market" Phase)
*   **Goal:** Let users enter the World.
*   **Action:**
    1.  **Claim Pages:** Public-facing pages for Worlds (`/world/[id]`).
    2.  **Purchase Flows:** USDC/HBAR payments for Passes.
    3.  **Gating:** Verify HTS Token ownership to access "Signals" or Content.

---

## 5. Deployment & Hygiene
*   **Codebase:** Clean, strict TypeScript.
*   **Database:** `world_passes`, `world_assets`, `worlds` fully migrated.
*   **Documentation:** Canonical Events defined in `/docs/events/`.

**Verdict:** Ready for Phase 2.
