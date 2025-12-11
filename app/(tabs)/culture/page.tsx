"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecognitionFeed } from '@/components/culture/RecognitionFeed'
import { MyCollectiblesSection } from '@/components/culture/MyCollectiblesSection'
import { BoostSection } from '@/components/culture/BoostSection'
import { SendSignalsModal } from '@/components/SendSignalsModal'
import { Button } from '@/components/ui/button'
import { Award, Plus, Sparkles } from 'lucide-react'

export default function CulturePage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'from-me' | 'to-me'>('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f]">
      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Page Header */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-purple-600 rounded-full mb-3 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Culture</h1>
          <p className="text-sm text-white/60">Recognition, collectibles & viral boosts</p>
        </div>

        {/* Recognition Feed Section */}
        <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-[#7c3aed]/20 shadow-[0_0_30px_rgba(124,58,237,0.15),0_0_60px_rgba(124,58,237,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-[#7c3aed]/20 before:via-transparent before:to-[#7c3aed]/20 before:-z-10 before:animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-#ca8a04/20 flex items-center justify-center border border-[#7c3aed]/30">
                <Award className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Recognition Feed</h2>
                <p className="text-xs text-white/60">Celebrate achievements</p>
              </div>
            </div>
          </div>

          {/* Scrollable feed container with max height */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 pr-2">
            <RecognitionFeed 
              filter={filter} 
              onFilterChange={setFilter}
              maxItems={10}
            />
          </div>
        </div>

        {/* My Collectibles */}
        <MyCollectiblesSection />

        {/* Boost Activity */}
        <BoostSection />

        {/* Create Signal FAB */}
        <SendSignalsModal>
          <button
            className="fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-br from-[#7c3aed] to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 z-30"
            aria-label="Send recognition signal"
          >
            <Plus className="w-6 h-6" />
          </button>
        </SendSignalsModal>
      </div>
    </div>
  )
}
