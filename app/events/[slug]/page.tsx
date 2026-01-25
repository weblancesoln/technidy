'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Ticket as TicketIcon, Clock, Share2, ShieldCheck, ChevronLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function EventDetailPage({ params }: { params: { slug: string } }) {
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<any>(null)

    const isValidImageSrc = (src: string) => {
        if (!src) return false
        return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')
    }

    const fetchEvent = useCallback(async () => {
        try {
            const res = await fetch(`/api/events/${params.slug}`)
            const data = await res.json()
            setEvent(data)
        } catch (error) {
            console.error('Error fetching event:', error)
        } finally {
            setLoading(false)
        }
    }, [params.slug])

    useEffect(() => {
        fetchEvent()
    }, [fetchEvent])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!event || event.error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Event Not Found</h1>
                <p className="text-gray-500 mb-8">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/events" className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                    Back to Events
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/events" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition">
                        <ChevronLeft className="h-5 w-5" />
                        Back to Discovery
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Event Info */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Image & Header */}
                        <div className="space-y-8">
                            <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl">
                                {isValidImageSrc(event.image) ? (
                                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                        <TicketIcon className="h-24 w-24 text-blue-300" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
                                        {event.category || 'Tech Event'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="p-2 bg-blue-50 rounded-xl">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                                            <p className="text-sm font-black text-gray-900">{new Date(event.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="p-2 bg-blue-50 rounded-xl">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
                                            <p className="text-sm font-black text-gray-900">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm grow md:grow-0">
                                        <div className="p-2 bg-blue-50 rounded-xl">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-black text-gray-900 line-clamp-1">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                            <h2 className="text-3xl font-black text-gray-900">About This Event</h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-lg">
                                {event.description.split('\n').map((para: string, i: number) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tickets */}
                    <div className="space-y-8">
                        <div className="sticky top-24 bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900">Tickets</h2>
                                <ShieldCheck className="h-6 w-6 text-green-500" />
                            </div>

                            <div className="space-y-4">
                                {event.tickets.map((ticket: any) => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`w-full p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 ${selectedTicket?.id === ticket.id
                                            ? 'border-blue-600 bg-blue-50/50'
                                            : 'border-gray-50 bg-gray-50/30 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black text-gray-900">{ticket.name}</span>
                                            <span className="text-xl font-black text-blue-600">₦{ticket.price.toLocaleString()}</span>
                                        </div>
                                        {ticket.description && (
                                            <p className="text-xs text-gray-500 font-medium">{ticket.description}</p>
                                        )}
                                        <div className="mt-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span className={ticket.available > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {ticket.available > 10 ? 'Available' : ticket.available > 0 ? `${ticket.available} Refill left` : 'Sold Out'}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6">
                                <Link
                                    href={selectedTicket ? `/checkout/${selectedTicket.id}` : '#'}
                                    className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all shadow-xl ${selectedTicket
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {selectedTicket ? 'Purchase Tickets' : 'Select a Ticket'}
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                                <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest">
                                    Secure Payment Powered by AI Pay
                                </p>
                            </div>
                        </div>

                        {/* Event Host Info */}
                        <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-sm">
                            <h3 className="text-lg font-black mb-4">Event Organizer</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center font-black text-xl">
                                    {event.title.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black">{event.title} Team</p>
                                    <p className="text-xs text-gray-400">Verified Organizer</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition">
                                Contact Organizer
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
