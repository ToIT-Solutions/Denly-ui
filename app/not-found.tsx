// app/not-found.jsx
"use client"
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/img/logo.png'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    usePageTitle('404 - Page Not Found')
    const router = useRouter()

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6] flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* 404 Content */}
            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Animated 404 Number */}
                <div className="relative mb-8">
                    <div className="text-[120px] sm:text-[160px] lg:text-[200px] font-serif text-[#876D4A]/10 font-bold leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl sm:text-7xl lg:text-8xl font-serif text-[#876D4A] font-bold">404</div>
                    </div>
                </div>

                {/* Message */}
                <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm mb-8">
                    <div className="w-20 h-20 bg-[#876D4A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-12 h-12 bg-[#876D4A]/20 rounded-full flex items-center justify-center">
                            <div className="text-2xl">🏠</div>
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        What you're looking for seems to have been moved or doesn't exist.
                    </p>

                    {/* Quick Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                        <button
                            onClick={() => router.back()}
                            className="bg-[#876D4A] text-white px-6 py-3 rounded-full hover:bg-[#756045] transition-colors font-medium cursor-pointer"
                        >
                            ← Go Back
                        </button>
                        <Link
                            href="/"
                            className="border border-[#876D4A] text-[#876D4A] px-6 py-3 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors font-medium"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Think this is an error?{' '}
                        <Link href="/contact" className="text-[#876D4A] hover:underline font-medium">
                            Contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}