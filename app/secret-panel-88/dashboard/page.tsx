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

    const { data, isPending } = useFetchAdminStats()
    console.log(data)

    // Helper function to extract numeric value from latency/response time string
    const parseTimeValue = (timeStr: string | number): number => {
        if (typeof timeStr === 'number') return timeStr

        // Extract number from string like "1.25ms", "150ms", "0.5s", "1.2s"
        const match = String(timeStr).match(/[\d.]+/)
        if (!match) return 0

        const value = parseFloat(match[0])

        // Convert seconds to milliseconds if needed
        if (String(timeStr).includes('s') && !String(timeStr).includes('ms')) {
            return value * 1000
        }

        return value
    }

    // Helper function to get payment status color
    const getPaymentStatusColor = (status: string) => {
        const statusLower = status?.toLowerCase()
        switch (statusLower) {
            case 'paid':
            case 'success':
            case 'completed':
                return 'bg-green-900/50 text-green-400 border-green-700'
            case 'pending':
            case 'waiting':
                return 'bg-yellow-900/50 text-yellow-400 border-yellow-700'
            case 'failed':
            case 'error':
            case 'declined':
                return 'bg-red-900/50 text-red-400 border-red-700'
            case 'refunded':
                return 'bg-purple-900/50 text-purple-400 border-purple-700'
            default:
                return 'bg-slate-800 text-slate-400 border-slate-700'
        }
    }

    // Helper function to get latency color based on milliseconds
    const getLatencyColor = (latency: string | number) => {
        const ms = parseTimeValue(latency)

        if (ms <= 100) return 'text-green-400 bg-green-900/50'
        if (ms <= 300) return 'text-yellow-400 bg-yellow-900/50'
        if (ms <= 500) return 'text-orange-400 bg-orange-900/50'
        return 'text-red-400 bg-red-900/50'
    }

    // Helper function to get response time color
    const getResponseTimeColor = (responseTime: string | number) => {
        const ms = parseTimeValue(responseTime)

        if (ms <= 150) return 'text-green-400 bg-green-900/50'
        if (ms <= 400) return 'text-yellow-400 bg-yellow-900/50'
        if (ms <= 800) return 'text-orange-400 bg-orange-900/50'
        return 'text-red-400 bg-red-900/50'
    }

    // Helper function to get system status color
    const getSystemStatusColor = (status: string) => {
        const statusLower = status?.toLowerCase()
        if (statusLower === 'healthy' || statusLower === 'operational' || statusLower === 'connected') {
            return 'text-green-400 bg-green-900/50'
        }
        if (statusLower === 'degraded' || statusLower === 'slow') {
            return 'text-yellow-400 bg-yellow-900/50'
        }
        if (statusLower === 'unhealthy' || statusLower === 'down' || statusLower === 'disconnected') {
            return 'text-red-400 bg-red-900/50'
        }
        return 'text-slate-400 bg-slate-800'
    }

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
                    </div>
                </div>
            </header>

            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Link href={'/secret-panel-88/users'} className="bg-slate-900 rounded-lg border border-slate-800 p-5 hover:border-white transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Users</p>
                                <p className="text-2xl font-semibold text-white">{data?.users?.total}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                👥
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">{data?.users?.growthPercentage}% from last month</p>
                    </Link>

                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Properties</p>
                                <p className="text-2xl font-semibold text-white">{data?.properties?.total}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                🏢
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">{data?.tenants?.active} active tenants</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Revenue</p>
                                <p className="text-2xl font-semibold text-white">${data?.revenue?.monthlyRevenue?.toLocaleString()}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                💰
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">This month</p>
                    </div>

                    <Link href={'/secret-panel-88/billing'} className="bg-slate-900 rounded-lg border border-slate-800 p-5 hover:border-white transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Billing Overview</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-slate-400">
                                <span className="text-green-400 font-bold text-lg">{data?.billing?.paid || 0}</span> paid
                            </p>
                            <p className="text-sm text-slate-400">
                                <span className="text-yellow-400 font-bold text-lg">{data?.billing?.pending || 0}</span> pending
                            </p>
                            <p className="text-sm text-slate-400">
                                <span className="text-red-400 font-bold text-lg">{data?.billing?.failed || 0}</span> failed
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-lg border border-slate-800">
                            <div className="p-5 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-white">Recent Billing Activity</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {data?.activity?.recentBillingPayments?.map((activity: any) => (
                                    <div key={activity.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-sm font-medium text-white">{activity.company?.name}</span>
                                                    <span className="text-sm text-slate-500">•</span>
                                                    <span className="text-sm text-slate-400">{activity.company?.email}</span>
                                                </div>
                                                <p className="text-xs text-slate-400">{formatDate(activity.createdAt, 'long')}</p>
                                                <p className="text-sm text-slate-400 mt-1">{activity.planName}</p>
                                                <p className="text-sm font-medium text-white mt-1">${activity.amount}</p>
                                            </div>
                                            <div className="ml-4">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getPaymentStatusColor(activity.status)}`}>
                                                    {activity.status?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* System Status */}
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                            <h2 className="text-lg font-medium text-white mb-4">System Status</h2>
                            <div className="space-y-4">
                                {/* API Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">API Status</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getSystemStatusColor(data?.system?.api?.status)}`}>
                                            {data?.system?.api?.status?.toUpperCase() || 'UNKNOWN'}
                                        </span>
                                        {data?.system?.api?.responseTime && (
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getResponseTimeColor(data?.system?.api?.responseTime)}`}>
                                                {data?.system?.api?.responseTime}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Database Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Database</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getSystemStatusColor(data?.system?.database?.status)}`}>
                                            {data?.system?.database?.status?.toUpperCase() || 'UNKNOWN'}
                                        </span>
                                        {data?.system?.database?.latency && (
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getLatencyColor(data?.system?.database?.latency)}`}>
                                                {data?.system?.database?.latency}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Redis/Cache Status (optional) */}
                                {data?.system?.cache && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Cache Server</span>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getSystemStatusColor(data?.system?.cache?.status)}`}>
                                                {data?.system?.cache?.status?.toUpperCase()}
                                            </span>
                                            {data?.system?.cache?.latency && (
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getLatencyColor(data?.system?.cache?.latency)}`}>
                                                    {data?.system?.cache?.latency}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Queue Status (optional) */}
                                {data?.system?.queue && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Message Queue</span>
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getSystemStatusColor(data?.system?.queue?.status)}`}>
                                            {data?.system?.queue?.status?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-500 mb-2">Latency Standards:</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="inline-flex px-2 py-1 rounded bg-green-900/50 text-green-400">&lt;100ms (Good)</span>
                                    <span className="inline-flex px-2 py-1 rounded bg-yellow-900/50 text-yellow-400">100-300ms (Slow)</span>
                                    <span className="inline-flex px-2 py-1 rounded bg-orange-900/50 text-orange-400">300-500ms (Warning)</span>
                                    <span className="inline-flex px-2 py-1 rounded bg-red-900/50 text-red-400">&gt;500ms (Critical)</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        {/* <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                            <h2 className="text-lg font-medium text-white mb-3">Payment Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 rounded bg-slate-800/30">
                                    <span className="text-sm text-slate-400">Paid</span>
                                    <span className="text-sm font-medium text-green-400">{data?.billing?.paid || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-slate-800/30">
                                    <span className="text-sm text-slate-400">Pending</span>
                                    <span className="text-sm font-medium text-yellow-400">{data?.billing?.pending || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-slate-800/30">
                                    <span className="text-sm text-slate-400">Failed</span>
                                    <span className="text-sm font-medium text-red-400">{data?.billing?.failed || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-slate-800/30">
                                    <span className="text-sm text-slate-400">Total Revenue</span>
                                    <span className="text-sm font-medium text-white">${data?.revenue?.totalRevenue?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}