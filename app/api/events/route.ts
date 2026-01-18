import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const adminMode = searchParams.get('adminMode') === 'true'
        const creatorId = searchParams.get('creatorId')

        const events = await prisma.event.findMany({
            where: {
                ...(category && { category }),
                ...(creatorId && { creatorId }),
                ...(!adminMode ? {
                    paymentStatus: 'PAID',
                    adminApproved: true,
                    published: true
                } : {}),
            },
            include: {
                tickets: true,
                creator: adminMode ? {
                    select: { id: true, name: true, email: true }
                } : undefined,
            },
            orderBy: {
                date: 'asc',
            },
        })

        return NextResponse.json(events)
    } catch (error: any) {
        console.error('Error fetching events:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, slug, description, date, location, image, category, tickets, creatorId } = body

        // If creatorId is provided, it's a user-created event (PENDING payment and approval)
        // If not, it might be an admin-created event (we can default to PAID/APPROVED if we want, or keep same flow)
        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description,
                date: new Date(date),
                location,
                image,
                category,
                creatorId: creatorId || null,
                paymentStatus: creatorId ? 'PENDING' : 'PAID',
                adminApproved: creatorId ? false : true,
                published: creatorId ? false : true,
                tickets: {
                    create: tickets.map((ticket: any) => ({
                        name: ticket.name,
                        price: ticket.price,
                        description: ticket.description,
                        quantity: ticket.quantity,
                        available: ticket.quantity,
                    })),
                },
            },
            include: {
                tickets: true,
            },
        })

        return NextResponse.json(event)
    } catch (error: any) {
        console.error('Error creating event:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
