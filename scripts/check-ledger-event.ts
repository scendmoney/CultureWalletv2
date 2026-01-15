
import { db } from './lib/db'

async function checkLatestEvent() {
    try {
        const res = await db.query(`
      SELECT * FROM world_ledger_events 
      ORDER BY created_at DESC 
      LIMIT 1
    `)

        if (res.rows.length === 0) {
            console.log('No events found.')
        } else {
            console.log('✅ Latest Ledger Event:')
            console.log(res.rows[0])
        }
    } catch (e) {
        console.error(e)
    } finally {
        await db.end()
    }
}

checkLatestEvent()
