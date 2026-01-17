import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import UserList from '@/components/UserList'

export default async function UsersPage() {
    const session = await getSession()

    if (!session || (session.user as any).role !== 'admin') {
        redirect('/admin/login')
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    })

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900 text-gray-900">User Management</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <UserList initialUsers={users} />
                </main>
            </div>
        </div>
    )
}
