/**
 * Asset Manager Component
 * 
 * Screen 3 of UI Canon (Tab: Assets)
 * Handles uploading media assets and inscribing them via HCS + KiloScribe (Stub).
 */

'use client'

import { useState } from 'react'
import { Upload, FileAudio, FileVideo, Image as ImageIcon, CheckCircle, Hash, Link as LinkIcon, Loader2 } from 'lucide-react'
import { ulid } from 'ulid'


interface Asset {
    id: string
    name: string
    type: 'image' | 'audio' | 'video'
    fileSize: string
    status: 'pending' | 'staged' | 'inscribed'
    hash?: string
    topicId?: string
    fileUrl?: string
    jsonUrl?: string
}

export function AssetManager() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [stagedFile, setStagedFile] = useState<File | null>(null)

    // Step 1: Select File
    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setStagedFile(file)

            // Add to UI list as "Pending"
            const newAsset: Asset = {
                id: ulid(),
                name: file.name,
                type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
                fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                status: 'pending'
            }
            setAssets([newAsset, ...assets])

            // Auto-trigger Stage 1 (Upload File)
            stageAsset(newAsset.id, file)
        }
    }

    // Step 2: Stage Asset (Upload File -> Generate JSON -> Upload JSON)
    const stageAsset = async (assetId: string, file: File) => {
        setIsUploading(true)
        try {
            // A. Upload File to Blob
            const fileRes = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                body: file
            })
            const fileBlob = await fileRes.json()
            if (!fileBlob.url) throw new Error('File upload failed')

            // B. Generate Metadata JSON
            const metadata = {
                name: file.name,
                description: 'Staged via World Studio',
                mimeType: file.type,
                sizeBytes: file.size,
                fileUrl: fileBlob.url,
                worldId: 'world_web3gang',
                issuerAccountId: '0.0.12345'
            }
            const jsonString = JSON.stringify(metadata, null, 2)

            // C. Upload JSON to Blob
            const jsonRes = await fetch(`/api/upload?filename=${file.name}.json`, {
                method: 'POST',
                body: jsonString
            })
            const jsonBlob = await jsonRes.json()
            if (!jsonBlob.url) throw new Error('Metadata upload failed')

            // D. Update UI to Staged
            setAssets(prev => prev.map(a => {
                if (a.id === assetId) {
                    return {
                        ...a,
                        status: 'staged',
                        fileUrl: fileBlob.url,
                        jsonUrl: jsonBlob.url
                    }
                }
                return a
            }))
            setStagedFile(null) // Clear input

        } catch (e) {
            console.error(e)
            alert('Staging Failed')
            setAssets(prev => prev.filter(a => a.id !== assetId)) // Remove failed
        } finally {
            setIsUploading(false)
        }
    }

    // Step 3: Inscribe (Send URLs to Backend)
    const triggerInscribe = async (assetId: string) => {
        const asset = assets.find(a => a.id === assetId)
        if (!asset || !asset.fileUrl || !asset.jsonUrl) return

        setIsUploading(true)
        try {
            const res = await fetch('/api/assets/inscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    worldId: 'world_web3gang',
                    issuerId: '0.0.12345',
                    urls: {
                        fileUrl: asset.fileUrl,
                        jsonUrl: asset.jsonUrl
                    },
                    meta: {
                        filename: asset.name,
                        mimeType: asset.type === 'video' ? 'video/mp4' : 'image/png', // simplified
                        sizeBytes: 1000 // simplified for Phase 1B
                    }
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Inscription failed')

            // Success Update
            setAssets(prev => prev.map(a => {
                if (a.id === assetId) {
                    return {
                        ...a,
                        status: 'inscribed',
                        hash: data.contentHash,
                        topicId: data.topicId
                    }
                }
                return a
            }))

            alert(`Success! Inscribed Sequence #${data.sequenceNumber}`)

        } catch (e: any) {
            console.error(e)
            alert('Inscription Failed: ' + e.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Asset Staging</h3>
                <p className="text-gray-400 text-sm">Upload to Vercel Blob &rarr; Inscribe Metadata to HCS.</p>
            </div>

            {/* Upload Area */}
            <div className="relative">
                <input
                    type="file"
                    onChange={onFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                />
                <div
                    className={`border-2 border-dashed border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-900/50 transition-all ${isUploading ? 'opacity-50' : ''}`}
                >
                    {isUploading ? <Loader2 className="animate-spin mb-4" size={48} /> : <Upload size={48} className="mb-4" />}
                    <h4 className="text-lg font-medium">
                        {isUploading ? 'Staging Asset...' : 'Drop file to Stage'}
                    </h4>
                </div>
            </div>

            {/* Asset List */}
            <div className="space-y-4">
                {assets.map(asset => (
                    <div key={asset.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                {asset.type === 'image' && <ImageIcon size={24} />}
                                {asset.type === 'video' && <FileVideo size={24} />}
                            </div>
                            <div>
                                <h5 className="font-medium text-white">{asset.name}</h5>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {asset.status === 'staged' && <span className="text-blue-400">Staged (Ready)</span>}
                                    {asset.status === 'inscribed' && <span className="text-green-500">Inscribed</span>}
                                    {asset.status === 'pending' && <span>Uploading...</span>}
                                </div>
                                {asset.fileUrl && (
                                    <div className="flex gap-2 mt-1">
                                        <a href={asset.fileUrl} target="_blank" className="text-xs text-indigo-400 hover:underline flex items-center gap-1"><LinkIcon size={10} /> File</a>
                                        <a href={asset.jsonUrl} target="_blank" className="text-xs text-indigo-400 hover:underline flex items-center gap-1"><LinkIcon size={10} /> JSON</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {asset.status === 'inscribed' ? (
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-green-500 text-sm font-medium mb-1">
                                        <CheckCircle size={14} /> Inscribed
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-mono bg-gray-950 px-2 py-1 rounded">
                                        <Hash size={10} /> {asset.hash?.substring(0, 8)}...
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => triggerInscribe(asset.id)}
                                    disabled={asset.status !== 'staged' || isUploading}
                                    className={`text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${asset.status === 'staged' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Inscribe
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
