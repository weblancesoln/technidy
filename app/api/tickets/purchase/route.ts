import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { ticketId, quantity, customerName, customerEmail, userId } = body

        if (!ticketId || !quantity || !customerName || !customerEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check ticket availability
            const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
                include: { event: true }
            })

            if (!ticket) {
                throw new Error('Ticket not found')
            }

            if (ticket.available < quantity) {
                throw new Error('Not enough tickets available')
            }

            // 2. Create the order
            const totalAmount = ticket.price * quantity
            const order = await tx.order.create({
                data: {
                    ticketId,
                    userId: userId || null,
                    quantity,
                    totalAmount,
                    customerName,
                    customerEmail,
                    status: 'COMPLETED', // Simulate successful payment
                },
            })

            // 3. Update ticket availability
            await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    available: {
                        decrement: quantity,
                    },
                },
            })

            return order
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Error purchasing ticket:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
