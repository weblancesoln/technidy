import Image from 'next/image'

interface AdvertProps {
    type: 'header' | 'footer' | 'square'
    className?: string
    ad?: {
        image: string
        link?: string | null
        alt?: string | null
    } | null
}

export default function Advert({ type, className = '', ad }: AdvertProps) {
    const isValidImageSrc = (src: string | undefined | null) => {
        if (!src) return false
        return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')
    }

    if (!ad || !isValidImageSrc(ad.image)) {
        return (
            <div className={`relative overflow-hidden rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center group hover:border-blue-200 transition-all ${className} ${type === 'square' ? 'aspect-square' : 'aspect-[6/1]'}`}>
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6 text-gray-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-black text-gray-400">Place your {type} ad here</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Contact: ads@technidy.com</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm transition hover:shadow-xl ${className}`}>
            <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/90 px-2 py-1 rounded-lg backdrop-blur-md shadow-sm">
                    Sponsored
                </span>
            </div>
            <div className={`relative ${type === 'square' ? 'aspect-square' : 'aspect-[6/1]'} w-full`}>
                <Image
                    src={ad.image}
                    alt={ad.alt || 'Advertisement'}
                    fill
                    className={type === 'square' ? 'object-contain object-center' : 'object-cover object-center'}
                />
            </div>
            {ad.link && (
                <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20"
                    aria-label="Visit advertiser"
                />
            )}
        </div>
    )
}
