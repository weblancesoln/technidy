import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import AdminPostsList from '@/components/AdminPostsList'
import AdminSidebar from '@/components/AdminSidebar'

async function getPosts() {
    return await prisma.post.findMany({
        include: {
            author: { select: { name: true } },
            category: true,
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function AdminPostsPage() {
    const session = await getSession()

    if (!session || (session.user as any).role !== 'admin') {
        redirect('/admin/login')
    }

    const posts = await getPosts()

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <AdminSidebar />
            <div className="flex-1">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Posts Management</h1>
                        <a
                            href="/admin/posts/new"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            + Create New Post
                        </a>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminPostsList initialPosts={posts} />
                </main>
            </div>
        </div>
    )
}
