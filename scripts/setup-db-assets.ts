/**
 * Database Setup Script (Assets Phase)
 * 
 * Initializes the world_assets table for Phase 1B.
 * Run via: npx tsx scripts/setup-db-assets.ts
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

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

async function setupAssetsTable() {
    console.log('🚀 Initializing World Assets Table...')

    try {
        await pool.query(`DROP TABLE IF EXISTS world_assets;`)

        await pool.query(`
      CREATE TABLE IF NOT EXISTS world_assets (
        id TEXT PRIMARY KEY,
        world_id TEXT REFERENCES worlds(id),
        issuer_id TEXT NOT NULL,
        asset_type TEXT NOT NULL,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes BIGINT,
        file_sha256 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `)

        console.log('✅ world_assets table created!')
    } catch (error) {
        console.error('❌ Setup failed:', error)
        process.exit(1)
    } finally {
        await pool.end()
    }
}

setupAssetsTable()
