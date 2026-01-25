'use client'

import Link from 'next/link'
import Header from './Header'

interface ErrorFallbackProps {
    error: string
    reset?: () => void
}

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
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
                            onClick={() => reset ? reset() : window.location.reload()}
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
                            Error: {error}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Ref: {Date.now().toString(36)}</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
