import { NextRequest, NextResponse } from 'next/server'
import { submitToTopic } from '@/lib/hedera/serverClient'
import { getRegistryTopics } from '@/lib/hcs2/registry'
import { WorldSubmitResponse } from '@/lib/worlds/types'
import { db } from '@/lib/db'

/**
 * World Studio HCS Submission Endpoint (Phase 1A)
 * 
 * 1. Checks Auth (Thin Gate)
 * 2. Persists DRAFT to Postgres
 * 3. Submits to HCS
 * 4. Stores Receipt in Postgres
 * 5. Returns Explorer Link
 */
export async function POST(req: NextRequest): Promise<NextResponse<WorldSubmitResponse>> {
    try {
        const envelope = await req.json()

        // --- 1. Basic Validation & Auth (Thin Gate) ---
        // In Phase 1A, we just check if the envelope looks sane.
        // Real auth comes later with Magic Link session checks.
        if (!envelope || !envelope.worldId || !envelope.type) {
            throw new Error('Invalid envelope structure')
        }

        const { worldId, type, payload } = envelope
        console.log(`[World Studio] Processing ${type} for ${worldId}`)

        // --- 2. Resolve Topic ---
        const topics = await getRegistryTopics()
        let topicId: string

        switch (type) {
            case 'WORLD_META':
                topicId = topics.registry || topics.profile
                break
            case 'WORLD_CONTENT':
                topicId = topics.content || topics.registry
                break
            case 'WORLD_SIGNAL':
            case 'WORLD_MEMBERSHIP':
                topicId = topics.recognition || topics.registry
                break
            default:
                throw new Error('Unsupported topic type')
        }

        if (!topicId) throw new Error('Topic not configured in .env')

        // --- 3. Persistence: Draft State ---
        // If it's a new world, ensure it exists in DB
        if (type === 'WORLD_META') {
            const { profile } = payload
            await db.query(`
        INSERT INTO worlds (id, name, type, description, status, updated_at)
        VALUES ($1, $2, $3, $4, 'PENDING', NOW())
        ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name, 
            type = EXCLUDED.type, 
            description = EXCLUDED.description,
            status = 'PENDING',
            updated_at = NOW()
      `, [worldId, profile.name, profile.type, profile.description || ''])
        }

        // --- 4. HCS Submission ---
        const message = JSON.stringify(envelope)
        const result = await submitToTopic(topicId, message)

        // --- 5. Persistence: Receipt ---
        const sequenceNumber = result.sequenceNumber?.toString() || '0'
        const consensusTimestamp = result.consensusTimestamp?.toString() || new Date().toISOString()
        const txId = result.transactionId?.toString() || ''

        // Record the event
        await db.query(`
      INSERT INTO world_ledger_events 
      (world_id, topic_id, sequence_number, consensus_timestamp, tx_id, event_type)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [worldId, topicId, sequenceNumber, consensusTimestamp, txId, type])

        // Update World Status to LIVE if Meta
        if (type === 'WORLD_META') {
            await db.query(`
        UPDATE worlds 
        SET status = 'LIVE', 
            topic_id = $1, 
            published_at = NOW()
        WHERE id = $2
      `, [topicId, worldId])
        }

        console.log(`[World Studio] Success: ${worldId} -> ${topicId} (#${sequenceNumber})`)

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
