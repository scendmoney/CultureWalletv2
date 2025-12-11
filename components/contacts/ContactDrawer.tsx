"use client"

import { useEffect, useState, useMemo } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Award, 
  Heart, 
  HeartOff, 
  Coins,
  User,
  Clock,
  Trophy
} from 'lucide-react'
import { signalsStore, type SignalEvent, type BondedContact } from '@/lib/stores/signalsStore'
import { getSessionId } from '@/lib/session'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ContactDrawerProps {
  contactId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Activity item type for unified feed
interface ActivityItem {
  id: string
  type: 'message' | 'signal' | 'trust'
  timestamp: number
  content: string
  icon: React.ReactNode
  color: string
}

export function ContactDrawer({ contactId, open, onOpenChange }: ContactDrawerProps) {
  const router = useRouter()
  const [contact, setContact] = useState<BondedContact | null>(null)
  const [inCircle, setInCircle] = useState(false)
  const [trustSlots, setTrustSlots] = useState({ allocated: 0, received: 0 })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isSendingTrust, setIsSendingTrust] = useState(false)

  useEffect(() => {
    if (!contactId || !open) {
      setContact(null)
      setInCircle(false)
      setTrustSlots({ allocated: 0, received: 0 })
      setActivities([])
      return
    }

    const loadContactData = () => {
      const sessionId = getSessionId()
      if (!sessionId) return

      // Get contact info
      const contacts = signalsStore.getBondedContacts(sessionId)
      const foundContact = contacts.find(c => c.peerId === contactId)
      setContact(foundContact || null)

      // Get trust status
      const allEvents = signalsStore.getAll()
      const trustEvents = allEvents.filter(
        e => e.type === 'TRUST_ALLOCATE' &&
             ((e.actor === sessionId && e.target === contactId) ||
              (e.actor === contactId && e.target === sessionId))
      )

      let allocatedCount = 0
      let receivedCount = 0

      for (const event of trustEvents) {
        if (event.actor === sessionId && event.target === contactId) {
          allocatedCount++
        }
        if (event.actor === contactId && event.target === sessionId) {
          receivedCount++
        }
      }

      setInCircle(allocatedCount > 0)
      setTrustSlots({ allocated: allocatedCount, received: receivedCount })

      // Build activity feed
      const activityItems: ActivityItem[] = []

      // Add signals (recognitions) received by or sent to this contact
      const signalEvents = allEvents.filter(
        e => e.type === 'RECOGNITION_MINT' &&
             ((e.actor === sessionId && e.target === contactId) ||
              (e.actor === contactId && e.target === sessionId))
      )

      for (const signal of signalEvents.slice(0, 5)) {
        const isSent = signal.actor === sessionId
        const signalName = signal.metadata?.name || 'Recognition'
        activityItems.push({
          id: signal.id || `signal-${signal.ts}`,
          type: 'signal',
          timestamp: signal.ts,
          content: isSent 
            ? `You sent ${signalName}` 
            : `Received ${signalName} from them`,
          icon: <Trophy className="w-4 h-4" />,
          color: 'text-[#7c3aed]'
        })
      }

      // Add trust events
      for (const trust of trustEvents.slice(0, 3)) {
        const isSent = trust.actor === sessionId
        activityItems.push({
          id: trust.id || `trust-${trust.ts}`,
          type: 'trust',
          timestamp: trust.ts,
          content: isSent 
            ? 'Added to your circle' 
            : 'Added you to their circle',
          icon: <Heart className="w-4 h-4" />,
          color: 'text-#10b981'
        })
      }

      // TODO: Add message events when XMTP integration is complete
      // For now, this is a placeholder for future message activity

      // Sort by timestamp descending and take top 10
      activityItems.sort((a, b) => b.timestamp - a.timestamp)
      setActivities(activityItems.slice(0, 10))
    }

    loadContactData()

    // Subscribe to store updates
    const unsubscribe = signalsStore.subscribe(() => {
      loadContactData()
    })

    return unsubscribe
  }, [contactId, open])

  const handleMessage = () => {
    if (!contact) return
    
    // Navigate to messages page
    // TODO: Pre-select conversation with this contact when XMTP integration is complete
    router.push('/messages')
    onOpenChange(false)
    toast.info(`Opening messages with ${contact.handle || 'contact'}`)
  }

  const handleSendSignal = () => {
    if (!contact) return
    
    // Close drawer and trigger recognition modal
    onOpenChange(false)
    
    // Dispatch custom event to open SendSignalsModal with this contact pre-selected
    // The contacts page can listen for this event
    window.dispatchEvent(new CustomEvent('openSendSignal', { 
      detail: { contactId: contact.peerId } 
    }))
    
    toast.info('Opening signal selector...')
  }

  const handleToggleTrust = async () => {
    if (!contact || isSendingTrust) return

    const sessionId = getSessionId()
    if (!sessionId) {
      toast.error('Please sign in')
      return
    }

    setIsSendingTrust(true)

    try {
      if (inCircle) {
        // Revoke trust (remove from circle)
        const response = await fetch('/api/trust/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            targetId: contact.peerId
          })
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to revoke trust')
        }

        toast.success(`Removed ${contact.handle || 'contact'} from circle`)
        setInCircle(false)
        setTrustSlots(prev => ({ ...prev, allocated: Math.max(0, prev.allocated - 1) }))
      } else {
        // Allocate trust (add to circle)
        const response = await fetch('/api/trust/allocate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            targetId: contact.peerId,
            weight: 1
          })
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to allocate trust')
        }

        toast.success(`Added ${contact.handle || 'contact'} to circle`)
        setInCircle(true)
        setTrustSlots(prev => ({ ...prev, allocated: prev.allocated + 1 }))
      }
    } catch (error: any) {
      console.error('[ContactDrawer] Trust toggle error:', error)
      toast.error(error.message || 'Failed to update trust')
    } finally {
      setIsSendingTrust(false)
    }
  }

  const handleSendTRST = () => {
    if (!contact) return
    
    // TODO: Implement TRST send modal/flow
    toast.info('TRST send flow coming soon!', {
      description: `Sending TRST to ${contact.handle || 'contact'}`
    })
  }

  const getDisplayName = (contact: BondedContact | null) => {
    if (!contact) return 'Unknown'
    
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
      ? `${contact.peerId.slice(0, 8)}...${contact.peerId.slice(-4)}` 
      : contact.peerId
  }

  const formatTimestamp = (ts: number) => {
    const now = Date.now()
    const diff = now - ts
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return new Date(ts).toLocaleDateString()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f] border-l border-[#7c3aed]/20 overflow-y-auto"
      >
        {/* Header */}
        <SheetHeader className="border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-[#7c3aed]/30">
              <AvatarFallback className="bg-gradient-to-br from-[#7c3aed]/20 to-#ca8a04/20 text-[#7c3aed] text-xl font-bold border border-[#7c3aed]/30">
                {getDisplayName(contact).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <SheetTitle className="text-white text-xl font-bold">
                {getDisplayName(contact)}
              </SheetTitle>
              
              <div className="flex items-center gap-2 mt-1">
                {inCircle && (
                  <Badge className="bg-#10b981/20 text-#10b981 border-#10b981/30 text-xs">
                    In Circle
                  </Badge>
                )}
                {trustSlots.allocated > 0 && (
                  <span className="text-xs text-white/60">
                    🔥 {trustSlots.allocated} slot{trustSlots.allocated !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button
            onClick={handleMessage}
            className="bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 text-[#7c3aed] border border-[#7c3aed]/30"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          
          <Button
            onClick={handleSendSignal}
            className="bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 text-[#7c3aed] border border-[#7c3aed]/30"
            variant="outline"
          >
            <Award className="w-4 h-4 mr-2" />
            Signal
          </Button>
          
          <Button
            onClick={handleToggleTrust}
            disabled={isSendingTrust}
            className={`${
              inCircle 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30' 
                : 'bg-#10b981/20 hover:bg-#10b981/30 text-#10b981 border-#10b981/30'
            } border`}
            variant="outline"
          >
            {inCircle ? (
              <>
                <HeartOff className="w-4 h-4 mr-2" />
                Remove
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Add Trust
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSendTRST}
            className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/30"
            variant="outline"
          >
            <Coins className="w-4 h-4 mr-2" />
            Send TRST
          </Button>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/60" />
            Recent Activity
          </h3>
          
          {activities.length === 0 ? (
            <div className="text-center py-8 text-white/60 text-sm bg-white/5 rounded-lg border border-white/10">
              No activity yet
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.content}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info Footer */}
        {contact && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-xs text-white/50">
              <div className="mb-1">
                <span className="font-semibold text-white/70">Peer ID: </span>
                {contact.peerId}
              </div>
              {contact.hrl && (
                <div>
                  <span className="font-semibold text-white/70">HRL: </span>
                  {contact.hrl}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
