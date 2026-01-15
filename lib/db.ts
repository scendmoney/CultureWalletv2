/**
 * Database Connection Pool
 * 
 * Shared Postgres pool for persisting World state and HCS receipts.
 * Usage: import { db } from '@/lib/db'
 */

import { Pool } from 'pg'

const globalForDb = global as unknown as { db: Pool }

export const db = globalForDb.db || new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true // Neon requires SSL
})

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

/**
 * Helper to run a query
 */
export async function query(text: string, params?: any[]) {
    const start = Date.now()
    const res = await db.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV === 'development') {
        console.log('executed query', { text, duration, rows: res.rowCount })
    }
    return res
}
