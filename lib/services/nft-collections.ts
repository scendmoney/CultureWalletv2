/**
 * NFT Collections Service
 * 
 * Queries user's NFT holdings from Hedera Mirror Node API.
 * Specifically designed for GHHA membership NFTs but can be extended for other collections.
 */

import type { GHHAMembershipNFT, MembershipTier, CollectionStats } from '@/lib/types/nft-collections'
import { TIER_CONFIG } from '@/lib/types/nft-collections'

const MIRROR_BASE = process.env.NEXT_PUBLIC_MIRROR_NODE_URL || 'https://testnet.mirrornode.hedera.com'

/**
 * GHHA Collection Token IDs (configured per environment)
 * These should be set via environment variables in production
 */
const GHHA_TOKEN_IDS = {
  bronze: process.env.NEXT_PUBLIC_GHHA_BRONZE_TOKEN_ID || '0.0.0', // Placeholder
  silver: process.env.NEXT_PUBLIC_GHHA_SILVER_TOKEN_ID || '0.0.0',
  gold: process.env.NEXT_PUBLIC_GHHA_GOLD_TOKEN_ID || '0.0.0',
  platinum: process.env.NEXT_PUBLIC_GHHA_PLATINUM_TOKEN_ID || '0.0.0'
}

interface MirrorNFT {
  account_id: string
  created_timestamp: string
  delegating_spender: string | null
  deleted: boolean
  metadata: string
  modified_timestamp: string
  serial_number: number
  spender: string | null
  token_id: string
}

interface MirrorTokenInfo {
  admin_key: any
  auto_renew_account: string
  auto_renew_period: number
  created_timestamp: string
  decimals: string
  deleted: boolean
  expiry_timestamp: number
  freeze_default: boolean
  freeze_key: any
  initial_supply: string
  kyc_key: any
  max_supply: string
  memo: string
  modified_timestamp: string
  name: string
  pause_key: any
  pause_status: string
  supply_key: any
  supply_type: string
  symbol: string
  token_id: string
  total_supply: string
  treasury_account_id: string
  type: string
  wipe_key: any
}

/**
 * Get all NFTs owned by an account
 */
export async function getUserNFTs(accountId: string): Promise<MirrorNFT[]> {
  try {
    const url = `${MIRROR_BASE}/api/v1/accounts/${accountId}/nfts`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`[NFT Service] Failed to fetch NFTs: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.nfts || []
  } catch (error) {
    console.error('[NFT Service] Error fetching user NFTs:', error)
    return []
  }
}

/**
 * Get token metadata from Mirror Node
 */
export async function getTokenInfo(tokenId: string): Promise<MirrorTokenInfo | null> {
  try {
    const url = `${MIRROR_BASE}/api/v1/tokens/${tokenId}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`[NFT Service] Failed to fetch token info: ${response.status}`)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('[NFT Service] Error fetching token info:', error)
    return null
  }
}

/**
 * Get GHHA membership NFTs for a user
 */
export async function getGHHAMemberships(accountId: string): Promise<GHHAMembershipNFT[]> {
  try {
    const allNFTs = await getUserNFTs(accountId)
    const memberships: GHHAMembershipNFT[] = []
    
    // Filter for GHHA collection NFTs
    for (const [tier, tokenId] of Object.entries(GHHA_TOKEN_IDS)) {
      if (tokenId === '0.0.0') continue // Skip placeholder tokens
      
      const userNFTsForTier = allNFTs.filter(nft => nft.token_id === tokenId)
      
      for (const nft of userNFTsForTier) {
        const tierKey = tier as MembershipTier
        const config = TIER_CONFIG[tierKey]
        
        // Parse metadata (base64 encoded JSON)
        let metadata: any = {}
        try {
          const metadataJson = Buffer.from(nft.metadata, 'base64').toString('utf8')
          metadata = JSON.parse(metadataJson)
        } catch {
          // Use defaults if metadata parsing fails
        }
        
        const membership: GHHAMembershipNFT = {
          tokenId: nft.token_id,
          serialNumber: nft.serial_number,
          accountId: nft.account_id,
          tier: tierKey,
          mintedAt: new Date(nft.created_timestamp).getTime(),
          name: metadata.name || `${config.name} #${nft.serial_number}`,
          description: metadata.description || config.description,
          imageUrl: metadata.image || `https://images.culturewallet.com/ghha/${tier}/${nft.serial_number}.png`,
          benefits: config.benefits,
          active: !nft.deleted,
          transferable: true
        }
        
        memberships.push(membership)
      }
    }
    
    return memberships
  } catch (error) {
    console.error('[NFT Service] Error fetching GHHA memberships:', error)
    return []
  }
}

/**
 * Get collection statistics for GHHA memberships
 */
export async function getCollectionStats(): Promise<CollectionStats> {
  try {
    const stats: CollectionStats = {
      totalMinted: 0,
      totalOwners: 0,
      tierDistribution: {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0
      }
    }
    
    // Query each tier's token info
    for (const [tier, tokenId] of Object.entries(GHHA_TOKEN_IDS)) {
      if (tokenId === '0.0.0') continue
      
      const tokenInfo = await getTokenInfo(tokenId)
      if (tokenInfo) {
        const supply = parseInt(tokenInfo.total_supply)
        stats.totalMinted += supply
        stats.tierDistribution[tier as MembershipTier] = supply
      }
    }
    
    return stats
  } catch (error) {
    console.error('[NFT Service] Error fetching collection stats:', error)
    return {
      totalMinted: 0,
      totalOwners: 0,
      tierDistribution: { bronze: 0, silver: 0, gold: 0, platinum: 0 }
    }
  }
}

/**
 * Get specific NFT details by token ID and serial number
 */
export async function getNFTDetails(tokenId: string, serialNumber: number): Promise<GHHAMembershipNFT | null> {
  try {
    const url = `${MIRROR_BASE}/api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`[NFT Service] Failed to fetch NFT details: ${response.status}`)
      return null
    }
    
    const nft: MirrorNFT = await response.json()
    
    // Determine tier from token ID
    let tier: MembershipTier = 'bronze'
    for (const [t, tid] of Object.entries(GHHA_TOKEN_IDS)) {
      if (tid === tokenId) {
        tier = t as MembershipTier
        break
      }
    }
    
    const config = TIER_CONFIG[tier]
    
    // Parse metadata
    let metadata: any = {}
    try {
      const metadataJson = Buffer.from(nft.metadata, 'base64').toString('utf8')
      metadata = JSON.parse(metadataJson)
    } catch {}
    
    return {
      tokenId: nft.token_id,
      serialNumber: nft.serial_number,
      accountId: nft.account_id,
      tier,
      mintedAt: new Date(nft.created_timestamp).getTime(),
      name: metadata.name || `${config.name} #${nft.serial_number}`,
      description: metadata.description || config.description,
      imageUrl: metadata.image || `https://images.culturewallet.com/ghha/${tier}/${nft.serial_number}.png`,
      benefits: config.benefits,
      active: !nft.deleted,
      transferable: true
    }
  } catch (error) {
    console.error('[NFT Service] Error fetching NFT details:', error)
    return null
  }
}

/**
 * Check if any GHHA tokens are configured
 */
export function hasConfiguredTokens(): boolean {
  return Object.values(GHHA_TOKEN_IDS).some(id => id !== '0.0.0')
}
