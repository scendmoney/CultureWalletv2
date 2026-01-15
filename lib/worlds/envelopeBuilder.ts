/**
 * World Studio Envelope Builders (Canon-safe v1)
 * 
 * Constructs validated HCS envelopes for World Studio workflows.
 * Implements deterministic eventIds and minimal canon shape.
 */

import {
    WorldEnvelope,
    WorldMetaPayload,
    WorldContentPayload,
    WorldSignalPayload,
    WorldProfile,
    WorldDrop,
    WorldPassPayload
} from './types'

/**
 * Build a WORLD_META envelope (Client Side)
 * Note: contentHash is computed on Server.
 */
export function buildWorldMetaEnvelope(
    worldId: string,
    issuerAccountId: string,
    profile: WorldProfile,
    op: 'CREATE' | 'UPDATE' = 'CREATE',
    revision: number = 1
): WorldEnvelope<WorldMetaPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    if (!profile.name) throw new Error('World name is required')
    if (!profile.type) throw new Error('World type is required')

    const clientTs = Date.now()
    // Deterministic Event ID
    const eventId = `${worldId}:meta:${op.toLowerCase()}:${clientTs}`

    return {
        appId: 'culturewallet', // Canonical Registry Scope
        type: 'WORLD_META',
        version: 1,
        eventId,
        worldId,
        issuerAccountId,
        clientTs,
        revision,
        payload: {
            schema: 'world.meta@1',
            op,
            profile
        }
    }
}

/**
 * Build a WORLD_CONTENT envelope
 */
export function buildWorldContentEnvelope(
    worldId: string,
    issuerAccountId: string,
    contentId: string,
    assetMeta: { filename: string, mimeType: string, sizeBytes: number, sha256?: string },
    urls: { fileUrl: string, jsonUrl: string },
    revision: number = 1
): WorldEnvelope<WorldContentPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    const clientTs = Date.now()
    const eventId = `${worldId}:content:${contentId}:${clientTs}`

    return {
        appId: 'culturewallet',
        type: 'WORLD_CONTENT',
        version: 1,
        eventId,
        worldId,
        issuerAccountId,
        clientTs,
        revision,
        payload: {
            schema: 'world.content@1',
            asset: {
                filename: assetMeta.filename,
                mime_type: assetMeta.mimeType,
                size_bytes: assetMeta.sizeBytes,
                file_sha256: assetMeta.sha256
            },
            urls: {
                file_url: urls.fileUrl,
                json_file_url: urls.jsonUrl
            },
            inscription: {
                provider: 'kiloscribe',
                id: null // Placeholder for Phase 1B
            }
        }
    }
}

/**
 * Build a WORLD_SIGNAL envelope
 */
export function buildDropAnnounceEnvelope(
    worldId: string,
    issuerAccountId: string,
    drop: WorldDrop,
    revision: number = 1
): WorldEnvelope<WorldSignalPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    const clientTs = Date.now()
    const eventId = `${worldId}:signal:drop_announce:${clientTs}`

    return {
        appId: 'culturewallet',
        type: 'WORLD_SIGNAL',
        version: 1,
        eventId,
        worldId,
        issuerAccountId,
        clientTs,
        revision,
        payload: {
            schema: 'world.signal@1',
            signal_type: 'DROP_ANNOUNCE',
            target_id: drop.id,
            data: {
                name: drop.name,
                type: drop.type,
                requirements: drop.requirements
            }
        }
    }
}

/**
 * Build a WORLD_PASS envelope
 */
export function buildWorldPassEnvelope(
    worldId: string,
    issuerAccountId: string,
    passData: {
        id: string
        name: string
        description?: string
        supply: { type: 'FINITE' | 'INFINITE', cap?: number }
        imageUrl?: string
        status: 'ACTIVE' | 'DRAFT'
    },
    revision: number = 1
): WorldEnvelope<WorldPassPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    const clientTs = Date.now()
    const eventId = `${worldId}:pass:mint:${passData.id}:${clientTs}`

    return {
        appId: 'culturewallet',
        type: 'WORLD_PASS',
        version: 1,
        eventId,
        worldId,
        issuerAccountId,
        clientTs,
        revision,
        payload: {
            schema: 'world.pass@1',
            pass: {
                id: passData.id,
                name: passData.name,
                description: passData.description,
                supply: passData.supply,
                image_url: passData.imageUrl,
                status: passData.status
            }
        }
    }
}

function validateBaseInputs(worldId: string, issuerAccountId: string) {
    if (!worldId) throw new Error('World ID is required')
    if (!issuerAccountId || !issuerAccountId.match(/^0\.0\.\d+$/)) {
        throw new Error('Invalid issuer account ID format (expected 0.0.xxxxx)')
    }
}
