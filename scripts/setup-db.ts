/**
 * Database Setup Script (Neon Compatible)
 * 
 * Initializes the Postgres schema for Worlds Studio.
 * FIX: Explicitly loads .env.local and uses direct Pool connection
 * to avoid localhost defaults.
 * 
 * Run via: npx tsx scripts/setup-db.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import { Pool } from 'pg'

// 1. Force-load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

// 2. Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL missing — check .env.local')
  process.exit(1)
}

try {
  const host = new URL(process.env.DATABASE_URL).host
  console.log('Using DB host:', host)
} catch (e) {
  console.warn('Could not parse DATABASE_URL hostname')
}

// 3. Instantiate Pool directly (No localhost fallback)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true // Neon usually requires SSL
})

async function setupDatabase() {
  console.log('🚀 Initializing Worlds Studio Database (Neon Schema)...')

  try {
    // 1. Worlds Table
    console.log('Creating table: worlds...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS worlds (
        id TEXT PRIMARY KEY,
        issuer_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK (status IN ('DRAFT', 'LIVE', 'PENDING')) NOT NULL DEFAULT 'DRAFT',
        topic_id TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `)

    // 2. Ledger Events Table
    console.log('Creating table: world_ledger_events...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS world_ledger_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        world_id TEXT REFERENCES worlds(id),
        event_type TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        sequence_number BIGINT,
        consensus_timestamp TEXT,
        tx_id TEXT,
        content_hash TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `)

    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupDatabase()
