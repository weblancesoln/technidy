import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import CreateEventForm from '@/components/CreateEventForm'
import Header from '@/components/Header'

export default async function CreateEventPage() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login') // Assuming this is also the user login
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Header />

            <div className="bg-gray-900 text-white py-24 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                        Host Your <span className="text-blue-500">Tech Event</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Share your knowledge, build your community, and make an impact. Create your event landing page and start selling tickets in minutes.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="bg-white p-12 md:p-16 rounded-[48px] shadow-2xl border border-gray-100">
                    <CreateEventForm userId={(session.user as any).id} />
                </div>
            </main>
        </div>
    )
}
