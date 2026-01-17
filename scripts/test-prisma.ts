import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing prisma connection...')
        const events = await prisma.event.findMany({
            where: {},
            include: {
                tickets: true,
            },
            orderBy: {
                date: 'asc',
            },
        })
        console.log('Events found:', events.length)
        console.log('First event:', JSON.stringify(events[0], null, 2))
    } catch (error) {
        console.error('Prisma Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
