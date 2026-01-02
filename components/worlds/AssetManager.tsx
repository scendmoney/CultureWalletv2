/**
 * Asset Manager Component
 * 
 * Screen 3 of UI Canon (Tab: Assets)
 * Handles uploading media assets and inscribing them via HCS + KiloScribe (Stub).
 */

'use client'

import { useState } from 'react'
import { Upload, FileAudio, FileVideo, Image as ImageIcon, CheckCircle, Hash } from 'lucide-react'
import { ulid } from 'ulid'

// Types aligned with World Canon
interface Asset {
    id: string
    name: string
    type: 'image' | 'audio' | 'video'
    fileSize: string
    status: 'pending' | 'inscribed'
    hash?: string
    topicId?: string // KiloScribe topic
}

export function AssetManager() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = () => {
        setIsUploading(true)

        // Simulate upload delay
        setTimeout(() => {
            const newAsset: Asset = {
                id: ulid(),
                name: `Asset_${new Date().getTime()}.png`,
                type: 'image',
                fileSize: '2.4 MB',
                status: 'pending'
            }
            setAssets([newAsset, ...assets])
            setIsUploading(false)
        }, 1500)
    }

    const handleInscribe = (id: string) => {
        // Simulate HCS/KiloScribe Inscription
        setAssets(prev => prev.map(a => {
            if (a.id === id) {
                return {
                    ...a,
                    status: 'inscribed',
                    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
                    topicId: '0.0.8849201' // Mock Mock Topic
                }
            }
            return a
        }))
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Asset Inscription</h3>
                <p className="text-gray-400 text-sm">Upload and inscribe cultural artifacts. These become permanent records in the World.</p>
            </div>

            {/* Upload Area */}
            <div
                onClick={handleUpload}
                className={`border-2 border-dashed border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-900/50 transition-all cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <Upload size={48} className="mb-4" />
                <h4 className="text-lg font-medium">{isUploading ? 'Uploading...' : 'Drop files to inscribe'}</h4>
                <p className="text-sm mt-2">Supports Audio, Video, Visuals (Max 100MB)</p>
            </div>

            {/* Asset List */}
            <div className="space-y-4">
                {assets.map(asset => (
                    <div key={asset.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                {asset.type === 'image' && <ImageIcon size={24} />}
                                {asset.type === 'audio' && <FileAudio size={24} />}
                                {asset.type === 'video' && <FileVideo size={24} />}
                            </div>
                            <div>
                                <h5 className="font-medium text-white">{asset.name}</h5>
                                <p className="text-xs text-gray-500">{asset.fileSize} • {asset.status === 'inscribed' ? 'Immutable' : 'Ready to Inscribe'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {asset.status === 'inscribed' ? (
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-green-500 text-sm font-medium mb-1">
                                        <CheckCircle size={14} /> Inscribed
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-mono bg-gray-950 px-2 py-1 rounded">
                                        <Hash size={10} /> {asset.hash?.substring(0, 12)}...
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleInscribe(asset.id)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                                >
                                    Inscribe to HCS
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
