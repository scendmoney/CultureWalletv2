# 3-Loop UX Compression Plan
**Strategic Reduction: 5 Tabs → 3 Loops**

## 🎯 Vision

Transform CultureWalletv2 from a **feature-per-tab architecture** to a **relationship-first architecture** by collapsing navigation into 3 core loops that match the original CultureWallet vision:

1. **Community** - Connect, trust, communicate
2. **Wallet** - Value exchange with TRST
3. **Culture** - Recognition, collectibles, status

---

## 📊 Current State Analysis

### Current Navigation (5 Tabs)
```
Friends   Circle   Signals   Messages   Boost
  ↓         ↓         ↓         ↓         ↓
Contact  Trust    Recognition  XMTP     Viral
  Mgmt   Alloc      Feed       Chat   Mechanics
```

**Problems:**
- User bounces between tabs to interact with ONE relationship
- Mental overhead: "Where do I send a signal?" "Where's trust?"
- Features feel disconnected despite being relationship-coded
- New users confused by number of surfaces

### Hidden/Secondary Surfaces
- Collections (GHHA NFTs)
- Recognition Cards (metadata)
- Profile / Settings
- QR Scanner
- Onboarding

**Total surfaces: 11+**

---

## 🎯 Proposed 3-Loop Structure

### Loop 1: COMMUNITY 👥
**Purpose:** All relationship-based interactions

```
COMMUNITY HOME
├─ Ring of 9 (mini trust circle)
│  └─ Tap to see full circle management
│
├─ Contacts List
│  ├─ Avatar + Name + Trust indicator
│  ├─ Last activity preview
│  └─ Tap → Contact Drawer
│
├─ Messages Preview
│  ├─ Recent XMTP conversations
│  └─ Tap → Full conversation
│
└─ + Add Contact (FAB)
   └─ Opens QR scanner

CONTACT DRAWER (Slide-up on contact tap)
┌────────────────────────────────┐
│ [Avatar] Tony Camero           │
│ Trust: 🔥🔥🔥 (3/9)            │
├────────────────────────────────┤
│ [💬 Message]  [⚡ Send Signal] │
│ [🔥 Trust]     [💰 Send TRST]  │
├────────────────────────────────┤
│ Recent Activity:               │
│ • Signal: "Great execution" 2h │
│ • Message: "Thanks!" 5h        │
│ • Trust allocated 2d           │
└────────────────────────────────┘
```

**Eliminates:**
- Friends tab (becomes Community home)
- Messages tab (becomes action in drawer + preview)
- Circle tab (becomes Ring of 9 widget + drawer action)

---

### Loop 2: WALLET 💰
**Purpose:** TRST balance and value exchange

```
WALLET HOME
├─ TRST Balance Card
│  ├─ Large balance display
│  ├─ USD equivalent
│  └─ Recent change indicator
│
├─ Quick Actions
│  ├─ [Send TRST]    → Opens contact picker
│  ├─ [Request TRST] → Generate QR/link
│  └─ [Add Funds]    → Future: Brinks/Brale
│
└─ Transaction History
   ├─ Sent/Received
   ├─ Timestamps
   └─ Tap → Detail view
```

**Adds:** (Future Sprint 2+)
- TRST payments
- Transaction history
- Brinks/Brale cash-to-TRST flow

---

### Loop 3: CULTURE 🎨
**Purpose:** Recognition, collectibles, cultural status

```
CULTURE HOME
├─ Recognition Feed (scrollable)
│  ├─ Filter: All | From Me | To Me
│  ├─ Signal cards with boost counts
│  └─ Pull-to-refresh
│
├─ + Create Signal (FAB)
│  └─ Opens recognition modal
│
├─ My Collectibles
│  ├─ GHHA Membership NFTs
│  │  ├─ Tier badge (Bronze/Silver/Gold/Platinum)
│  │  ├─ Benefits summary
│  │  └─ Tap → Full collection view
│  │
│  └─ Recognition Cards Earned
│     ├─ By category (Leadership, Execution, etc.)
│     └─ Rarity indicators
│
└─ Boost Activity (when implemented)
   ├─ Signals boosted
   ├─ Viral momentum tracking
   └─ Shareable boost links
```

**Eliminates:**
- Signals tab (becomes Culture feed)
- Boost tab (becomes Culture section)
- Collections tab (becomes Culture section)

**Moves to subpages:**
- Recognition Cards detail → `/recognition-cards` (kept for deep links)
- Collection detail → `/collections/[tokenId]/[serial]`

---

## 🔄 Data Flow Remains Unchanged

**Key Insight:** This is a UI reorganization, not a backend change.

All existing services remain:
- SignalsStore (recognition events)
- HCS topics (contact, trust, signals, profile)
- XMTP client (messaging)
- Mirror Node (NFT queries)
- Magic.link (authentication)

The compression happens at the **component level**, not the data level.

---

## 📐 Contact Drawer Architecture

The **Contact Drawer** is the keystone component - it collapses 4 interactions into 1 surface:

```typescript
// Contact Drawer Component
interface ContactDrawerProps {
  contactId: string
  onClose: () => void
}

const ContactDrawer = ({ contactId, onClose }) => {
  // Fetch all relationship data
  const contact = useContact(contactId)
  const trustStatus = useTrustStatus(contactId)
  const recentMessages = useRecentMessages(contactId, 3)
  const recentSignals = useRecentSignals(contactId, 3)
  
  return (
    <Drawer>
      <Header>
        <Avatar src={contact.avatar} />
        <Name>{contact.name}</Name>
        <TrustIndicator count={trustStatus.trustCount} max={9} />
      </Header>
      
      <Actions>
        <MessageButton onClick={() => openXMTP(contactId)} />
        <SignalButton onClick={() => openRecognitionModal(contactId)} />
        <TrustButton 
          active={trustStatus.inCircle}
          onClick={() => toggleTrust(contactId)}
        />
        <PaymentButton onClick={() => openPaymentModal(contactId)} />
      </Actions>
      
      <ActivityFeed>
        {[...recentMessages, ...recentSignals]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
          .map(event => <ActivityItem key={event.id} event={event} />)
        }
      </ActivityFeed>
    </Drawer>
  )
}
```

---

## 🗺️ Route Structure

### Bottom Navigation (3 Tabs)
```
/community   (Community Loop)
/wallet      (Wallet Loop)
/culture     (Culture Loop)
```

### Preserved Routes (for deep linking)
```
/recognition-cards           (Culture subpage)
/recognition-cards/[id]      (Signal detail)
/collections                 (Culture subpage)
/collections/[tokenId]/[serial]  (NFT detail)
/messages                    (redirects to Community)
/circle                      (redirects to Community)
/signals                     (redirects to Culture)
```

### Auth & Meta Routes (unchanged)
```
/                  (Landing)
/onboard           (Onboarding)
/me                (Profile)
/settings          (Settings)
/qr                (QR Scanner - launched from Community)
```

---

## 🎨 Component Architecture

### New Components
```
Community Loop:
├─ CommunityHome
├─ RingOfNine (trust circle widget)
├─ ContactsList
├─ MessagesPreview
├─ ContactDrawer ⭐ (KEY COMPONENT)
├─ AddContactFAB
└─ QRScannerModal

Wallet Loop:
├─ WalletHome
├─ TRSTBalanceCard
├─ QuickActionsBar
├─ TransactionHistory
├─ SendTRSTModal
└─ RequestTRSTModal

Culture Loop:
├─ CultureHome
├─ RecognitionFeed
├─ CreateSignalFAB
├─ MyCollectiblesSection
│  ├─ GHHAMembershipCards
│  └─ RecognitionCardsGrid
└─ BoostActivitySection
```

### Refactored Components
```
Existing components move INTO loops:
- ContactsList → CommunityHome
- TrustCircleVisualization → RingOfNine widget
- SignalsFeed → RecognitionFeed
- CollectionsPage → MyCollectiblesSection
```

---

## 📋 Implementation Phases

### Phase 1: Contact Drawer (Week 1)
**Goal:** Build the keystone component

**Tasks:**
1. Create ContactDrawer component
2. Wire up 4 action buttons (Message, Signal, Trust, Pay)
3. Add activity feed (recent messages + signals)
4. Integrate with existing services (no new backend needed)
5. Test slide-up animation and gesture handling

**Deliverable:** Working contact drawer that launches from anywhere

---

### Phase 2: Community Loop (Week 2)
**Goal:** Collapse Friends + Circle + Messages into Community

**Tasks:**
1. Create CommunityHome layout
2. Build RingOfNine widget (simplified Circle visualization)
3. Move ContactsList into Community
4. Add MessagesPreview section
5. Update navigation: Replace 3 tabs with 1 Community tab
6. Redirect old routes: /circle → /community, /messages → /community

**Deliverable:** Single Community tab with all relationship features

---

### Phase 3: Culture Loop (Week 3)
**Goal:** Collapse Signals + Boost + Collections into Culture

**Tasks:**
1. Create CultureHome layout
2. Move SignalsFeed to top of Culture
3. Build MyCollectiblesSection
4. Integrate GHHA membership cards
5. Add RecognitionCards grid
6. Keep CreateSignal FAB
7. Redirect old routes: /signals → /culture, /boost → /culture

**Deliverable:** Single Culture tab with recognition + collectibles

---

### Phase 4: Wallet Loop (Week 4)
**Goal:** Create clean TRST balance + payments surface

**Tasks:**
1. Create WalletHome layout
2. Build TRSTBalanceCard (large, prominent)
3. Add QuickActionsBar (Send, Request, Add Funds)
4. Create TransactionHistory component
5. Build SendTRSTModal with contact picker
6. Integrate with existing TRST infrastructure

**Deliverable:** Working Wallet tab with TRST operations

---

### Phase 5: Polish & Testing (Week 5)
**Goal:** Smooth transitions and mobile optimization

**Tasks:**
1. Optimize drawer animations
2. Test gesture handling (swipe-to-close, etc.)
3. Mobile responsiveness testing
4. Update onboarding flow for 3-loop structure
5. Analytics: Track which loop features get most use
6. Bug fixes and performance optimization

**Deliverable:** Production-ready 3-loop navigation

---

## 📊 Success Metrics

### User Behavior
- **Reduced tab switches:** Expect 60% reduction in navigation events
- **Increased contact engagement:** More actions per contact (message + signal + trust)
- **Faster task completion:** Time to send signal or message reduced by 40%

### System Metrics
- **Component reuse:** 80%+ of existing components reused
- **Bundle size:** Minimal change (just reorganization)
- **Performance:** No degradation (same data loading)

### User Feedback
- **Onboarding success:** New users understand 3 loops faster than 5 tabs
- **Power user approval:** Existing users adapt within 1 week
- **Support tickets:** Reduced "where is X?" questions

---

## 🚧 Rollout Strategy

### Option A: Big Bang (Recommended)
**When:** After Phase 5 complete
**How:** Ship 3-loop navigation all at once
**Pros:** Clean break, no confusion
**Cons:** Requires user re-learning

### Option B: Gradual Migration
**When:** Ship phase by phase
**How:** Community first, then Culture, then Wallet
**Pros:** Less disruptive
**Cons:** Inconsistent experience during transition

**Recommendation:** Option A with:
- In-app tutorial for first login after update
- "What's New" modal explaining 3 loops
- Old routes redirect with toast: "Now in Community tab"

---

## 🔮 Future Enhancements

### Post-3-Loop Optimizations

**Smart Contact Drawer:**
- AI-suggested actions based on relationship history
- "You usually send Tony a signal on Fridays"
- Quick reply suggestions

**Cross-Loop Integration:**
- Pay someone while messaging them (Wallet → Community)
- Send signal after completing payment (Wallet → Culture)
- Boost signal in Culture tab, message contact in Community tab

**Contextual Navigation:**
- Bottom nav adapts based on current activity
- Community tab highlights when message received
- Culture tab highlights when signal received

---

## 📚 Technical Details

### State Management
No changes needed - existing patterns work:
- SignalsStore for HCS events
- React Query for API data
- LocalStorage for session
- XMTP client state

### API Layer
No changes needed - same endpoints:
- `/api/hcs/events` (signals)
- `/api/trust/allocate` (trust)
- `/api/contact/*` (contacts)
- Mirror Node (NFTs)

### Performance
- Lazy load drawer content
- Virtualized lists for feeds
- Optimistic UI updates
- Background sync unchanged

---

## ✅ Checklist

### Pre-Implementation
- [ ] Review plan with team
- [ ] Design mockups for 3 loops
- [ ] Design contact drawer interactions
- [ ] Plan data migration (if any)

### During Implementation
- [ ] Build ContactDrawer (Phase 1)
- [ ] Build Community loop (Phase 2)
- [ ] Build Culture loop (Phase 3)
- [ ] Build Wallet loop (Phase 4)
- [ ] Testing & polish (Phase 5)

### Post-Launch
- [ ] Monitor analytics
- [ ] Gather user feedback
- [ ] Iterate on drawer interactions
- [ ] Add cross-loop features

---

## 🎯 Summary

This compression:
1. **Reduces cognitive load** - 5 tabs → 3 loops (40% reduction)
2. **Matches mental model** - Relationships first, not features
3. **Preserves all functionality** - Nothing lost, just reorganized
4. **Improves task completion** - Fewer navigation jumps
5. **Aligns with data model** - HCS events are relationship-coded
6. **Sets up future scaling** - 3 loops can grow without nav bloat

**The Contact Drawer is the key** - it collapses 4 interaction types (message, signal, trust, pay) into 1 unified relationship surface.

This is the right move for CultureWalletv2.

---

**Document Version:** 1.0  
**Status:** Planning Phase  
**Ready for:** Design mockups + implementation
