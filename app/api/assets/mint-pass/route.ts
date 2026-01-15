
import { NextRequest, NextResponse } from 'next/server'
import { submitToTopic } from '@/lib/hedera/serverClient'
import { buildWorldPassEnvelope } from '@/lib/worlds/envelopeBuilder'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { ulid } from 'ulid'

/**
 * World Studio Pass Minting Endpoint (Phase 1C Stub)
 * 
 * Flow:
 * 1. Accepts Pass Details (Name, Supply, etc.)
 * 2. Builds WORLD_PASS Envelope (Canon V1)
 * 3. Hashes & Submits to HCS (using Meta topic as stream for now)
 * 4. Persists to Neon (Passes + Ledger Events)
 */
export async function POST(req: NextRequest) {
    try {
        if (process.env.HEDERA_NETWORK === 'mainnet') {
            return NextResponse.json({ error: 'Mainnet disabled' }, { status: 403 })
        }

        const body = await req.json()
        const { worldId, issuerId, pass } = body

        if (!worldId || !pass?.name) {
            return NextResponse.json({ error: 'Missing required pass data' }, { status: 400 })
        }

        console.log(`[Pass Mint] Request for '${pass.name}' in ${worldId}`)

        // 1. Authorization: Verify Issuer
        // In a real implementation we check session. For now, check if issuer is associated with world (stubbed check).
        if (issuerId !== '0.0.generic-issuer' && !issuerId.match(/^0\.0\.\d+$/)) {
            // Basic regex check for now, can query `worlds` table to verify ownership if needed.
            // For Study MVP, we assume client passed valid issuerId for the world context.
        }

        // 2. Idempotency: Check if Pass already exists (Dedupe by Name)
        const existing = await db.query(
            `SELECT * FROM world_passes WHERE world_id = $1 AND name = $2 LIMIT 1`,
            [worldId, pass.name]
        )

        if (existing.rows.length > 0) {
            console.log(`[Pass Mint] Idempotency Hit: Returning existing pass ${existing.rows[0].id}`)
            return NextResponse.json({
                success: true,
                passId: existing.rows[0].id,
                status: existing.rows[0].status,
                idempotent: true,
                eventId: existing.rows[0].event_id,
            })
        }

        // --- Build Envelope ---
        const passId = ulid() // Deterministic-ish (time ordered) generated on server
        const envelope = buildWorldPassEnvelope(
            worldId,
            issuerId || '0.0.generic-issuer',
            {
                id: passId,
                name: pass.name,
                description: pass.description,
                supply: pass.supply,
                imageUrl: pass.imageUrl,
                status: 'ACTIVE' // Auto-activate for MVP
            },
            1 // Revision 1
        )

        // --- Server-Side Hashing ---
        const canonicalString = JSON.stringify(envelope)
        const contentHash = 'sha256:' + crypto.createHash('sha256').update(canonicalString).digest('hex')

        const finalEnvelope = { ...envelope, contentHash }
        const message = JSON.stringify(finalEnvelope)
        const eventId = envelope.eventId

        // --- Submit to HCS ---
        const topicId = process.env.CW_WORLD_PASS_TOPIC_ID || process.env.CW_WORLD_META_TOPIC_ID
        if (!topicId) throw new Error('Topic ID configuration missing')

        let hcsResult = { sequenceNumber: '0', consensusTimestamp: '', transactionId: '', status: 'PENDING' }
        try {
            const result = await submitToTopic(topicId, message)
            hcsResult = {
                sequenceNumber: result.sequenceNumber?.toString() || '0',
                consensusTimestamp: result.consensusTimestamp?.toString() || new Date().toISOString(),
                transactionId: result.transactionId?.toString() || '',
                status: 'CONFIRMED'
            }
        } catch (hcsError: any) {
            console.error('[Pass Mint] HCS Submission Failed:', hcsError)
            hcsResult.status = 'FAILED'
            // We CONTINUE to persist to DB but mark as FAILED/OFFLINE so user isn't blocked, 
            // but knows sync is pending. Or we fail closed? 
            // "If HCS submit fails... Persist record with hcs_status = FAILED".
        }

        // --- Persist ---
        await db.query(`
            INSERT INTO world_passes 
            (id, world_id, issuer_id, name, description, image_url, supply_type, supply_cap, status, event_id, hcs_status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        `, [
            passId,
            worldId,
            issuerId,
            pass.name,
            pass.description || '',
            pass.imageUrl || '',
            pass.supply.type,
            pass.supply.cap || null,
            'ACTIVE',
            eventId,
            hcsResult.status
        ])

        if (hcsResult.status === 'CONFIRMED') {
            await db.query(`
                INSERT INTO world_ledger_events 
                (world_id, topic_id, sequence_number, consensus_timestamp, tx_id, event_type, content_hash)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [worldId, topicId, hcsResult.sequenceNumber, hcsResult.consensusTimestamp, hcsResult.transactionId, 'WORLD_PASS', contentHash])
        }

        // Return standardized response
        return NextResponse.json({
            success: true,
            passId,
            eventId,
            hcsSequence: hcsResult.sequenceNumber,
            hcsStatus: hcsResult.status,
            contentHash
        })

    } catch (error: any) {
        console.error('[Pass Mint] Critical Error:', error)
        // Check for Unique Constraint violations (race condition double click)
        if (error.code === '23505') { // Postgres Unique Violation
            // Fallback to fetch existing if race won by other request
            return NextResponse.json({ error: 'Pass already exists (race condition detected). Please refresh.' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
