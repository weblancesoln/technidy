import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const data = await request.json()
        const advert = await prisma.advert.update({
            where: { id },
            data: {
                type: data.type,
                image: data.image,
                link: data.link,
                alt: data.alt,
                published: data.published
            }
        })

        return NextResponse.json(advert)
    } catch (error) {
        console.error('Update advert error:', error)
        return NextResponse.json({ error: 'Failed to update advert' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== 'admin') {
            console.log('Delete advert: Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        console.log('Deleting advert with ID:', id)

        await prisma.advert.delete({
            where: { id }
        })

        console.log('Advert deleted successfully:', id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Delete advert error:', error)
        console.error('Error details:', error?.message, error?.code)
        return NextResponse.json({
            error: 'Failed to delete advert',
            details: error?.message
        }, { status: 500 })
    }
}
