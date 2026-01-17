'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Layout, Square, Check, X, Upload, Loader2, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export default function AdminAdvertsPage() {
    const [adverts, setAdverts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        type: 'header',
        image: '',
        link: '',
        alt: '',
        published: true
    })

    useEffect(() => {
        fetchAdverts()
    }, [])

    async function fetchAdverts() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/adverts')
            const data = await res.json()
            setAdverts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
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
        try {
            const res = await fetch('/api/admin/adverts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setIsModalOpen(false)
                setFormData({ type: 'header', image: '', link: '', alt: '', published: true })
                fetchAdverts()
            } else {
                const errorData = await res.json()
                console.error('Server error saving advert:', errorData)
                alert(`Failed to save advert: ${errorData.error || 'Unknown error'}`)
            }
        } catch (error: any) {
            console.error('Save error details:', error)
            alert('An unexpected error occurred while saving the advert: ' + (error?.message || 'Unknown error'))
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this advert?')) return
        try {
            const res = await fetch(`/api/admin/adverts/${id}`, { method: 'DELETE' })

            if (res.ok) {
                alert('Advert deleted successfully!')
                fetchAdverts()
            } else {
                const errorData = await res.json()
                console.error('Delete failed:', errorData)
                alert(`Failed to delete advert: ${errorData.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred while deleting the advert')
        }
    }

    async function togglePublished(id: string, currentStatus: boolean) {
        try {
            await fetch(`/api/admin/adverts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !currentStatus }),
            })
            fetchAdverts()
        } catch (error) {
            console.error('Toggle error:', error)
        }
    }

    const isValidImageSrc = (src: string) => {
        if (!src) return false
        return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Advert Management</h1>
                    <p className="text-gray-500">Manage your banner and sidebar advertisements.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <Plus className="h-5 w-5" />
                    New Advert
                </button>
            </div>

            {loading && !adverts.length ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {adverts.map((ad) => (
                        <div key={ad.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-300">
                            <div className={`relative ${ad.type === 'square' ? 'aspect-square' : 'aspect-[6/1]'} overflow-hidden bg-gray-50`}>
                                {isValidImageSrc(ad.image) ? (
                                    <Image src={ad.image} alt={ad.alt || ''} fill className="object-contain object-center" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Layout className="h-10 w-10 text-gray-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ad.type === 'header' ? 'bg-blue-600 text-white' : ad.type === 'footer' ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                                        }`}>
                                        {ad.type}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(ad.id)}
                                    className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Link</p>
                                    <a href={ad.link} target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                        {ad.link || 'No link set'} <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${ad.published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-xs font-bold text-gray-500">{ad.published ? 'Published' : 'Hidden'}</span>
                                    </div>
                                    <button
                                        onClick={() => togglePublished(ad.id, ad.published)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition ${ad.published ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                                            }`}
                                    >
                                        {ad.published ? 'Hide Ad' : 'Publish Ad'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && adverts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                    <Layout className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-gray-800 mb-2">No Adverts Yet</h2>
                    <p className="text-gray-500">Create your first advertisement to see it on the site.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-gray-900">New Advert</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-3 gap-4 p-1 bg-gray-50 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'header' })}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${formData.type === 'header' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                                            }`}
                                    >
                                        Header
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'footer' })}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${formData.type === 'footer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'
                                            }`}
                                    >
                                        Footer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'square' })}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${formData.type === 'square' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'
                                            }`}
                                    >
                                        Square
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Ad Image</label>
                                    {formData.image ? (
                                        <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm">
                                            <Image src={formData.image} alt="Preview" fill className="object-contain object-center" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-xl shadow-lg hover:bg-white transition"
                                            >
                                                <X className="h-4 w-4" />
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
                                            <p className="font-black text-gray-900">{uploadingImage ? 'Uploading...' : 'Upload Image'}</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Target URL (Link)</label>
                                    <input
                                        placeholder="https://example.com"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>

                                <button type="submit" disabled={!formData.image} className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition shadow-xl disabled:opacity-50">
                                    Create Advert
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
