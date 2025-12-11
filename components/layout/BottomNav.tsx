'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Sparkles, Wallet } from 'lucide-react'

export function BottomNav({
  isAuthenticated,
  hasUnseen = false,
}: {
  isAuthenticated: boolean
  hasUnseen?: boolean
}) {
  const pathname = usePathname()

  // If unauth in viral/kiosk, send to /onboard
  const route = (path: string) => (isAuthenticated ? path : '/onboard')

  const tabs = [
    { id: 'community', label: 'Community', path: route('/community'), icon: Users },
    { id: 'culture', label: 'Culture', path: route('/culture'), icon: Sparkles },
    { id: 'wallet', label: 'Wallet', path: route('/wallet'), icon: Wallet },
  ]

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10 z-40">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = isActive(tab.path)
            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-all duration-300 ${
                  active ? 'text-white' : 'text-white/60 hover:text-white/90'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 mb-1 transition-all duration-300 ${
                      active ? 'text-purple-500 scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]' : 'text-white/60'
                    }`}
                  />
                  {tab.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full pulse-accent shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_4px_rgba(124,58,237,0.8)]" />
                  )}
                </div>
                <span
                  className={`transition-all duration-300 text-xs ${
                    active ? 'text-purple-500 font-bold' : 'text-white/60'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
