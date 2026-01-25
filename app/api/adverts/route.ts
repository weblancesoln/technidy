import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const adverts = await prisma.advert.findMany({
            where: { published: true },
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(adverts)
    } catch (error) {
        console.error('Public fetch adverts error:', error)
        return NextResponse.json({ error: 'Failed to fetch adverts' }, { status: 500 })
    }
}
