# CultureWalletv2 - Complete UX Workflow Diagram

## 🎯 Overview
CultureWallet is built around 3 core loops from the original vision (Wallet, Community, Collectibles) plus viral boost mechanics, all powered by Hedera Consensus Service (HCS) and Magic.link authentication.

---

## 📱 Main User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CULTUREWALLET USER JOURNEY                        │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │ Landing Page │
                         │ "Own Culture"│
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌───────────────┐      ┌──────────────┐
            │  New User     │      │ Returning    │
            │  → /onboard   │      │ → /contacts  │
            └───────┬───────┘      └──────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │   MAGIC.LINK AUTH        │
        │   Email/Social Login     │
        │   Creates Hedera Account │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │   ONBOARDING FLOW        │
        │   1. Accept Stipend      │
        │   2. Create Profile      │
        │   3. Publish to HCS      │
        └──────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │     AUTHENTICATED - 5 TAB LOOP       │
    │  Friends→Circle→Signals→Messages→Boost│
    └──────────────────────────────────────┘
```

---

## 🔄 Loop 1: FRIENDS (Contacts Management)

```
START: /contacts
     │
     ▼
┌─────────────────────────────────────┐
│  GROW YOUR TRUSTED NETWORK          │
│  ┌──────────┐  ┌──────────┐        │
│  │QR Exchange│  │Send Signal│        │
│  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼──────────────┘
        │             │
        ▼             ▼
   [Scan QR]    [Recognition Modal]
        │             │
        ▼             │
   Add Contact        │
   CONTACT_ACCEPT ────┘
   event to HCS
        │
        ▼
┌─────────────────────────────────────┐
│  ALL CONTACTS LIST                  │
│  • Bonded contacts with trust count │
│  • Click → Profile sheet            │
│  • Message button → XMTP            │
│  • Send Signal → Recognition modal  │
└─────────┬───────────────────────────┘
          │
          ▼
    [Contact Added Event]
          │
          ▼
    Reload contacts list
    Update Circle LED indicators
```

**Key Actions:**
- QR Code Exchange: Scan peer's QR → Create contact bond
- Send Signal: Recognize friend's contribution
- View Profile: See trust history, NFTs, stats
- Direct Message: Open XMTP conversation

**HCS Events Emitted:**
- `CONTACT_REQUEST` (initial request)
- `CONTACT_ACCEPT` (bond confirmed)
- `TRUST_ALLOCATE` (inner circle tracking)

---

## 🔥 Loop 2: CIRCLE (Trust Allocation)

```
START: /circle
     │
     ▼
┌─────────────────────────────────────┐
│  TRUST CIRCLE VISUALIZATION         │
│                                     │
│         ┌─────────────┐            │
│         │   🔥 YOU    │            │
│         └─────────────┘            │
│    🟢●●●●●●●●●  (9 slots)         │
│    GREEN = Trust allocated         │
│    GRAY = Available slots          │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  ALLOCATE TRUST BUTTON              │
│  Click → Select Contact Modal       │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CONTACT SELECTION MODAL            │
│  • Show bonded contacts only        │
│  • Select → Optimistic UI update    │
│  • POST /api/trust/allocate         │
│  • Publish TRUST_ALLOCATE to HCS    │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CIRCLE MEMBERS LIST                │
│  • Current 9 trusted members        │
│  • Trust count per member           │
│  • Message/Signal buttons           │
│  • Revoke trust option              │
│  • Sprint challenge: "Add 3 more"   │
└─────────┬───────────────────────────┘
          │
          ▼
    LED Ring Updates
    Reflected in /contacts page
```

**Key Actions:**
- Allocate Trust: Add friend to inner circle (max 9)
- Revoke Trust: Remove from circle
- View Members: See all trusted connections
- Message Member: Quick XMTP access

**HCS Events Emitted:**
- `TRUST_ALLOCATE` (adds to circle)
- `TRUST_REVOKE` (removes from circle)

**Business Logic:**
- Max 9 trusted connections (intimate circle constraint)
- Must be bonded contact first
- Trust allocation tracked on-chain via HCS

---

## 🏆 Loop 3: SIGNALS (Recognition Feed)

```
START: /signals
     │
     ▼
┌─────────────────────────────────────┐
│  TWO TABS: FEED | MY TOKENS         │
└─────────┬─────────────┬─────────────┘
          │             │
  ┌───────┘             └──────┐
  ▼                            ▼
┌──────────────────┐    ┌──────────────────┐
│  FEED TAB        │    │  MY TOKENS TAB   │
│                  │    │                  │
│ • Real-time feed │    │ • Received NFTs  │
│ • Filter options │    │ • By category    │
│ • Search signals │    │ • Rarity display │
│ • Pull-to-refresh│    │ • Trust values   │
│ • Click → Detail │    │ • Swipeable grid │
└────┬─────────────┘    └──────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  SIGNAL FEED FILTERS                │
│  • All                              │
│  • From Me                          │
│  • To Me                            │
│  • Mine (my collection)             │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  FAB: SEND SIGNAL BUTTON            │
│  Click → Recognition Modal          │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CREATE RECOGNITION MODAL           │
│  1. Select Recipient (from contacts)│
│  2. Choose Signal Type              │
│     • Leadership                    │
│     • Execution                     │
│     • Knowledge                     │
│     • Social/Academic/Professional  │
│  3. Add Optional Message            │
│  4. Review & Sign                   │
│  5. Submit → HCS                    │
└─────────┬───────────────────────────┘
          │
          ▼
    POST /api/hcs/profile
    Event: SIGNAL_MINT or RECOGNITION_MINT
          │
          ▼
    Add to signalsStore (optimistic)
    Broadcast to all listeners
          │
          ▼
    Feed auto-updates with new signal
```

**Key Actions:**
- Send Signal: Recognize someone's contribution
- View Feed: Real-time recognition activity
- Filter Signals: Personalize view
- View Detail: See full signal metadata
- Collect Tokens: Track received recognitions

**HCS Events Emitted:**
- `SIGNAL_MINT` (recognition event)
- `RECOGNITION_MINT` (alternative format)

**Recognition Types:**
- Leadership (inspire, direct, organize)
- Execution (deliver, build, complete)
- Knowledge (teach, research, innovate)
- Social (connect, support, celebrate)

---

## 💬 Loop 4: MESSAGES (XMTP Chat)

```
START: /messages
     │
     ▼
┌─────────────────────────────────────┐
│  IDENTITY CHECK                     │
│  • useIdentity() → resolveScendID   │
│  • Magic wallet → EVM address       │
│  • XMTP enabled check               │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
[No Identity] [XMTP Ready]
    │           │
    ▼           ▼
Login Prompt  Load Conversations
              from xmtpClient
              │
              ▼
┌─────────────────────────────────────┐
│  CONVERSATION LIST                  │
│  • All active conversations         │
│  • Bonded contacts only             │
│  • Last message preview             │
│  • Unread indicators                │
│  • Click → Open chat                │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CHAT VIEW (1:1 Conversation)       │
│  • Send/receive messages            │
│  • End-to-end encrypted (XMTP)      │
│  • Tied to Hedera identity          │
│  • Real-time sync                   │
│  • Message history                  │
└─────────────────────────────────────┘
```

**Key Actions:**
- Start Conversation: Message any bonded contact
- Send Message: Encrypted via XMTP protocol
- Receive Message: Real-time notification
- View History: All past conversations

**Technical Stack:**
- XMTP Protocol (EVM-based messaging)
- Magic Wallet (provides EVM private key)
- ScendIdentity (identity layer)
- Encrypted end-to-end by default

---

## ⚡ Loop 5: BOOST (Viral Mechanics)

```
START: /boost
     │
     ▼
┌─────────────────────────────────────┐
│  BOOST FEED PAGE                    │
│  Current State: EMPTY STATE         │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  STATS DASHBOARD (Placeholder)      │
│  • Boosts Given: 0                  │
│  • Boosts Received: 0               │
│  • Viral Signals: 0                 │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  EMPTY STATE EDUCATION              │
│  "Start Boosting Signals"           │
│                                     │
│  ┌─────────────────────────┐       │
│  │ 📝 How Boosts Work:     │       │
│  │ 1. Give Boosts          │       │
│  │    Amplify signals      │       │
│  │                         │       │
│  │ 2. Go Viral             │       │
│  │    Gain rarity          │       │
│  │                         │       │
│  │ 3. Share Links          │       │
│  │    Social media         │       │
│  │                         │       │
│  │ 4. Track Impact         │       │
│  │    Network spread       │       │
│  └─────────────────────────┘       │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  CTAs                               │
│  • Send Your First Signal           │
│  • Browse Recognition Cards         │
└─────────────────────────────────────┘

FUTURE IMPLEMENTATION:
          │
          ▼
┌─────────────────────────────────────┐
│  USER SIGNALS LIST                  │
│  • Recognition signals sent/received│
│  • Boost count per signal           │
│  • Viral status indicator           │
│  • Shareable boost links            │
│  • Rarity progression               │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  BOOST MECHANICS                    │
│  • Boost signal → Increase rarity   │
│  • Generate boost link              │
│  • Track boost count                │
│  • Rarity progression:              │
│    Common (0-9) → Rare (10-49)      │
│    → Epic (50-99) → Legendary (100+)│
└─────────────────────────────────────┘
```

**Key Actions (Future):**
- Boost Signal: Amplify recognition to network
- Generate Link: Create shareable boost URL
- Track Virality: Monitor boost count
- View Analytics: Network spread metrics

**Rarity System:**
- Common: 0-9 boosts
- Rare: 10-49 boosts
- Epic: 50-99 boosts
- Legendary: 100+ boosts

**Integration Points:**
- `/boost/[boostId]` - Viral landing page (already exists)
- Boost count tracked as signal metadata
- Shareable links for social media

---

## 💎 Loop 6: COLLECTIONS (GHHA Membership NFTs)

```
START: /collections
     │
     ▼
┌─────────────────────────────────────┐
│  CHECK TOKEN CONFIGURATION          │
│  hasConfiguredTokens()?             │
└─────────┬─────────────┬─────────────┘
          │             │
    [No Tokens]    [Tokens Configured]
          │             │
          ▼             ▼
    ┌──────────┐  ┌────────────────┐
    │ COMING   │  │ LOAD USER      │
    │ SOON     │  │ MEMBERSHIPS    │
    │ STATE    │  │ from Mirror    │
    └──────────┘  └────┬───────────┘
                       │
                 ┌─────┴─────┐
                 │           │
           [No NFTs]    [Has NFTs]
                 │           │
                 ▼           ▼
          ┌──────────┐  ┌────────────┐
          │ EMPTY    │  │ GALLERY    │
          │ STATE    │  │ VIEW       │
          └──────────┘  └────┬───────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │  BENEFITS SUMMARY   │
                    │  • Events Unlocked  │
                    │  • Voting Power     │
                    │  • Max Discounts    │
                    └────┬────────────────┘
                         │
                         ▼
                    ┌─────────────────────┐
                    │  NFT CARD GRID      │
                    │  3 columns layout   │
                    │  • Tier badge       │
                    │  • Serial number    │
                    │  • Event count      │
                    │  • Voting power     │
                    │  Click → Detail     │
                    └────┬────────────────┘
                         │
                         ▼
              /collections/[tokenId]/[serial]
                         │
                         ▼
              ┌──────────────────────────┐
              │  NFT DETAIL PAGE         │
              │                          │
              │  LEFT COLUMN:            │
              │  • Large tier display    │
              │  • Status badge          │
              │                          │
              │  RIGHT COLUMN:           │
              │  • Token metadata        │
              │  • Benefits stats        │
              │  • HashScan link         │
              │                          │
              │  BENEFITS GRID (2x2):    │
              │  • Event Access          │
              │  • Governance/Channels   │
              │  • Member Discounts      │
              │  • Priority Access       │
              └──────────────────────────┘
```

**GHHA Membership Tiers:**

| Tier | Emoji | Governance | Voting Power | Event Access | Discounts |
|------|-------|------------|--------------|--------------|-----------|
| Bronze | 🥉 | No | 0 | General Admission | 10% / 5% |
| Silver | 🥈 | Yes | 1 | +Workshops, Mixers | 20% / 15% |
| Gold | 🥇 | Yes | 3 | +VIP, Meet & Greets | 30% / 25% |
| Platinum | 💎 | Yes | 10 | +Executive, Private | 50% / 40% |

**Key Actions:**
- View Collections: Browse owned membership NFTs
- Check Benefits: See unlocked access and discounts
- View Details: Full NFT metadata and benefits
- HashScan Link: Verify on-chain ownership
- Token-Gating: Features locked by tier

**Data Flow:**
```
User Account ID
    ↓
Mirror Node API Query
/api/v1/accounts/{accountId}/nfts
    ↓
Filter by GHHA Token IDs
    ↓
Parse NFT Metadata (base64)
    ↓
Match to Tier Configuration
    ↓
Calculate Benefits
    ↓
Display Gallery
```

**Token-Gating Examples:**
```typescript
// Check tier access
checkMembershipTier(memberships, 'gold')
// Result: { hasAccess: true/false, userTier, reason }

// Check event access
checkEventAccess(memberships, 'VIP Receptions')

// Check governance
checkGovernanceAccess(memberships)

// Calculate voting power
calculateVotingPower(memberships)
```

---

## 🔐 Authentication & Identity Flow

```
┌─────────────────────────────────────┐
│  MAGIC.LINK AUTHENTICATION          │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  USER SIGNS IN                      │
│  • Email magic link                 │
│  • Social login (Google, etc)       │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  MAGIC GENERATES                    │
│  • EVM private key (encrypted)      │
│  • DID token (auth token)           │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  HEDERA ACCOUNT CREATION            │
│  • Account ID: 0.0.xxxxx            │
│  • Public key from EVM key          │
│  • Associated with Magic wallet     │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  PROFILE CREATION                   │
│  • POST /api/hcs/profile            │
│  • Event: PROFILE_CREATE            │
│  • Published to HCS                 │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  SESSION ESTABLISHED                │
│  • localStorage: tm:users           │
│  • Contains: accountId, publicKey   │
│  • Magic DID token for API calls    │
└─────────────────────────────────────┘
```

**Identity Layers:**
1. **Magic Wallet**: Email-based web3 wallet
2. **Hedera Account**: 0.0.x format account ID
3. **ScendIdentity**: Unified identity layer
4. **XMTP**: EVM address for messaging

---

## 📊 Data Architecture

### SignalsStore (Client-Side Cache)
```
localStorage: 'tm:signals'
    │
    ▼
{
  events: [
    {
      id: "unique-id",
      type: "CONTACT_ACCEPT" | "TRUST_ALLOCATE" | "SIGNAL_MINT",
      from: "0.0.12345",
      to: "0.0.67890",
      data: {...},
      timestamp: 1234567890,
      _hrl: "hedera://...",
      _ts: "2025-12-11..."
    }
  ],
  watermark: "last-ingestion-timestamp"
}
```

**Operations:**
- `getAll()` - All cached events
- `getBondedContacts(sessionId)` - Only CONTACT_ACCEPT events
- `add(event)` - Optimistic add with broadcast
- `subscribe(callback)` - Real-time updates

### HCS Topics
```
CONTACTS:     0.0.7148063  (bonding events)
TRUST:        0.0.7148064  (trust allocation)
PROFILE:      0.0.7148066  (user profiles)
RECOGNITION:  0.0.7148065  (signals/recognition)
```

### Mirror Node Integration
```
Base: https://testnet.mirrornode.hedera.com/api/v1

Endpoints Used:
- /topics/{topicId}/messages       (HCS events)
- /accounts/{accountId}/nfts       (NFT holdings)
- /tokens/{tokenId}                (Token info)
- /tokens/{tokenId}/nfts/{serial}  (NFT details)
```

---

## 🎨 Navigation Structure

### Bottom Navigation (5 Tabs)
```
┌─────────┬─────────┬─────────┬──────────┬────────┐
│ Friends │ Circle  │ Signals │ Messages │ Boost  │
│  (👥)   │  (🔥)   │  (⚡)   │   (💬)   │  (⚡)  │
└─────────┴─────────┴─────────┴──────────┴────────┘
```

### Header Menu (Dropdown)
- Profile (`/me`)
- Settings (`/settings`)
- Collections (`/collections`)
- Recognition Cards (`/recognition-cards`)
- QR Scanner (`/qr`)

### Routes
```
/                    Landing page
/onboard             Onboarding flow
/contacts            Friends tab
/circle              Circle of trust
/signals             Recognition feed
/messages            XMTP chat
/boost               Boost feed
/collections         GHHA NFT memberships
/recognition-cards   Recognition signal cards
/me                  User profile
/settings            App settings
```

---

## 🔄 Real-Time Update Flow

```
User Action (e.g., Send Signal)
    ↓
POST /api/hcs/profile
    ↓
Submit to Hedera (background)
    ↓
Optimistic Update: signalsStore.add()
    ↓
signalsStore.broadcast()
    ↓
All subscribed components re-render
    ↓
Mirror Node Ingestion (async)
    ↓
useHcsEvents() hook fetches new data
    ↓
signalsStore.add() with HCS confirmation
    ↓
Final state synchronized
```

**Key Pattern:**
1. Optimistic UI update (instant feedback)
2. Background HCS submission (async)
3. Confirmation via Mirror Node polling
4. Final state reconciliation

---

## 🎯 Critical User Paths

### 1. First-Time User Journey
```
Landing → Login → Onboarding → Accept Stipend → Create Profile
→ Add First Contact (QR) → Allocate Trust → Send First Signal
→ View Feed → Explore Collections
```

### 2. Daily Active User
```
Open App → Check Signals Feed → Respond to Recognition
→ Send Signal to Friend → Check Messages → View Circle
→ Boost Favorite Signal → Explore Collections
```

### 3. GHHA Member Journey
```
Login → View Collections → Check Tier Benefits
→ Use Event Access → Vote on Proposal → Apply Discount
→ Access Exclusive Channel → Boost Signal
```

---

## 🚀 Future Enhancements

### Sprint 2: Vertical Integration
- **Engagement**: Recognition signals → Mintable NFTs
- **Boost Mechanics**: Full viral amplification system
- **Governance**: Weighted voting interface

### Sprint 3: Advanced Features
- **Token-Gated Channels**: XMTP with tier filtering
- **Event Management**: GHHA event ticketing
- **Analytics Dashboard**: Personal and community metrics

### Sprint 4: Cultural Verticals
- **African Context**: Localized recognition types
- **GenZ Slang**: Custom signal language
- **Community Themes**: Vertical-specific UI modes

---

## 📚 Technical Stack Summary

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI

**Blockchain:**
- Hedera Consensus Service (HCS)
- Hedera Token Service (HTS)
- Mirror Node API

**Authentication:**
- Magic.link (wallet auth)
- ScendIdentity (unified layer)

**Messaging:**
- XMTP Protocol (encrypted)

**State Management:**
- SignalsStore (custom)
- LocalStorage persistence
- React hooks

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2025  
**Status:** Production Ready (Sprint 1 Complete)
