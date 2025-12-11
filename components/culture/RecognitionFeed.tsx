"use client"

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type SignalEvent, signalsStore } from '@/lib/stores/signalsStore'
import { getSessionId } from '@/lib/session'
import { Trophy, User, Calendar, Sparkles } from 'lucide-react'

interface EnhancedSignal extends SignalEvent {
  firstName: string
  eventDescription: string
}

type FilterType = 'all' | 'from-me' | 'to-me'

interface RecognitionFeedProps {
  filter?: FilterType
  onFilterChange?: (filter: FilterType) => void
  maxItems?: number
}

export function RecognitionFeed({ 
  filter = 'all', 
  onFilterChange,
  maxItems 
}: RecognitionFeedProps) {
  const [signals, setSignals] = useState<EnhancedSignal[]>([])
  const [loading, setLoading] = useState(true)

  const getFirstName = (actorId: string): string => {
    if (actorId.startsWith('0.0.')) {
      const parts = actorId.split('.')
      return `...${parts[2]?.slice(-4) || actorId.slice(-4)}`
    }
    
    if (actorId.startsWith('tm-') && actorId.length > 3) {
      const namepart = actorId.slice(3).replace(/-/g, ' ')
      const words = namepart.split(' ')
      return words[0].charAt(0).toUpperCase() + words[0].slice(1)
    }
    
    return actorId.length > 10 ? actorId.slice(0, 6) : actorId
  }

  const getEventDescription = (signal: SignalEvent): string => {
    if ((signal.type === 'SIGNAL_MINT' || signal.type === 'RECOGNITION_MINT') && signal.metadata) {
      const tokenName = signal.metadata.name || signal.metadata.recognition || signal.metadata.recognitionType || 'Recognition Token'
      const description = signal.metadata.description || signal.metadata.subtitle
      const rarity = signal.metadata.rarity
      const emoji = signal.metadata.emoji
      
      let displayText = `${emoji || '🏆'} ${tokenName}`
      if (description) displayText += ` - ${description}`
      if (rarity && rarity !== 'Common') displayText += ` (⭐ ${rarity})`
      
      return displayText
    }
    
    const firstName = getFirstName(signal.actor)
    return `🏆 ${firstName} earned recognition`
  }

  const loadSignals = () => {
    try {
      setLoading(true)
      const sessionId = getSessionId()
      
      const allSignals = signalsStore.getAll()
      
      // Filter to recognition events
      const recognitionEvents = allSignals.filter(signal => {
        const isRecognition = signal.type === 'SIGNAL_MINT' || signal.type === 'RECOGNITION_MINT'
        const hasMetadata = signal.metadata && Object.keys(signal.metadata).length > 0
        const hasRichMetadata = signal.metadata?.name || signal.metadata?.subtitle || signal.metadata?.senderName
        const isHederaAccount = signal.actor?.startsWith('0.0.')
        const isTmWithRichData = signal.actor?.startsWith('tm-') && hasRichMetadata
        const isNotOldDemo = !signal.actor?.startsWith('demo-') && !signal.actor?.startsWith('test')
        
        return isRecognition && hasMetadata && (isHederaAccount || isTmWithRichData) && isNotOldDemo
      })
      
      // Apply filter
      let filteredEvents = recognitionEvents
      if (filter === 'from-me' && sessionId) {
        filteredEvents = recognitionEvents.filter(s => s.actor === sessionId)
      } else if (filter === 'to-me' && sessionId) {
        filteredEvents = recognitionEvents.filter(s => s.target === sessionId)
      }
      
      // Sort by timestamp
      const sortedEvents = filteredEvents.sort((a, b) => b.ts - a.ts)
      
      // Limit if maxItems specified
      const limitedEvents = maxItems ? sortedEvents.slice(0, maxItems) : sortedEvents
      
      const enhancedSignals: EnhancedSignal[] = limitedEvents.map((signal) => {
        const displayName = signal.metadata?.senderName || getFirstName(signal.actor)
        
        return {
          ...signal,
          firstName: displayName,
          eventDescription: getEventDescription(signal)
        }
      })
      
      setSignals(enhancedSignals)
    } catch (error) {
      console.error('[RecognitionFeed] Failed to load signals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSignals()
    
    const unsubscribe = signalsStore.subscribe(() => {
      loadSignals()
    })
    
    return unsubscribe
  }, [filter, maxItems])

  const formatDate = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Loading recognition feed...</p>
      </div>
    )
  }

  if (signals.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
        <Sparkles className="w-12 h-12 text-[#7c3aed] mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">No Recognition Yet</h3>
        <p className="text-sm text-white/60 max-w-sm mx-auto">
          Start sending recognition signals to celebrate achievements and build trust
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Buttons */}
      {onFilterChange && (
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => onFilterChange('all')}
            className={filter === 'all' ? 'bg-[#7c3aed] text-white' : 'border-white/20 text-white hover:bg-white/10'}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'from-me' ? 'default' : 'outline'}
            onClick={() => onFilterChange('from-me')}
            className={filter === 'from-me' ? 'bg-[#7c3aed] text-white' : 'border-white/20 text-white hover:bg-white/10'}
          >
            From Me
          </Button>
          <Button
            size="sm"
            variant={filter === 'to-me' ? 'default' : 'outline'}
            onClick={() => onFilterChange('to-me')}
            className={filter === 'to-me' ? 'bg-[#7c3aed] text-white' : 'border-white/20 text-white hover:bg-white/10'}
          >
            To Me
          </Button>
        </div>
      )}

      {/* Feed List */}
      <div className="space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-[#7c3aed]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#7c3aed]/20 to-#ca8a04/20 text-[#7c3aed] text-sm font-bold">
                  {signal.firstName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{signal.firstName}</span>
                  <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 text-xs">
                    Recognition
                  </Badge>
                </div>
                
                <p className="text-sm text-white/80 mb-2">
                  {signal.eventDescription}
                </p>
                
                {signal.target && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <User className="w-3 h-3" />
                    <span>to {getFirstName(signal.target)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-white/50 mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(signal.ts)}</span>
                </div>
              </div>
              
              <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
