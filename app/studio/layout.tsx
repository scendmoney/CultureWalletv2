/**
 * Studio Layout
 * 
 * Provides the persistent shell for the Studio experience.
 * Includes top nav and context providers.
 */

'use client'

import { ReactNode } from 'react'

export default function StudioLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-gray-800 selection:text-white font-sans">
            {/* 
        Ideally, we would check auth here (Magic Link)
        For MVP Skeleton, we assume open access to /studio/* 
      */}
            {children}
        </div>
    )
}
