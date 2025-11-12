"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'

export default function BillingPage() {
    usePageTitle('Billing - Denly')
    const currentPlan = {
        name: 'Professional',
        price: '$49',
        period: 'month',
        features: [
            'Up to 50 properties',
            'Unlimited tenants',
            'Advanced reporting',
            'Priority support',
            'Custom branding'
        ],
        status: 'active',
        nextBilling: 'March 15, 2024'
    }

    const plans = [
        {
            name: 'Starter',
            price: '$19',
            period: 'month',
            description: 'Perfect for small portfolios',
            features: [
                'Up to 10 properties',
                'Basic reporting',
                'Email support',
                'Payment tracking',
                'Tenant management'
            ],
            popular: false
        },
        {
            name: 'Professional',
            price: '$49',
            period: 'month',
            description: 'Ideal for growing businesses',
            features: [
                'Up to 50 properties',
                'Advanced reporting',
                'Priority support',
                'Custom branding',
                'API access',
                'Bulk operations'
            ],
            popular: true
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: 'month',
            description: 'For large property managers',
            features: [
                'Unlimited properties',
                'Custom reporting',
                '24/7 phone support',
                'White-label solution',
                'Dedicated account manager',
                'Advanced analytics'
            ],
            popular: false
        }
    ]

    const billingHistory = [
        { id: 1, date: 'Feb 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-001' },
        { id: 2, date: 'Jan 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-002' },
        { id: 3, date: 'Dec 15, 2023', amount: '$49.00', status: 'Paid', invoice: 'INV-003' },
        { id: 4, date: 'Nov 15, 2023', amount: '$49.00', status: 'Paid', invoice: 'INV-004' },
    ]

    const paymentMethod = {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa',
        expiry: '12/25'
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Billing & Subscription</h1>
                        <p className="text-gray-600 text-sm">Manage your subscription and payment methods</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Plan & Billing Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Plan Card */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-2">Current Plan</h2>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl font-bold text-gray-900">{currentPlan.name}</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                {currentPlan.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-0 text-right">
                                        <div className="text-2xl font-bold text-gray-900">{currentPlan.price}
                                            <span className="text-base text-gray-600">/{currentPlan.period}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">Next billing: {currentPlan.nextBilling}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Plan Features</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {currentPlan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-xs">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex space-x-3">
                                    <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium">
                                        Cancel Subscription
                                    </button>
                                    <button className="px-3 py-2 bg-[#876D4A] text-white rounded-lg hover:bg-[#756045] transition-colors text-xs font-medium">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <h2 className="font-medium text-gray-900 mb-4">Payment Method</h2>

                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                                            <span className="text-gray-600 text-xs font-medium">VISA</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">•••• {paymentMethod.last4}</p>
                                            <p className="text-xs text-gray-600">Expires {paymentMethod.expiry}</p>
                                        </div>
                                    </div>
                                    <button className="text-[#876D4A] hover:text-[#756045] transition-colors text-xs font-medium">
                                        Edit
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-700 text-xs">
                                        + Add Payment Method
                                    </button>
                                </div>
                            </div>

                            {/* Billing History */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <h2 className="font-medium text-gray-900 mb-4">Billing History</h2>

                                <div className="space-y-3">
                                    {billingHistory.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{invoice.date}</p>
                                                <p className="text-xs text-gray-600">{invoice.invoice}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900 text-sm">{invoice.amount}</p>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs">
                                    View Full Billing History
                                </button>
                            </div>
                        </div>

                        {/* Available Plans */}
                        <div className="space-y-4">
                            <h2 className="font-medium text-gray-900 mb-3">Available Plans</h2>

                            {plans.map((plan, index) => (
                                <div key={index} className={`bg-white rounded-xl p-4 border-2 ${plan.popular ? 'border-[#876D4A]' : 'border-gray-200'} shadow-sm relative`}>
                                    {plan.popular && (
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-[#876D4A] text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-4">
                                        <h3 className="font-medium text-gray-900 text-sm mb-1">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center space-x-1">
                                            <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-gray-600 text-sm">/{plan.period}</span>
                                        </div>
                                        <p className="text-gray-600 text-xs mt-1">{plan.description}</p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center space-x-2">
                                                <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 text-xs">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className={`w-full py-2 rounded-lg transition-colors text-xs font-medium ${plan.popular
                                        ? 'bg-[#876D4A] text-white hover:bg-[#756045]'
                                        : 'border border-[#876D4A] text-[#876D4A] hover:bg-[#876D4A] hover:text-white'
                                        }`}>
                                        {plan.popular ? 'Current Plan' : 'Upgrade to ' + plan.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <h2 className="font-medium text-gray-900 mb-4">Usage Statistics</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">8</div>
                                <div className="text-xs text-gray-600">Properties Used</div>
                                <div className="text-xs text-gray-500">of 50 available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">24</div>
                                <div className="text-xs text-gray-600">Active Tenants</div>
                                <div className="text-xs text-gray-500">unlimited</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">156</div>
                                <div className="text-xs text-gray-600">Payments Processed</div>
                                <div className="text-xs text-gray-500">this month</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">42%</div>
                                <div className="text-xs text-gray-600">Storage Used</div>
                                <div className="text-xs text-gray-500">of 10GB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}