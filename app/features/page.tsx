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
            description: 'Complete control over your rental finances with clear insights and automated tracking.',
            items: [
                {
                    title: 'Payment Tracking',
                    description: 'Automatically track rent payments, send reminders, and identify late payments instantly.',
                    icon: '💳'
                },
                {
                    title: 'Expense Management',
                    description: 'Categorize and track property expenses, maintenance costs, and operational spending.',
                    icon: '📊'
                },
                {
                    title: 'Financial Reports',
                    description: 'Generate detailed profit/loss statements, cash flow analysis, and tax-ready reports.',
                    icon: '📈'
                }
            ]
        },
        {
            category: 'Property Management',
            description: 'Centralized management for all your properties with real-time overview and insights.',
            items: [
                {
                    title: 'Portfolio Dashboard',
                    description: 'See all your properties at a glance with occupancy rates and financial performance.',
                    icon: '🏠'
                },
                {
                    title: 'Tenant Management',
                    description: 'Store tenant information, lease details, and communication history in one place.',
                    icon: '👥'
                },
                {
                    title: 'Maintenance Tracking',
                    description: 'Log maintenance requests, track repair status, and manage service providers.',
                    icon: '🔧'
                }
            ]
        },
        {
            category: 'Automation & Tools',
            description: 'Smart automation that saves you time and reduces manual work.',
            items: [
                {
                    title: 'Auto Reminders',
                    description: 'Automated payment reminders to tenants and expense alerts to you.',
                    icon: '⏰'
                },
                {
                    title: 'Late Fee Calculation',
                    description: 'Automatic late fee calculations and tracking based on your rules.',
                    icon: '💰'
                },
                {
                    title: 'Document Storage',
                    description: 'Secure storage for leases, invoices, receipts, and important documents.',
                    icon: '📁'
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src={logo} alt='denly Logo' className='w-29' />

                    </Link>
                    <div className="flex items-center space-x-8">
                        <Link href="/features" className="text-[#876D4A] transition-colors">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors">Pricing</Link>
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors">Login</Link>
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-6 py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
                <h1 className="text-5xl font-serif text-gray-800 mb-6">Everything You Need to Manage Your Properties</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Denly brings all your property management tasks into one beautiful, intuitive platform.
                    From financial tracking to tenant communication, we've got you covered.
                </p>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
                <div className="space-y-16">
                    {features.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-gray-800 mb-4">{category.category}</h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                {category.items.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="text-center p-6">
                                        <div className="w-16 h-16 bg-[#876D4A] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
                <div className="bg-[#876D4A] rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-serif mb-4">Ready to Simplify Your Property Management?</h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of landlords who have found their peace of mind with Denly.
                    </p>
                    <Link href="/auth/signup" className="inline-flex items-center space-x-3 bg-white text-[#876D4A] px-10 py-4 rounded-full hover:bg-gray-100 transition-colors">
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