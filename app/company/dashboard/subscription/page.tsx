// app/app/[companyId]/billing/page.jsx
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function BillingPage() {
    const currentPlan = {
        name: 'Professional',
        price: '$29',
        properties: '10 properties',
        status: 'Active',
        nextBilling: '2024-02-15',
        features: ['Up to 10 properties', 'Advanced financial tracking', 'Automated reports', 'Priority support']
    }

    const usage = {
        propertiesUsed: '8 / 10',
        storageUsed: '45%',
        apiCalls: '1,234 / 5,000'
    }

    const billingHistory = [
        { id: 1, date: '2024-01-15', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
        { id: 2, date: '2023-12-15', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
        { id: 3, date: '2023-11-15', amount: '$29.00', status: 'Paid', invoice: 'INV-003' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Billing & Subscription</h1>
                        <p className="text-gray-600">Manage your subscription and billing preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Plan */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Current Plan Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="font-serif text-xl text-gray-900 mb-1">Current Plan</h2>
                                        <p className="text-gray-600 text-sm">Active subscription details</p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {currentPlan.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-2xl font-serif text-[#876D4A] mb-2">{currentPlan.name}</h3>
                                        <div className="flex items-baseline space-x-1 mb-4">
                                            <span className="text-3xl font-bold text-gray-900">{currentPlan.price}</span>
                                            <span className="text-gray-600">/month</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{currentPlan.properties}</p>
                                        <div className="space-y-2">
                                            {currentPlan.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    <div className="w-4 h-4 bg-[#876D4A] rounded-full mr-3 flex items-center justify-center">
                                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                                    </div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Next billing date</p>
                                            <p className="font-medium text-gray-900">{currentPlan.nextBilling}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Payment method</p>
                                            <p className="font-medium text-gray-900">•••• 4242 (Visa)</p>
                                        </div>
                                        <div className="pt-4 space-y-3">
                                            <button className="w-full bg-[#876D4A] text-white py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                                Upgrade Plan
                                            </button>
                                            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                                                Update Payment Method
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Statistics */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-serif text-xl text-gray-900 mb-6">Usage</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-2">Properties</p>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">{usage.propertiesUsed}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-[#876D4A] h-2 rounded-full" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-2">Storage</p>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">{usage.storageUsed}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-[#876D4A] h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-2">API Calls</p>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">{usage.apiCalls}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-[#876D4A] h-2 rounded-full" style={{ width: '25%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links & Billing History */}
                        <div className="space-y-8">
                            {/* Quick Links */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-serif text-xl text-gray-900 mb-4">Quick Links</h2>
                                <div className="space-y-3">
                                    <Link href="/company-settings" className="block p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer">
                                        <p className="font-medium text-gray-900">Company Settings</p>
                                        <p className="text-gray-600 text-sm">Update company information</p>
                                    </Link>
                                    <Link href="/profile" className="block p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer">
                                        <p className="font-medium text-gray-900">Profile Settings</p>
                                        <p className="text-gray-600 text-sm">Manage your account</p>
                                    </Link>
                                    <Link href="/user-management" className="block p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer">
                                        <p className="font-medium text-gray-900">User Management</p>
                                        <p className="text-gray-600 text-sm">Manage team members</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Billing History */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-serif text-xl text-gray-900 mb-4">Billing History</h2>
                                <div className="space-y-3">
                                    {billingHistory.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="font-medium text-gray-900">{invoice.date}</p>
                                                <p className="text-gray-600 text-sm">{invoice.invoice}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{invoice.amount}</p>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 border border-[#876D4A] text-[#876D4A] py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                    View All Invoices
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}