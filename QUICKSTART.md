# CultureWalletv2 Quick Reference

## 🚀 Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm run build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📁 Project Structure

```
app/
├── (tabs)/                      # Main navigation tabs
│   ├── contacts/               # Friends management
│   ├── circle/                 # Trust visualization
│   ├── signals/                # Recognition feed
│   ├── messages/               # XMTP messaging
│   └── boost/                  # Boost feed (NEW)
├── collections/                # GHHA NFT memberships (NEW)
│   └── [tokenId]/[serialNumber]/ # NFT detail pages
├── recognition-cards/          # Recognition signal cards (MIGRATED)
├── boost/[boostId]/           # Viral boost links
└── page.tsx                    # Landing page

lib/
├── types/
│   └── nft-collections.ts     # GHHA membership types (NEW)
├── services/
│   └── nft-collections.ts     # Mirror Node NFT queries (NEW)
└── utils/
    └── token-gate.ts          # Token-gating utilities (NEW)

components/
├── HeaderMenu.tsx             # Main header (rebranded)
└── layout/
    └── BottomNav.tsx          # Bottom navigation (updated)
```

## 🎨 CultureWallet Branding

### Color Palette
```css
Purple (Primary):   #7c3aed
Green (Secondary):  #10b981
Gold (Accent):      #ca8a04
```

### Design Patterns
```tsx
// Glass morphism cards
className="bg-white/5 backdrop-blur-sm border border-white/10"

// Hover effects
className="hover:border-white/30 transition-all hover:scale-105"

// Classic gold buttons
className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
```

## 🔑 Environment Variables

### Required for Collections
```bash
# GHHA NFT Token IDs
NEXT_PUBLIC_GHHA_BRONZE_TOKEN_ID=0.0.XXXXX
NEXT_PUBLIC_GHHA_SILVER_TOKEN_ID=0.0.XXXXX
NEXT_PUBLIC_GHHA_GOLD_TOKEN_ID=0.0.XXXXX
NEXT_PUBLIC_GHHA_PLATINUM_TOKEN_ID=0.0.XXXXX

# Already Configured
NEXT_PUBLIC_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
```

### Existing Configuration
```bash
# Hedera HCS Topics
NEXT_PUBLIC_CONTACTS_TOPIC_ID=0.0.7148063
NEXT_PUBLIC_TRUST_TOPIC_ID=0.0.7148064
NEXT_PUBLIC_PROFILE_TOPIC_ID=0.0.7148066
NEXT_PUBLIC_RECOGNITION_TOPIC_ID=0.0.7148065

# TRST Token
NEXT_PUBLIC_TRST_TOKEN_ID=0.0.5361653
```

## 📱 Navigation Structure

**Bottom Nav (5 tabs):**
1. Friends → `/contacts`
2. Circle → `/circle`
3. Signals → `/signals`
4. Messages → `/messages`
5. Boost → `/boost` ✨ NEW

**Additional Routes:**
- Landing → `/`
- Collections → `/collections` ✨ NEW
- Recognition Cards → `/recognition-cards` ✨ MIGRATED
- Profile → `/me`
- Settings → `/settings`
- Onboarding → `/onboard`

## 🎯 Key Features

### GHHA Membership NFTs (Sprint 1)
```typescript
// Get user's memberships
import { getGHHAMemberships } from '@/lib/services/nft-collections'
const memberships = await getGHHAMemberships(accountId)

// Check token-gating
import { checkMembershipTier } from '@/lib/utils/token-gate'
const result = checkMembershipTier(memberships, 'gold')
if (result.hasAccess) {
  // Show gold+ features
}

// Get highest tier
import { getHighestTier } from '@/lib/types/nft-collections'
const tier = getHighestTier(memberships) // 'bronze' | 'silver' | 'gold' | 'platinum'
```

### Tier Benefits
| Tier | Voting Power | Events | Governance | Merch Discount |
|------|--------------|--------|------------|----------------|
| Bronze | 0 | General | No | 10% |
| Silver | 1 | +Workshops | Yes | 20% |
| Gold | 3 | +VIP | Yes | 30% |
| Platinum | 10 | +Executive | Yes | 50% |

## 🧪 Testing

### Local Testing
```bash
# Start dev server
pnpm dev

# Visit pages
http://localhost:3000               # Landing
http://localhost:3000/collections   # Collections (coming soon state)
http://localhost:3000/boost         # Boost feed
```

### Build Testing
```bash
# Production build
pnpm run build

# Should see:
✓ Compiled successfully
✓ Generating static pages (57/57)
```

## 📚 Documentation

- **`docs/SPRINT_1_COMPLETE.md`** - Full Sprint 1 summary
- **`docs/TRUSTMESH_BASELINE.md`** - TrustMesh foundation audit
- **`docs/FEATURES_TO_PRUNE.md`** - Removed features list
- **`docs/PHASE_B_COMPLEXITY_REDUCTION.md`** - Phase B details

## 🚧 Next Steps

### Option 1: Deploy GHHA NFTs
1. Create 4 NFT collections on Hedera (Bronze/Silver/Gold/Platinum)
2. Mint initial NFTs for testing
3. Update environment variables with token IDs
4. Test with real NFT ownership
5. Deploy to staging

### Option 2: Sprint 2 Development
1. **Engagement System**
   - Recognition signal minting as NFTs
   - Boost mechanics implementation
   - Rarity progression (Common → Legendary)

2. **XMTP Enhancements**
   - Token-gated channels
   - Member-only messaging
   - Event notifications

3. **Governance Module**
   - Voting interface
   - Proposal creation (Platinum only)
   - Vote tallying by weight

## 🔗 Quick Links

- **Mirror Node Explorer:** https://hashscan.io/testnet
- **Hedera Docs:** https://docs.hedera.com
- **Magic.link Docs:** https://magic.link/docs
- **XMTP Docs:** https://xmtp.org/docs

---

**Current Status:** ✅ Production Ready (Sprint 1 Complete)  
**Last Updated:** December 11, 2025  
**Build:** Successful (57/57 pages)
