"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import useAuthStore from '@/store/useAuthStore'
import Link from 'next/link'

export default function DashboardPage() {
    usePageTitle('Dashboard - Denly')

    const user = useAuthStore((state) => state.user)

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-gray-900 mb-2">Welcome back, {user?.firstName}</h1>
                        <p className="text-gray-600">Here's your property portfolio overview</p>
                        {/* <Spinner /> */}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {[
                            { title: 'Total Revenue', value: '$24,580', subtitle: 'This month', trend: '+12%' },
                            { title: 'Active Properties', value: '12', subtitle: '11 occupied', trend: '+2' },
                            { title: 'Pending Payments', value: '3', subtitle: 'Action required', trend: '-1' },
                            { title: 'Occupancy Rate', value: '92%', subtitle: 'Overall portfolio', trend: '+5%' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                <div className="flex items-baseline space-x-2 mb-1">
                                    <span className="text-2xl font-serif text-gray-900">{stat.value}</span>
                                    <span className="text-sm text-green-600">{stat.trend}</span>
                                </div>
                                <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-serif text-xl text-gray-900">Recent Activity</h2>
                                <Link href="/company/dashboard/payments" className="text-[#876D4A] hover:text-[#756045] text-sm transition-colors cursor-pointer">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                        <div className="w-10 h-10 bg-[#876D4A] rounded-lg flex items-center justify-center text-white">
                                            💰
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">Payment received for Downtown Loft</p>
                                            <p className="text-gray-500 text-sm">Today, 10:30 AM • Tenant: John Smith</p>
                                        </div>
                                        <span className="text-[#876D4A] font-medium">$2,400</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats & Properties Preview */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <h2 className="font-serif text-xl text-gray-900 mb-4">Portfolio Health</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Collection Rate', value: '94%', color: 'text-green-600' },
                                        { label: 'Avg Rent Price', value: '$2,048', color: 'text-gray-900' },
                                        { label: 'Vacancy Rate', value: '8%', color: 'text-amber-600' },
                                        { label: 'Late Payments', value: '1', color: 'text-red-600' }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                                            <span className="text-gray-600">{stat.label}</span>
                                            <span className={`font-medium ${stat.color}`}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Properties Quick View */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-serif text-xl text-gray-900">Properties</h2>
                                    <Link href="/properties" className="text-[#876D4A] hover:text-[#756045] text-sm transition-colors cursor-pointer">
                                        Manage
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {['Downtown Loft', 'Garden Villa', 'Urban Suite'].map((property, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                            <span className="text-gray-700">{property}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-sm text-gray-600">$2,400</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}