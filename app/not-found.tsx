import Link from 'next/link'
import Header from '@/components/Header'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-12">
          {/* Visual Element */}
          <div className="relative">
            <div className="text-[150px] md:text-[200px] font-black text-blue-600/5 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 shadow-2xl space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Lost in Space?
                </h1>
                <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed">
                  The page you&apos;re looking for has vanished into the digital void. Let&apos;s get you back on track.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <Link
              href="/"
              className="group flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-left"
            >
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Home className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Return Home</p>
                <p className="text-xs text-gray-400">Back to the front page</p>
              </div>
            </Link>

            <Link
              href="/search"
              className="group flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-left"
            >
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Search className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Search</p>
                <p className="text-xs text-gray-400">Find what you need</p>
              </div>
            </Link>
          </div>

          <div className="pt-8">
            <Link
              href="javascript:history.back()"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-xs">
        <p>&copy; {new Date().getFullYear()} Technidy. All rights reserved.</p>
      </footer>
    </div>
  )
}

