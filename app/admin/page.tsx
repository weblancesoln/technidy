import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminPostsList from '@/components/AdminPostsList'
import AdminSidebar from '@/components/AdminSidebar'
import { FileText, Tags, Users, CheckCircle } from 'lucide-react'

async function getStats() {
  const [postCount, categoryCount, userCount, publishedCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.post.count({ where: { published: true } })
  ])

  return [
    { name: 'Total Posts', value: postCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Published', value: publishedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Categories', value: categoryCount, icon: Tags, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Admin Users', value: userCount, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]
}

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      author: { select: { name: true } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session || (session.user as any).role !== 'admin') {
    redirect('/admin/login')
  }

  const [stats, posts] = await Promise.all([getStats(), getPosts()])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-sm font-bold text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {session.user?.name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Action */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            <Link
              href="/admin/posts/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <span className="text-xl">+</span> Create New Post
            </Link>
          </div>

          <AdminPostsList initialPosts={posts} />
        </main>
      </div>
    </div>
  )
}

