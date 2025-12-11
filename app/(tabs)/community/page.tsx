"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  UserPlus, 
  QrCode, 
  Search, 
  User, 
  MessageCircle,
  Users,
  Mail
} from 'lucide-react'
import { type BondedContact, signalsStore } from '@/lib/stores/signalsStore'
import { getSessionId } from '@/lib/session'
import { ContactDrawer } from '@/components/contacts/ContactDrawer'
import { RingOfNine } from '@/components/community/RingOfNine'
import { AddContactDialog } from '@/components/AddContactDialog'
import { toast } from 'sonner'

export default function CommunityPage() {
  const router = useRouter()
  const [bondedContacts, setBondedContacts] = useState<BondedContact[]>([])
  const [trustLevels, setTrustLevels] = useState<Map<string, { allocatedTo: number, receivedFrom: number }>>(new Map())
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // ContactDrawer state
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true)
        const currentSessionId = getSessionId()
        
        if (!currentSessionId) {
          console.log('[CommunityPage] No session ID - user not authenticated')
          setSessionId('')
          setBondedContacts([])
          setIsLoading(false)
          return
        }
        
        setSessionId(currentSessionId)
        
        // Load contacts from signalsStore
        const contacts = signalsStore.getBondedContacts(currentSessionId)
        setBondedContacts(contacts)
        
        // Build trust levels map
        const trustLevelsMap = new Map<string, { allocatedTo: number, receivedFrom: number }>()
        const trustEvents = signalsStore.getAll().filter(e => e.type === 'TRUST_ALLOCATE')
        
        trustEvents.forEach(event => {
          const targetId = event.target
          if (!targetId) return
          
          if (event.actor === currentSessionId) {
            const existing = trustLevelsMap.get(targetId) || { allocatedTo: 0, receivedFrom: 0 }
            existing.allocatedTo += 1
            trustLevelsMap.set(targetId, existing)
          }
          
          if (event.target === currentSessionId) {
            const actorId = event.actor
            const existing = trustLevelsMap.get(actorId) || { allocatedTo: 0, receivedFrom: 0 }
            existing.receivedFrom += 1
            trustLevelsMap.set(actorId, existing)
          }
        })
        
        setTrustLevels(trustLevelsMap)
      } catch (error) {
        console.error('[CommunityPage] Failed to load data:', error)
        toast.error('Failed to load community data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    
    // Subscribe to store updates
    const unsubscribe = signalsStore.subscribe(() => {
      loadData()
    })
    
    return unsubscribe
  }, [])

  // Circle members (contacts with trust allocated)
  const circleMembers = bondedContacts.filter(contact => {
    const trustData = trustLevels.get(contact.peerId || '')
    return trustData && trustData.allocatedTo > 0
  })

  // Filtered contacts for list
  const filteredContacts = bondedContacts.filter(contact =>
    (contact.handle || contact.peerId || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const handleContactClick = (contactId: string) => {
    setSelectedContactId(contactId)
    setDrawerOpen(true)
  }

  const handleAddContact = () => {
    router.push('/qr')
  }

  const getDisplayName = (contact: BondedContact) => {
    if (contact.handle && contact.handle !== contact.peerId) {
      return contact.handle
    }
    
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

  // Show authentication prompt if no session
  if (!sessionId && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f]">
        <div className="max-w-md mx-auto px-4 py-20 space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-800/30 to-purple-900/20 flex items-center justify-center border border-purple-700/30">
            <Users className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Sign in to view your community</h2>
          <p className="text-white/60">Connect with Magic to access your trusted network</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Sign in with Magic
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f]">
      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Page Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-white mb-1">Community</h1>
          <p className="text-sm text-white/60">Your trusted network on the blockchain</p>
        </div>

        {/* Ring of Nine - Circle of Trust */}
        <RingOfNine
          circleMembers={circleMembers}
          maxSlots={9}
          onContactClick={handleContactClick}
          onAddClick={handleAddContact}
        />

        {/* Quick Actions */}
        <div className="flex gap-2">
          <AddContactDialog>
            <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all">
              <QrCode className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </AddContactDialog>
        </div>

        {/* All Contacts List */}
        <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1),0_0_50px_rgba(255,255,255,0.05)] rounded-lg p-4 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/10 before:-z-10 before:animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">All Contacts</h3>
              <span className="text-sm text-white/60">({bondedContacts.length})</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
              <Input
                placeholder="Search..."
                className="pl-7 h-8 w-32 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#7c3aed] text-xs rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-white/60 text-sm">
              <div className="animate-pulse">Loading contacts...</div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p className="text-sm">No contacts found</p>
              <p className="text-xs mt-2">Add contacts to get started</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => {
                const trustData = trustLevels.get(contact.peerId || '') || { allocatedTo: 0, receivedFrom: 0 }
                const displayName = getDisplayName(contact)
                const inCircle = trustData.allocatedTo > 0
                
                return (
                  <div
                    key={contact.peerId}
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all border border-white/10 hover:border-[#7c3aed]/30"
                    onClick={() => handleContactClick(contact.peerId)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-#ca8a04/20 border border-[#7c3aed]/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#7c3aed]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-white">{displayName}</div>
                          {inCircle && (
                            <Badge className="bg-#10b981/20 text-#10b981 border-#10b981/30 text-xs">
                              In Circle
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-white/60">
                          {trustData.allocatedTo > 0 ? (
                            <span>🔥 {trustData.allocatedTo} trust</span>
                          ) : (
                            <span>Contact</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-[#7c3aed] hover:bg-[#7c3aed]/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleContactClick(contact.peerId)
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Messages Preview Section */}
        <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-[#7c3aed]/20 shadow-[0_0_30px_rgba(124,58,237,0.15),0_0_60px_rgba(124,58,237,0.05)] rounded-lg p-4 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-[#7c3aed]/20 before:via-transparent before:to-[#7c3aed]/20 before:-z-10 before:animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-#ca8a04/20 flex items-center justify-center border border-[#7c3aed]/30">
                <Mail className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <h3 className="font-semibold text-white text-sm">Messages</h3>
            </div>
          </div>
          
          <div className="text-center py-6 text-white/60">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No messages yet</p>
            <p className="text-xs mt-1">XMTP messaging coming soon</p>
          </div>
        </div>

        {/* Floating Add Button - Bottom Right */}
        <button
          onClick={handleAddContact}
          className="fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-black transition-all hover:scale-110 active:scale-95 z-30"
          aria-label="Add new contact"
        >
          <UserPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Contact Drawer */}
      {selectedContactId && (
        <ContactDrawer
          contactId={selectedContactId}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </div>
  )
}
