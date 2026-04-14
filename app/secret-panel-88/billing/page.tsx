// app/admin/billing/page.jsx
'use client'
import { useFetchBillingStats } from '@/hooks/useBilling'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/lib/dateFormatter'
import { useState } from 'react'

export default function BillingPage() {
    usePageTitle('Billing - Admin')


    const { data, isPending } = useFetchBillingStats()
    console.log(data)

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-white">Billing Overview</h1>
                <p className="text-sm text-slate-400 mt-1">Track subscriptions, revenue, and payment analytics</p>
            </div>


            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Revenue</p>
                        <span className="text-lg">💰</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">${data?.revenue?.totalRevenue}</p>
                    <p className="text-xs text-green-500 mt-2">${data?.revenue?.monthlyRevenue} this month</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Active Subs</p>
                        <span className="text-lg">📊</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{data?.subscriptions?.activeSubscriptions}</p>
                    <p className="text-xs text-slate-500 mt-2">Across all plans</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">New Subscriptions</p>
                        <span className="text-lg">✨</span>
                    </div>
                    <p className="text-2xl font-semibold text-green-500">+{data?.subscriptions?.newSubscriptions}</p>
                    {/* <p className="text-xs text-slate-500 mt-2">This {period}</p> */}
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Failed Invoices</p>
                        <span className="text-lg">📉</span>
                    </div>
                    <p className="text-2xl font-semibold text-red-500">{data?.billing?.failedBilling}</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Pending Invoices</p>
                        <span className="text-lg">⏳</span>
                    </div>
                    <p className="text-2xl font-semibold text-yellow-500">{data?.billing?.pendingBilling}</p>
                    <p className="text-xs text-slate-500 mt-2">Need attention</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Subscription Breakdown */}
                <div className="lg:col-span-2 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="p-5 border-b border-slate-800">
                        <h2 className="text-lg font-medium text-white">Subscription Breakdown by Plan</h2>
                        <p className="text-sm text-slate-400 mt-1">Active subscriptions and revenue per plan</p>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {data?.plans?.breakdown.map((plan: any) => (
                            <div key={plan.planName} className="p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <span className="text-sm font-medium text-white">{plan.planName}</span>
                                        {/* <span className="text-xs text-green-500">{plan.growth}</span> */}
                                    </div>
                                    <p className="text-xs text-slate-400">{plan.totalSubscriptions} total subscriptions</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-white">${plan.totalRevenue.toLocaleString()}</p>
                                    {/* <p className="text-xs text-slate-400">${(plan.revenue / plan.count).toFixed(2)} avg/user</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
                    <h2 className="text-lg font-medium text-white mb-3">Quick Actions</h2>
                    <div className="space-y-2">
                        <button className="w-full text-left bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3">
                            <span className="text-sm font-medium text-white">Export Financial Report</span>
                            <p className="text-xs text-slate-400 mt-1">Download CSV for accounting</p>
                        </button>
                        <button className="w-full text-left bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3">
                            <span className="text-sm font-medium text-white">Send Payment Reminders</span>
                            <p className="text-xs text-slate-400 mt-1">To users with pending invoices</p>
                        </button>
                        <button className="w-full text-left bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3">
                            <span className="text-sm font-medium text-white">View Failed Payments</span>
                            <p className="text-xs text-slate-400 mt-1">Resolve payment issues</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-slate-900 rounded-lg border border-slate-800">
                <div className="p-5 border-b border-slate-800">
                    <h2 className="text-lg font-medium text-white">Recent Transactions</h2>
                    <p className="text-sm text-slate-400 mt-1">Latest payments and subscription activity</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50 border-b border-slate-800">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">User</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Plan</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Amount</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Billing ID</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {data?.transactions?.recentTransactions?.map((transaction: any) => (
                                <tr key={transaction.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-sm text-white">{transaction.company?.name}</td>
                                    <td className="p-4 text-sm text-slate-300">{transaction.planName}</td>
                                    <td className="p-4 text-sm text-white">${transaction.amount}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${transaction.status === 'paid' ? 'bg-green-900/50 text-green-400' :
                                            transaction.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">{formatDate(transaction.createdAt, 'long')}</td>
                                    <td className="p-4 text-sm text-slate-400 font-mono">{transaction.id}</td>
                                    <td className="p-4">
                                        <button className="text-xs text-amber-600 hover:text-amber-900 transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-800 text-center">
                    <button className="text-sm text-amber-600 hover:text-amber-900 transition-colors">
                        View All Transactions →
                    </button>
                </div>
            </div>
        </div>
    )
}