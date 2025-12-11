"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, ExternalLink, Sparkles } from 'lucide-react'

export function MyCollectiblesSection() {
  const router = useRouter()

  // TODO: Query Mirror Node for NFTs once collections system is fully wired
  // For now, show placeholder
  const collectibles: any[] = []

  const handleViewAll = () => {
    router.push('/collections')
  }

  return (
    <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-yellow-600/20 shadow-[0_0_30px_rgba(202,138,4,0.15),0_0_60px_rgba(202,138,4,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-yellow-600/20 before:via-transparent before:to-yellow-600/20 before:-z-10 before:animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600/30 to-yellow-600/20 flex items-center justify-center border border-yellow-600/30">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-white">My Collectibles</h3>
            <p className="text-xs text-white/60">NFTs & Recognition Cards</p>
          </div>
        </div>
        {collectibles.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewAll}
            className="border-yellow-600/30 text-yellow-600 hover:bg-yellow-600/20"
          >
            View All
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        )}
      </div>

      {/* Empty State */}
      {collectibles.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-yellow-600 mx-auto mb-4 opacity-50" />
          <h4 className="text-sm font-semibold text-white mb-2">No collectibles yet</h4>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Your collectibles will appear here as you earn membership and recognition
          </p>
        </div>
      )}

      {/* Collectibles Grid (when data available) */}
      {collectibles.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {collectibles.slice(0, 6).map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-yellow-600/40 transition-colors cursor-pointer"
              onClick={() => router.push(`/collections/${item.id}`)}
            >
              <div className="aspect-square bg-gradient-to-br from-yellow-600/20 to-yellow-600/10 rounded-lg flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-xs font-medium text-white truncate">{item.name}</h4>
              <Badge className="bg-yellow-600/20 text-yellow-600 border-yellow-600/30 text-xs mt-1">
                {item.tier}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
