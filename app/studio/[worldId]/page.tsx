/**
 * World Editor Page
 * Route: /studio/[worldId]
 * 
 * Main editor interface for a specific World.
 * Manages tabs: Overview, Assets, Passes, Signals, Settings.
 */

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, LayoutGrid, Image as ImageIcon, Ticket, Activity, Settings, Save, Loader2, CheckCircle } from 'lucide-react'
import { WorldIdentityForm } from '@/components/worlds/WorldIdentityForm'
import { AssetManager } from '@/components/worlds/AssetManager'
import { PassManager } from '@/components/worlds/PassManager'
import { buildWorldMetaEnvelope } from '@/lib/worlds/envelopeBuilder'

type EditorTab = 'overview' | 'assets' | 'passes' | 'signals' | 'settings'

export default function WorldEditorPage() {
    const params = useParams()
    const router = useRouter()
    const worldId = params.worldId as string
    const [activeTab, setActiveTab] = useState<EditorTab>('overview')
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState<'DRAFT' | 'LIVE'>('DRAFT')
    const [lastTxLink, setLastTxLink] = useState<string | null>(null)

    // Mock World Data (In real app, fetch from HCS/Registry)
    const [worldData, setWorldData] = useState({
        name: 'Web3 Gang World',
        type: 'Community',
        description: 'Hip-hop meets decentralized culture.',
        coverArt: '',
        visibility: 'PUBLIC'
    })

    // Handle Tab Switching
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <WorldIdentityForm
                        data={worldData}
                        onChange={setWorldData}
                    />
                )
            case 'assets':
                return <AssetManager />
            case 'passes':
                return <PassManager />
            case 'signals':
                return (
                    <div className="p-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/50">
                        <Activity className="mx-auto h-12 w-12 text-gray-700 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300">Signals & Recognition</h3>
                        <p className="max-w-md mx-auto mt-2">View engagement and issue recognition signals to your members.</p>
                        <div className="mt-6">
                            <span className="text-xs bg-gray-800 text-gray-500 px-3 py-1 rounded-full">Read Only in V0</span>
                        </div>
                    </div>
                )
            default:
                return <div className="p-6 text-gray-500">Settings coming soon.</div>
        }
    }

    const handlePublish = async () => {
        setIsSaving(true)
        setLastTxLink(null)

        try {
            // 1. Build HCS-5 Envelope
            const envelope = buildWorldMetaEnvelope(
                worldId,
                '0.0.mock-issuer', // TODO: Get from Auth
                {
                    name: worldData.name,
                    type: worldData.type as any,
                    description: worldData.description,
                    visibility: 'PUBLIC'
                },
                'CREATE'
            )

            // 2. Submit to API
            const response = await fetch('/api/worlds/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(envelope)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Submission failed')
            }

            // 3. Success
            setStatus('LIVE')
            // Construct Hashscan link (Testnet)
            if (result.transactionId) {
                setLastTxLink(`https://hashscan.io/testnet/transaction/${result.transactionId}`)
            }

            alert(`World Published! Sequence #${result.sequenceNumber}`)

        } catch (error: any) {
            alert(`Error: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex h-screen bg-black text-gray-100 overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <button
                        onClick={() => router.push('/studio')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={16} /> Back to Worlds
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex-shrink-0" />
                        <div className="overflow-hidden">
                            <h1 className="font-bold truncate">{worldData.name || 'Untitled World'}</h1>
                            <p className="text-xs text-gray-500 font-mono text-ellipsis overflow-hidden">{worldId}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarItem
                        icon={<LayoutGrid size={18} />}
                        label="Overview"
                        isActive={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={<ImageIcon size={18} />}
                        label="Assets"
                        isActive={activeTab === 'assets'}
                        onClick={() => setActiveTab('assets')}
                    />
                    <SidebarItem
                        icon={<Ticket size={18} />}
                        label="Passes"
                        isActive={activeTab === 'passes'}
                        onClick={() => setActiveTab('passes')}
                    />
                    <SidebarItem
                        icon={<Activity size={18} />}
                        label="Signals"
                        isActive={activeTab === 'signals'}
                        onClick={() => setActiveTab('signals')}
                    />
                    <SidebarItem
                        icon={<Settings size={18} />}
                        label="Settings"
                        isActive={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="text-xs text-gray-600 text-center">
                        Status: <span className={`font-medium ${status === 'LIVE' ? 'text-green-500' : 'text-gray-500'}`}>{status}</span>
                    </div>
                    {lastTxLink && (
                        <a href={lastTxLink} target="_blank" rel="noreferrer" className="block mt-2 text-xs text-indigo-400 hover:text-indigo-300 text-center truncate">
                            View Transaction ↗
                        </a>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-925">
                {/* Top Bar */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-950/50 backdrop-blur-sm">
                    <h2 className="text-lg font-medium capitalize">{activeTab}</h2>
                    <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                            Discard Changes
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSaving}
                            className={`bg-white text-black px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Publishing...
                                </>
                            ) : status === 'LIVE' ? (
                                <>
                                    <CheckCircle size={16} className="text-green-600" /> Update World
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Publish World
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* Canvas */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon, label, isActive, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`}
        >
            {icon}
            {label}
        </button>
    )
}
