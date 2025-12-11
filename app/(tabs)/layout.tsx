"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signalsStore } from "@/lib/stores/signalsStore"
import { HeaderModeChips } from "@/components/HeaderModeChips"
import { useLayoutMode } from "@/lib/layout/useLayoutMode"
import { ModeShell } from "@/components/layout/ModeShell"
import { HeaderMenu } from "@/components/HeaderMenu"
import type { UserTokens } from "@/lib/layout/token-types"
import { TokenGatedProgress } from "@/components/gating/TokenGatedProgress"
import { UnlockModal } from "@/components/gating/UnlockModal"
import { useModeUpgrade } from "@/lib/layout/useModeUpgrade"
import { modeToUnlockKind } from "@/lib/layout/upgrade-map"
import { 
  Circle, 
  Activity, 
  Users,
  MessageCircle,
  Zap
} from "lucide-react"

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [hasUnseen, setHasUnseen] = useState(false)
  const [userTokens, setUserTokens] = useState<UserTokens | undefined>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth from Magic wallet
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is logged in via Magic
      const users = localStorage.getItem('tm:users')
      if (users) {
        const parsed = JSON.parse(users)
        setIsAuthenticated(parsed.length > 0)
      }
      
      // TODO: Wire to real token detection from Hedera account
      // For now, no special token-gated modes - just default App mode
      setUserTokens(undefined)
    }
    checkAuth()
  }, [])

  const mode = useLayoutMode({ isAuthenticated, userTokens })
  const collectionCount = userTokens?.nfts?.length ?? 0
  
  // Track mode upgrades and show unlock modal
  const { upgraded } = useModeUpgrade(mode)
  const unlockKind = upgraded ? modeToUnlockKind(mode) : null

  // Update unseen signals indicator
  useEffect(() => {
    const updateUnseen = () => {
      const unseen = signalsStore.hasUnseen()
      setHasUnseen(unseen)
    }

    // Load initially
    updateUnseen()

    // Update on storage changes
    const handleStorageChange = () => updateUnseen()
    window.addEventListener('storage', handleStorageChange)
    
    // Also poll for updates
    const interval = setInterval(updateUnseen, 5000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // CultureWallet navigation: Community → Signals → Boost (3-Loop Compression)
  const tabs = [
    {
      id: "community",
      label: "Community",
      path: "/community",
      icon: Users,
      badge: null,
      description: "Trusted network"
    },
    {
      id: "signals", 
      label: "Signals",
      path: "/signals",
      icon: Activity,
      badge: hasUnseen ? "•" : null,
      description: "Props activity"
    },
    {
      id: "boost",
      label: "Boost",
      path: "/boost",
      icon: Zap,
      badge: null,
      description: "Boost signals"
    }
  ]

  return (
    <ModeShell 
      mode={mode} 
      collectionCount={collectionCount}
      isAuthenticated={isAuthenticated}
      signalsHasUnseen={hasUnseen}
    >
      {/* Header menu across all modes */}
      <HeaderMenu />
      
      <div className="min-h-screen">
        {/* Main content - Add bottom padding for fixed navigation */}
        <main className="min-h-[calc(100vh-8rem)] px-1 pb-20">
          {children}
        </main>

        {/* CultureWallet Theme CSS Injection */}
        <style jsx global>{`
        .theme-professional {
          --accent-primary: #7c3aed;
          --accent-secondary: #10b981;
          --accent-tertiary: #ca8a04;
          --bg-glass: rgba(55, 17, 89, 0.3);
          --border-glow: 0 0 4px rgba(124, 58, 237, 0.4);
        }
        
        .pulse-accent {
          animation: pulse-culture 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-culture {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 2px rgba(124, 58, 237, 0.4));
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));
          }
        }
        
        .animate-spin-slow-cw {
          animation: spin-slow-cw 27s linear infinite;
        }
        
        .animate-spin-slow-ccw {
          animation: spin-slow-ccw 27s linear infinite;
        }
        
        @keyframes spin-slow-cw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slow-ccw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        `}</style>
      </div>
      
      {/* Progress HUD (only when authenticated) */}
      {isAuthenticated && <TokenGatedProgress tokens={userTokens} />}

      {/* Unlock modal (fires on upgrade) */}
      <UnlockModal showFor={unlockKind} />
    </ModeShell>
  )
}
