# Features to Prune/Evaluate
**Date:** December 10, 2025  
**Purpose:** Identify TrustMesh features to remove or disable before CultureWalletv2 integration  
**Status:** ✅ Review Complete

---

## Overview

Before integrating CultureWallet's collections system, we need to simplify the TrustMesh codebase by removing or disabling features that:
1. Won't be used in CultureWalletv2
2. Add unnecessary complexity
3. Conflict with CultureWallet's design

---

## 🟢 **KEEP (Do Not Remove)**

### **Core Features:**
✅ Magic.link authentication  
✅ HCS-22 identity binding  
✅ SignalsStore pattern  
✅ Mirror Node ingestion  
✅ Contact management  
✅ Trust allocation (Circle View)  
✅ Recognition system (will adapt for collections)  
✅ XMTP messaging  
✅ QR code scanner (will reuse for collections)  

**Rationale:** These are the foundation of TrustMesh and required for CultureWalletv2.

---

## 🟡 **EVALUATE (Decision Needed)**

### **1. Demo Mode / Ephemeral Sessions**
**Location:** `lib/session.ts`, `ALLOW_DEMO` env var  
**Current Status:** ✅ Working  
**Use Case:** Multi-user ephemeral sessions for demos/presentations

**Decision Options:**
- **Option A:** Keep for CultureWallet demos (show collections to groups)
- **Option B:** Remove (CultureWallet doesn't need ephemeral sessions)

**Recommendation:** 🟢 **KEEP** - Useful for demonstrating collections at events  
**Action:** Document in Phase B, keep flag-gated

---

### **2. KNS Integration (.hbar names)**
**Location:** `app/api/kns/*`  
**Current Status:** API routes exist  
**Use Case:** Human-readable Hedera names (e.g., `fan.hbar`, `collector.hbar`)

**CultureWallet Context:** Original used KNS names for messaging  
**Example:** `mc.rhymer.hbar`, `urban.records.hbar`, `vinyl.collector.hbar`

**Decision Options:**
- **Option A:** Keep and integrate (show `.hbar` names in collections)
- **Option B:** Remove (not critical for MVP)

**Recommendation:** 🟡 **EVALUATE IN SPRINT 3** - Nice to have, not MVP  
**Action:** Keep API routes, defer UX integration

---

### **3. "Collections" Page (Current Recognition Cards)**
**Location:** `app/collections/page.tsx`  
**Current Status:** 🚧 Shows recognition cards as collectibles  
**Issue:** Uses "collections" route but displays recognition system

**Decision Options:**
- **Option A:** Replace entirely with GHHA collections (CultureWallet style)
- **Option B:** Rename to `/recognition-cards` and create new `/collections`
- **Option C:** Adapt to show both recognition AND GHHA collections

**Recommendation:** 🔴 **REPLACE** - Conflicts with CultureWallet's collections concept  
**Action:** 
- Move current content to `/recognition-cards` 
- Use `/collections` for GHHA membership NFTs

---

### **4. Mode System (GenZ / Professional)**
**Location:** `lib/layout/mode-detector.ts`, `ModeShell.tsx`  
**Current Status:** ✅ Working - GenZ Dark / Professional modes  
**Use Case:** Theme switching based on user profile/tokens

**Decision Options:**
- **Option A:** Keep and add "CultureWallet" mode (purple theme)
- **Option B:** Remove and use single purple theme
- **Option C:** Keep GenZ mode, apply purple as accent

**Recommendation:** 🟡 **ADAPT** - Keep system, apply purple to GenZ mode  
**Action:** Phase C (Visual Baseline) - Update GenZ mode colors

---

### **5. Recognition Browser Tab**
**Location:** `app/(tabs)/recognition/page.tsx`  
**Current Status:** ✅ Working - virtualized recognition feed  
**Use Case:** Browse and mint recognition tokens

**Decision Options:**
- **Option A:** Keep as-is (recognition separate from collections)
- **Option B:** Merge with collections (unified browse experience)
- **Option C:** Remove (collections replace recognition)

**Recommendation:** 🟢 **KEEP** - Recognition ≠ Collections  
**Action:** Keep separate, will integrate with collections in Phase 3

---

### **6. Intelligence/Operations/Clusters Tabs**
**Location:** `app/(tabs)/intelligence`, `/operations`, `/clusters`  
**Current Status:** Experimental features  
**Use Case:** Advanced analytics and trust insights

**Decision Options:**
- **Option A:** Keep (might be useful for cultural domination metrics)
- **Option B:** Remove (not part of CultureWallet vision)

**Recommendation:** 🔴 **REMOVE** - Not in CultureWallet scope  
**Action:** Phase B - Remove from navigation, archive files

---

## 🔴 **REMOVE (Not Needed)**

### **1. Signals Trading Tab**
**Location:** `app/(dashboard)/signals-trading/page.tsx`  
**Rationale:** Not part of CultureWallet's 3-loop design (Wallet, Community, Collectibles)  
**Action:** Remove from navigation and archive

---

### **2. Intelligence Tab**
**Location:** `app/(tabs)/intelligence/page.tsx`  
**Rationale:** Experimental feature not aligned with CultureWallet  
**Action:** Remove from navigation, keep code commented for future

---

### **3. Operations Tab**
**Location:** `app/(tabs)/operations/page.tsx`  
**Rationale:** Admin/ops feature not needed for CultureWallet MVP  
**Action:** Move to `/admin` or remove

---

### **4. Clusters Tab**
**Location:** `app/(tabs)/clusters/page.tsx`  
**Rationale:** Network analysis feature not in CultureWallet scope  
**Action:** Remove from main navigation

---

### **5. Debug Pages (Keep in dev, hide in prod)**
**Location:** `app/debug/*`, `app/api/debug/*`  
**Rationale:** Development tools, should not be user-facing  
**Action:** Keep but ensure hidden from production navigation

---

## 📋 **Recommended Action Plan**

### **Phase B: UI Cleanup (Days 4-7)**

**Ticket B1 - Navigation Simplification:**
```
Current tabs: Friends, Circle, Signals, Messages, Intelligence, Operations, Clusters
Target tabs: Friends, Circle, Signals, Messages, Collectibles

Actions:
- Remove Intelligence tab
- Remove Operations tab
- Remove Clusters tab
- Add Collectibles placeholder (disabled)
- Keep Recognition tab (for now)
```

**Ticket B2 - Feature Flags Setup:**
```
Create lib/config/features.ts:
export const features = {
  ENABLE_DEMO_MODE: process.env.ALLOW_DEMO === 'true',
  ENABLE_KNS: process.env.NEXT_PUBLIC_ENABLE_KNS === 'true',
  ENABLE_COLLECTIONS: process.env.NEXT_PUBLIC_ENABLE_COLLECTIONS === 'true',
  ENABLE_INTELLIGENCE: false, // Remove in CultureWalletv2
  ENABLE_OPERATIONS: false,    // Remove in CultureWalletv2
  ENABLE_CLUSTERS: false,      // Remove in CultureWalletv2
}

Wrap features in conditional renders
```

**Ticket B3 - Collections Route Migration:**
```
Current: /collections shows recognition cards
Target: /collections shows GHHA membership NFTs

Actions:
1. Rename current /collections to /recognition-cards
2. Update all links and references
3. Create new /collections stub for GHHA collections
4. Update navigation
```

---

## 🎯 **Final Navigation Structure**

### **Main Tabs (Bottom Nav):**
1. **Friends** (`/contacts`) - Contact management ✅ Keep
2. **Circle** (`/circle`) - Trust visualization ✅ Keep
3. **Signals** (`/signals`) - Recognition feed ✅ Keep
4. **Messages** (`/messages`) - XMTP messaging ✅ Keep
5. **Collectibles** (`/collections`) - 🆕 GHHA collections (NEW)

### **Additional Pages (Header Menu):**
- Home (`/`) - Landing/dashboard
- Profile (`/me`) - User settings
- Recognition Cards (`/recognition-cards`) - Moved from /collections
- QR Scanner (`/qr`) - Connection requests
- Settings (`/settings`) - App config

### **Removed from User Nav:**
- ❌ Intelligence
- ❌ Operations
- ❌ Clusters
- ❌ Signals Trading

---

## 📊 **Impact Assessment**

### **Lines of Code Removed:** ~5,000-10,000 (estimated)
### **Complexity Reduction:** 🟢 High
### **Breaking Changes:** 🔴 Low (feature-flagged removal)
### **Testing Required:** 🟡 Medium (verify navigation)

---

## ✅ **Decision Summary**

| Feature | Decision | Phase | Priority |
|---------|----------|-------|----------|
| Demo Mode | Keep (flag-gated) | B | Low |
| KNS Integration | Evaluate later | Sprint 3 | Low |
| Collections Route | Replace/migrate | B | 🔴 **High** |
| Mode System | Adapt (purple theme) | C | Medium |
| Recognition Browser | Keep | N/A | N/A |
| Intelligence Tab | Remove | B | Medium |
| Operations Tab | Remove | B | Medium |
| Clusters Tab | Remove | B | Medium |
| Signals Trading | Remove | B | Low |
| Debug Tools | Keep (dev only) | B | Low |

---

## 🚨 **Critical Path Item**

**Collections Route Conflict:**
- Current `/collections` shows recognition cards
- CultureWallet needs `/collections` for GHHA membership NFTs
- **Must resolve in Phase B before Sprint 1**

**Resolution Plan:**
1. Move recognition cards to `/recognition-cards`
2. Update all internal links
3. Clear `/collections` for new implementation
4. Update navigation components

---

## 📝 **Next Steps**

1. ✅ **Ticket A2 Complete** - Features identified
2. ⏭️ **Ticket A3** - Test existing features
3. ⏭️ **Phase B (Days 4-7)** - Implement removals
4. ⏭️ **Phase C (Days 8-12)** - Apply purple aesthetic

---

**Audit Completed By:** Warp AI Agent  
**Review Status:** Ready for Phase B execution  
**Risk Level:** 🟢 Low (feature-flagged approach)
