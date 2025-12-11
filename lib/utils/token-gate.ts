/**
 * Token-Gating Utilities
 * 
 * Functions to check NFT ownership and gate features/content based on membership tiers.
 */

import type { GHHAMembershipNFT, MembershipTier } from '@/lib/types/nft-collections'
import { getHighestTier, hasEventAccess } from '@/lib/types/nft-collections'

export interface TokenGateResult {
  hasAccess: boolean
  reason?: string
  requiredTier?: MembershipTier
  userTier?: MembershipTier | null
}

/**
 * Check if user has minimum membership tier
 */
export function checkMembershipTier(
  memberships: GHHAMembershipNFT[],
  requiredTier: MembershipTier
): TokenGateResult {
  const tierRank: Record<MembershipTier, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum: 4
  }
  
  const userTier = getHighestTier(memberships)
  
  if (!userTier) {
    return {
      hasAccess: false,
      reason: 'No membership NFT found',
      requiredTier,
      userTier: null
    }
  }
  
  const hasAccess = tierRank[userTier] >= tierRank[requiredTier]
  
  return {
    hasAccess,
    reason: hasAccess ? undefined : `${requiredTier} membership or higher required`,
    requiredTier,
    userTier
  }
}

/**
 * Check if user has access to specific event
 */
export function checkEventAccess(
  memberships: GHHAMembershipNFT[],
  eventName: string
): TokenGateResult {
  const hasAccess = hasEventAccess(memberships, eventName)
  
  return {
    hasAccess,
    reason: hasAccess ? undefined : `Membership with ${eventName} access required`
  }
}

/**
 * Check if user owns any active membership
 */
export function checkAnyMembership(memberships: GHHAMembershipNFT[]): TokenGateResult {
  const hasActive = memberships.some(nft => nft.active)
  
  return {
    hasAccess: hasActive,
    reason: hasActive ? undefined : 'Active membership required'
  }
}

/**
 * Check if user has governance rights
 */
export function checkGovernanceAccess(memberships: GHHAMembershipNFT[]): TokenGateResult {
  const hasGovernance = memberships.some(
    nft => nft.active && nft.benefits.governanceRights
  )
  
  return {
    hasAccess: hasGovernance,
    reason: hasGovernance ? undefined : 'Silver membership or higher required for governance'
  }
}

/**
 * Check if user has minimum voting power
 */
export function checkVotingPower(
  memberships: GHHAMembershipNFT[],
  requiredPower: number
): TokenGateResult {
  const totalPower = memberships
    .filter(nft => nft.active && nft.benefits.governanceRights)
    .reduce((sum, nft) => sum + nft.benefits.votingWeight, 0)
  
  const hasAccess = totalPower >= requiredPower
  
  return {
    hasAccess,
    reason: hasAccess ? undefined : `${requiredPower} voting power required (you have ${totalPower})`
  }
}

/**
 * Higher-order component helper for token-gated pages
 * Returns render props with gate status
 */
export function useTokenGate(
  memberships: GHHAMembershipNFT[],
  gateType: 'membership' | 'governance' | 'tier',
  options?: { requiredTier?: MembershipTier; eventName?: string; votingPower?: number }
): TokenGateResult {
  switch (gateType) {
    case 'membership':
      return checkAnyMembership(memberships)
    case 'governance':
      return checkGovernanceAccess(memberships)
    case 'tier':
      return options?.requiredTier 
        ? checkMembershipTier(memberships, options.requiredTier)
        : checkAnyMembership(memberships)
    default:
      return { hasAccess: false, reason: 'Invalid gate type' }
  }
}
