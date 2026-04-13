// app/error/page.tsx
'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const status = searchParams.get('status')
    const code = searchParams.get('code')
    const message = searchParams.get('message')
    const decodedMessage = message ? decodeURIComponent(message) : 'An unexpected error occurred'

    const getErrorConfig = () => {
        const statusNum = status ? parseInt(status) : 500

        if (statusNum === 0) {
            return {
                title: 'Connection Lost',
                subtitle: 'Can\'t reach our servers',
                color: 'from-orange-500 to-amber-500',
                houseColor: 'text-orange-500',
                houseIcon: (
                    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 45L50 20L80 45V75H20V45Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M35 75V55H65V75" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                        <path d="M20 45L50 20L80 45" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                    </svg>
                )
            }
        }

        if (statusNum >= 500) {
            return {
                title: 'Server Issue',
                subtitle: 'Our house is having some trouble',
                color: 'from-red-500 to-rose-500',
                houseColor: 'text-red-500',
                houseIcon: (
                    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 45L50 20L80 45V75H20V45Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M35 75V55H65V75" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M50 35V45M50 55H50.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M40 35L60 35" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                    </svg>
                )
            }
        }

        if (statusNum >= 400) {
            return {
                title: 'Page Not Found',
                subtitle: 'This property doesn\'t exist',
                color: 'from-yellow-500 to-amber-500',
                houseColor: 'text-yellow-500',
                houseIcon: (
                    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 45L50 20L80 45V75H20V45Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M35 75V55H65V75" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                        <path d="M44 44L56 56M56 44L44 56" stroke="currentColor" strokeWidth="2" />
                    </svg>
                )
            }
        }

        return {
            title: 'Oops!',
            subtitle: 'Something unexpected happened',
            color: 'from-gray-500 to-gray-600',
            houseColor: 'text-gray-500',
            houseIcon: (
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 45L50 20L80 45V75H20V45Z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M35 75V55H65V75" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="50" cy="50" r="3" fill="currentColor" />
                    <path d="M45 42L55 52M55 42L45 52" stroke="currentColor" strokeWidth="2" />
                </svg>
            )
        }
    }

    const config = getErrorConfig()

    const routing = () => {
        const statusNum = status ? parseInt(status) : 500

        if (statusNum === 0) {
            window.history.go(-2)
        } else {
            router.back()
        }
    }

    return (
        <div className="min-h-screen bg-[#876D4A] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Houses Silhouettes */}
                <div className="absolute top-10 left-10 opacity-5">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor" className="text-gray-600">
                        <path d="M20 45L50 20L80 45V75H20V45Z" fill="currentColor" />
                        <rect x="35" y="55" width="30" height="20" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 opacity-5 transform scale-150">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-gray-600">
                        <path d="M20 45L50 20L80 45V75H20V45Z" fill="currentColor" />
                        <rect x="35" y="55" width="30" height="20" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute top-1/3 right-20 opacity-5 transform rotate-45">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor" className="text-gray-600">
                        <path d="M20 45L50 20L80 45V75H20V45Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Dotted Grid Pattern */}
                <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10" preserveAspectRatio="none">
                    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-600" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ">
                    {/* Decorative Roof Element */}
                    <div className="relative h-2 bg-linear-to-r from-[#876D4A] to-[#b89a6e]">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-12 border-r-12 border-b-20 border-l-transparent border-r-transparent border-b-[#876D4A]"></div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Animated House Icon */}
                        <div className="relative flex justify-center mb-8">
                            <div className={`relative animate-float ${config.houseColor}`}>
                                {config.houseIcon}
                                {/* Window Glow Effect */}
                                <div className="absolute inset-0 bg-linear-to-r from-yellow-300 to-amber-400 rounded-full blur-xl opacity-0 animate-pulse-glow"></div>
                            </div>

                            {/* Decorative Keyhole */}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#f8f6f2] rounded-full flex items-center justify-center shadow-inner">
                                <div className="w-3 h-3 bg-[#876D4A] rounded-full"></div>
                            </div>
                        </div>

                        {/* Status Code */}
                        {status && (
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#f8f6f2] to-[#f0ede6]">
                                    <span className="text-sm font-mono text-gray-500">Error</span>
                                    <span className={`text-lg font-mono font-bold bg-linear-to-r ${config.color} bg-clip-text text-transparent`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl font-serif text-gray-900 text-center mb-2">
                            {config.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-gray-500 text-center text-sm mb-6 font-light">
                            {config.subtitle}
                        </p>

                        {/* Message Card */}
                        <div className="bg-linear-to-r from-[#f8f6f2] to-[#f0ede6] rounded-2xl p-5 mb-6 border border-[#e9e0d5]">
                            <p className="text-gray-700 text-center text-sm leading-relaxed">
                                {decodedMessage}
                            </p>
                        </div>

                        {/* Error Reference */}
                        {code && (
                            <div className="flex justify-center mb-8">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-full">
                                        Reference: {code}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* <button
                                onClick={() => window.location.reload()}
                                className="group w-full px-4 py-3 bg-linear-to-r from-[#876D4A] to-[#b89a6e] cursor-pointer text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Try Again
                            </button> */}

                            <button
                                onClick={routing}
                                className="w-full px-4 py-3 border-2 border-[#e9e0d5] text-gray-600 rounded-2xl cursor-pointer hover:bg-[#f8f6f2] hover:border-[#876D4A] transition-all duration-300 font-medium flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Go Back
                            </button>

                            <Link
                                href="/dashboard"
                                className="block w-full px-4 py-3 text-center text-[#876D4A] hover:text-[#756045] transition-colors text-sm font-medium group"
                            >
                                <span className="inline-flex items-center gap-1">
                                    Return to Dashboard
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </Link>
                        </div>


                    </div>
                </div>

                {/* Support Section with Property Theme */}
                {/* <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Need a hand?</span>
                        <a
                            href="mailto:support@denly.com"
                            className="text-[#876D4A] hover:text-[#756045] font-medium transition-colors"
                        >
                            support@denly.com
                        </a>
                    </div>
                </div> */}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 0.3; transform: scale(1.2); }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default function ErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-3 border-[#876D4A] border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-[#876D4A] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">Loading your property...</p>
                </div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}