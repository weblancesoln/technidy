'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Eye, Ticket as TicketIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        date: '',
        location: '',
        image: '',
        category: 'Tech',
        published: false,
        adminApproved: false,
        paymentStatus: 'PAID',
        tickets: [
            { name: 'Regular', price: 0, quantity: 100, description: '' }
        ]
    })

    const isValidImageSrc = (src: string) => {
        if (!src) return false
        return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')
    }

    const addTicketType = () => {
        setFormData({
            ...formData,
            tickets: [...formData.tickets, { name: '', price: 0, quantity: 0, description: '' }]
        })
    }

    const removeTicketType = (index: number) => {
        const newTickets = formData.tickets.filter((_, i) => i !== index)
        setFormData({ ...formData, tickets: newTickets })
    }

    const updateTicket = (index: number, field: string, value: any) => {
        const newTickets = [...formData.tickets]
        newTickets[index] = { ...newTickets[index], [field]: value }
        setFormData({ ...formData, tickets: newTickets })
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/events?adminMode=true')
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || data.details || 'Failed to fetch events')
            }
            const data = await res.json()
            setEvents(Array.isArray(data) ? data : [])
        } catch (err: any) {
            console.error('Fetch error:', err)
            setError(err.message)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const method = editingEvent ? 'PATCH' : 'POST'
        const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setIsModalOpen(false)
                setEditingEvent(null)
                fetchEvents()
            } else {
                const data = await res.json()
                alert('Error updating event: ' + (data.error || 'Unknown error') + (data.details ? '\nDetails: ' + data.details : ''))
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('An error occurred while saving the event')
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            await fetch(`/api/events/${id}`, { method: 'DELETE' })
            fetchEvents()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    const handleEdit = (event: any) => {
        setEditingEvent(event)
        setFormData({
            title: event.title,
            slug: event.slug,
            description: event.description,
            date: new Date(event.date).toISOString().slice(0, 16),
            location: event.location,
            image: event.image || '',
            category: event.category || 'Tech',
            published: event.published,
            adminApproved: event.adminApproved,
            paymentStatus: event.paymentStatus,
            tickets: event.tickets
        })
        setIsModalOpen(true)
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Events Management</h1>
                    <p className="text-gray-500">Create and manage your tech events and ticket sales.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingEvent(null)
                        setFormData({
                            title: '', slug: '', description: '', date: '', location: '',
                            image: '', category: 'Tech', published: false,
                            adminApproved: true, paymentStatus: 'PAID',
                            tickets: [{ name: 'Regular', price: 0, quantity: 100, description: '' }]
                        })
                        setIsModalOpen(true)
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <Plus className="h-5 w-5" />
                    Create Event
                </button>
            </div>

            {/* Loading & Error States */}
            {loading && !events.length && (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-black">Error loading events</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                    <button onClick={fetchEvents} className="ml-auto bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Retry</button>
                </div>
            )}

            {/* Events Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Event</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Creator</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Payment</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {Array.isArray(events) && events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                            {isValidImageSrc(event.image) ? (
                                                <Image src={event.image} alt={event.title} fill className="object-cover" />
                                            ) : (
                                                <Calendar className="h-6 w-6 text-blue-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{event.title}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(event.date).toLocaleDateString()}
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <MapPin className="h-3 w-3" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs">
                                        <p className="font-bold text-gray-900">{event.creator?.name || 'Admin'}</p>
                                        <p className="text-gray-400">{event.creator?.email || '-'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.paymentStatus === 'PAID' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {event.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`px-3 py-1 rounded-full text-center text-[10px] font-black uppercase tracking-widest ${event.adminApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {event.adminApproved ? 'Approved' : 'Pending'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-center text-[10px] font-black uppercase tracking-widest ${event.published ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {event.published ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {!event.adminApproved && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`/api/events/${event.id}`, {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ adminApproved: true, published: true })
                                                        });
                                                        if (res.ok) {
                                                            fetchEvents();
                                                        } else {
                                                            const data = await res.json();
                                                            alert('Approval failed: ' + (data.error || 'Unknown error') + (data.details ? '\nDetails: ' + data.details : ''));
                                                        }
                                                    } catch (err) {
                                                        alert('An error occurred during approval');
                                                    }
                                                }}
                                                className="px-3 py-1 bg-green-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-green-700 transition"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <Link href={`/events/${event.slug}`} target="_blank" className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => handleEdit(event)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-500 transition">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && events.length === 0 && !error && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">
                                    No events found. Create your first event!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center bg-gray-50 -m-10 p-10 mb-8 border-b border-gray-100">
                                <h2 className="text-3xl font-black text-gray-900">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">Close</button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Title</label>
                                        <input
                                            required
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Slug</label>
                                        <input
                                            required
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-medium text-black"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Date & Time</label>
                                        <input
                                            required
                                            type="datetime-local"
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location</label>
                                        <input
                                            required
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URL</label>
                                        <input
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-6 pt-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="published"
                                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={formData.published}
                                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                            />
                                            <label htmlFor="published" className="text-sm font-bold text-gray-700">Published</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="adminApproved"
                                                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                checked={formData.adminApproved}
                                                onChange={(e) => setFormData({ ...formData, adminApproved: e.target.checked })}
                                            />
                                            <label htmlFor="adminApproved" className="text-sm font-bold text-gray-700">Admin Approved</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label htmlFor="paymentStatus" className="text-xs font-black uppercase tracking-widest text-gray-400">Payment:</label>
                                            <select
                                                id="paymentStatus"
                                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                                                value={formData.paymentStatus}
                                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                            >
                                                <option value="PAID">PAID</option>
                                                <option value="PENDING">PENDING</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Types Section */}
                                <div className="md:col-span-2 pt-8 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black">Ticket Configuration</h3>
                                        <button
                                            type="button"
                                            onClick={addTicketType}
                                            className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Plus className="h-3 w-3" /> Add Ticket Type
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.tickets.map((ticket, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl relative group">
                                                {formData.tickets.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTicketType(index)}
                                                        className="absolute -top-2 -right-2 h-6 w-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                )}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                                                    <input
                                                        required
                                                        className="w-full px-4 py-2 rounded-xl bg-white border-none text-sm font-bold text-black"
                                                        value={ticket.name}
                                                        placeholder="e.g. Regular"
                                                        onChange={e => updateTicket(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (₦)</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full px-4 py-2 rounded-xl bg-white border-none text-sm font-bold text-black"
                                                        value={ticket.price}
                                                        onChange={e => updateTicket(index, 'price', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full px-4 py-2 rounded-xl bg-white border-none text-sm font-bold text-black"
                                                        value={ticket.quantity}
                                                        onChange={e => updateTicket(index, 'quantity', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                                                    <input
                                                        className="w-full px-4 py-2 rounded-xl bg-white border-none text-sm text-black"
                                                        value={ticket.description}
                                                        placeholder="Optional details"
                                                        onChange={e => updateTicket(index, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-8">
                                    <button type="submit" className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl">
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
