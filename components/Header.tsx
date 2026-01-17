'use client'

import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link href="/" className="text-3xl font-black text-gray-900 tracking-tight">
                        Tech<span className="text-blue-600">nidy</span>
                    </Link>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none">
                            <SearchBar />
                        </div>
                        <nav className="hidden xl:flex space-x-6">
                            <Link href="/category/technology" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Tech</Link>
                            <Link href="/category/news" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Tech News</Link>
                            <Link href="/category/tutorials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Tutorials</Link>
                            <Link href="/category/innovations" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Innovations</Link>
                            <Link href="/category/resources" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Resources</Link>
                            <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Events</Link>
                        </nav>
                        <Link
                            href="https://wa.me/2348103551543"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition whitespace-nowrap"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
