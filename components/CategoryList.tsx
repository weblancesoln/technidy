'use client'

import { useState } from 'react'
import { Plus, Trash2, Tag, Edit2, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
    _count: {
        posts: number
    }
}

export default function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState(initialCategories)
    const [newName, setNewName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            })

            if (response.ok) {
                const newCategory = await response.json()
                setCategories([...categories, { ...newCategory, _count: { posts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
                setNewName('')
                router.refresh()
            } else {
                alert('Failed to create category')
            }
        } catch (error) {
            console.error('Error creating category:', error)
            alert('An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (category: Category) => {
        setEditingId(category.id)
        setEditName(category.name)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditName('')
    }

    const handleUpdate = async (id: string) => {
        if (!editName.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim() }),
            })

            if (response.ok) {
                const updatedCategory = await response.json()
                setCategories(categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c))
                setEditingId(null)
                router.refresh()
            } else {
                alert('Failed to update category')
            }
        } catch (error) {
            console.error('Error updating category:', error)
            alert('An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete the category but not the posts (they will need a new category).')) {
            return
        }

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setCategories(categories.filter((c) => c.id !== id))
                router.refresh()
            } else {
                alert('Failed to delete category')
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    return (
        <div className="space-y-8">
            {/* Create New Category */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Create New Category
                </h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Category Name (e.g. Artificial Intelligence)"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition shadow-lg shadow-blue-200"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>

            {/* Category List Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-gray-900">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Posts</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Tag className="w-4 h-4 text-blue-600" />
                                        </div>
                                        {editingId === category.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="px-2 py-1 border border-blue-500 rounded focus:outline-none text-black ring-2 ring-blue-200"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-bold text-gray-900">{category.name}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === category.id ? (
                                        <span className="italic text-gray-400">Updating...</span>
                                    ) : (
                                        category.slug
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded-md">{category._count.posts} posts</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-2">
                                        {editingId === category.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdate(category.id)}
                                                    className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition"
                                                    title="Save"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition"
                                                    title="Cancel"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
