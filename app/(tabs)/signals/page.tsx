"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignalsPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to culture page
    router.replace('/culture')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#2a1030] to-[#1a0a1f] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to Culture...</p>
      </div>
    </div>
  )
}
