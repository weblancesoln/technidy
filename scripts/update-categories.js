const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Update "News" to "Tech News"
    const newsCategory = await prisma.category.findUnique({
        where: { slug: 'news' }
    })
    if (newsCategory) {
        await prisma.category.update({
            where: { id: newsCategory.id },
            data: { name: 'Tech News' }
        })
        console.log('Updated News to Tech News')
    }

    // 2. Create "Tutorials", "Innovations", "Resources" if they don't exist
    const categoriesToCreate = [
        { name: 'Tutorials', slug: 'tutorials' },
        { name: 'Innovations', slug: 'innovations' },
        { name: 'Resources', slug: 'resources' }
    ]

    for (const cat of categoriesToCreate) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: cat
        })
        console.log(`Ensured category: ${cat.name}`)
    }

    // 3. Optional: Rename "Technology" to "Tech" if desired, but user just said "tech should be added". 
    // I will keep the name "Technology" but use "Tech" as the label in the menu.
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
