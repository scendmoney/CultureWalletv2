import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, targetId } = body
    
    if (!sessionId || !targetId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: sessionId and targetId' },
        { status: 400 }
      )
    }
    
    console.log('[API /trust/revoke] Revoking trust:', { sessionId, targetId })
    
    // Submit trust revocation event to HCS via the existing HCS submit endpoint
    const envelope = {
      type: 'TRUST_REVOKE',
      from: sessionId,
      nonce: Date.now(),
      ts: Math.floor(Date.now() / 1000),
      payload: {
        actor: sessionId,
        target: targetId,
        status: 'revoked'
      }
    }
    
    console.log('[API /trust/revoke] Submitting envelope to HCS:', envelope)
    
    const hcsResponse = await fetch(`${request.nextUrl.origin}/api/hcs/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope)
    })
    
    const hcsResult = await hcsResponse.json()
    
    console.log('[API /trust/revoke] HCS response:', hcsResult)
    
    if (!hcsResult.ok) {
      throw new Error(hcsResult.error || 'Failed to submit trust revocation to HCS')
    }
    
    const hcsRef = `hcs://${hcsResult.sequenceNumber}/${hcsResult.topicId}/${hcsResult.sequenceNumber}`
    console.log('[API /trust/revoke] Trust revoked successfully:', hcsRef)
    
    return NextResponse.json({
      success: true,
      hcsRef,
      topicId: hcsResult.topicId,
      sequenceNumber: hcsResult.sequenceNumber,
      message: 'Trust revoked successfully'
    })
  } catch (error) {
    console.error('[API /trust/revoke] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke trust'
      },
      { status: 500 }
    )
  }
}
