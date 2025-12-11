# Legacy Navigation Notes

## Overview
This document tracks the legacy 6-tab navigation structure and how it maps to the new 3-loop architecture introduced in Phase 2-4 of the 3-Loop Compression project.

## Old Tab Structure → New Loop Structure

### Legacy 6-Tab Navigation (Pre-Compression)
1. Friends → `/contacts`
2. Circle → `/circle`  
3. Messages → `/messages`
4. Signals → `/signals`
5. Boost → `/boost`
6. Collections → `/collections`

### New 3-Loop Navigation (Current)
1. **Community** → `/community`
   - Consolidates: Friends, Circle, Messages
   - Features: RingOfNine (Circle of 9), contacts list, trust management, message preview
   
2. **Culture** → `/culture`
   - Consolidates: Signals, Boost, Collections
   - Features: Recognition feed, collectibles section, boost stats
   
3. **Wallet** → `/wallet`
   - New dedicated tab
   - Features: TRST balance, send/receive/top-up, transaction history

## Redirect Mappings

All legacy routes are preserved as redirect stubs that automatically forward to the appropriate new loop:

| Legacy Route | Redirects To | Status | Implementation |
|-------------|-------------|--------|----------------|
| `/contacts` | `/community` | ✅ Active | `app/(tabs)/contacts/page.tsx` |
| `/circle` | `/community` | ✅ Active | `app/(tabs)/circle/page.tsx` |
| `/messages` | `/community` | ✅ Active | `app/(tabs)/messages/page.tsx` |
| `/signals` | `/culture` | ✅ Active | `app/(tabs)/signals/page.tsx` |
| `/boost` | `/culture` | ✅ Active | `app/(tabs)/boost/page.tsx` |
| `/collections` | N/A | ❌ Removed | Route does not exist |

## Redirect Implementation Pattern

All redirect stubs follow this pattern:

```tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LegacyPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/target-loop')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to [Target Loop]...</p>
      </div>
    </div>
  )
}
```

## Component Mapping

### ContactDrawer
- **Location**: `components/contacts/ContactDrawer.tsx`
- **Used by**: Community page
- **Status**: Active, fully integrated
- **Language**: Updated to reference "Circle of 9" and 3-loop concepts

### RingOfNine
- **Location**: `components/community/RingOfNine.tsx`
- **Used by**: Community page
- **Status**: Active
- **Purpose**: Visual representation of Circle of Trust (max 9 contacts)

### RecognitionFeed
- **Location**: `components/culture/RecognitionFeed.tsx`
- **Used by**: Culture page
- **Status**: Active
- **Replaces**: Old signals page feed

### MyCollectiblesSection
- **Location**: `components/culture/MyCollectiblesSection.tsx`
- **Used by**: Culture page
- **Status**: Active
- **Replaces**: Old collections tab

### BoostSection
- **Location**: `components/culture/BoostSection.tsx`
- **Used by**: Culture page
- **Status**: Active
- **Replaces**: Old boost tab

## Bottom Navigation

**Location**: `components/layout/BottomNav.tsx`

**Current tabs** (in order):
1. Community (Users icon) → `/community`
2. Culture (Sparkles icon) → `/culture`
3. Wallet (Wallet icon) → `/wallet`

**Removed tabs**:
- Friends
- Circle
- Messages
- Signals
- Boost

## Known Issues & Future Cleanup

### TODO: Not Urgent
- [ ] Consider removing `/contacts`, `/circle`, `/messages`, `/signals`, `/boost` page files entirely (currently kept for backwards compatibility)
- [ ] Archive old component variants if any exist in unused directories
- [ ] Update any deep-linked documentation or external URLs pointing to legacy routes

### TODO: Monitor
- [ ] Check analytics for users hitting legacy routes (if analytics are implemented)
- [ ] Watch for any hard-coded legacy route references in external integrations

## Testing Checklist

When making navigation changes, verify:
- [ ] All legacy routes redirect correctly without infinite loops
- [ ] Bottom nav shows exactly 3 tabs with correct labels and icons
- [ ] No console errors when navigating between loops
- [ ] ContactDrawer opens correctly from Community page
- [ ] RingOfNine interactions work (click contact, click empty slot)
- [ ] Culture feed, collectibles, and boost sections load
- [ ] Wallet balance and transaction sections load

## Related Documentation

- `/docs/3_LOOP_COMPRESSION_PLAN.md` - Original compression strategy
- `/docs/PHASE_1_CONTACT_DRAWER_SUMMARY.md` - ContactDrawer implementation
- `EXISTING_USER_FIX.md` - Onboarding redirect fixes

## Change Log

- **2025-12-11**: Initial documentation created as part of Phase 5 UX Polish
- **Phase 4**: Wallet tab added, completing 3-loop structure
- **Phase 3**: Culture loop created, consolidating Signals/Boost/Collections
- **Phase 2**: Community loop created, consolidating Friends/Circle/Messages
- **Phase 1**: ContactDrawer implementation

## Contact

For questions about legacy navigation or 3-loop architecture:
- Check git history for implementation details
- Review conversation summary for context on architectural decisions
