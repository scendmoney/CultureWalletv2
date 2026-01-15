# Tashi Alignment Facts (Worlds / Topics / Settlement / Ordering)

**Source**: `https://docs.tashi.network` (Retrieved 2026-01-03)

## 1. Primitives & Terminology

### Confirmed
*   **Vertex**: The consensus layer. Uses a "DAG-based gossip-about-gossip protocol with virtual voting." (Sec: *How It Works*)
    *   *Implication*: This is likely where "coordination" happens. It provides ordering without a central leader.
*   **Arc**: The settlement layer. "Bridges to Ethereum, Solana, Hedera... activates only when required." (Sec: *The Three-Layer Architecture*)
    *   *Implication*: Our HCS "World State" aligns perfectly with Arc. We use HCS for permanent settlement/audit, just as Arc is designed to do.
*   **Lattice**: The infrastructure layer. Handles "Discovery, ... Validation, ... Economics." (Sec: *How It Works*)
*   **Latency**: "26-103ms depending on configuration." (Sec: *Key Capabilities*)
    *   *Implication*: "Fast path" updates can be extremely responsive.

### Unknown (No Citation Found)
*   **FoxMQ**: The term "FoxMQ" does not appear in the public documentation at `docs.tashi.network`.
    *   *Action*: We cannot confirm MQTT topic constraints (wildcards, auth, QoS) specific to "FoxMQ". We will assume standard MQTT v5 behavior for the `TOPIC_MAP.md` proposal but flag this for verification.
*   **"Worlds" Primitive**: No mention of a "World" primitive. Applications listed are "Robotics," "AI Agents," "Industrial IoT," "Gaming."
    *   *Implication*: "Worlds" is a pure Culture Wallet abstraction. We can define it however we want on top of Vertex/Arc.

## 2. Ordering & Consensus

### Confirmed
*   **Causal Ordering**: Vertex builds a "causally-ordered graph." (Sec: *How It Works*)
    *   *Implication*: Events are ordered relative to each other. This supports our strategy of using `prevEventId` or monotonic `revision` numbers to enforce order at the application level, matching the underlying DAG structure.
*   **Byzantine Tolerance**: "Up to f = ⌊(n-1)/3⌋ malicious participants." (Sec: *Key Capabilities*)

## 3. Settlement Relationship

### Confirmed
*   **Bridging**: Arc is explicitly for "when blockchain settlement, token issuance, or public finality is needed." (Sec: *How It Works*)
*   **Hedera Support**: Hedera is explicitly listed as a supported network for Arc. (Sec: *The Three-Layer Architecture*)

## 4. Questions for Tashi Team
1.  **FoxMQ Specs**: Where is the documentation for "FoxMQ"? Is it a standard MQTT broker? What are the topic limits?
2.  **Vertex Stream Identity**: How do we map a "World" (a logical grouping of state) to a Vertex session/group?
