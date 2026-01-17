import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create default categories
  const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'News', slug: 'news' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Business', slug: 'business' },
  ]

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    console.log('Created category:', created.name)
  }

  console.log('Seed completed!')
  console.log('\nDefault login credentials:')
  console.log('Email: admin@blog.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

