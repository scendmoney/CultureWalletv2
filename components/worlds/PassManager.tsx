/**
 * Pass Manager Component
 * 
 * Screen 3 of UI Canon (Tab: Passes)
 * Handles creation and minting of World Passes (Membership/Tickets).
 */

'use client'

import { useState } from 'react'
import { Ticket, Plus, Users, Crown } from 'lucide-react'
import { ulid } from 'ulid'

interface Pass {
    id: string
    name: string
    supply: number
    minted: number
    type: 'access' | 'vip' | 'commemorative'
}

export function PassManager() {
    const [passes, setPasses] = useState<Pass[]>([
        { id: 'pass_1', name: 'Season 1 Member', supply: 1000, minted: 450, type: 'access' }
    ])
    const [isCreating, setIsCreating] = useState(false)

    const handleCreatePass = () => {
        const newPass: Pass = {
            id: ulid(),
            name: 'New Pass (Draft)',
            supply: 100,
            minted: 0,
            type: 'access'
        }
        setPasses([newPass, ...passes])
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">World Passes</h3>
                    <p className="text-gray-400 text-sm">Mint access tokens and memberships for your community.</p>
                </div>
                <button
                    onClick={handleCreatePass}
                    className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Plus size={16} /> Create Pass
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {passes.map(pass => (
                    <div key={pass.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${pass.type === 'vip' ? 'bg-amber-900/30 text-amber-500' : 'bg-indigo-900/30 text-indigo-400'
                                }`}>
                                {pass.type === 'vip' ? <Crown size={24} /> : <Ticket size={24} />}
                            </div>
                            <span className="text-xs font-mono text-gray-500 bg-gray-950 px-2 py-1 rounded">
                                SUPPLY: {pass.supply}
                            </span>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-2">{pass.name}</h4>

                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                            <div
                                className="bg-indigo-500 h-full rounded-full"
                                style={{ width: `${(pass.minted / pass.supply) * 100}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{pass.minted} minted</span>
                            <span className="text-gray-600">{(pass.supply - pass.minted)} remaining</span>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-800 flex gap-2">
                            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                                Mint to User
                            </button>
                            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
