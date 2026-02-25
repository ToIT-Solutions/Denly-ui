"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllTenants } from '@/hooks/useTenant'
import { useFetchAllPayments } from '@/hooks/usePayment' // You'll need this hook
import { CAN_INTERACT } from '@/lib/roles'
import useAuthStore from '@/store/useAuthStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { formatDate } from '@/lib/dateFormatter'

export default function TenantsPage() {
    usePageTitle("Tenants - Denly")

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [showOverdueOnly, setShowOverdueOnly] = useState(false)

    const { data: tenants, isLoading, error } = useFetchAllTenants()
    const { data: allPayments, isLoading: paymentsLoading } = useFetchAllPayments() // Fetch all payments
    console.log(tenants)
    // Calculate overdue status for each tenant
    const tenantsWithOverdueStatus = useMemo(() => {
        if (!tenants || !allPayments) return []

        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time for accurate date comparison

        return tenants.map((tenant: any) => {
            // Get all payments for this tenant
            const tenantPayments = allPayments.filter((p: any) => p.tenantId === tenant.id)

            // Find overdue payments (due date passed and not paid)
            const overduePayments = tenantPayments.filter((payment: any) => {
                const dueDate = new Date(payment.dueDate)
                dueDate.setHours(0, 0, 0, 0)
                return dueDate < today && payment.status !== 'paid'
            })

            // Calculate total overdue amount
            const totalOverdue = overduePayments.reduce((sum: number, p: any) => sum + p.amount, 0)

            // Get the oldest overdue date
            const oldestOverdue = overduePayments.length > 0
                ? new Date(Math.min(...overduePayments.map((p: any) => new Date(p.dueDate).getTime())))
                : null

            return {
                ...tenant,
                hasOverdue: overduePayments.length > 0,
                overdueCount: overduePayments.length,
                overdueAmount: totalOverdue,
                oldestOverdueDate: oldestOverdue,
                overdueMonths: overduePayments.map((p: any) => ({
                    month: p.month,
                    year: p.year,
                    amount: p.amount
                }))
            }
        })
    }, [tenants, allPayments])

    // Filter tenants based on search and overdue filter
    const filteredTenants = useMemo(() => {
        if (!tenantsWithOverdueStatus) return []

        let filtered = tenantsWithOverdueStatus

        // Apply overdue filter if enabled
        if (showOverdueOnly) {
            filtered = filtered.filter((tenant: any) => tenant.hasOverdue)
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter((tenant: any) => {
                const searchableFields = [
                    tenant.firstName,
                    tenant.lastName,
                    `${tenant.firstName} ${tenant.lastName}`,
                    tenant.email,
                    tenant.phone,
                    tenant.property?.name,
                    tenant.status,
                    tenant.actualRent?.toString()
                ]
                return searchableFields.some(field =>
                    field?.toString().toLowerCase().includes(query)
                )
            })
        }

        return filtered
    }, [tenantsWithOverdueStatus, searchQuery, showOverdueOnly])

    // Calculate total overdue stats
    const overdueStats = useMemo(() => {
        if (!tenantsWithOverdueStatus) return { totalOverdue: 0, tenantsWithOverdue: 0 }

        const tenantsWithOverdue = tenantsWithOverdueStatus.filter((t: any) => t.hasOverdue)
        const totalOverdueAmount = tenantsWithOverdue.reduce((sum: number, t: any) => sum + t.overdueAmount, 0)

        return {
            totalOverdue: totalOverdueAmount,
            tenantsWithOverdue: tenantsWithOverdue.length,
            totalTenants: tenantsWithOverdueStatus.length
        }
    }, [tenantsWithOverdueStatus])


    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                {isLoading || paymentsLoading ?
                    <Spinner />
                    :
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Tenants</h1>
                                <p className="text-gray-600">Manage tenant information</p>
                                {tenants && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total: {tenants.length} {tenants.length === 1 ? 'tenant' : 'tenants'}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {CAN_INTERACT.includes(userRole) &&
                                    <Link href="/dashboard/tenants/add">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#876D4A] text-white px-6 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm"
                                        >
                                            Add Tenant
                                        </button>
                                    </Link>
                                }

                                <input
                                    type="text"
                                    placeholder="Search tenants"
                                    className="px-4 py-1 border text-black outline-0 placeholder-gray-400 border-gray-300 rounded-2xl focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors w-full sm:w-80"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Overdue Summary Banner - Only shows if there are overdue payments */}
                        {overdueStats.tenantsWithOverdue > 0 && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-red-800">Overdue Payments Alert</h3>
                                            <p className="text-sm text-red-700">
                                                {overdueStats.tenantsWithOverdue} tenant{overdueStats.tenantsWithOverdue > 1 ? 's' : ''} with overdue payments
                                                (Total: ${overdueStats.totalOverdue.toLocaleString()})
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showOverdueOnly
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                                            }`}
                                    >
                                        {showOverdueOnly ? 'Show All Tenants' : 'Show Only Overdue'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search Results Info */}
                        {searchQuery && (
                            <div className="mb-4 text-sm text-gray-600">
                                Found {filteredTenants.length} {filteredTenants.length === 1 ? 'tenant' : 'tenants'} matching "{searchQuery}"
                                {showOverdueOnly && ' with overdue payments'}
                            </div>
                        )}

                        {/* Override search info when showing only overdue */}
                        {!searchQuery && showOverdueOnly && (
                            <div className="mb-4 text-sm text-gray-600">
                                Showing {filteredTenants.length} {filteredTenants.length === 1 ? 'tenant' : 'tenants'} with overdue payments
                            </div>
                        )}

                        {/* Tenants Table */}
                        {filteredTenants.length > 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="text-left p-6 font-serif text-gray-900">Tenant</th>
                                                <th className="text-left p-6 font-serif text-gray-900">Contact</th>
                                                <th className="text-left p-6 font-serif text-gray-900">Property</th>
                                                <th className="text-left p-6 font-serif text-gray-900">Rent</th>
                                                <th className="text-left p-6 font-serif text-gray-900">Status</th>
                                                <th className="text-left p-6 font-serif text-gray-900">Last Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTenants.map((tenant: any) => (
                                                <tr
                                                    key={tenant.id}
                                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${tenant.hasOverdue ? 'bg-red-50/30' : ''
                                                        }`}
                                                    onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                                                >
                                                    <td className="p-6">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{tenant.firstName + ' ' + tenant.lastName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <p className="text-gray-900">{tenant.email}</p>
                                                        <p className="text-gray-600 text-sm">{tenant.phone}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <p className="text-gray-900">{tenant.property?.name || '—'}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <p className="text-[#876D4A] font-medium">${tenant.actualRent}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenant.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : tenant.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {tenant.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-gray-900">
                                                        {/* {tenant.hasOverdue ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                                <div>
                                                                    <p className="text-red-600 font-medium text-sm">
                                                                        ${tenant.overdueAmount} overdue
                                                                    </p>
                                                                    {tenant.overdueCount > 0 && (
                                                                        <p className="text-xs text-red-500">
                                                                            {tenant.overdueCount} {tenant.overdueCount === 1 ? 'payment' : 'payments'} past due
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">—</span>
                                                        )} */}
                                                        {formatDate(tenant?.payments[0].createdAt, 'long')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* No Results State */
                            <div className="rounded-2xl p-12 text-center">
                                {showOverdueOnly ? (
                                    <>
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            ✅
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">No overdue payments</h3>
                                        <p className="text-gray-600 mb-6">All tenants are up to date with their payments</p>
                                        <button
                                            onClick={() => setShowOverdueOnly(false)}
                                            className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer"
                                        >
                                            Show All Tenants
                                        </button>
                                    </>
                                ) : tenants?.length === 0 ? (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            👤
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">No tenants yet</h3>
                                        <p className="text-gray-600 mb-6">Get started by adding your first tenant</p>
                                        <Link href="/dashboard/tenants/add">
                                            <button className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer">
                                                Add Your First Tenant
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            🔍
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 mb-2">No tenants found</h3>
                                        <p className="text-gray-600 mb-6">No tenants match your search criteria</p>
                                        <button
                                            onClick={() => {
                                                setSearchQuery('')
                                                setShowOverdueOnly(false)
                                            }}
                                            className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer"
                                        >
                                            Clear Filters
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}