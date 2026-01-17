import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adverts = await prisma.advert.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(adverts)
    } catch (error) {
        console.error('Fetch adverts error:', error)
        return NextResponse.json({ error: 'Failed to fetch adverts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const advert = await prisma.advert.create({
            data: {
                type: data.type,
                image: data.image,
                link: data.link,
                alt: data.alt,
                published: data.published ?? true
            }
        })

        return NextResponse.json(advert)
    } catch (error: any) {
        console.error('Create advert error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        return NextResponse.json({
            error: 'Failed to create advert',
            details: error.message
        }, { status: 500 })
    }
}
