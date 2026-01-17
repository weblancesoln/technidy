import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { eventId } = body

        if (!eventId) {
            return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
        }

        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                paymentStatus: 'PAID'
            }
        })

        return NextResponse.json({ success: true, event })
    } catch (error) {
        console.error('Error processing event payment:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
