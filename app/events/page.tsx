'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Ticket as TicketIcon, Search, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Header from '@/components/Header'

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [category, setCategory] = useState('All')

    const isValidImageSrc = (src: string) => {
        if (!src) return false
        return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        try {
            const res = await fetch('/api/events')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredEvents = Array.isArray(events) ? events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = category === 'All' || event.category === category
        return matchesSearch && matchesCategory
    }) : []

    const categories = ['All', ...Array.from(new Set(Array.isArray(events) ? events.map(e => e.category).filter(Boolean) : []))]

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            {/* Hero Header */}
            <div className="bg-gray-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Discover Amazing <span className="text-blue-500">Tech Events</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Join the brightest minds and stay ahead of the curve with the most happening events in tech and beyond.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/events/create" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                            Host Your Own Event
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto relative cursor-pointer">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for events, cities or venues..."
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xl text-lg font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Filters and Categories */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {categories.map((cat: string) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${category === cat
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                        <Filter className="h-4 w-4" />
                        <span>Showing {filteredEvents.length} events</span>
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    {isValidImageSrc(event.image) ? (
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                            <TicketIcon className="h-16 w-16 text-blue-200" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-blue-600">
                                            {event.category || 'Event'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <div className="bg-white px-3 py-1 rounded-xl shadow-lg flex flex-col items-center">
                                            <span className="text-sm font-black text-gray-900 leading-none">
                                                {new Date(event.date).getDate()}
                                            </span>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase leading-none mt-1">
                                                {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-blue-500" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                                            <p className="text-2xl font-black text-gray-900">
                                                {event.tickets && event.tickets.length > 0
                                                    ? `₦${Math.min(...event.tickets.map((t: any) => t.price)).toLocaleString()}`
                                                    : 'Free'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                            Get Tickets
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <TicketIcon className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-800 mb-2">No events found</h2>
                        <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
