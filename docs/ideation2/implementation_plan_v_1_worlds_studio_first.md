# Implementation Plan v1 — Worlds Studio First

> Status: Canonical execution plan Audience: Internal (Engineering, Product) + External (Issuer-facing narrative for Frank) Principle: **Supply creates gravity before networks form**

---

## 1. Core Thesis (Locked)

Culture Wallet launches **issuer-first** via **Worlds Studio (desktop)**.

Artists, brands, and labels create *Worlds* that:

- Publish canonical culture (media, drops, recognitions)
- Anchor engagement before social graphs exist
- Pull audiences in through content, not onboarding friction

TrustMesh provides the substrate, but **does not lead UX**.

---

## 2. System Topology (High-Level)

```
[ Worlds Studio (Desktop) ]
        |
        v
[ TrustMesh Substrate ]
  - HCS Topics (Profile, Signal, Recognition)
  - WorldID (context lens)
  - KiloScribe (media inscription)
        |
        v
[ Culture Wallet (Mobile/Web) ]
  - World Feed (issuer content)
  - Join World (WorldID)
  - Collect / Recognize / Subscribe
```

Key separation:

- **Identity & Contacts** → Global (outside WorldID)
- **Culture & Signals** → Scoped by WorldID

---

## 3. Phase Breakdown

### Phase 0 — Worlds Studio Activation (IMMEDIATE)

**Objective:** Enable issuers to create gravity.

Deliverables:

- Desktop Worlds Studio UI (v0 locked)
- World Creation Flow
  - World metadata (name, visuals, description)
  - Issuer verification
- Media Inscription
  - Upload media
  - Hash + inscribe via KiloScribe
  - Emit HCS media events
- Recognition Templates
  - Drops
  - Membership passes
  - Event access

No audience features required.

---

### Phase 1 — World Feed (Audience Read-Only)

**Objective:** Let fans *enter culture without friction*.

Deliverables:

- World Landing Page
- Feed of issuer-published content
- Collect / Save actions (no posting)
- Join World (WorldID subscription)

No wallet required at entry.

---

### Phase 2 — Wallet + Recognition Unlock

**Objective:** Convert engagement into identity.

Deliverables:

- Culture Wallet onboarding (Magic → Hedera binding)
- Recognition claims
- TRST balances (contextual, not dominant)
- Contact bonding (global, not World-scoped)

---

### Phase 3 — Network Effects

**Objective:** Let Worlds overlap via shared people.

Deliverables:

- Cross-World recognition
- Portable identity + reputation
- TrustMesh signals surfaced progressively

---

## 4. Technical Execution Map

### Worlds Studio

- Next.js / Desktop-first
- Auth: Magic (issuer accounts)
- APIs:
  - POST /worlds/create
  - POST /worlds/{id}/publish
  - POST /worlds/{id}/recognition

### Ledger Layer

- HCS Topics
  - Profile (issuer)
  - Recognition (World-scoped)
  - Signal (future)
- KiloScribe
  - Media hashing
  - Immutable reference

### WorldID

- Passed as context header
- Never used as identity root

---

## 5. Non-Goals (Explicit)

To prevent scope creep, v1 **does not** include:

- UGC feeds
- Open posting
- Algorithmic timelines
- Token speculation UX
- Social graph dependence

---

## 6. Success Metrics

Issuer-side:

-
  # of Worlds created
-
  # of drops published
- Time-to-first-drop

Audience-side:

- World joins per drop
- Collect actions
- Wallet conversions

---

## 7. Strategic Payoff

By anchoring launch on **Worlds Studio**, Culture Wallet:

- Avoids cold-start failure
- Matches how culture actually spreads
- Makes TrustMesh invisible until valuable

This is not a wallet launch. This is a **culture infrastructure launch**.

