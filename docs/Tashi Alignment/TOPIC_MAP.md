# Culture Wallet Worlds → Tashi/FoxMQ Topic Map

**Status**: PROPOSAL (Subject to "FoxMQ" verification)
**Protocol**: MQTT (Assumed based on "FoxMQ" name)

## 1. Topic Taxonomy Strategy
Since "Worlds" are a Culture Wallet abstraction, we map them to a namespaced topic structure. This allows us to plug into Vertex (fast path) or HCS (anchor path) indiscriminately.

### Root Namespace
`cw/{environment}/{worldId}`

*   `cw`: Application Prefix (Culture Wallet)
*   `environment`: `dev`, `testnet`, `mainnet` (Matches HCS streams)
*   `worldId`: Unique World Identifier (e.g., `world_web3gang`)

## 2. Stream Definitions

| Logical Stream | MQTT Topic Suffix | Purpose | QoS (Prop) | Retain |
| :--- | :--- | :--- | :--- | :--- |
| **Meta** | `/meta` | Governance, Profile, Rules (The `WORLD_META` event) | 2 (Ex-once) | True |
| **Assets** | `/assets` | File inscriptions, metadata pointers | 1 (At-least) | False |
| **Signals** | `/signals` | Lightweight engagement, ephemeral pings | 0 (At-most) | False |
| **Passes** | `/passes` | Minting events, supply changes | 2 (Ex-once) | True |
| **Chat** | `/chat/{roomId}` | Real-time chat (if applicable) | 1 (At-least) | False |

### Example Full Topic
`cw/testnet/world_web3gang/meta`

## 3. Constraints & Unknowns
*   **Wildcards**: We assume standard MQTT `+` (single level) and `#` (multi-level) support.
    *   *Usage*: A client subscribes to `cw/testnet/world_web3gang/#` to get full state.
*   **Payload Size**: Unknown. HCS has strict limits (~6kb practical). If Vertex/FoxMQ supports larger, we might relax limits on the *Fast Path*, but *Anchor Path* events must still fit in HCS.
    *   *Decision*: **Enforce HCS limits on ALL paths** to ensure every coordination event can be settled if needed.
*   **Auth**: Unknown. Likely SASL or token-based.

## 4. Migration Path
1.  **Phase 1 (Current)**: All events -> HCS Topics.
2.  **Phase 2 (Hybrid)**:
    *   Events -> FoxMQ (Fast Path)
    *   Select Events (Meta, Assets) -> HCS (Anchor Path) via "Arc" bridge or dual-write.
    *   Wallet "Reducer" listens to both, de-dupes by `eventId`.
