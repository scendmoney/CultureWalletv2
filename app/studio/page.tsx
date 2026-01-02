/**
 * Worlds Studio Dashboard
 * Route: /studio
 * 
 * Entry point for Issuers. Displays "My Worlds" and allows creating new ones.
 * Desktop-first management interface.
 */

'use client'

import { useState } from 'react'
import { ulid } from 'ulid'
import { Plus, Globe, Music, Tag, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock Data for MVP
const MOCK_WORLDS = [
    {
        id: 'world_web3gang',
        name: 'Web3 Gang World',
        type: 'Community',
        members: 12480,
        signals: 38201,
        status: 'LIVE'
    },
    {
        id: 'world_nittyradio',
        name: 'Nitty Radio Presents',
        type: 'Label',
        members: 3210,
        signals: 9102,
        status: 'DRAFT'
    }
]

export default function StudioDashboard() {
    const router = useRouter()
    const [worlds, setWorlds] = useState(MOCK_WORLDS)

    const handleCreateWorld = () => {
        // In a real flow, this would open a modal -> DB create -> Redirect
        // For MVP skeleton, direct redirect to a new "Draft" world
        const newId = `world_${ulid().toLowerCase()}`
        router.push(`/studio/${newId}`)
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
            {/* Header */}
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Worlds Studio</h1>
                    <p className="text-gray-400">Issuer: Frank Nitty / Web3 Gang General</p>
                </div>
                <button
                    onClick={handleCreateWorld}
                    className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Plus size={18} />
                    Create New World
                </button>
            </header>

            {/* Worlds Grid */}
            <main className="max-w-6xl mx-auto">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">My Worlds</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {worlds.map(world => (
                        <div
                            key={world.id}
                            onClick={() => router.push(`/studio/${world.id}`)}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    {world.type === 'Label' ? <Music size={24} /> : <Globe size={24} />}
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${world.status === 'LIVE'
                                        ? 'bg-green-900/30 text-green-400 border border-green-900'
                                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                    }`}>
                                    {world.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-1">{world.name}</h3>
                            <p className="text-sm text-gray-400 mb-6">{world.type}</p>

                            <div className="flex gap-4 border-t border-gray-800 pt-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                    <Users size={14} className="text-gray-500" />
                                    <span>{world.members.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                    <Tag size={14} className="text-gray-500" />
                                    <span>{world.signals.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New World Card Placeholder */}
                    <button
                        onClick={handleCreateWorld}
                        className="border border-dashed border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-all h-[240px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Create New World</span>
                    </button>
                </div>
            </main>
        </div>
    )
}
