// app/(marketing)/pricing/page.jsx
import Link from 'next/link'
import Image from 'next/image'
import logoWhite from '@/public/img/logoWhite.png'
import Footer from '@/components/Footer'
import logo from '@/public/img/logo.png'

export const metadata = {
    title: 'Pricing - Denly',
}

export default function PricingPage() {
    const plans = [
        {
            name: 'Free Trial',
            price: '$0',
            properties: '3 properties',
            description: 'Try all features for 7 days',
            features: [
                'Up to 3 properties',
                'Full feature access',
                'Payment tracking',
                'Tenant management',
                'Basic reporting',
                '7-day free trial',
                'No credit card required'
            ],
            cta: 'Start Free Trial',
            popular: false,
            trial: true,
            trialDays: 7
        },
        {
            name: 'Starter',
            price: '$15',
            properties: '5 properties',
            description: 'Perfect for getting started',
            features: [
                'Up to 5 properties',
                'Payment tracking & reminders',
                'Basic financial reports',
                'Email support',
                'Automated late fees',
                'Document storage'
            ],
            cta: 'Get Started',
            popular: false,
            trial: false
        },
        {
            name: 'Professional',
            price: '$30',
            properties: '10 properties',
            description: 'Ideal for growing portfolios',
            features: [
                'Up to 10 properties',
                'Advanced financial tracking',
                'Automated late fees',
                'Priority email support',
                'Maintenance tracking',
                'Custom reports',
                'API access'
            ],
            cta: 'Get Started',
            popular: true,
            trial: false
        },
        {
            name: 'Business',
            price: '$60',
            properties: '20 properties',
            description: 'For established portfolios',
            features: [
                'Up to 20 properties',
                'Advanced analytics',
                'Phone & email support',
                'API access',
                'White-label reports',
                'Bulk operations',
                'Custom integrations'
            ],
            cta: 'Get Started',
            popular: false,
            trial: false
        },
        {
            name: 'Enterprise',
            price: '$99',
            properties: 'Unlimited properties',
            description: 'For serious property investors',
            features: [
                'Unlimited properties',
                'All Business features',
                'Dedicated account manager',
                'Custom integrations',
                'SLA guarantee',
                'Training & onboarding',
                'Priority support'
            ],
            cta: 'Contact Sales',
            popular: false,
            trial: false
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src={logo} alt='denly Logo' className='w-24 sm:w-29' />
                    </Link>
                    <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
                        <Link href="/features" className="hidden sm:block text-gray-600 hover:text-[#876D4A] transition-colors text-sm">Features</Link>
                        <Link href="/pricing" className="text-[#876D4A] transition-colors text-sm">Pricing</Link>
                        <Link href="/auth/login" className="hidden sm:block text-gray-600 hover:text-[#876D4A] transition-colors text-sm">Login</Link>
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-4 py-2 sm:px-6 sm:py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-20 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-4 sm:mb-6">Simple, Fair Pricing</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Start with a free 7-day trial. Choose the plan that fits your portfolio size.
                </p>

                {/* Trial Notice */}
                <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>No credit card required for free trial</span>
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                {/* Mobile Plan Selector */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Scroll horizontally to view all plans →
                        </p>
                    </div>
                </div>

                <div className="flex lg:grid lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto pb-6 lg:pb-0 scrollbar-hide">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative min-w-[280px] sm:min-w-[300px] lg:min-w-0 bg-white rounded-2xl lg:rounded-3xl border ${plan.popular ? 'border-[#876D4A] ring-2 ring-[#876D4A]/20' : 'border-gray-200'
                                } p-4 sm:p-6 shadow-sm flex flex-col shrink-0 lg:shrink`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                                    <span className="bg-[#876D4A] text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {plan.trial && (
                                <div className="absolute -top-1 left-4 z-10">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {plan.trialDays}-day free trial
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-4 sm:mb-6 grow">
                                <h3 className="text-lg sm:text-xl font-serif text-gray-800 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center mb-1">
                                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.price !== '$0' && <span className="text-gray-600 ml-1 text-sm sm:text-base">/month</span>}
                                </div>
                                <p className="text-xs sm:text-sm text-[#876D4A] font-medium mb-2">{plan.properties}</p>
                                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{plan.description}</p>

                                <ul className="space-y-1 sm:space-y-2 text-left">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start text-xs sm:text-sm text-gray-600">
                                            <div className={`w-3 h-3 mt-0.5 ${plan.price === '$0' ? 'bg-green-500' : 'bg-[#876D4A]'} rounded-full mr-2 shrink-0 flex items-center justify-center`}>
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                            </div>
                                            <span className="flex-1">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}
                                className={`w-full text-center py-2 sm:py-3 rounded-full transition-colors mt-auto text-sm ${plan.popular
                                    ? 'bg-[#876D4A] text-white hover:bg-[#756045]'
                                    : plan.price === '$0'
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'border border-[#876D4A] text-[#876D4A] hover:bg-[#876D4A] hover:text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">How does the free trial work?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Start with 7 days free with access to 3 properties. No credit card required. Upgrade to a paid plan after your trial ends.</p>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">What happens after the trial?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">After your 7-day trial ends, you'll need to choose a paid plan to continue using Denly. Your data is preserved.</p>
                            </div>
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Can I upgrade later?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Yes! You can upgrade to any paid plan at any time. Changes take effect immediately.</p>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Is there a contract?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">No long-term contracts. All plans are month-to-month. Cancel anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}