'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, CreditCard, User, Mail, ChevronLeft, CheckCircle2, Ticket as TicketIcon } from 'lucide-react'

export default function CheckoutPage({ params }: { params: { ticketId: string } }) {
    const router = useRouter()
    const [ticket, setTicket] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        quantity: 1
    })

    const fetchTicket = useCallback(async () => {
        try {
            // We can fetch ticket info via a search or a dedicated endpoint. 
            // For now, let's assume we can get it from the event detail if we had the event ID, 
            // but here we only have ticketId. I'll search for it.
            const res = await fetch(`/api/events`) // This is inefficient but works for now. 
            // Better: Create /api/tickets/[id]
            const events = await res.json()
            let foundTicket = null
            events.forEach((event: any) => {
                const t = event.tickets.find((t: any) => t.id === params.ticketId)
                if (t) foundTicket = { ...t, eventTitle: event.title }
            })
            setTicket(foundTicket)
        } catch (error) {
            console.error('Error fetching ticket:', error)
        } finally {
            setLoading(false)
        }
    }, [params.ticketId])

    useEffect(() => {
        fetchTicket()
    }, [fetchTicket])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)

        try {
            const res = await fetch('/api/tickets/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: params.ticketId,
                    quantity: formData.quantity,
                    customerName: formData.name,
                    customerEmail: formData.email,
                }),
            })

            if (res.ok) {
                setCompleted(true)
            } else {
                const data = await res.json()
                alert(data.error || 'Something went wrong')
            }
        } catch (error) {
            console.error('Purchase error:', error)
            alert('An error occurred during purchase')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black mb-4">Ticket Not Found</h1>
                <Link href="/events" className="text-blue-600 font-bold underline">Back to Events</Link>
            </div>
        )
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
                        <p className="text-gray-500">Your ticket has been sent to <span className="font-bold text-gray-900">{formData.email}</span></p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl text-left space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</p>
                        <p className="text-sm font-black text-gray-900">{ticket.eventTitle}</p>
                        <p className="text-xs text-gray-500">{formData.quantity}x {ticket.name}</p>
                        <p className="text-lg font-black text-blue-600 pt-2 border-t border-gray-200 mt-2">₦{(ticket.price * formData.quantity).toLocaleString()}</p>
                    </div>
                    <Link href="/events" className="block w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl">
                        Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-12">
                <Link href="/events" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition">
                    <ChevronLeft className="h-5 w-5" />
                    Back
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition font-medium text-black"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            type="email"
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition font-medium text-black"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Quantity</label>
                                    <select
                                        className="block w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition font-black text-black"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <option key={v} value={v}>{v} {v === 1 ? 'Ticket' : 'Tickets'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 bg-blue-50 p-4 rounded-2xl">
                                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                                        Secure checkout. Your information is protected.
                                    </div>
                                    <button
                                        disabled={processing}
                                        type="submit"
                                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none"
                                    >
                                        {processing ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5" />
                                                Pay ₦{(ticket.price * formData.quantity).toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 text-white p-8 md:p-10 rounded-[40px] shadow-xl sticky top-24 space-y-8">
                            <h2 className="text-xl font-black border-b border-white/10 pb-6">Order Summary</h2>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <TicketIcon className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm leading-tight mb-1">{ticket.eventTitle}</h3>
                                        <p className="text-xs text-gray-400">{ticket.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10 text-sm font-bold">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Price per ticket</span>
                                        <span>₦{ticket.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Quantity</span>
                                        <span>x{formData.quantity}</span>
                                    </div>
                                    <div className="flex justify-between pt-6 border-t border-white/10 text-2xl font-black">
                                        <span>Total</span>
                                        <span className="text-blue-500">₦{(ticket.price * formData.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-3xl space-y-4">
                                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Included with your ticket:</p>
                                <ul className="text-xs text-gray-400 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        Digital admission pass
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        Event materials & resources
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
