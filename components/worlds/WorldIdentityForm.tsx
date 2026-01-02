/**
 * World Identity Form
 * 
 * Screen 2 of the UI Canon.
 * Defines the core metadata of the World: Name, Type, Description.
 */

'use client'

import { Camera, RefreshCw } from "lucide-react"

interface WorldIdentityFormProps {
    data: any
    onChange: (data: any) => void
}

export function WorldIdentityForm({ data, onChange }: WorldIdentityFormProps) {

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <h3 className="text-xl font-bold text-white mb-1">World Identity</h3>
                <p className="text-gray-400 text-sm">Define the public face of your World. This is what subscribers see first.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Cover Art */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Cover Art</label>
                    <div className="aspect-square bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-gray-600 hover:border-gray-600 hover:bg-gray-800 transition-all cursor-pointer group relative overflow-hidden">
                        {data.coverArt ? (
                            <img src={data.coverArt} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <>
                                <Camera size={32} className="mb-2 group-hover:text-white transition-colors" />
                                <span className="text-xs">Upload 1:1 Image</span>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Recommended: 1080x1080px</p>
                </div>

                {/* Right Column: Fields */}
                <div className="col-span-2 space-y-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">World Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600"
                            placeholder="e.g. Web3 Gang World"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Artist', 'Label', 'Brand'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleChange('type', type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${data.type === type
                                            ? 'bg-white text-black border-white'
                                            : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {/* Community option separately if needed, or generic dropdown later */}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600 resize-none"
                            placeholder="What is this world about?"
                        />
                    </div>

                    {/* Visibility Info */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 flex items-start gap-3">
                        <div className="p-2 bg-gray-800 rounded-md text-gray-400">
                            <GlobeIcon size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-white">Public Visibility</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Your World will be discoverable via its unique WorldID.
                                Joining requires a subscription action from the user.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function GlobeIcon({ size }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
