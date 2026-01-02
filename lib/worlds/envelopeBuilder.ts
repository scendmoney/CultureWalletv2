/**
 * World Studio Envelope Builders
 * 
 * Constructs validated HCS envelopes for World Studio workflows.
 * Ensures adherence to HCS-5 standards while introducing WorldID scoping.
 */

import {
    WorldEnvelope,
    WorldMetaPayload,
    WorldContentPayload,
    WorldSignalPayload,
    WorldProfile,
    WorldDrop
} from './types'

/**
 * Build a WORLD_META envelope for creating or updating a World
 */
export function buildWorldMetaEnvelope(
    worldId: string,
    issuerAccountId: string,
    profile: WorldProfile,
    op: 'CREATE' | 'UPDATE' = 'CREATE'
): WorldEnvelope<WorldMetaPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    if (!profile.name) throw new Error('World name is required')
    if (!profile.type) throw new Error('World type is required')

    const nonce = Date.now()
    const ts = Math.floor(Date.now() / 1000)

    return {
        type: 'WORLD_META',
        worldId,
        from: issuerAccountId,
        nonce,
        ts,
        payload: {
            t: 'world.meta@1',
            op,
            profile
        }
    }
}

/**
 * Build a WORLD_CONTENT envelope for media inscription (KiloScribe pattern)
 */
export function buildWorldContentEnvelope(
    worldId: string,
    issuerAccountId: string,
    contentId: string,
    url: string,
    mimeType: string
): WorldEnvelope<WorldContentPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    if (!contentId) throw new Error('Content ID is required')
    if (!url) throw new Error('Content URL is required')

    const nonce = Date.now()
    const ts = Math.floor(Date.now() / 1000)

    return {
        type: 'WORLD_CONTENT',
        worldId,
        from: issuerAccountId,
        nonce,
        ts,
        payload: {
            t: 'world.content@1',
            content_id: contentId,
            mime_type: mimeType,
            url,
            // hash can be added here if computed
        }
    }
}

/**
 * Build a WORLD_SIGNAL envelope for Drop Announcements
 */
export function buildDropAnnounceEnvelope(
    worldId: string,
    issuerAccountId: string,
    drop: WorldDrop
): WorldEnvelope<WorldSignalPayload> {
    validateBaseInputs(worldId, issuerAccountId)

    if (!drop.id) throw new Error('Drop ID is required')

    const nonce = Date.now()
    const ts = Math.floor(Date.now() / 1000)

    return {
        type: 'WORLD_SIGNAL',
        worldId,
        from: issuerAccountId,
        nonce,
        ts,
        payload: {
            t: 'world.signal@1',
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
 * Helper: Validate common inputs
 */
function validateBaseInputs(worldId: string, issuerAccountId: string) {
    if (!worldId) throw new Error('World ID is required')
    // Basic validation using regex from Issuer Studio
    if (!issuerAccountId || !issuerAccountId.match(/^0\.0\.\d+$/)) {
        throw new Error('Invalid issuer account ID format (expected 0.0.xxxxx)')
    }
}

/**
 * Preview envelope as formatted JSON
 */
export function previewEnvelope(envelope: any): string {
    return JSON.stringify(envelope, null, 2)
}
