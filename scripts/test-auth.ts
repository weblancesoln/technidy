import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@blog.com' }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:', user.email)
    console.log('   Name:', user.name)
    console.log('   Role:', user.role)

    const passwordMatch = await bcrypt.compare('admin123', user.password)
    console.log('✅ Password verification:', passwordMatch ? 'PASSED' : 'FAILED')

    if (!passwordMatch) {
      console.log('⚠️  Password mismatch. Re-hashing password...')
      const newHash = await bcrypt.hash('admin123', 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash }
      })
      console.log('✅ Password updated')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()

