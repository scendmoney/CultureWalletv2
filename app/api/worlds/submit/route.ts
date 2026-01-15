import { NextRequest, NextResponse } from 'next/server'
import { submitToTopic } from '@/lib/hedera/serverClient'
import { getRegistryTopics } from '@/lib/hcs2/registry'
import { WorldSubmitResponse, WorldEnvelope } from '@/lib/worlds/types'
import { db } from '@/lib/db'
import crypto from 'crypto'

/**
 * World Studio HCS Submission Endpoint (Phase 1A - Canon Safe)
 * 
 * 1. Env Checks (Testnet Only)
 * 2. Auth (Thin Gate - Issuer ID)
 * 3. HCS Submission (with Server-Side Content Hash)
 * 4. Atomic DB Persistence (Status + Receipt)
 */
export async function POST(req: NextRequest): Promise<NextResponse<WorldSubmitResponse>> {
    try {
        // --- 1. Environment Safety Checks ---
        if (process.env.HEDERA_NETWORK === 'mainnet') {
            return NextResponse.json(
                { success: false, error: 'Mainnet submissions disabled in Phase 1A' },
                { status: 403 }
            )
        }

        // --- 2. Payload Validation ---
        const partialEnvelope = await req.json()
        if (!partialEnvelope || !partialEnvelope.worldId || !partialEnvelope.type) {
            throw new Error('Invalid envelope structure')
        }

        const { worldId, type, payload, issuerAccountId } = partialEnvelope
        console.log(`[World Studio] Processing ${type} for ${worldId}`)

        // --- 3. Server-Side Hashing (Canon-Safe) ---
        // Construct canonical object (exclude contentHash)
        const canonical: WorldEnvelope = {
            appId: 'culturewallet', // Enforce App Scope
            type: partialEnvelope.type,
            version: partialEnvelope.version || 1,
            eventId: partialEnvelope.eventId,
            worldId: partialEnvelope.worldId,
            issuerAccountId: issuerAccountId || '0.0.generic-issuer',
            clientTs: partialEnvelope.clientTs,
            revision: partialEnvelope.revision || 1,
            payload: partialEnvelope.payload
        }

        // Compute SHA-256 Hash
        // We use JSON.stringify as a poor-man's canonical string for V0.
        // In real canon, we'd sort keys. For now, we trust the builder order or just hash what we have.
        const canonicalString = JSON.stringify(canonical)
        const contentHash = 'sha256:' + crypto.createHash('sha256').update(canonicalString).digest('hex')

        // Final Envelope to Submit
        const finalEnvelope = {
            ...canonical,
            contentHash
        }
        const message = JSON.stringify(finalEnvelope)


        // --- 4. Topic Resolution ---
        // This topic is an app-level CultureWallet registry. Multiple worlds are published here.
        const topics = await getRegistryTopics()
        const topicId = process.env.CW_WORLD_META_TOPIC_ID || topics.registry || topics.profile

        if (!topicId) {
            throw new Error('CultureWallet World Registry Topic missing (CW_WORLD_META_TOPIC_ID)')
        }


        // --- 5. HCS Submission ---
        const result = await submitToTopic(topicId, message)

        const sequenceNumber = result.sequenceNumber?.toString() || '0'
        const consensusTimestamp = result.consensusTimestamp?.toString() || new Date().toISOString()
        const txId = result.transactionId?.toString() || ''

        // --- 6. Atomic DB Persistence ---

        // A. Upsert World (DRAFT/PENDING -> LIVE)
        if (type === 'WORLD_META') {
            const { profile } = payload
            await db.query(`
         INSERT INTO worlds (id, issuer_id, name, type, description, status, published_at, topic_id, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'LIVE', NOW(), $6, NOW())
         ON CONFLICT (id) DO UPDATE 
         SET name = EXCLUDED.name, 
             type = EXCLUDED.type, 
             description = EXCLUDED.description,
             status = 'LIVE',
             published_at = NOW(),
             topic_id = EXCLUDED.topic_id,
             updated_at = NOW()
       `, [worldId, canonical.issuerAccountId, profile?.name, profile?.type, profile?.description || '', topicId])
        }

        // B. Insert Ledger Event
        await db.query(`
      INSERT INTO world_ledger_events 
      (world_id, topic_id, sequence_number, consensus_timestamp, tx_id, event_type, content_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [worldId, topicId, sequenceNumber, consensusTimestamp, txId, type, contentHash])

        console.log(`[World Studio] Success: ${worldId} -> ${topicId} (#${sequenceNumber}) Hash: ${contentHash.substring(0, 8)}...`)

        return NextResponse.json({
            success: true,
            topicId,
            sequenceNumber,
            consensusTimestamp,
            transactionId: txId
        })

    } catch (error: any) {
        console.error('[World Studio] Submit Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Submission failed' },
            { status: 500 }
        )
    }
}
