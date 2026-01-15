
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Ticket, CheckCircle, Shield } from 'lucide-react'

interface PassManagerProps {
    worldId: string
    issuerId: string | null
}

interface Pass {
    id: string
    name: string
    status: string
}

export function PassManager({ worldId, issuerId }: PassManagerProps) {
    const [isMinting, setIsMinting] = useState(false)
    const [passes, setPasses] = useState<Pass[]>([])

    // Form State
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [supplyType, setSupplyType] = useState<'FINITE' | 'INFINITE'>('INFINITE')
    const [supplyCap, setSupplyCap] = useState('')
    const [imageUrl, setImageUrl] = useState('') // Simple URL input for MVP logic, usually file upload

    const handleMint = async () => {
        if (!name) return
        setIsMinting(true)

        try {
            const res = await fetch('/api/assets/mint-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    worldId,
                    issuerId,
                    pass: {
                        name,
                        description,
                        imageUrl,
                        supply: {
                            type: supplyType,
                            cap: supplyType === 'FINITE' ? parseInt(supplyCap) : undefined
                        }
                    }
                })
            })

            const data = await res.json()

            if (data.success) {
                setPasses(prev => [...prev, { id: data.passId, name, status: 'ACTIVE' }])
                // Reset form
                setName('')
                setDescription('')
                setSupplyCap('')
                setImageUrl('')
            } else {
                alert('Mint failed: ' + data.error)
            }
        } catch (e: any) {
            alert('Mint error: ' + e.message)
        } finally {
            setIsMinting(false)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-indigo-500" />
                        Create & Mint Pass
                    </CardTitle>
                    <CardDescription>
                        Issue a new Access Pass or Membership for your World.
                        <br />
                        Note: This creates a World State entitlement record. Tokenization happens later.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Pass Name</Label>
                        <Input
                            placeholder="e.g. Early Access VIP"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="What does this pass grant?"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Supply Type</Label>
                            <Select value={supplyType} onValueChange={(v: any) => setSupplyType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INFINITE">Infinite (Open Edition)</SelectItem>
                                    <SelectItem value="FINITE">Finite (Capped)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {supplyType === 'FINITE' && (
                            <div className="grid gap-2">
                                <Label>Max Supply (Cap)</Label>
                                <Input
                                    type="number"
                                    placeholder="100"
                                    value={supplyCap}
                                    onChange={e => setSupplyCap(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Image URL (Optional)</Label>
                        <Input
                            placeholder="https://..."
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleMint}
                        disabled={!name || isMinting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isMinting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting to World State...
                            </>
                        ) : (
                            <>
                                Mint Pass (Preview)
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {passes.length > 0 && (
                    <h3 className="text-sm font-medium text-gray-400">Active Passes ({passes.length})</h3>
                )}

                {passes.map(pass => (
                    <Card key={pass.id} className="bg-gray-900 border border-indigo-500/30 text-gray-100">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-medium">{pass.name}</CardTitle>
                                <Shield className="h-4 w-4 text-green-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-400 font-medium">Active on World State</span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono break-all">{pass.id}</div>
                        </CardContent>
                    </Card>
                ))}

                {passes.length === 0 && (
                    <div className="border border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-500">
                        <Ticket className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No passes minted yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
