/**
 * World Studio Types (Canon-safe v1)
 * 
 * Defines the HCS envelope structures for World interactions.
 * Refined for Phase 1A (Idempotency, Ledger-verifiability).
 */

export interface WorldProfile {
    name: string
    type: 'Artist' | 'Label' | 'Brand' | 'Community' // Restricted types for MVP
    description?: string
    coverArt?: string
    visibility: 'PUBLIC' | 'PRIVATE'
}

export interface WorldDrop {
    id: string
    name: string
    type: string
    requirements: string
}

// --- Payloads ---

export interface WorldMetaPayload {
    schema: 'world.meta@1' // Renamed from 't'
    op: 'CREATE' | 'UPDATE'
    profile: WorldProfile
}

export interface WorldContentPayload {
    schema: 'world.content@1'
    asset: {
        filename: string
        mime_type: string
        size_bytes: number
        file_sha256?: string
    }
    urls: {
        file_url: string
        json_file_url: string
    }
    inscription: {
        provider: 'kiloscribe' | 'hcs_only'
        id: string | null
    }
}

export interface WorldSignalPayload {
    schema: 'world.signal@1'
    signal_type: 'DROP_ANNOUNCE' | 'MEMBER_JOIN'
    target_id: string
    data: any
}

export interface WorldPassPayload {
    schema: 'world.pass@1'
    pass: {
        id: string
        name: string
        description?: string
        supply: {
            type: 'FINITE' | 'INFINITE'
            cap?: number
        }
        image_url?: string
        status: 'ACTIVE' | 'DRAFT'
    }
}

// --- Envelope ---

export interface WorldEnvelope<T = any> {
    appId: 'culturewallet' // Canonical App ID
    type: 'WORLD_META' | 'WORLD_CONTENT' | 'WORLD_SIGNAL' | 'WORLD_PASS'
    version: 1
    eventId: string         // Deterministic: worldId:type:op:ts
    worldId: string
    issuerAccountId: string // Renamed from 'from'
    clientTs: number        // Renamed from 'ts' (ms)
    revision: number        // Monotonic state revision (Tashi Alignment)
    payload: T
    contentHash?: string    // Computed on server
}

export interface WorldSubmitResponse {
    success: boolean
    topicId?: string
    sequenceNumber?: string
    consensusTimestamp?: string
    transactionId?: string
    error?: string
}
