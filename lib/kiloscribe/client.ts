/**
 * KiloScribe Client Stub
 * 
 * Interface for KiloScribe Inscription API.
 * Phase 1B: Mock implementation only.
 */

export interface InscriptionRequest {
    fileUrl: string
    jsonUrl: string
    topicId?: string
}

export interface InscriptionResponse {
    status: 'PENDING' | 'SUCCESS' | 'FAILED'
    txCallback?: string
    inscriptionId?: string
}

export class KiloScribeClient {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    /**
     * Start an inscription (Stub)
     */
    async startInscription(req: InscriptionRequest): Promise<InscriptionResponse> {
        console.log('[KiloScribe Stub] Starting Inscription:', req)

        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            status: 'PENDING',
            txCallback: '0xmock_transaction_bytes_to_sign',
            inscriptionId: `insc_${Date.now()}`
        }
    }

    /**
     * Retrieve status (Stub)
     */
    async retrieveInscription(id: string): Promise<InscriptionResponse> {
        console.log('[KiloScribe Stub] Checking Status:', id)
        return { status: 'SUCCESS' }
    }
}

export const kiloscribe = new KiloScribeClient(process.env.KILOSCRIBE_API_KEY || 'mock_key')
