'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Zap, TrendingUp, Share2, ExternalLink, Sparkles } from 'lucide-react'

/**
 * Boost Feed Page
 * 
 * Shows user's recognition signals that can be boosted and tracks boost activity.
 * Boosts amplify signal visibility and create viral momentum.
 */
export default function BoostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userSignals, setUserSignals] = useState<any[]>([])

  useEffect(() => {
    loadUserSignals()
  }, [])

  const loadUserSignals = async () => {
    try {
      // TODO: Wire to real user signal history from HCS
      // For now, show placeholder UI
      setUserSignals([])
    } catch (error) {
      console.error('[Boost] Failed to load signals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading boost feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Boost Feed
          </h1>
          <p className="text-purple-200 text-lg">
            Amplify recognition signals and track viral momentum
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
            <div className="text-sm text-purple-300">Boosts Given</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-emerald-400 mb-1">0</div>
            <div className="text-sm text-purple-300">Boosts Received</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
            <div className="text-sm text-purple-300">Viral Signals</div>
          </div>
        </div>

        {/* Empty State */}
        {userSignals.length === 0 && (
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-8 border border-purple-500/20 text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Start Boosting Signals
            </h2>
            <p className="text-purple-200 mb-6 max-w-md mx-auto leading-relaxed">
              Send recognition signals to friends and boost their visibility. 
              When others boost your signals, they gain viral momentum and reach a wider audience.
            </p>

            {/* How Boosts Work */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Give Boosts</h3>
                    <p className="text-sm text-purple-300">
                      Amplify signals you love by boosting them to your network
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Go Viral</h3>
                    <p className="text-sm text-purple-300">
                      Signals with more boosts gain rarity and reach more people
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Share Links</h3>
                    <p className="text-sm text-purple-300">
                      Every signal gets a shareable boost link for social media
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Track Impact</h3>
                    <p className="text-sm text-purple-300">
                      See how your recognition spreads through the network
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/signals')}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold min-h-[48px]"
              >
                <Zap className="w-4 h-4 mr-2" />
                Send Your First Signal
              </Button>
              
              <Button
                onClick={() => router.push('/recognition-cards')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[48px]"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse Recognition Cards
              </Button>
            </div>
          </div>
        )}

        {/* TODO: User Signals List (when signals exist) */}
        {userSignals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Your Signals</h2>
            {/* Signal cards with boost counts, share links, analytics */}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center text-purple-400 text-sm">
          <p>
            Boosts are recorded on Hedera Consensus Service (HCS) for verifiable social proof.
          </p>
          <p className="mt-1">
            Every boost increases signal rarity: Common → Rare → Epic → Legendary
          </p>
        </div>

      </div>
    </div>
  )
}
