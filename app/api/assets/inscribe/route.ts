import { NextRequest, NextResponse } from 'next/server'
import { submitToTopic } from '@/lib/hedera/serverClient'
import { getRegistryTopics } from '@/lib/hcs2/registry'
import { buildWorldContentEnvelope } from '@/lib/worlds/envelopeBuilder'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { ulid } from 'ulid'

/**
 * World Studio Asset Inscription Endpoint (Phase 1B Prep)
 * 
 * Flow:
 * 1. Accepts PRE-STAGED URLs (File + JSON)
 * 2. Builds WORLD_CONTENT Envelope (Canon V1)
 * 3. Hashes & Submits to HCS
 * 4. Persists to Neon (Assets + Ledger Events)
 */
export async function POST(req: NextRequest) {
    try {
        if (process.env.HEDERA_NETWORK === 'mainnet') {
            return NextResponse.json({ error: 'Mainnet disabled' }, { status: 403 })
        }

        const body = await req.json()
        const { worldId, issuerId, urls, meta } = body

        if (!worldId || !urls?.fileUrl || !urls?.jsonUrl) {
            return NextResponse.json({ error: 'Missing required staging data' }, { status: 400 })
        }

        console.log(`[Asset Inscribe] Processing ${meta.filename} for ${worldId}`)

        // --- Build Envelope (Canon V1) ---
        const contentId = ulid()
        const envelope = buildWorldContentEnvelope(
            worldId,
            issuerId || '0.0.generic-issuer',
            contentId,
            {
                filename: meta.filename,
                mimeType: meta.mimeType,
                sizeBytes: meta.sizeBytes
            },
            {
                fileUrl: urls.fileUrl,
                jsonUrl: urls.jsonUrl
            }
        )

        // --- Server-Side Hashing ---
        const canonicalString = JSON.stringify(envelope)
        const contentHash = 'sha256:' + crypto.createHash('sha256').update(canonicalString).digest('hex')

        const finalEnvelope = { ...envelope, contentHash }
        const message = JSON.stringify(finalEnvelope)

        // --- Submit ---
        const topicId = process.env.CW_WORLD_CONTENT_TOPIC_ID || process.env.CW_WORLD_META_TOPIC_ID
        if (!topicId) throw new Error('CW_WORLD_CONTENT_TOPIC_ID missing')

        const result = await submitToTopic(topicId, message)
        const sequenceNumber = result.sequenceNumber?.toString() || '0'
        const consensusTimestamp = result.consensusTimestamp?.toString() || new Date().toISOString()
        const txId = result.transactionId?.toString() || ''

        // --- Persist ---
        await db.query(`
            INSERT INTO world_assets 
            (id, world_id, issuer_id, asset_type, filename, mime_type, size_bytes, file_sha256)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            contentId,
            worldId,
            issuerId,
            meta.mimeType.split('/')[0] || 'unknown',
            meta.filename,
            meta.mimeType,
            meta.sizeBytes,
            'hash_staged_in_json' // In future, we verify this from the JSON
        ])

        await db.query(`
            INSERT INTO world_ledger_events 
            (world_id, topic_id, sequence_number, consensus_timestamp, tx_id, event_type, content_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [worldId, topicId, sequenceNumber, consensusTimestamp, txId, 'WORLD_CONTENT', contentHash])

        return NextResponse.json({
            success: true,
            contentId,
            topicId,
            sequenceNumber,
            contentHash
        })

    } catch (error: any) {
        console.error('[Asset Inscribe] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
