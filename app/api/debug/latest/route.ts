import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const res = await db.query(`
      SELECT * FROM world_ledger_events 
      ORDER BY created_at DESC 
      LIMIT 1
    `)
        return NextResponse.json(res.rows[0] || { message: 'No events found' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
