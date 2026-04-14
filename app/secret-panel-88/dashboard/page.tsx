// app/admin/dashboard/page.jsx
'use client'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState } from 'react'
import { useFetchAdminStats } from '@/hooks/admin/useAdminDashboard'
import { formatDate } from '@/lib/dateFormatter'

export default function AdminDashboardPage() {
    usePageTitle('Admin Dashboard - Denly')
    const [selectedPeriod, setSelectedPeriod] = useState('week')

    // Mock stats data - replace with your actual data fetching
    const stats = {
        totalUsers: 1247,
        totalProperties: 342,
        totalRevenue: 28450,
        pendingTasks: 8,
        activeTenants: 456,
        vacantProperties: 23
    }

    const recentActivities = [
        { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
        { id: 2, type: 'property', action: 'Property listed', user: 'Sarah Smith', time: '1 hour ago' },
        { id: 3, type: 'payment', action: 'Payment received', user: 'Mike Johnson', time: '3 hours ago' },
        { id: 4, type: 'ticket', action: 'Support ticket opened', user: 'Emily Brown', time: '5 hours ago' },
    ]

    const pendingApprovals = [
        { id: 1, type: 'Property Listing', item: 'Luxury Apartment', user: 'Alice Cooper', date: '2024-01-15' },
        { id: 2, type: 'User Verification', item: 'ID Verification', user: 'Bob Wilson', date: '2024-01-14' },
        { id: 3, type: 'Payment Dispute', item: 'Transaction #1234', user: 'Carol Davis', date: '2024-01-14' },
    ]

    const { data, isPending } = useFetchAdminStats()
    console.log(data)

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Simple Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
                            <p className="text-sm text-slate-400 mt-1">Manage your platform from here</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-300">Admin User</span>
                            <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Users</p>
                                <p className="text-2xl font-semibold text-white">{data?.users?.totalUsers}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                👥
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">{data?.users.growthPercentage}% from last month</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Properties</p>
                                <p className="text-2xl font-semibold text-white">{data?.properties?.totalProperties}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                🏢
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">{data?.tenants?.activeTenants} active tenants</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Revenue</p>
                                <p className="text-2xl font-semibold text-white">${data?.revenue?.monthlyRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                💰
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">This month</p>
                    </div>

                    {/* <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Pending Tasks</p>
                                <p className="text-2xl font-semibold text-white">{stats.pendingTasks}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                📋
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">Requires attention</p>
                    </div> */}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-lg border border-slate-800">
                            <div className="p-5 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-white">Recent Activity</h2>
                                    <select className="bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#876D4A]">
                                        <option value="week">Last 7 days</option>
                                        <option value="month">Last 30 days</option>
                                        <option value="all">All time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {data?.activity?.recentActivityLogs?.map((activity: any) => (
                                    <div key={activity.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-sm font-medium text-white">{activity.description}</span>
                                                    <span className="text-xs text-slate-500">•</span>
                                                    <span className="text-xs text-slate-400">{activity.email}</span>
                                                </div>
                                                <p className="text-xs text-slate-400">{formatDate(activity.createdAt, 'long')}</p>
                                            </div>
                                            {/* <button className="text-xs text-amber-600 hover:text-amber-900 transition-colors">
                                                View
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="p-4 border-t border-slate-800 text-center">
                                <Link href="/admin/activity" className="text-sm text-amber-600 hover:text-amber-900 transition-colors">
                                    View all activity →
                                </Link>
                            </div> */}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Pending Approvals */}
                        {/* <div className="bg-slate-900 rounded-lg border border-slate-800">
                            <div className="p-5 border-b border-slate-800">
                                <h2 className="text-lg font-medium text-white">Pending Approvals</h2>
                                <p className="text-sm text-slate-400 mt-1">Items waiting for your review</p>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {pendingApprovals.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-amber-600">{item.type}</span>
                                            <span className="text-xs text-slate-500">{item.date}</span>
                                        </div>
                                        <p className="text-sm text-white mb-1">{item.item}</p>
                                        <p className="text-xs text-slate-400 mb-2">by {item.user}</p>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-xs bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-900 transition-colors">
                                                Approve
                                            </button>
                                            <button className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded hover:bg-slate-700 transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-slate-800 text-center">
                                <Link href="/admin/approvals" className="text-sm text-amber-600 hover:text-amber-900 transition-colors">
                                    View all pending →
                                </Link>
                            </div>
                        </div> */}

                        {/* Quick Actions */}
                        {/* <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                            <h2 className="text-lg font-medium text-white mb-3">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/admin/users"
                                    className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3 text-center"
                                >
                                    <div className="text-xl mb-1">👥</div>
                                    <span className="text-sm text-slate-300">Manage Users</span>
                                </Link>
                                <Link
                                    href="/admin/properties"
                                    className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3 text-center"
                                >
                                    <div className="text-xl mb-1">🏢</div>
                                    <span className="text-sm text-slate-300">Properties</span>
                                </Link>
                                <Link
                                    href="/admin/payments"
                                    className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3 text-center"
                                >
                                    <div className="text-xl mb-1">💰</div>
                                    <span className="text-sm text-slate-300">Payments</span>
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3 text-center"
                                >
                                    <div className="text-xl mb-1">⚙️</div>
                                    <span className="text-sm text-slate-300">Settings</span>
                                </Link>
                            </div>
                        </div> */}

                        {/* System Status */}
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                            <h2 className="text-lg font-medium text-white mb-3">System Status</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">API Status</span>
                                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">{data?.system?.apiStatus}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Database</span>
                                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">{data?.system?.dbStatus}</span>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Last Backup</span>
                                    <span className="text-xs text-slate-400">2 hours ago</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Storage</span>
                                    <span className="text-xs text-slate-400">43% used</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}