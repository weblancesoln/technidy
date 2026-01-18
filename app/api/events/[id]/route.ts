import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findFirst({
            where: {
                OR: [
                    { id: params.id },
                    { slug: params.id }
                ]
            },
            include: {
                tickets: true,
            },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { title, slug, description, date, location, image, category, published, adminApproved, paymentStatus, tickets } = body

        const eventId = params.id

        // Find the event first to get its ID if slug was passed
        const existingEvent = await prisma.event.findFirst({
            where: {
                OR: [
                    { id: eventId },
                    { slug: eventId }
                ]
            },
            include: { tickets: true }
        })

        if (!existingEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        const actualEventId = existingEvent.id

        // Update event fields
        const updatedEvent = await prisma.$transaction(async (tx) => {
            const updateData: any = {}
            if (title !== undefined) updateData.title = title
            if (slug !== undefined) updateData.slug = slug
            if (description !== undefined) updateData.description = description
            if (date !== undefined) updateData.date = new Date(date)
            if (location !== undefined) updateData.location = location
            if (image !== undefined) updateData.image = image
            if (category !== undefined) updateData.category = category
            if (published !== undefined) updateData.published = published
            if (adminApproved !== undefined) updateData.adminApproved = adminApproved
            if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus

            if (Object.keys(updateData).length > 0) {
                await tx.event.update({
                    where: { id: actualEventId },
                    data: updateData,
                })
            }

            if (tickets && Array.isArray(tickets)) {
                // Get existing ticket IDs
                const existingTicketIds = existingEvent.tickets.map(t => t.id)
                const incomingTicketIds = tickets.filter(t => t.id).map(t => t.id)

                // Delete tickets that are NOT in the incoming list
                const ticketsToDelete = existingTicketIds.filter(id => !incomingTicketIds.includes(id))
                if (ticketsToDelete.length > 0) {
                    await tx.ticket.deleteMany({
                        where: { id: { in: ticketsToDelete } }
                    })
                }

                // Update or Create tickets
                for (const ticket of tickets) {
                    if (ticket.id) {
                        // Update existing ticket
                        await tx.ticket.update({
                            where: { id: ticket.id },
                            data: {
                                name: ticket.name,
                                price: ticket.price,
                                description: ticket.description,
                                quantity: ticket.quantity,
                                available: ticket.available !== undefined ? ticket.available : ticket.quantity, // Default to quantity if not provided
                            }
                        })
                    } else {
                        // Create new ticket
                        await tx.ticket.create({
                            data: {
                                eventId: actualEventId,
                                name: ticket.name,
                                price: ticket.price,
                                description: ticket.description || '',
                                quantity: ticket.quantity,
                                available: ticket.quantity,
                            }
                        })
                    }
                }
            }

            return tx.event.findUnique({
                where: { id: actualEventId },
                include: { tickets: true }
            })
        })

        return NextResponse.json(updatedEvent)
    } catch (error: any) {
        console.error('Error in PATCH /api/events/[id]:', error)
        return NextResponse.json({
            error: 'Failed to update event',
            details: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.event.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
