const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const events = await prisma.event.findMany({
            include: {
                tickets: true,
                creator: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })
        console.log('Success:', events.length, 'events found')
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
