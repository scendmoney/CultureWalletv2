/**
 * World Studio Type Definitions
 * 
 * Defines the core data structures for Worlds, localized signals, and HCS envelopes.
 * Evolves from Issuer Studio types to support "World" scoping.
 */

export type WorldTopicType = 'WORLD_META' | 'WORLD_CONTENT' | 'WORLD_SIGNAL' | 'WORLD_MEMBERSHIP'

export interface WorldProfile {
    name: string
    description?: string
    type: 'ARTIST' | 'LABEL' | 'BRAND' | 'COMMUNITY' | 'OTHER'
    coverArtUrl?: string // Check KiloScribe compatibility
    visibility: 'PUBLIC' | 'PRIVATE'
}

export interface WorldAsset {
    id: string
    title: string
    description?: string
    type: 'IMAGE' | 'AUDIO' | 'VIDEO'
    url: string
    hash: string // Content hash
    status: 'Draft' | 'Inscribed'
}

export interface WorldPass {
    id: string
    name: string
    supply: number
    minted: number
    description?: string
    image?: string
    status: 'Draft' | 'Minted'
}

export interface WorldDrop {
    id: string
    name: string
    type: 'AUDIO' | 'VIDEO' | 'ACCESS_PASS' | 'DIGITAL_ART'
    description?: string
    mediaUrl?: string
    totalSupply?: number
    requirements?: {
        action: 'INVITE' | 'FOLLOW' | 'ATTEND' | 'NONE'
        count?: number
    }
}

// --- HCS Envelopes ---

// Base Envelope specific to World context
export interface WorldEnvelope<T = any> {
    type: WorldTopicType
    worldId: string
    from: string // Issuer DID
    nonce: number
    ts: number
    payload: T
}

// Payload for WORLD_META topics
export interface WorldMetaPayload {
    t: 'world.meta@1'
    op: 'CREATE' | 'UPDATE'
    profile: WorldProfile
}

// Payload for WORLD_CONTENT topics (Media/KiloScribe pattern)
export interface WorldContentPayload {
    t: 'world.content@1'
    content_id: string
    mime_type: string
    url: string // IPFS or external
    hash?: string // Content integrity
}

// Payload for WORLD_SIGNAL topics (Drops/Recognition)
export interface WorldSignalPayload {
    t: 'world.signal@1'
    signal_type: 'DROP_ANNOUNCE' | 'RECOGNITION'
    target_id?: string // Drop ID or User DID
    data: any
}

// --- API Responses ---

export interface WorldSubmitResponse {
    success: boolean
    topicId?: string
    sequenceNumber?: string
    consensusTimestamp?: string
    transactionId?: string
    error?: string
}

export interface SubmittedWorldEvent {
    id: string
    timestamp: string
    worldId: string
    type: WorldTopicType
    status: 'pending' | 'confirmed' | 'failed'
    sequenceNumber?: string
    consensusTimestamp?: string
    transactionId?: string
    error?: string
}
