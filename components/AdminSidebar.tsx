'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Tags,
    Users,
    Settings,
    Eye,
    LogOut,
    Calendar
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
            <div className="flex items-center justify-center h-16 bg-gray-800">
                <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-blue-500">AI</span> BLOG ADMIN
                </Link>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all group"
                >
                    <Eye className="w-5 h-5 text-gray-500 group-hover:text-green-400" />
                    <span className="font-medium">View Site</span>
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}
