"use client"

import { Button } from '@/components/ui/button'
import { Zap, TrendingUp, Share2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export function BoostSection() {
  return (
    <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-yellow-600/20 shadow-[0_0_30px_rgba(250,204,21,0.15),0_0_60px_rgba(250,204,21,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-yellow-500/20 before:via-transparent before:to-yellow-500/20 before:-z-10 before:animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-600/20 flex items-center justify-center border border-yellow-500/30">
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Boost Activity</h3>
          <p className="text-xs text-white/60">Amplify signals & go viral</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-lg font-bold text-yellow-400">0</div>
          <div className="text-xs text-white/60">Given</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-lg font-bold text-#10b981">0</div>
          <div className="text-xs text-white/60">Received</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-lg font-bold text-[#7c3aed]">0</div>
          <div className="text-xs text-white/60">Viral</div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">How Boosts Work</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Amplify recognition signals to increase their visibility. Signals with more boosts gain rarity (Common → Rare → Epic → Legendary) and reach more people across the network.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <TrendingUp className="w-5 h-5 text-#10b981 mb-2" />
          <h5 className="text-xs font-semibold text-white mb-1">Viral Momentum</h5>
          <p className="text-xs text-white/60">Track signal reach</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <Share2 className="w-5 h-5 text-[#7c3aed] mb-2" />
          <h5 className="text-xs font-semibold text-white mb-1">Share Links</h5>
          <p className="text-xs text-white/60">Social amplification</p>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={() => toast.info('Boost system launching soon!')}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
      >
        <Zap className="w-4 h-4 mr-2" />
        Start Boosting
      </Button>

      {/* Footer Note */}
      <p className="text-center text-xs text-white/50 mt-3">
        Boosts are recorded on Hedera HCS for verifiable social proof
      </p>
    </div>
  )
}
