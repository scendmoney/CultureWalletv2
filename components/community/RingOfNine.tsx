"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Plus } from 'lucide-react'
import type { BondedContact } from '@/lib/stores/signalsStore'

interface RingOfNineProps {
  circleMembers: BondedContact[]
  maxSlots?: number
  onContactClick: (contactId: string) => void
  onAddClick?: () => void
}

export function RingOfNine({ 
  circleMembers, 
  maxSlots = 9, 
  onContactClick,
  onAddClick 
}: RingOfNineProps) {
  const filledSlots = circleMembers.length
  const emptySlots = Math.max(0, maxSlots - filledSlots)

  const getDisplayName = (contact: BondedContact) => {
    if (contact.handle && contact.handle !== contact.peerId) {
      return contact.handle
    }
    
    // Format peer ID if it's a tm-* format
    if (contact.peerId.startsWith('tm-')) {
      const namepart = contact.peerId.slice(3).replace(/-/g, ' ')
      return namepart.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    return contact.peerId.length > 20 
      ? `${contact.peerId.slice(0, 6)}...` 
      : contact.peerId
  }

  return (
    <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-#10b981/20 shadow-[0_0_30px_rgba(16,185,129,0.15),0_0_60px_rgba(16,185,129,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-#10b981/20 before:via-transparent before:to-#10b981/20 before:-z-10 before:animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-#10b981/30 to-#10b981/20 flex items-center justify-center border border-#10b981/30">
            <Users className="w-5 h-5 text-#10b981" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Circle of Trust
              <Badge className="bg-#10b981/20 text-#10b981 border-#10b981/30 text-xs">
                {filledSlots}/{maxSlots}
              </Badge>
            </h3>
            <p className="text-xs text-white/60">Your most trusted contacts</p>
          </div>
        </div>
      </div>

      {/* Circle Visualization */}
      <div className="relative mx-auto" style={{ width: '240px', height: '240px' }}>
        {/* Center fire icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="text-4xl animate-pulse">🔥</div>
        </div>

        {/* Circle members positioned in a ring */}
        {circleMembers.map((contact, index) => {
          const angle = (index * 360) / maxSlots - 90 // Start from top
          const radian = (angle * Math.PI) / 180
          const radius = 90
          const x = Math.cos(radian) * radius + 120 // 120 is center (240/2)
          const y = Math.sin(radian) * radius + 120

          const displayName = getDisplayName(contact)

          return (
            <button
              key={contact.peerId}
              onClick={() => onContactClick(contact.peerId)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-#10b981/50 focus:ring-offset-2 focus:ring-offset-panel rounded-full transition-all hover:scale-110 active:scale-95"
              style={{ left: x, top: y }}
              title={displayName}
            >
              {/* LED ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_12px_rgba(34,197,94,0.6),0_0_24px_rgba(34,197,94,0.3)] animate-pulse" 
                   style={{ padding: '2px' }}>
                <div className="rounded-full bg-panel w-full h-full" />
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 ring-2 ring-#10b981/50 relative">
                <AvatarFallback className="bg-gradient-to-br from-#10b981/20 to-emerald-600/20 text-#10b981 text-sm font-bold border border-#10b981/30">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Name tooltip on hover */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {displayName}
                </div>
              </div>
            </button>
          )
        })}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => {
          const slotIndex = filledSlots + index
          const angle = (slotIndex * 360) / maxSlots - 90
          const radian = (angle * Math.PI) / 180
          const radius = 90
          const x = Math.cos(radian) * radius + 120
          const y = Math.sin(radian) * radius + 120

          return (
            <button
              key={`empty-${slotIndex}`}
              onClick={onAddClick}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-panel rounded-full transition-all hover:scale-110 active:scale-95"
              style={{ left: x, top: y }}
              title="Add to circle"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/20 border-dashed flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/40 transition-colors">
                <Plus className="w-5 h-5 text-white/40 group-hover:text-white/60" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Empty state message */}
      {filledSlots === 0 && (
        <div className="text-center mt-4">
          <p className="text-sm text-white/70 font-medium">
            Your Circle of 9 is empty
          </p>
          <p className="text-xs text-white/50 mt-1">
            Use trust in the Contact Drawer to add people you rely on most
          </p>
        </div>
      )}
    </div>
  )
}
