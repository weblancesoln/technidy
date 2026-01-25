'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, CreditCard, ChevronLeft, CheckCircle2, Copy, Check, Building2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function EventPaymentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'bank'>('card')
    const [copied, setCopied] = useState(false)
    const [copiedBank, setCopiedBank] = useState(false)

    const fetchEvent = useCallback(async () => {
        try {
            const res = await fetch(`/api/events/${params.id}`)
            const data = await res.json()
            setEvent(data)
        } catch (error) {
            console.error('Error fetching event:', error)
        } finally {
            setLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        fetchEvent()
    }, [fetchEvent])

    async function handlePay() {
        setProcessing(true)
        try {
            const res = await fetch('/api/events/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: params.id }),
            })

            if (res.ok) {
                setCompleted(true)
            } else {
                alert('Payment failed')
            }
        } catch (error) {
            console.error('Payment error:', error)
            alert('An error occurred during payment')
        } finally {
            setProcessing(false)
        }
    }

    const walletAddress = "T9yD...[CRYPTO_WALLET_ADDRESS]"
    const bankDetails = {
        name: "FIRST BANK",
        accountNumber: "3123456789",
        accountName: "TECHNIDY LIMITED"
    }

    async function copyToClipboard(text: string, isBank: boolean = false) {
        try {
            await navigator.clipboard.writeText(text)
            if (isBank) {
                setCopiedBank(true)
                setTimeout(() => setCopiedBank(false), 2000)
            } else {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black mb-4">Event Not Found</h1>
                <Link href="/events" className="text-blue-600 font-bold underline">Back to Events</Link>
            </div>
        )
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center space-y-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
                        <p className="text-gray-500">
                            Thank you for hosting with us! Your event <strong>&quot;{event.title}&quot;</strong> has been received.
                        </p>
                        <div className="bg-yellow-50 p-6 rounded-3xl text-left border border-yellow-100">
                            <p className="text-sm font-black text-yellow-800 mb-1">What&apos;s Next?</p>
                            <p className="text-xs text-yellow-700 leading-relaxed">
                                Our admin team will review your event details. Once approved, it will be visible on the public events page and you&apos;ll be able to track ticket sales.
                            </p>
                        </div>
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
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-20">
                <Link href="/events/create" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-12 transition">
                    <ChevronLeft className="h-5 w-5" />
                    Cancel
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-black text-gray-900 mb-8">Secure Payment</h1>

                            <div className="space-y-6">
                                <div className="p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
                                    <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-black text-blue-900">One-time Creation Fee</p>
                                        <p className="text-xs text-blue-700 opacity-80 mt-1">
                                            This fee covers event hosting, ticket management, and our platform&apos;s administrative services.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Payment Method</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-4 rounded-2xl border-2 transition font-black text-sm ${paymentMethod === 'card'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            Card
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('crypto')}
                                            className={`p-4 rounded-2xl border-2 transition font-black text-sm ${paymentMethod === 'crypto'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            Crypto
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('bank')}
                                            className={`p-4 rounded-2xl border-2 transition font-black text-sm ${paymentMethod === 'bank'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            Bank
                                        </button>
                                    </div>
                                </div>

                                {paymentMethod === 'crypto' && (
                                    <div className="p-6 bg-gray-50 rounded-3xl space-y-4 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Send USDT (TRC20) to:</p>
                                            <button
                                                onClick={() => copyToClipboard(walletAddress)}
                                                className="flex items-center justify-between w-full gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group text-left"
                                            >
                                                <code className="text-xs font-mono break-all text-gray-900">{walletAddress}</code>
                                                {copied ? (
                                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span>Network: TRON (TRC20)</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            After sending the amount, click the button below to confirm your payment. Our team will verify the transaction.
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === 'bank' && (
                                    <div className="p-6 bg-gray-50 rounded-3xl space-y-4 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                                <p className="text-sm font-black text-gray-900">{bankDetails.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                                                <button
                                                    onClick={() => copyToClipboard(bankDetails.accountNumber, true)}
                                                    className="flex items-center justify-between w-full gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group text-left"
                                                >
                                                    <span className="text-sm font-mono font-bold text-gray-900 tracking-wider transition-all">{bankDetails.accountNumber}</span>
                                                    {copiedBank ? (
                                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    ) : (
                                                        <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                                    )}
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Name</p>
                                                <p className="text-xs font-black text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-tight">
                                                    {bankDetails.accountName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 border-t border-gray-200/50 pt-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span>Manual verification within 5-10 mins</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePay}
                                    disabled={processing}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                                >
                                    {processing ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <CreditCard className="h-5 w-5" />
                                            {paymentMethod === 'card' ? 'Pay ₦5,000 Now' : 'I Have Paid (Confirm)'}
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-medium">
                                    By clicking pay, you agree to our terms of service and event hosting policies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-900 text-white p-10 rounded-[40px] shadow-xl space-y-8">
                        <h2 className="text-xl font-black border-b border-white/10 pb-6">Event Details</h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Title</p>
                                <p className="text-lg font-bold">{event.title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Category</p>
                                    <p className="font-bold">{event.category}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center text-2xl font-black">
                                    <span className="text-gray-400 text-sm">Amount Due</span>
                                    <span className="text-blue-500">₦5,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
