"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Coins, 
  Send, 
  ArrowDownLeft, 
  History, 
  TrendingUp,
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight
} from 'lucide-react'
import { getSessionId } from '@/lib/session'
import { toast } from 'sonner'

export default function WalletPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState("")
  const [trstBalance, setTrstBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBalance = async () => {
      try {
        setLoading(true)
        const currentSessionId = getSessionId()
        
        if (!currentSessionId) {
          setSessionId('')
          setLoading(false)
          return
        }
        
        setSessionId(currentSessionId)
        
        // Fetch TRST balance from API
        const response = await fetch('/api/trst/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountId: currentSessionId })
        })
        
        if (response.ok) {
          const data = await response.json()
          setTrstBalance(data.balance || 0)
        } else {
          setTrstBalance(0)
        }
      } catch (error) {
        console.error('[WalletPage] Failed to load balance:', error)
        setTrstBalance(0)
      } finally {
        setLoading(false)
      }
    }

    loadBalance()
  }, [])

  const handleSendTRST = () => {
    toast.info('Send TRST flow coming soon!')
  }

  const handleReceive = () => {
    toast.info('Receive TRST flow coming soon!')
  }

  const handleTopUp = () => {
    toast.info('Top up TRST coming soon!')
  }

  // Show authentication prompt if no session
  if (!sessionId && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f]">
        <div className="max-w-md mx-auto px-4 py-20 space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-800/30 to-yellow-900/20 flex items-center justify-center border border-yellow-700/30">
            <WalletIcon className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Sign in to view your wallet</h2>
          <p className="text-white/60">Connect with Magic to access your TRST balance</p>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full mb-3 shadow-lg">
            <Coins className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Wallet</h1>
          <p className="text-sm text-white/60">TRST balance & payments</p>
        </div>

        {/* Balance Card */}
        <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-yellow-600/20 shadow-[0_0_30px_rgba(202,138,4,0.15),0_0_60px_rgba(202,138,4,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-yellow-600/20 before:via-transparent before:to-yellow-600/20 before:-z-10 before:animate-pulse">
          <div className="text-center">
            <p className="text-sm text-white/60 mb-2">Your TRST Balance</p>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-white/10 rounded w-48 mx-auto"></div>
              </div>
            ) : (
              <div className="text-5xl font-bold text-white mb-1">
                {trstBalance?.toFixed(2) || '0.00'}
              </div>
            )}
            <p className="text-xs text-white/50">TRST</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={handleSendTRST}
            className="flex-col h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10"
            variant="outline"
          >
            <Send className="w-6 h-6 mb-2 text-yellow-500" />
            <span className="text-xs text-white">Send</span>
          </Button>
          
          <Button
            onClick={handleReceive}
            className="flex-col h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10"
            variant="outline"
          >
            <ArrowDownLeft className="w-6 h-6 mb-2 text-#10b981" />
            <span className="text-xs text-white">Receive</span>
          </Button>
          
          <Button
            onClick={handleTopUp}
            className="flex-col h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10"
            variant="outline"
          >
            <Plus className="w-6 h-6 mb-2 text-[#7c3aed]" />
            <span className="text-xs text-white">Top Up</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <div className="sheen-sweep bg-gradient-to-br from-panel/90 to-panel/80 border-2 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1),0_0_50px_rgba(255,255,255,0.05)] rounded-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/10 before:-z-10 before:animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-white/60" />
              <h3 className="font-semibold text-white">Recent Transactions</h3>
            </div>
          </div>
          
          <div className="text-center py-8">
            <History className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-sm text-white/60">No transactions yet</p>
            <p className="text-xs text-white/40 mt-1">Your payment history will appear here</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-#10b981" />
              <span className="text-xs text-white/60">Received</span>
            </div>
            <div className="text-2xl font-bold text-white">0.00</div>
            <p className="text-xs text-white/40">This month</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-white/60">Sent</span>
            </div>
            <div className="text-2xl font-bold text-white">0.00</div>
            <p className="text-xs text-white/40">This month</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#7c3aed]/10 rounded-lg p-4 border border-[#7c3aed]/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#7c3aed] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">About TRST</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                TRST is the native token of CultureWallet, used for sending recognition signals and building trust in your network. All transactions are recorded on Hedera for transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
