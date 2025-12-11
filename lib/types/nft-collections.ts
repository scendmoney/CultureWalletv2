/**
 * NFT Collections - GHHA Membership Tiers
 * 
 * Defines the data model for token-gated membership NFTs.
 * These NFTs provide access to exclusive GHHA community features, events, and governance.
 */

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface MembershipBenefits {
  eventAccess: string[]
  governanceRights: boolean
  votingWeight: number
  exclusiveChannels: string[]
  discounts: {
    merchandise: number
    eventTickets: number
  }
  priority: {
    earlyAccess: boolean
    prioritySupport: boolean
    vipSeating: boolean
  }
}

export interface GHHAMembershipNFT {
  // Hedera NFT identifiers
  tokenId: string          // e.g., "0.0.123456"
  serialNumber: number     // NFT serial number
  accountId: string        // Owner's account ID
  
  // Membership details
  tier: MembershipTier
  mintedAt: number         // Unix timestamp
  expiresAt?: number       // Optional expiration
  
  // Metadata
  name: string
  description: string
  imageUrl: string
  
  // Benefits
  benefits: MembershipBenefits
  
  // Status
  active: boolean
  transferable: boolean
}

export interface CollectionStats {
  totalMinted: number
  totalOwners: number
  tierDistribution: Record<MembershipTier, number>
  floorPrice?: number
}

/**
 * Tier Configuration
 * Defines benefits and visual styling for each membership tier
 */
export const TIER_CONFIG: Record<MembershipTier, {
  name: string
  color: string
  gradient: string
  emoji: string
  benefits: MembershipBenefits
  description: string
}> = {
  bronze: {
    name: 'Bronze Member',
    color: '#CD7F32',
    gradient: 'from-amber-700 via-amber-600 to-amber-700',
    emoji: '🥉',
    description: 'Entry-level access to GHHA community and events',
    benefits: {
      eventAccess: ['General Admission Events'],
      governanceRights: false,
      votingWeight: 0,
      exclusiveChannels: ['#bronze-lounge'],
      discounts: {
        merchandise: 10,
        eventTickets: 5
      },
      priority: {
        earlyAccess: false,
        prioritySupport: false,
        vipSeating: false
      }
    }
  },
  silver: {
    name: 'Silver Member',
    color: '#C0C0C0',
    gradient: 'from-slate-400 via-slate-300 to-slate-400',
    emoji: '🥈',
    description: 'Enhanced access with governance participation',
    benefits: {
      eventAccess: ['General Admission Events', 'Member Workshops', 'Networking Mixers'],
      governanceRights: true,
      votingWeight: 1,
      exclusiveChannels: ['#bronze-lounge', '#silver-circle'],
      discounts: {
        merchandise: 20,
        eventTickets: 15
      },
      priority: {
        earlyAccess: true,
        prioritySupport: false,
        vipSeating: false
      }
    }
  },
  gold: {
    name: 'Gold Member',
    color: '#FFD700',
    gradient: 'from-yellow-500 via-yellow-400 to-yellow-500',
    emoji: '🥇',
    description: 'Premium access with VIP benefits and increased voting power',
    benefits: {
      eventAccess: ['All Events', 'VIP Receptions', 'Artist Meet & Greets', 'Behind the Scenes'],
      governanceRights: true,
      votingWeight: 3,
      exclusiveChannels: ['#bronze-lounge', '#silver-circle', '#gold-suite'],
      discounts: {
        merchandise: 30,
        eventTickets: 25
      },
      priority: {
        earlyAccess: true,
        prioritySupport: true,
        vipSeating: true
      }
    }
  },
  platinum: {
    name: 'Platinum Member',
    color: '#E5E4E2',
    gradient: 'from-purple-300 via-indigo-200 to-purple-300',
    emoji: '💎',
    description: 'Ultimate access with executive privileges and maximum voting power',
    benefits: {
      eventAccess: ['All Events', 'Executive Roundtables', 'Private Showcases', 'Award Ceremonies'],
      governanceRights: true,
      votingWeight: 10,
      exclusiveChannels: ['#bronze-lounge', '#silver-circle', '#gold-suite', '#platinum-executive'],
      discounts: {
        merchandise: 50,
        eventTickets: 40
      },
      priority: {
        earlyAccess: true,
        prioritySupport: true,
        vipSeating: true
      }
    }
  }
}

/**
 * Get highest tier owned by user
 */
export function getHighestTier(memberships: GHHAMembershipNFT[]): MembershipTier | null {
  if (memberships.length === 0) return null
  
  const tierRank: Record<MembershipTier, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum: 4
  }
  
  const highest = memberships.reduce((best, nft) => {
    if (!nft.active) return best
    return tierRank[nft.tier] > tierRank[best.tier] ? nft : best
  })
  
  return highest.tier
}

/**
 * Calculate total voting power
 */
export function calculateVotingPower(memberships: GHHAMembershipNFT[]): number {
  return memberships
    .filter(nft => nft.active && nft.benefits.governanceRights)
    .reduce((sum, nft) => sum + nft.benefits.votingWeight, 0)
}

/**
 * Check if user has access to specific event
 */
export function hasEventAccess(memberships: GHHAMembershipNFT[], eventName: string): boolean {
  return memberships.some(nft => 
    nft.active && nft.benefits.eventAccess.includes(eventName)
  )
}

/**
 * Get all unique benefits across owned memberships
 */
export function getUniqueBenefits(memberships: GHHAMembershipNFT[]): {
  events: string[]
  channels: string[]
  hasGovernance: boolean
  votingPower: number
  maxDiscounts: { merchandise: number, eventTickets: number }
} {
  const activeMemberships = memberships.filter(nft => nft.active)
  
  const events = new Set<string>()
  const channels = new Set<string>()
  let hasGovernance = false
  let votingPower = 0
  let maxMerchDiscount = 0
  let maxEventDiscount = 0
  
  activeMemberships.forEach(nft => {
    nft.benefits.eventAccess.forEach(e => events.add(e))
    nft.benefits.exclusiveChannels.forEach(c => channels.add(c))
    if (nft.benefits.governanceRights) hasGovernance = true
    votingPower += nft.benefits.votingWeight
    maxMerchDiscount = Math.max(maxMerchDiscount, nft.benefits.discounts.merchandise)
    maxEventDiscount = Math.max(maxEventDiscount, nft.benefits.discounts.eventTickets)
  })
  
  return {
    events: Array.from(events),
    channels: Array.from(channels),
    hasGovernance,
    votingPower,
    maxDiscounts: {
      merchandise: maxMerchDiscount,
      eventTickets: maxEventDiscount
    }
  }
}
