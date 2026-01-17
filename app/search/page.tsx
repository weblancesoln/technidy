import { prisma } from '@/lib/prisma'
import { formatDate, truncate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

async function searchPosts(query: string) {
  // SQLite doesn't support case-insensitive mode, so we'll use contains
  const searchQuery = query.toLowerCase()
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ],
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  // Filter case-insensitively in JavaScript for SQLite compatibility
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery))
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const posts = query ? await searchPosts(query) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            Tech Blog
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              Found {posts.length} {posts.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
            </p>
          )}
        </div>

        {query ? (
          posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {post.category.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4">
                        {truncate(post.excerpt, 120)}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {post.author.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No posts found matching your search.</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Please enter a search query.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Tech Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

