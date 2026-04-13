"use client"
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import logo from '@/public/img/logo.png'
import { useFetchSubscriptionPlansWithFree } from '@/hooks/useSubscription'
import { usePageTitle } from '@/hooks/usePageTitle'


export default function PricingPage() {
    usePageTitle('Pricing - Denly')


    const { data: subPlan, isLoading } = useFetchSubscriptionPlansWithFree()
    // console.log(subPlan)

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6] relative">

            {isLoading ? null :
                <div>
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

                    {/* Navbar */}
                    <nav className="relative z-10 max-w-6xl pt-5 mx-auto px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center justify-between flex-wrap">
                            {/* Logo */}
                            <Link href="/" className="shrink-0">
                                <Image src={logo} alt="denly Logo" className="w-24 sm:w-28" />
                            </Link>

                            {/* Links */}
                            <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 items-center sm:mt-0">
                                <Link href="/features" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Features</Link>
                                <Link href="/pricing" className="text-[#876D4A] text-sm sm:text-base">Pricing</Link>
                                {/* <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Login</Link> */}
                                <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors text-sm sm:text-base">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Header */}
                    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-16 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-4 sm:mb-6">Simple, Fair Pricing</h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Choose the plan that fits your portfolio size.
                        </p>
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
                    <section className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0">
                            {subPlan.map((plan: any) => (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl lg:rounded-3xl border ${plan.isPopular ? 'border-[#876D4A] ring-5 ring-[#876D4A]/20' : 'border-gray-200'} p-4 sm:p-6 shadow-sm flex flex-col min-w-[290px] sm:min-w-[310px] lg:min-w-0`}
                                >
                                    {/* Labels */}
                                    {plan.isPopular && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                                        <span className="bg-[#876D4A] text-white px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                                    </div>}
                                    {plan.name === 'Free Trial' && <div className="absolute -top-2 left-4 z-10">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">14-day free trial</span>
                                    </div>}

                                    {/* Content */}
                                    <div className="text-center mb-4 sm:mb-6 grow">
                                        <h3 className="text-lg sm:text-xl font-serif text-gray-800 mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center mb-1">
                                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">${plan.priceMonthly}</span>
                                            {plan.priceMonthly !== 0 && <span className="text-gray-600 ml-1 text-sm sm:text-base font-medium">/month</span>}
                                        </div>
                                        <p className={`text-md mt-2 ${plan.priceMonthly === 0 ? 'text-green-600' : 'text-[#876D4A]'} font-bold `}>{plan.maxProperties}  {plan.maxProperties === 1 ? 'property' : 'properties'} </p>
                                        <p className={`text-md ${plan.priceMonthly === 0 ? 'text-green-600' : 'text-[#876D4A]'} font-bold mb-2`}>{plan.maxUsers}  {plan.maxUsers === 1 ? 'user' : 'users'} </p>
                                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 mt-5 font-medium">{plan.description}</p>

                                        <ul className="space-y-1 sm:space-y-2 text-left font-medium">
                                            {plan.features.map((feature: any, featureIndex: any) => (
                                                <li key={featureIndex} className="flex items-start text-xs sm:text-sm text-gray-600">
                                                    <div className={`w-3 h-3 mt-0.5 ${plan.priceMonthly === 0 ? 'bg-green-500' : 'bg-[#876D4A]'} rounded-full mr-2 flex items-center justify-center`}>
                                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                                    </div>
                                                    <span className="flex-1">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href={`/auth/signup`}
                                        // href={`/auth/signup?plan=${plan.name.toLowerCase()}`}
                                        className={`w-full text-center py-2 sm:py-3 rounded-full transition-colors mt-auto text-sm ${plan.popular
                                            ? 'bg-[#876D4A] text-white hover:bg-[#756045]'
                                            : plan.priceMonthly === 0
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'border border-[#876D4A] text-[#876D4A] hover:bg-[#876D4A] hover:text-white'
                                            }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* FAQ */}
                        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
                            <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">How does the free trial work?</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">Start with 14 days free with access to 1 property. No credit card required. Upgrade to a paid plan after your trial ends or when you are ready to upgrade.</p>
                                    </div>
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">What happens after the trial?</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">After your 14-day trial ends, you'll need to choose a paid plan to continue using Denly. Your data is preserved.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Can I upgrade later?</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">Yes! You can upgrade to any paid plan at any time. Changes take effect immediately.</p>
                                    </div>
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Is there a contract?</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">No long-term contracts. All plans are month-to-month.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </div>
            }
        </div>
    )
}