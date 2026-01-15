import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupPassesTable() {
    console.log('🔌 Connecting to Neon Database to setup `world_passes`...');

    try {
        // 1. Drop if exists (Phase 1C Dev Mode)
        await pool.query(`DROP TABLE IF EXISTS world_passes;`)
        console.log('🗑️  Dropped existing world_passes table (dev reset).')

        // 2. Create Schema
        // Adapting User Request to match API Implementation (id=passId/ULID, issuer_id, etc.)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS world_passes (
        id TEXT PRIMARY KEY, -- ULID from API
        world_id TEXT REFERENCES worlds(id),
        issuer_id TEXT, -- Matches API
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        supply_type TEXT NOT NULL CHECK (supply_type IN ('FINITE', 'INFINITE')),
        supply_cap INTEGER,
        status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'REVOKED')),
        
        event_id TEXT UNIQUE, -- Idempotency / Audit Link
        hcs_status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED
        hcs_topic_id TEXT,
        hcs_sequence BIGINT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Logic Constraint: Names must be unique per world for MVP idempotency
        CONSTRAINT unique_pass_name_per_world UNIQUE (world_id, name)
      );
    `)

        // 3. Indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_world_passes_world_id ON world_passes(world_id);`)
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_world_passes_issuer_id ON world_passes(issuer_id);`)
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_world_passes_event_id ON world_passes(event_id);`)

        console.log('✅ Created world_passes table with hardening constraints.')

    } catch (err) {
        console.error('❌ Error setting up world_passes:', err);
    } finally {
        await pool.end();
    }
}

setupPassesTable();
