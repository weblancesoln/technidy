import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import PostEditor from '@/components/PostEditor'
import { prisma } from '@/lib/prisma'

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

export default async function NewPostPage() {
  const session = await getSession()

  if (!session || (session.user as any).role !== 'admin') {
    redirect('/admin/login')
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
            <a
              href="/admin"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostEditor categories={categories} />
      </main>
    </div>
  )
}

