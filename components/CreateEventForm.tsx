'use client'

import { useState } from 'react'
import { Plus, Trash2, Calendar, MapPin, Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CreateEventFormProps {
    userId: string
}

export default function CreateEventForm({ userId }: CreateEventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        date: '',
        location: '',
        image: '',
        category: 'Tech',
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            })

            if (res.ok) {
                const data = await res.json()
                setFormData({ ...formData, image: data.url })
            } else {
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('An error occurred while uploading the image')
        } finally {
            setUploadingImage(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, creatorId: userId }),
            })

            if (res.ok) {
                const event = await res.json()
                // Redirect to payment page
                router.push(`/events/payment/${event.id}`)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to create event')
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('An error occurred while saving the event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Basic Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-gray-900 border-b pb-4">Basic Information</h2>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Event Title</label>
                        <input
                            required
                            placeholder="e.g. AI Innovation Summit 2026"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                            value={formData.title}
                            onChange={(e) => setFormData({
                                ...formData,
                                title: e.target.value,
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ /g, '-')
                            })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Event Slug (URL)</label>
                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-6 py-4 rounded-2xl">
                            <span className="font-medium whitespace-nowrap">/events/</span>
                            <input
                                required
                                className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold text-blue-600"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Tell people what your event is about..."
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-medium text-black"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Logistics */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-gray-900 border-b pb-4">Logistics</h2>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Date & Time</label>
                        <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="datetime-local"
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                placeholder="Physical address or Online Link"
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Cover Image</label>
                        <div className="relative group">
                            {isValidImageSrc(formData.image) ? (
                                <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm">
                                    <Image
                                        src={formData.image}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-xl shadow-lg hover:bg-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-video w-full rounded-[32px] border-4 border-dashed border-gray-100 bg-gray-50 hover:bg-gray-100/50 hover:border-blue-200 transition-all cursor-pointer group">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        {uploadingImage ? (
                                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-gray-900">
                                            {uploadingImage ? 'Uploading image...' : 'Upload Cover Image'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">Recommended: 1200 x 630px</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Tech</option>
                            <option>Innovations</option>
                            <option>Tutorials</option>
                            <option>Resources</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tickets */}
            <div className="pt-12 border-t">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Ticket Tiers</h2>
                    <button
                        type="button"
                        onClick={addTicketType}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-200 transition"
                    >
                        <Plus className="h-4 w-4" /> Add Tier
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.tickets.map((ticket, index) => (
                        <div key={index} className="p-8 bg-gray-50 rounded-[32px] relative group border-2 border-transparent hover:border-blue-100 transition shadow-sm">
                            {formData.tickets.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTicketType(index)}
                                    className="absolute top-6 right-6 p-2 bg-white text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tier Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Early Bird"
                                        className="w-full px-6 py-3 rounded-xl bg-white border-none font-bold text-black"
                                        value={ticket.name}
                                        onChange={e => updateTicket(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (₦)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-6 py-3 rounded-xl bg-white border-none font-bold text-black"
                                            value={ticket.price}
                                            onChange={e => updateTicket(index, 'price', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-6 py-3 rounded-xl bg-white border-none font-bold text-black"
                                            value={ticket.quantity}
                                            onChange={e => updateTicket(index, 'quantity', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Included Benefits</label>
                                    <input
                                        placeholder="e.g. Lunch, Swag Bag..."
                                        className="w-full px-6 py-3 rounded-xl bg-white border-none text-sm text-black"
                                        value={ticket.description}
                                        onChange={e => updateTicket(index, 'description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-12">
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition shadow-2xl flex items-center justify-center gap-4 text-xl"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                        'Save & Proceed to Payment'
                    )}
                </button>
                <p className="text-center text-gray-400 text-sm mt-6 font-medium">
                    Note: A one-time creation fee of <span className="text-gray-900 font-bold">₦5,000</span> will be required.
                </p>
            </div>
        </form>
    )
}
