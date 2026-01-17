import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import CategoryList from '@/components/CategoryList'

export default async function CategoriesPage() {
    const session = await getSession()

    if (!session || (session.user as any).role !== 'admin') {
        redirect('/admin/login')
    }

    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <CategoryList initialCategories={categories} />
                </main>
            </div>
        </div>
    )
}
