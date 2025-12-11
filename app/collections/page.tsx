'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, Lock, ArrowRight, Zap, TrendingUp, Users, Award, ExternalLink, Sparkles } from 'lucide-react'
import { getGHHAMemberships, getCollectionStats, hasConfiguredTokens } from '@/lib/services/nft-collections'
import { TIER_CONFIG, getHighestTier, getUniqueBenefits, calculateVotingPower } from '@/lib/types/nft-collections'
import type { GHHAMembershipNFT, CollectionStats } from '@/lib/types/nft-collections'

/**
 * Collections Page - GHHA Membership NFTs
 * 
 * Displays user's owned membership NFTs with tier badges and unlocked benefits.
 * Provides token-gated access to exclusive GHHA community features.
 */
export default function CollectionsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [memberships, setMemberships] = useState<GHHAMembershipNFT[]>([])
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [userAccountId, setUserAccountId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Get user's Hedera account from Magic/session
      const users = localStorage.getItem('tm:users')
      if (users) {
        const parsed = JSON.parse(users)
        if (parsed.length > 0 && parsed[0].hederaAccountId) {
          const accountId = parsed[0].hederaAccountId
          setUserAccountId(accountId)
          
          // Load user's memberships if tokens are configured
          if (hasConfiguredTokens()) {
            const userMemberships = await getGHHAMemberships(accountId)
            setMemberships(userMemberships)
          }
        }
      }
      
      // Load collection stats
      if (hasConfiguredTokens()) {
        const collectionStats = await getCollectionStats()
        setStats(collectionStats)
      }
    } catch (error) {
      console.error('[Collections] Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = memberships.length > 0 ? getUniqueBenefits(memberships) : null
  const highestTier = getHighestTier(memberships)
  const votingPower = calculateVotingPower(memberships)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your collection...</p>
        </div>
      </div>
    )
  }

  // If no tokens configured, show coming soon
  if (!hasConfiguredTokens()) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/30 rounded-full mb-6 backdrop-blur-sm border border-purple-500/30">
              <Shield className="w-10 h-10 text-purple-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Membership Collections
            </h1>
            <p className="text-xl text-purple-200">
              GHHA Membership NFTs • Coming Soon
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Exclusive Membership NFTs
            </h2>
            <p className="text-purple-200 leading-relaxed max-w-2xl mx-auto text-center mb-8">
              Greater Houston Hip-Hop Awards (GHHA) membership NFTs provide token-gated access 
              to exclusive community features, events, and governance rights.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🎭 Four Membership Tiers
                </h3>
                <p className="text-purple-300 text-sm">
                  Bronze, Silver, Gold, and Platinum with increasing benefits
                </p>
              </div>
              
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🎫 Event Access
                </h3>
                <p className="text-purple-300 text-sm">
                  Exclusive entry to GHHA events, workshops, and VIP receptions
                </p>
              </div>
              
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🗳️ Governance Rights
                </h3>
                <p className="text-purple-300 text-sm">
                  Vote on community decisions and award nominations
                </p>
              </div>
              
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">
                  💎 Collectible Value
                </h3>
                <p className="text-purple-300 text-sm">
                  Limited edition NFTs with verifiable scarcity on Hedera
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/recognition-cards')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[48px]"
              >
                View Recognition Cards
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => router.push('/')}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold min-h-[48px]"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User has no memberships
  if (memberships.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/30 rounded-full mb-6">
              <Shield className="w-10 h-10 text-purple-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Collections
            </h1>
            <p className="text-xl text-purple-200">
              GHHA Membership NFTs
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.totalMinted}</div>
                <div className="text-sm text-purple-300">Total Minted</div>
              </div>
              
              {Object.entries(stats.tierDistribution).map(([tier, count]) => (
                <div key={tier} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{count}</div>
                  <div className="text-sm text-purple-300 capitalize">{tier}</div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-8 border border-purple-500/20 text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              No Memberships Yet
            </h2>
            <p className="text-purple-200 mb-6 max-w-md mx-auto">
              You don't own any GHHA membership NFTs yet. Join the community to unlock exclusive 
              access to events, governance, and cultural experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://ghha.com', '_blank')}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold min-h-[48px]"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Membership
              </Button>
              
              <Button
                onClick={() => router.push('/boost')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[48px]"
              >
                Explore CultureWallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User owns memberships - show gallery
  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full mb-4 shadow-lg">
            <Award className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Your GHHA Memberships
          </h1>
          {highestTier && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <span className="text-2xl">{TIER_CONFIG[highestTier].emoji}</span>
              <span className="text-white font-semibold">{TIER_CONFIG[highestTier].name}</span>
            </div>
          )}
        </div>

        {/* Benefits Summary */}
        {benefits && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Users className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{benefits.events.length}</div>
              <div className="text-sm text-purple-300">Events Unlocked</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{votingPower}</div>
              <div className="text-sm text-purple-300">Voting Power</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{benefits.maxDiscounts.merchandise}%</div>
              <div className="text-sm text-purple-300">Max Discount</div>
            </div>
          </div>
        )}

        {/* NFT Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {memberships.map((nft) => {
            const config = TIER_CONFIG[nft.tier]
            return (
              <div
                key={`${nft.tokenId}-${nft.serialNumber}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all cursor-pointer hover:scale-105"
                onClick={() => router.push(`/collections/${nft.tokenId}/${nft.serialNumber}`)}
              >
                <div className={`aspect-square bg-gradient-to-br ${config.gradient} rounded-lg mb-4 flex items-center justify-center`}>
                  <div className="text-6xl">{config.emoji}</div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{nft.name}</h3>
                <p className="text-sm text-purple-300 mb-3">Serial #{nft.serialNumber}</p>
                
                <div className="space-y-2 text-sm text-purple-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{nft.benefits.eventAccess.length} Events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>{nft.benefits.votingWeight} Voting Power</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Unlocked Benefits */}
        {benefits && benefits.events.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Unlocked Benefits</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Event Access
                </h3>
                <ul className="space-y-2">
                  {benefits.events.map((event, idx) => (
                    <li key={idx} className="text-purple-200 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Exclusive Channels
                </h3>
                <ul className="space-y-2">
                  {benefits.channels.map((channel, idx) => (
                    <li key={idx} className="text-purple-200 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">◆</span>
                      <span>{channel}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
