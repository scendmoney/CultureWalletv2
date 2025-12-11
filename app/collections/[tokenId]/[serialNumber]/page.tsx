'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Users, Zap, TrendingUp, Shield, Calendar, Hash } from 'lucide-react'
import { getNFTDetails } from '@/lib/services/nft-collections'
import { TIER_CONFIG } from '@/lib/types/nft-collections'
import type { GHHAMembershipNFT } from '@/lib/types/nft-collections'

/**
 * NFT Detail Page
 * 
 * Shows full details for a specific GHHA membership NFT including:
 * - Tier information and benefits
 * - Ownership details
 * - Transfer history
 * - Token metadata
 */
export default function NFTDetailPage({
  params
}: {
  params: { tokenId: string; serialNumber: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [nft, setNft] = useState<GHHAMembershipNFT | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNFT()
  }, [params.tokenId, params.serialNumber])

  const loadNFT = async () => {
    try {
      const serialNum = parseInt(params.serialNumber)
      const nftData = await getNFTDetails(params.tokenId, serialNum)
      
      if (!nftData) {
        setError('NFT not found')
      } else {
        setNft(nftData)
      }
    } catch (err) {
      console.error('[NFT Detail] Error loading NFT:', err)
      setError('Failed to load NFT details')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading NFT details...</p>
        </div>
      </div>
    )
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">NFT Not Found</h1>
          <p className="text-purple-200 mb-6">{error || 'This NFT does not exist'}</p>
          <Button
            onClick={() => router.push('/collections')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Button>
        </div>
      </div>
    )
  }

  const config = TIER_CONFIG[nft.tier]
  const mintDate = new Date(nft.mintedAt).toLocaleDateString()

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={() => window.open(`https://hashscan.io/testnet/token/${nft.tokenId}`, '_blank')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on HashScan
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* NFT Display */}
          <div>
            <div className={`aspect-square bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-2xl mb-6`}>
              <div className="text-9xl">{config.emoji}</div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {nft.active ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-300 text-sm font-medium">Active Membership</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30">
                  <span className="text-red-300 text-sm font-medium">Inactive</span>
                </div>
              )}
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{config.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-white">{nft.name}</h1>
                  <p className="text-purple-300 text-lg capitalize">{config.name}</p>
                </div>
              </div>
              <p className="text-xl text-purple-100 leading-relaxed mt-4">
                {nft.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Token Details
              </h3>
              <div className="space-y-3 text-purple-200">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Token ID:
                  </span>
                  <code className="font-mono text-sm bg-black/20 px-2 py-1 rounded">
                    {nft.tokenId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="font-medium">#{nft.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Minted:
                  </span>
                  <span className="font-medium">{mintDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Owner:</span>
                  <code className="font-mono text-xs bg-black/20 px-2 py-1 rounded">
                    {nft.accountId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Transferable:</span>
                  <span className="font-medium">{nft.transferable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Benefits Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{nft.benefits.eventAccess.length}</div>
                <div className="text-xs text-purple-300">Events</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{nft.benefits.votingWeight}</div>
                <div className="text-xs text-purple-300">Voting Power</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{nft.benefits.discounts.merchandise}%</div>
                <div className="text-xs text-purple-300">Discount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          
          {/* Event Access */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 rounded-2xl p-6 border border-emerald-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              Event Access
            </h3>
            <ul className="space-y-2">
              {nft.benefits.eventAccess.map((event, idx) => (
                <li key={idx} className="text-emerald-100 flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance & Channels */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Governance & Access
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-purple-300 mb-2">Governance Rights</div>
                <div className="text-white font-semibold">
                  {nft.benefits.governanceRights ? (
                    <span className="text-emerald-400">✓ Enabled</span>
                  ) : (
                    <span className="text-gray-400">Not available</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-purple-300 mb-2">Exclusive Channels</div>
                <div className="flex flex-wrap gap-2">
                  {nft.benefits.exclusiveChannels.map((channel, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm text-purple-200">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-2xl p-6 border border-yellow-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              Member Discounts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-100">Merchandise</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {nft.benefits.discounts.merchandise}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-100">Event Tickets</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {nft.benefits.discounts.eventTickets}%
                </span>
              </div>
            </div>
          </div>

          {/* Priority Benefits */}
          <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 rounded-2xl p-6 border border-pink-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-pink-400" />
              Priority Access
            </h3>
            <div className="space-y-3 text-pink-100">
              <div className="flex items-center justify-between">
                <span>Early Access</span>
                <span>{nft.benefits.priority.earlyAccess ? '✓' : '–'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Priority Support</span>
                <span>{nft.benefits.priority.prioritySupport ? '✓' : '–'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>VIP Seating</span>
                <span>{nft.benefits.priority.vipSeating ? '✓' : '–'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
