"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function ReportsPage() {
    usePageTitle('Reports - Denly')
    const reports = [
        { id: 1, name: 'Monthly Financial Summary', type: 'Finance', date: 'Jan 2024', status: 'Generated' },
        { id: 2, name: 'Portfolio Performance', type: 'Analytics', date: 'Q4 2023', status: 'Generated' },
        { id: 3, name: 'Tax Preparation Report', type: 'Tax', date: '2023', status: 'Ready' },
        { id: 4, name: 'Occupancy Analysis', type: 'Analytics', date: 'Dec 2023', status: 'Generated' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-gray-900 mb-2">Reports & Analytics</h1>
                        <p className="text-gray-600">Generate and view detailed property reports</p>
                    </div>

                    {/* Report Types */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {[
                            { title: 'Financial Reports', count: '12', icon: '💰', color: 'bg-blue-500' },
                            { title: 'Performance Analytics', count: '8', icon: '📈', color: 'bg-green-500' },
                            { title: 'Tax Documents', count: '4', icon: '📋', color: 'bg-purple-500' },
                            { title: 'Custom Reports', count: '3', icon: '⚡', color: 'bg-orange-500' }
                        ].map((type, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{type.title}</p>
                                        <p className="text-gray-600 text-sm">{type.count} reports</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="font-serif text-xl text-gray-900">Recent Reports</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {reports.map((report) => (
                                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-[#876D4A] rounded-lg flex items-center justify-center text-white">
                                                📊
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{report.name}</p>
                                                <p className="text-gray-600 text-sm">{report.type} • {report.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${report.status === 'Generated'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-sm">
                                                    Download
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm">
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="font-serif text-lg text-gray-900 mb-4">Report Usage</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Generated This Month', value: '8' },
                                    { label: 'Most Popular', value: 'Financial Summary' },
                                    { label: 'Total Reports', value: '27' }
                                ].map((stat, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-gray-600">{stat.label}</span>
                                        <span className="font-medium text-gray-900">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="font-serif text-lg text-gray-900 mb-4">Quick Generate</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    'Monthly Income Statement',
                                    'Occupancy Report',
                                    'Expense Breakdown',
                                    'Tenant Payment History'
                                ].map((report, index) => (
                                    <button key={index} className="border border-[#876D4A] text-[#876D4A] py-3 rounded-lg hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer">
                                        {report}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}