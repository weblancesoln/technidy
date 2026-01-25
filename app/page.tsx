import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate, truncate } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'
import Hero from '@/components/Hero'
import Advert from '@/components/Advert'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
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
    take: 12,
  })
  return posts
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

async function getAdverts() {
  const adverts = await prisma.advert.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
  })
  return {
    header: adverts.find(ad => ad.type === 'header') || null,
    footer: adverts.find(ad => ad.type === 'footer') || null,
    square: adverts.find(ad => ad.type === 'square') || null
  }
}

export default async function Home() {
  try {
    const [posts, categories, ads] = await Promise.all([
      getPosts(),
      getCategories(),
      getAdverts()
    ])

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Top Banner Advert */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <Advert type="header" ad={ads.header} />
        </div>

        {/* Hero Section */}
        <div className="py-6">
          <Hero />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Recent Posts & Categories */}
            <div className="lg:col-span-3">

              {/* Posts Grid */}
              <div className="mb-8" id="latest-posts">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-10 bg-blue-600 rounded-full"></span>
                  Latest Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                    >
                      {post.featuredImage && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="text-xs font-bold text-white bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-wider">
                              {post.category.name}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="text-xs text-gray-400 mb-3 font-medium">
                          {formatDate(post.createdAt)} • By {post.author.name}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition duration-300 leading-tight">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                            {truncate(post.excerpt, 150)}
                          </p>
                        )}
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-blue-600 font-bold text-sm">
                          Read Article
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {posts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 text-lg">No stories found yet. Come back soon!</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Sponsored</h2>
                <Advert type="square" ad={ads.square} className="mb-8" />

                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                  <h3 className="text-xl font-bold mb-2">Subscribe</h3>
                  <p className="text-blue-100 text-sm mb-6">Get the latest AI insights delivered straight to your inbox.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:bg-white/20 placeholder:text-blue-200"
                    />
                    <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Bottom Horizontal Advert */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Advert type="footer" ad={ads.footer} />
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-20 pb-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand Section */}
              <div>
                <Link href="/" className="text-3xl font-black text-white tracking-tight mb-6 block">
                  Tech<span className="text-blue-500">nidy</span>
                </Link>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Navigating the frontier of artificial intelligence. We decode complex breakthroughs into actionable insights for the modern visionary.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 transition group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84a4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 transition group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 transition group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li><Link href="/about" className="hover:text-blue-500 transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-500 transition">Contact Us</Link></li>
                  <li><Link href="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Top Categories */}
              <div>
                <h4 className="text-lg font-bold mb-6">Top Categories</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  {categories.slice(0, 4).map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/category/${cat.slug}`} className="hover:text-blue-500 transition">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@technidy.com
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lagos, Nigeria
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
              <p>&copy; {new Date().getFullYear()} Technidy. All rights reserved. Created with passion for the future.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error("Home page data fetching error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              We&apos;re having trouble connecting to our services. Please try refreshing the page or check back later.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => typeof window !== 'undefined' && window.location.reload()}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Retry Connection
              </button>
              <Link
                href="/admin/login"
                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Go to Admin Login
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50 text-left">
              <p className="text-[10px] text-gray-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                Error: {error instanceof Error ? error.message : String(error)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Ref: {Date.now().toString(36)}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

