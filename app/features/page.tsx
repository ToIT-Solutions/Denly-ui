// app/(marketing)/features/page.jsx
import Footer from '@/components/Footer'
import Link from 'next/link'
import logo from '@/public/img/logo.png'
import Image from 'next/image'

export const metadata = {
    title: 'Features - Denly',
}

export default function FeaturesPage() {
    const features = [
        {
            category: 'Financial Management',
            description: 'Track rental income and keep clear visibility over property performance.',
            items: [
                {
                    title: 'Payment Tracking',
                    description: 'Track rent payments for each tenant and quickly identify overdue payments.',
                    icon: '💳'
                },
                {
                    title: 'Rent Overview',
                    description: 'View expected rent vs received payments across all your properties.',
                    icon: '📊'
                },
                {
                    title: 'Financial Reports',
                    description: 'Generate clear reports showing rental income and payment history.',
                    icon: '📈'
                }
            ]
        },
        {
            category: 'Property Management',
            description: 'Manage all your properties and tenants from a single dashboard.',
            items: [
                {
                    title: 'Property Portfolio',
                    description: 'View and manage all properties in one place with tenant occupancy insights.',
                    icon: '🏠'
                },
                {
                    title: 'Tenant Management',
                    description: 'Store tenant profiles, lease periods, contact details, and statuses.',
                    icon: '👥'
                },
                {
                    title: 'Lease Tracking',
                    description: 'Track lease start and end dates to stay ahead of renewals or terminations.',
                    icon: '📅'
                }
            ]
        },
        {
            category: 'Automation & Tools',
            description: 'Smart tools designed to simplify daily property management tasks.',
            items: [
                {
                    title: 'Activity Logs',
                    description: 'Track important system actions such as payments, updates, and user activities for transparency and auditing.',
                    icon: '📋'
                },
                {
                    title: 'Secure Access Control',
                    description: 'Role-based permissions ensure users only access features and data relevant to their responsibilities.',
                    icon: '🔐'
                },
                {
                    title: 'Document Storage',
                    description: 'Store important documents such as lease agreements, receipts, and property records securely.',
                    icon: '📁'
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6] relative">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl pt-5 mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between flex-wrap">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image src={logo} alt="denly Logo" className="w-24 sm:w-28" />
                    </Link>

                    {/* Links */}
                    <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 items-center sm:mt-0">
                        <Link href="/features" className="text-[#876D4A] hover:text-[#876D4A] transition-colors text-sm sm:text-base">Features</Link>
                        <Link href="/pricing" className="text-gray-600 text-sm sm:text-base">Pricing</Link>
                        {/* <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Login</Link> */}
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors text-sm sm:text-base">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
                <h1 className="text-4xl sm:text-5xl font-serif text-gray-800 mb-4 sm:mb-6">Everything You Need to Manage Your Properties</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Denly brings all your property management tasks into one beautiful, intuitive platform.
                    From financial tracking to tenant communication, we've got you covered.
                </p>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
                <div className="space-y-12 sm:space-y-16">
                    {features.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 lg:p-12 shadow-sm">
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-3">{category.category}</h2>
                                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {category.items.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="text-center p-4 sm:p-6">
                                        <div className="w-16 h-16 bg-[#876D4A] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
                <div className="bg-[#876D4A] rounded-3xl p-8 sm:p-12 text-white">
                    <h2 className="text-2xl sm:text-3xl font-serif mb-4">Ready to Simplify Your Property Management?</h2>
                    <p className="text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                        Join thousands of landlords who have found their peace of mind with Denly.
                    </p>
                    <Link href="/auth/signup" className="inline-flex items-center space-x-3 bg-white text-[#876D4A] px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-colors">
                        <span>Start Free Trial</span>
                        <div className="w-6 h-6 bg-[#876D4A]/20 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#876D4A] rounded-full"></div>
                        </div>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}