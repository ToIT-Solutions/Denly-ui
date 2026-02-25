'use client'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllPayments } from '@/hooks/usePayment'
import { formatDate } from '@/lib/dateFormatter'
import { useState, useMemo } from 'react'

export default function PaymentsPage() {
    usePageTitle('Payments - Denly')
    const payments = [
        { id: 1, tenant: 'John Smith', property: 'Downtown Loft', amount: 2400, date: '2024-01-15', status: 'Paid', method: 'Bank Transfer' },
        { id: 2, tenant: 'Sarah Johnson', property: 'Garden Villa', amount: 3200, date: '2024-01-14', status: 'Paid', method: 'Credit Card' },
        { id: 3, tenant: 'Mike Chen', property: 'Riverside Apartment', amount: 2750, date: '2024-01-10', status: 'Overdue', method: 'Bank Transfer' },
        { id: 4, tenant: 'Emily Davis', property: 'Urban Suite', amount: 1800, date: '2024-01-05', status: 'Paid', method: 'Cash' },
    ]

    const { data, isLoading, error } = useFetchAllPayments()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [monthFilter, setMonthFilter] = useState('')

    const paymentData = data || payments

    const filteredPayments = useMemo(() => {
        let filtered = paymentData

        if (statusFilter !== 'All Status') {
            filtered = filtered.filter((payment: any) =>
                payment.status?.toLowerCase() === statusFilter.toLowerCase()
            )
        }

        if (monthFilter) {
            filtered = filtered.filter((payment: any) => {
                const paymentDate = new Date(payment.createdAt || payment.date)
                const paymentMonth = paymentDate.toISOString().slice(0, 7)
                return paymentMonth === monthFilter
            })
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter((payment: any) => {
                const searchableFields = [
                    payment.tenant?.firstName,
                    payment.tenant?.lastName,
                    `${payment.tenant?.firstName} ${payment.tenant?.lastName}`,
                    payment.tenant?.email,
                    payment.property?.name,
                    payment.paymentMethod,
                    payment.method,
                    payment.status,
                    payment.amount?.toString(),
                    payment.createdAt,
                    payment.date
                ]
                return searchableFields.some(field =>
                    field?.toString().toLowerCase().includes(query)
                )
            })
        }

        return filtered
    }, [paymentData, searchQuery, statusFilter, monthFilter])

    const paymentStats = useMemo(() => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        const currentMonthPayments = paymentData.filter((payment: any) => {
            const paymentDate = new Date(payment.createdAt || payment.date)
            return paymentDate.getFullYear() === currentYear &&
                paymentDate.getMonth() === currentMonth
        })

        const totalReceived = currentMonthPayments
            .filter((p: any) => p.status?.toLowerCase() === 'paid')
            .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

        const pending = paymentData
            .filter((p: any) => p.status?.toLowerCase() === 'pending')
            .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

        const overdue = paymentData
            .filter((p: any) => p.status?.toLowerCase() === 'overdue')
            .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

        const totalExpected = totalReceived + pending + overdue
        const collectionRate = totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 100

        const pendingCount = paymentData.filter((p: any) => p.status?.toLowerCase() === 'pending').length
        const overdueCount = paymentData.filter((p: any) => p.status?.toLowerCase() === 'overdue').length

        const paidPayments = paymentData.filter((p: any) => p.status?.toLowerCase() === 'paid')
        const averagePayment = paidPayments.length > 0
            ? paidPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0) / paidPayments.length
            : 0

        return {
            totalReceived,
            pending,
            overdue,
            collectionRate,
            pendingCount,
            overdueCount,
            averagePayment,
            totalTransactions: currentMonthPayments.length
        }
    }, [paymentData])



    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-1">Payments</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Track and manage rental payments</p>
                            {paymentData && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Total: {paymentData.length} {paymentData.length === 1 ? 'payment' : 'payments'}
                                </p>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                            <select
                                className="border border-gray-300 text-black outline-0 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm w-full sm:w-auto"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Pending</option>
                                <option>Overdue</option>
                            </select>
                            <input
                                type="month"
                                className="border border-gray-300 text-black outline-0 placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm w-full sm:w-auto"
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Search payments..."
                                className="border border-gray-300 text-black outline-0 placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Info */}
                    {(searchQuery || statusFilter !== 'All Status' || monthFilter) && (
                        <div className="mb-4 text-sm text-gray-600 flex flex-wrap items-center gap-2">
                            <span>Found {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}</span>
                            {searchQuery && <span>matching "{searchQuery}"</span>}
                            {statusFilter !== 'All Status' && <span>with status: {statusFilter}</span>}
                            {monthFilter && <span>for month: {monthFilter}</span>}
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('All Status'); setMonthFilter(''); }}
                                className="text-[#876D4A] hover:text-[#756045] underline text-xs ml-2"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Payment Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                        {[
                            { title: 'Total Received', value: `$${paymentStats.totalReceived.toLocaleString()}`, subtitle: `${paymentStats.totalTransactions} transaction${paymentStats.totalTransactions !== 1 ? 's' : ''} this month` },
                            { title: 'Pending', value: `$${paymentStats.pending.toLocaleString()}`, subtitle: `${paymentStats.pendingCount} payment${paymentStats.pendingCount !== 1 ? 's' : ''} awaiting confirmation` },
                            { title: 'Overdue', value: `$${paymentStats.overdue.toLocaleString()}`, subtitle: `${paymentStats.overdueCount} payment${paymentStats.overdueCount !== 1 ? 's' : ''} past due date` },
                            { title: 'Collection Rate', value: `${paymentStats.collectionRate}%`, subtitle: `Avg payment: $${paymentStats.averagePayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                <div className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">{stat.value}</div>
                                <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                            </div>
                        ))}
                    </div>

                    {/* Payments List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <h2 className="font-serif text-lg sm:text-xl text-gray-900 mb-2 sm:mb-0">Recent Payments</h2>
                            <span className="text-sm text-gray-500">{filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}</span>
                        </div>

                        {filteredPayments.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredPayments.map((payment: any) => {
                                    const tenantName = payment.tenant
                                        ? `${payment.tenant.firstName || ''} ${payment.tenant.lastName || ''}`.trim()
                                        : payment.tenant || 'Unknown Tenant'

                                    const propertyName = payment.property?.name || payment.property || 'Unknown Property'
                                    const paymentMethod = payment.paymentMethod || payment.method || 'Unknown Method'
                                    const paymentDate = payment.createdAt || payment.date || 'No date'
                                    const paymentStatus = payment.status || 'Unknown'
                                    const paymentAmount = Number(payment.amount) || 0

                                    return (
                                        <div key={payment.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                                <div className="flex items-center space-x-3 sm:space-x-4">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#876D4A] rounded-lg flex items-center justify-center text-white text-sm sm:text-base">💰</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{tenantName}</p>
                                                        <p className="text-gray-600 text-xs sm:text-sm">{propertyName} • {paymentMethod}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="text-[#876D4A] font-medium text-lg sm:text-lg">${paymentAmount.toLocaleString()}</p>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                                                        <p className="text-gray-600 text-xs sm:text-sm">{formatDate(paymentDate, 'long')}</p>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatus.toLowerCase() === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : paymentStatus.toLowerCase() === 'overdue'
                                                                ? 'bg-red-100 text-red-800'
                                                                : paymentStatus.toLowerCase() === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                {paymentData.length === 0 ? (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">💰</div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">No payments yet</h3>
                                        <p className="text-gray-600 mb-6">Payments will appear here once tenants start paying</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">🔍</div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">No payments found</h3>
                                        <p className="text-gray-600 mb-6">No payments match your search or filter criteria</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setStatusFilter('All Status'); setMonthFilter(''); }}
                                            className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer"
                                        >
                                            Clear All Filters
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}