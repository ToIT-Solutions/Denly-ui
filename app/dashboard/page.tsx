"use client"
import { fetchCompanyStats } from '@/api/company'
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { useFetchCompanyStats } from '@/hooks/useCompany'
import { usePageTitle } from '@/hooks/usePageTitle'
import useAuthStore from '@/store/useAuthStore'
import Link from 'next/link'

export default function DashboardPage() {
    usePageTitle('Dashboard - Denly')

    const user = useAuthStore((state) => state.user)

    const { data, isLoading, error } = useFetchCompanyStats()
    console.log(data)

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-gray-900 mb-2">Welcome back, {user?.firstName || 'User'}</h1>
                        <p className="text-gray-600">Here's your property portfolio overview</p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-lg text-gray-900 mb-2">Failed to load dashboard data</h3>
                            <p className="text-gray-600 mb-4">{error.message || 'Please try refreshing the page'}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Refresh Page
                            </button>
                        </div>
                    )}

                    {/* Data Display */}
                    {!isLoading && !error && data && (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-4 gap-6 mb-8">
                                {[
                                    {
                                        title: 'Total Revenue',
                                        value: data?.overview?.totalRevenue ? '$' + data.overview.totalRevenue : '$0',
                                        subtitle: 'Total',
                                        // trend: data?.overview?.totalRevenue ? '+12%' : ''
                                    },
                                    {
                                        title: 'Monthly Revenue',
                                        value: data?.overview?.currentMonthRevenue ? '$' + data.overview.currentMonthRevenue : '$0',
                                        subtitle: 'This month'
                                    },
                                    {
                                        title: 'Active Properties',
                                        value: data?.overview?.activeProperties ?? 0,
                                        subtitle: (data?.overview?.totalProperties ?? 0) + ' occupied'
                                    },
                                    {
                                        title: 'Occupancy Rate',
                                        value: (data?.overview?.occupancyRate ?? 0) + '%',
                                        subtitle: 'Overall portfolio'
                                    }
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                        <div className="flex items-baseline space-x-2 mb-1">
                                            <span className="text-2xl font-serif text-gray-900">{stat.value}</span>
                                            {/* {stat.trend && <span className="text-sm text-green-600">{stat.trend}</span>} */}
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
                                        <Link href="/dashboard/payments" className="text-[#876D4A] hover:text-[#756045] text-sm transition-colors cursor-pointer">
                                            View All
                                        </Link>
                                    </div>

                                    {data?.lastPayments && data.lastPayments.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.lastPayments.map((payment: any) => (
                                                <div key={payment.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                    <div className="w-10 h-10 bg-[#876D4A] rounded-lg flex items-center justify-center text-white">
                                                        💰
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-900 font-medium">Payment received for {payment.property?.name || 'Unknown Property'}</p>
                                                        <p className="text-gray-500 text-sm">
                                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Recent'} •
                                                            Tenant: {payment.tenant?.firstName || 'Unknown'} {payment.tenant?.lastName || ''}
                                                        </p>
                                                    </div>
                                                    <span className="text-[#876D4A] font-medium">${payment.amount || 0}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-1">No recent activity</h3>
                                            <p className="text-gray-500 text-sm">Payments and updates will appear here</p>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats & Properties Preview */}
                                <div className="space-y-6">
                                    {/* Portfolio Health */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <h2 className="font-serif text-xl text-gray-900 mb-4">Portfolio Health</h2>

                                        {data ? (
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Avg Rent Price', value: data?.overview?.averageRevenuePerProperty ? '$' + data.overview.averageRevenuePerProperty : '$0', color: 'text-gray-900' },
                                                    { label: 'Avg Revenue per Prop', value: data?.overview?.averageRent ? '$' + data.overview.averageRent : '$0', color: 'text-gray-900' },
                                                    { label: 'Prop Without Tenants', value: data?.overview?.propertiesWithoutTenants ?? 0, color: 'text-gray-900' },
                                                    { label: 'Active Tenants', value: data?.overview?.activeTenants ?? 0, color: 'text-gray-900' },
                                                    { label: 'Vacancy Rate', value: (data?.overview?.vacancyRate ?? 0) + '%', color: (data?.overview?.vacancyRate ?? 0) < 50 ? 'text-amber-600' : 'text-green-600' },
                                                ].map((stat, index) => (
                                                    <div key={index} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                                                        <span className="text-gray-600">{stat.label}</span>
                                                        <span className={`font-medium ${stat.color}`}>{stat.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-sm">No portfolio data available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Properties Quick View */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="font-serif text-xl text-gray-900">Properties</h2>
                                            <Link href="/dashboard/properties" className="text-[#876D4A] hover:text-[#756045] text-sm transition-colors cursor-pointer">
                                                Manage
                                            </Link>
                                        </div>

                                        {data?.topProperties && data.topProperties.length > 0 ? (
                                            <div className="space-y-3">
                                                {data.topProperties.map((property: any) => (
                                                    <div key={property.propertyId} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                        <span className="text-gray-700">{property.propertyName || 'Unnamed Property'}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                            <span className="text-sm text-gray-600">${property.revenue || 0}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-sm mb-2">No properties yet</p>
                                                <Link
                                                    href="/dashboard/properties/add"
                                                    className="inline-block text-[#876D4A] hover:text-[#756045] text-sm font-medium"
                                                >
                                                    Add your first property →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}