"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllProperties } from '@/hooks/useProperty'
import { useFetchAllTenants } from '@/hooks/useTenant'
import { useFetchAllPayments } from '@/hooks/usePayment'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import useAuthStore from '@/store/useAuthStore'
import { CAN_VIEW_REPORTS } from '@/lib/roles'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
    usePageTitle('Reports & Analytics - Denly')

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const router = useRouter()

    // Fetch real data
    const { data: properties, isLoading: propertiesLoading } = useFetchAllProperties()
    const { data: tenants, isLoading: tenantsLoading } = useFetchAllTenants()
    const { data: payments, isLoading: paymentsLoading } = useFetchAllPayments()

    const isLoading = propertiesLoading || tenantsLoading || paymentsLoading

    const [selectedReportType, setSelectedReportType] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (!CAN_VIEW_REPORTS.includes(userRole)) {
            return router.back()
        }
    }, [userRole])


    // ============= CONSOLIDATED DATA =============
    // First, let's consolidate all our data to ensure accurate relationships
    const consolidatedData = useMemo(() => {
        if (!properties || !tenants || !payments) {
            return {
                properties: [],
                tenants: [],
                payments: [],
                propertyMap: new Map(),
                tenantMap: new Map(),
                paymentMap: new Map()
            }
        }

        // Create maps for easy lookup
        const propertyMap = new Map()
        properties.forEach((property: any) => {
            propertyMap.set(property.id, {
                ...property,
                tenants: [],
                payments: [],
                totalRevenue: 0,
                totalPaid: 0,
                totalPending: 0,
                totalOverdue: 0
            })
        })

        const tenantMap = new Map()
        tenants.forEach((tenant: any) => {
            tenantMap.set(tenant.id, {
                ...tenant,
                payments: [],
                totalPaid: 0,
                totalPending: 0,
                totalOverdue: 0,
                outstandingBalance: 0
            })
        })

        // Process payments and link to properties and tenants
        payments.forEach((payment: any) => {
            const paymentAmount = Number(payment.amount || 0)
            const propertyId = payment.property?.id || payment.propertyId
            const tenantId = payment.tenant?.id || payment.tenantId

            // Link payment to property
            if (propertyId && propertyMap.has(propertyId)) {
                const property = propertyMap.get(propertyId)
                property.payments.push(payment)

                if (payment.status?.toLowerCase() === 'paid') {
                    property.totalPaid += paymentAmount
                    property.totalRevenue += paymentAmount
                } else if (payment.status?.toLowerCase() === 'pending') {
                    property.totalPending += paymentAmount
                }
            }

            // Link payment to tenant
            if (tenantId && tenantMap.has(tenantId)) {
                const tenant = tenantMap.get(tenantId)
                tenant.payments.push(payment)

                if (payment.status?.toLowerCase() === 'paid') {
                    tenant.totalPaid += paymentAmount
                } else if (payment.status?.toLowerCase() === 'pending') {
                    tenant.totalPending += paymentAmount
                }
            }
        })

        // Calculate tenant outstanding balances
        const today = new Date()
        tenantMap.forEach((tenant) => {
            // Get the tenant's actual rent from their lease
            const monthlyRent = Number(tenant.actualRent || 0)

            // If tenant has no payments at all and is active, the full rent is outstanding
            if (tenant.payments.length === 0 && tenant.status === 'active' && tenant.leaseStart) {
                // Calculate how many months they've been tenants
                const leaseStart = new Date(tenant.leaseStart)
                const monthsAsTenant = Math.max(1, Math.ceil((today.getTime() - leaseStart.getTime()) / (1000 * 60 * 60 * 24 * 30)))
                tenant.outstandingBalance = monthlyRent * monthsAsTenant
                tenant.totalOverdue = tenant.outstandingBalance
                return
            }

            // For tenants with payments, check each month's payment
            // Group payments by month/year
            const paymentsByMonth = new Map()
            tenant.payments.forEach((payment: any) => {
                const paymentDate = new Date(payment.date || payment.createdAt)
                const monthKey = `${paymentDate.getFullYear()}-${paymentDate.getMonth()}`

                if (!paymentsByMonth.has(monthKey)) {
                    paymentsByMonth.set(monthKey, {
                        totalPaid: 0,
                        dueDate: payment.dueDate || payment.date
                    })
                }

                if (payment.status?.toLowerCase() === 'paid') {
                    const monthData = paymentsByMonth.get(monthKey)
                    monthData.totalPaid += Number(payment.amount || 0)
                }
            })

            // Check if rent was paid for each month since lease start
            if (tenant.leaseStart) {
                const leaseStart = new Date(tenant.leaseStart)
                const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                let monthsOutstanding = 0

                for (let d = new Date(leaseStart); d <= currentMonth; d.setMonth(d.getMonth() + 1)) {
                    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
                    const monthPayment = paymentsByMonth.get(monthKey)

                    // If no payment or payment less than rent for this month, it's outstanding
                    if (!monthPayment || monthPayment.totalPaid < monthlyRent) {
                        monthsOutstanding++
                    }
                }

                tenant.outstandingBalance = monthlyRent * monthsOutstanding
                tenant.totalOverdue = tenant.outstandingBalance
            }

            // Update property totals for overdue
            if (tenant.property?.id) {
                const property = propertyMap.get(tenant.property.id)
                if (property) {
                    property.totalOverdue += tenant.outstandingBalance
                }
            }
        })

        // Calculate monthly rent potential (property rent * number of tenants)
        propertyMap.forEach((property) => {
            const propertyTenants = tenants.filter((t: any) =>
                t.property?.id === property.id || t.propertyId === property.id
            )
            property.tenantCount = propertyTenants.length
            property.monthlyRentPotential = Number(property.monthlyRent || 0) * property.tenantCount
        })

        return {
            properties: Array.from(propertyMap.values()),
            tenants: Array.from(tenantMap.values()),
            payments,
            propertyMap,
            tenantMap
        }
    }, [properties, tenants, payments])

    // ============= PROPERTY-LEVEL REPORTS =============
    const propertyReports = useMemo(() => {
        const defaultReport = {
            summary: {
                totalProperties: 0,
                occupiedProperties: 0,
                vacantProperties: 0,
                occupancyRate: '0',
                vacancyRate: '0',
                totalMonthlyRentPotential: 0
            },
            propertyRevenue: [],
            leaseExpirations: []
        }

        if (!consolidatedData.properties.length) return defaultReport

        const totalProperties = consolidatedData.properties.length
        const occupiedProperties = consolidatedData.properties.filter((p: any) => p.tenantCount > 0).length
        const vacantProperties = consolidatedData.properties.filter((p: any) => p.tenantCount === 0).length
        const vacancyRate = totalProperties > 0 ? ((vacantProperties / totalProperties) * 100).toFixed(1) : '0'
        const occupancyRate = totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(1) : '0'

        const totalMonthlyRentPotential = consolidatedData.properties.reduce((sum: number, p: any) =>
            sum + (p.monthlyRentPotential || 0), 0
        )

        const propertyRevenue = consolidatedData.properties.map((property: any) => ({
            propertyId: property.id,
            propertyName: property.name || 'Unnamed Property',
            address: property.address || 'No address',
            monthlyRent: Number(property.monthlyRent || 0),
            monthlyRentPotential: property.monthlyRentPotential || 0,
            tenantCount: property.tenantCount || 0,
            totalRevenue: property.totalPaid || 0,
            totalPending: property.totalPending || 0,
            totalOverdue: property.totalOverdue || 0,
            paymentCount: property.payments?.length || 0
        })).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)

        const today = new Date()
        const leaseExpirations = consolidatedData.tenants
            .filter((tenant: any) => {
                if (!tenant.leaseEnd) return false
                const leaseEnd = new Date(tenant.leaseEnd)
                const daysUntilExpiry = Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                return daysUntilExpiry > 0 && daysUntilExpiry <= 90
            })
            .map((tenant: any) => ({
                tenantId: tenant.id,
                tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
                propertyName: tenant.property?.name || 'Unknown',
                leaseEnd: tenant.leaseEnd,
                daysUntilExpiry: Math.ceil((new Date(tenant.leaseEnd).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
                rentAmount: Number(tenant.actualRent || 0)
            }))
            .sort((a: any, b: any) => a.daysUntilExpiry - b.daysUntilExpiry)

        return {
            summary: {
                totalProperties,
                occupiedProperties,
                vacantProperties,
                occupancyRate,
                vacancyRate,
                totalMonthlyRentPotential
            },
            propertyRevenue,
            leaseExpirations
        }
    }, [consolidatedData])

    // ============= TENANT-LEVEL REPORTS =============
    const tenantReports = useMemo(() => {
        const defaultReport = {
            tenantPaymentHistory: [],
            leaseDurationReport: [],
            documentCompliance: [],
            summary: {
                totalTenants: 0,
                activeTenants: 0,
                tenantsWithOutstandingBalance: 0,
                totalOutstandingBalance: 0
            }
        }

        if (!consolidatedData.tenants.length) return defaultReport

        const tenantPaymentHistory = consolidatedData.tenants.map((tenant: any) => ({
            tenantId: tenant.id,
            tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
            email: tenant.email || 'No email',
            phone: tenant.phone || 'No phone',
            propertyName: tenant.property?.name || 'No Property',
            monthlyRent: Number(tenant.actualRent || 0),
            paymentSummary: {
                totalPaid: tenant.totalPaid || 0,
                totalPending: tenant.totalPending || 0,
                totalOverdue: tenant.totalOverdue || 0,
                outstandingBalance: tenant.outstandingBalance || 0,
                paymentCount: tenant.payments?.length || 0,
                lastPaymentDate: tenant.payments
                    ?.filter((p: any) => p.status?.toLowerCase() === 'paid')
                    .sort((a: any, b: any) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())[0]?.date || 'No payments'
            }
        }))

        const leaseDurationReport = consolidatedData.tenants
            .filter((tenant: any) => tenant.leaseStart && tenant.leaseEnd)
            .map((tenant: any) => {
                const leaseStart = new Date(tenant.leaseStart)
                const leaseEnd = new Date(tenant.leaseEnd)
                const durationDays = Math.ceil((leaseEnd.getTime() - leaseStart.getTime()) / (1000 * 60 * 60 * 24))
                const durationMonths = Math.round(durationDays / 30)

                return {
                    tenantId: tenant.id,
                    tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
                    propertyName: tenant.property?.name || 'Unknown',
                    leaseStart: tenant.leaseStart,
                    leaseEnd: tenant.leaseEnd,
                    durationDays,
                    durationMonths,
                    status: tenant.status || 'unknown'
                }
            })
            .sort((a: any, b: any) => b.durationDays - a.durationDays)

        // Document Compliance - Check for actual documents
        const documentCompliance = consolidatedData.tenants.map((tenant: any) => {
            const hasId = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('id') ||
                doc.type?.toLowerCase().includes('identification') ||
                doc.name?.toLowerCase().includes('id') ||
                doc.name?.toLowerCase().includes('identification')
            ) || false

            const hasLeaseAgreement = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('lease') ||
                doc.name?.toLowerCase().includes('lease') ||
                doc.type?.toLowerCase().includes('agreement')
            ) || (tenant.leaseStart && tenant.leaseEnd ? true : false)

            const hasIncomeProof = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('income') ||
                doc.type?.toLowerCase().includes('pay') ||
                doc.type?.toLowerCase().includes('salary') ||
                doc.name?.toLowerCase().includes('income') ||
                doc.name?.toLowerCase().includes('paystub')
            ) || false

            const hasEmergencyContact = tenant.emergencyContact ? true : false

            const documentsPresent = [hasId, hasLeaseAgreement, hasIncomeProof, hasEmergencyContact]
            const documentsUploaded = documentsPresent.filter(Boolean).length
            const complianceScore = Math.round((documentsUploaded / 4) * 100)

            return {
                tenantId: tenant.id,
                tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
                documents: {
                    id: hasId,
                    leaseAgreement: hasLeaseAgreement,
                    incomeProof: hasIncomeProof,
                    emergencyContact: hasEmergencyContact
                },
                complianceScore
            }
        })

        const totalOutstandingBalance = consolidatedData.tenants.reduce((sum: number, t: any) => sum + (t.outstandingBalance || 0), 0)
        const tenantsWithOutstandingBalance = consolidatedData.tenants.filter((t: any) => (t.outstandingBalance || 0) > 0).length

        return {
            tenantPaymentHistory,
            leaseDurationReport,
            documentCompliance,
            summary: {
                totalTenants: consolidatedData.tenants.length,
                activeTenants: consolidatedData.tenants.filter((t: any) => t.status === 'active').length,
                tenantsWithOutstandingBalance,
                totalOutstandingBalance
            }
        }
    }, [consolidatedData])

    // ============= FINANCIAL REPORTS =============
    const financialReports = useMemo(() => {
        const defaultReport = {
            monthlyRevenue: [],
            paymentMethodUsage: [],
            latePayments: [],
            summary: {
                totalRevenue: 0,
                totalPending: 0,
                totalOverdue: 0,
                paymentCount: 0,
                latePaymentCount: 0
            }
        }

        if (!consolidatedData.payments || !Array.isArray(consolidatedData.payments) || consolidatedData.payments.length === 0) {
            return defaultReport
        }

        const processedPayments = consolidatedData.payments.map((p: any) => ({
            ...p,
            amount: Number(p.amount || 0)
        }))

        // 1. Monthly Revenue Report
        const monthlyRevenue = processedPayments.reduce((acc: any, payment: any) => {
            const date = new Date(payment.date || payment.createdAt || new Date())
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })

            if (!acc[monthYear]) {
                acc[monthYear] = {
                    month: monthYear,
                    total: 0,
                    paid: 0,
                    pending: 0,
                    overdue: 0,
                    count: 0
                }
            }

            if (payment.status?.toLowerCase() === 'paid') {
                acc[monthYear].total += payment.amount
                acc[monthYear].paid += payment.amount
                acc[monthYear].count += 1
            } else if (payment.status?.toLowerCase() === 'pending') {
                acc[monthYear].pending += payment.amount
                acc[monthYear].count += 1
            } else if (payment.status?.toLowerCase() === 'overdue') {
                acc[monthYear].overdue += payment.amount
                acc[monthYear].count += 1
            }

            return acc
        }, {})

        const monthlyRevenueArray = Object.values(monthlyRevenue).sort((a: any, b: any) => {
            const dateA = new Date(a.month)
            const dateB = new Date(b.month)
            return dateB.getTime() - dateA.getTime()
        }).slice(0, 6)

        // 2. Payment Method Usage
        const paymentMethodUsage = processedPayments
            .filter((p: any) => p.status?.toLowerCase() === 'paid')
            .reduce((acc: any, payment: any) => {
                const method = payment.paymentMethod || payment.method || 'Unknown'
                acc[method] = (acc[method] || 0) + 1
                return acc
            }, {})

        const totalPaidPayments = processedPayments.filter((p: any) => p.status?.toLowerCase() === 'paid').length
        const paymentMethodArray = Object.entries(paymentMethodUsage).map(([method, count]) => ({
            method,
            count: count as number,
            percentage: totalPaidPayments > 0
                ? Number(((count as number) / totalPaidPayments * 100).toFixed(1))
                : 0
        })).sort((a: any, b: any) => b.count - a.count)

        // 3. Late Payments Report
        const today = new Date()
        const latePayments = consolidatedData.tenants
            .filter((tenant: any) => tenant.outstandingBalance > 0)
            .map((tenant: any) => ({
                id: tenant.id,
                tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
                propertyName: tenant.property?.name || 'Unknown',
                amount: tenant.outstandingBalance || 0,
                monthlyRent: Number(tenant.actualRent || 0),
                daysOverdue: Math.ceil((today.getTime() - new Date(tenant.leaseStart || today).getTime()) / (1000 * 60 * 60 * 24))
            }))
            .sort((a: any, b: any) => b.amount - a.amount)

        // Calculate totals
        const totalRevenue = consolidatedData.properties.reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0)
        const totalPending = consolidatedData.properties.reduce((sum: number, p: any) => sum + (p.totalPending || 0), 0)
        const totalOverdue = consolidatedData.properties.reduce((sum: number, p: any) => sum + (p.totalOverdue || 0), 0)

        return {
            monthlyRevenue: monthlyRevenueArray,
            paymentMethodUsage: paymentMethodArray,
            latePayments,
            summary: {
                totalRevenue,
                totalPending,
                totalOverdue,
                paymentCount: processedPayments.length,
                latePaymentCount: latePayments.length
            }
        }
    }, [consolidatedData])

    // ============= CROSS-CUTTING REPORTS =============
    const crossCuttingReports = useMemo(() => {
        const defaultReport = {
            topRevenueProperties: [],
            complianceRate: '0',
            revenueForecast: [],
            expiringLeases: []
        }

        if (!consolidatedData.properties.length || !consolidatedData.tenants.length) {
            return defaultReport
        }

        // 1. Top Revenue Properties
        const topRevenueProperties = consolidatedData.properties
            .map((property: any) => ({
                id: property.id,
                name: property.name || 'Unnamed Property',
                address: property.address || 'No address',
                revenue: property.totalPaid || 0,
                monthlyRent: Number(property.monthlyRent || 0),
                monthlyRentPotential: property.monthlyRentPotential || 0,
                tenants: property.tenantCount || 0,
                paymentCount: property.payments?.length || 0
            }))
            .sort((a: any, b: any) => b.revenue - a.revenue)

        // 2. Tenant Document Compliance Rate
        const documentCompliance = consolidatedData.tenants.map((tenant: any) => {
            const hasId = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('id') ||
                doc.name?.toLowerCase().includes('id')
            ) || false

            const hasLeaseAgreement = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('lease') ||
                doc.name?.toLowerCase().includes('lease')
            ) || (tenant.leaseStart && tenant.leaseEnd ? true : false)

            const hasIncomeProof = tenant.documents?.some((doc: any) =>
                doc.type?.toLowerCase().includes('income') ||
                doc.name?.toLowerCase().includes('income') ||
                doc.type?.toLowerCase().includes('pay')
            ) || false

            const hasEmergencyContact = tenant.emergencyContact ? true : false

            const documentsUploaded = [hasId, hasLeaseAgreement, hasIncomeProof, hasEmergencyContact].filter(Boolean).length
            return (documentsUploaded / 4) * 100
        })

        const complianceRate = documentCompliance.length > 0
            ? (documentCompliance.reduce((a, b) => a + b, 0) / documentCompliance.length).toFixed(1)
            : '0'

        // 3. Revenue Forecast
        const currentDate = new Date()
        const revenueForecast = []

        // Calculate average collection rate
        const totalPaid = consolidatedData.properties.reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0)
        const totalExpected = consolidatedData.properties.reduce((sum: number, p: any) => sum + (p.totalPaid + p.totalPending + p.totalOverdue), 0)
        const collectionRate = totalExpected > 0 ? totalPaid / totalExpected : 0.95

        for (let i = 0; i < 3; i++) {
            const forecastMonth = new Date(currentDate)
            forecastMonth.setMonth(currentDate.getMonth() + i)
            const monthName = forecastMonth.toLocaleString('default', { month: 'short', year: 'numeric' })

            const expectedRevenue = consolidatedData.properties.reduce((sum: number, p: any) =>
                sum + (p.monthlyRentPotential || 0), 0
            )

            revenueForecast.push({
                month: monthName,
                expected: expectedRevenue,
                confidence: Math.min(95, Math.round((collectionRate - (i * 0.05)) * 100))
            })
        }

        // 4. Lease Expiration Alerts
        const today = new Date()
        const thirtyDaysFromNow = new Date(today)
        thirtyDaysFromNow.setDate(today.getDate() + 30)

        const expiringLeases = consolidatedData.tenants
            .filter((tenant: any) => {
                if (!tenant.leaseEnd) return false
                const leaseEnd = new Date(tenant.leaseEnd)
                return leaseEnd >= today && leaseEnd <= thirtyDaysFromNow
            })
            .map((tenant: any) => ({
                tenantName: `${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'Unknown Tenant',
                propertyName: tenant.property?.name || 'Unknown',
                leaseEnd: tenant.leaseEnd,
                daysRemaining: Math.ceil((new Date(tenant.leaseEnd).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            }))
            .sort((a: any, b: any) => a.daysRemaining - b.daysRemaining)

        return {
            topRevenueProperties,
            complianceRate,
            revenueForecast,
            expiringLeases
        }
    }, [consolidatedData])

    const filteredReportCategories = useMemo(() => {
        if (!searchQuery) return ['all']

        const query = searchQuery.toLowerCase()
        const categories = []

        if (query.includes('property') || query.includes('occupancy') || query.includes('vacant') || query.includes('revenue') || query.includes('lease')) {
            categories.push('property')
        }
        if (query.includes('tenant') || query.includes('payment') || query.includes('lease') || query.includes('document')) {
            categories.push('tenant')
        }
        if (query.includes('financial') || query.includes('revenue') || query.includes('payment') || query.includes('method') || query.includes('late')) {
            categories.push('financial')
        }
        if (query.includes('cross') || query.includes('top') || query.includes('forecast') || query.includes('expiring')) {
            categories.push('cross')
        }

        return categories.length > 0 ? categories : ['all']
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                {isLoading ?
                    <Spinner />
                    :
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Reports & Analytics</h1>
                                <p className="text-gray-600">Comprehensive insights into your property portfolio</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    className="border border-gray-300 text-black outline-0 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm"
                                    value={selectedReportType}
                                    onChange={(e) => setSelectedReportType(e.target.value)}
                                >
                                    <option value="all">All Reports</option>
                                    <option value="property">Property Reports</option>
                                    <option value="tenant">Tenant Reports</option>
                                    <option value="financial">Financial Reports</option>
                                    <option value="cross">Cross-Cutting Reports</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    className="border border-gray-300 text-black outline-0 placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm w-full sm:w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-600 text-sm mb-1">Properties</p>
                                <div className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">{propertyReports?.summary?.totalProperties || 0}</div>
                                <p className="text-gray-500 text-xs">{propertyReports?.summary?.occupancyRate || 0}% occupied</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-600 text-sm mb-1">Tenants</p>
                                <div className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">{tenantReports?.summary?.totalTenants || 0}</div>
                                <p className="text-gray-500 text-xs">{tenantReports?.summary?.activeTenants || 0} active</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                                <div className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">${financialReports?.summary?.totalRevenue?.toLocaleString() || 0}</div>
                                <p className="text-gray-500 text-xs">{financialReports?.summary?.paymentCount || 0} payments</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-600 text-sm mb-1">Outstanding</p>
                                <div className="text-xl sm:text-2xl font-serif text-amber-600 mb-1">${tenantReports?.summary?.totalOutstandingBalance?.toLocaleString() || 0}</div>
                                <p className="text-gray-500 text-xs">{tenantReports?.summary?.tenantsWithOutstandingBalance || 0} tenants</p>
                            </div>
                        </div>

                        {/* Report Categories */}
                        <div className="space-y-8">
                            {/* PROPERTY-LEVEL REPORTS */}
                            {(selectedReportType === 'all' || selectedReportType === 'property' || filteredReportCategories.includes('property')) && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">🏢</span>
                                            <h2 className="font-serif text-xl text-gray-900">Property-Level Reports</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Occupancy, revenue, and lease analytics per property</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Occupancy & Vacancy Stats */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <p className="text-blue-600 text-sm font-medium">Occupancy Rate</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">{propertyReports?.summary?.occupancyRate || 0}%</p>
                                                <p className="text-xs text-gray-600 mt-1">{propertyReports?.summary?.occupiedProperties || 0} occupied / {propertyReports?.summary?.totalProperties || 0} total</p>
                                            </div>
                                            <div className="bg-amber-50 rounded-xl p-4">
                                                <p className="text-amber-600 text-sm font-medium">Vacancy Rate</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">{propertyReports?.summary?.vacancyRate || 0}%</p>
                                                <p className="text-xs text-gray-600 mt-1">{propertyReports?.summary?.vacantProperties || 0} vacant properties</p>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-4">
                                                <p className="text-green-600 text-sm font-medium">Monthly Rent Potential</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">
                                                    ${propertyReports?.summary?.totalMonthlyRentPotential?.toLocaleString() || 0}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">Based on {propertyReports?.summary?.occupiedProperties || 0} occupied properties</p>
                                            </div>
                                        </div>

                                        {/* Top Revenue Properties */}
                                        {propertyReports?.propertyRevenue && propertyReports.propertyRevenue.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-medium text-gray-900 mb-3">🏆 Top Revenue Properties</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="text-left p-3 text-xs font-medium text-gray-600">Property</th>
                                                                <th className="text-left p-3 text-xs font-medium text-gray-600">Address</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Tenants</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Monthly Potential</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Total Revenue</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {propertyReports.propertyRevenue.slice(0, 5).map((prop: any) => (
                                                                <tr key={prop.propertyId} className="border-b border-gray-100">
                                                                    <td className="p-3 text-sm text-gray-900">{prop.propertyName}</td>
                                                                    <td className="p-3 text-sm text-gray-600">{prop.address}</td>
                                                                    <td className="p-3 text-sm text-right text-gray-900">{prop.tenantCount}</td>
                                                                    <td className="p-3 text-sm text-right text-gray-900">${prop.monthlyRentPotential?.toLocaleString()}</td>
                                                                    <td className="p-3 text-sm text-right text-[#876D4A] font-medium">${prop.totalRevenue?.toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lease Expirations */}
                                        {propertyReports?.leaseExpirations && propertyReports.leaseExpirations.length > 0 && (
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-3">⚠️ Upcoming Lease Expirations (Next 90 Days)</h3>
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                    {propertyReports.leaseExpirations.slice(0, 5).map((expiry: any) => (
                                                        <div key={expiry.tenantId} className="flex justify-between items-center py-2 border-b border-amber-200 last:border-0">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{expiry.tenantName}</p>
                                                                <p className="text-xs text-gray-600">{expiry.propertyName} • ${expiry.rentAmount.toLocaleString()}/mo</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-amber-600">{expiry.daysUntilExpiry} days</p>
                                                                <p className="text-xs text-gray-600">Ends: {new Date(expiry.leaseEnd).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TENANT-LEVEL REPORTS */}
                            {(selectedReportType === 'all' || selectedReportType === 'tenant' || filteredReportCategories.includes('tenant')) && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">👤</span>
                                            <h2 className="font-serif text-xl text-gray-900">Tenant-Level Reports</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Payment history, lease duration, and document compliance</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Tenant Summary Stats */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-600 text-xs">Total Tenants</p>
                                                <p className="text-xl font-serif text-gray-900">{tenantReports?.summary?.totalTenants || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-600 text-xs">Active Tenants</p>
                                                <p className="text-xl font-serif text-gray-900">{tenantReports?.summary?.activeTenants || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-600 text-xs">Outstanding Balance</p>
                                                <p className="text-xl font-serif text-amber-600">${tenantReports?.summary?.totalOutstandingBalance?.toLocaleString() || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-600 text-xs">Avg. Lease Duration</p>
                                                <p className="text-xl font-serif text-gray-900">
                                                    {tenantReports?.leaseDurationReport && tenantReports.leaseDurationReport.length > 0
                                                        ? Math.round(tenantReports.leaseDurationReport.reduce((sum: number, t: any) => sum + t.durationMonths, 0) / tenantReports.leaseDurationReport.length)
                                                        : 0} months
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tenants with Outstanding Balance */}
                                        {tenantReports?.tenantPaymentHistory && tenantReports.tenantPaymentHistory.filter((t: any) => t.paymentSummary.outstandingBalance > 0).length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-medium text-gray-900 mb-3">💰 Tenants with Outstanding Balance</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="text-left p-3 text-xs font-medium text-gray-600">Tenant</th>
                                                                <th className="text-left p-3 text-xs font-medium text-gray-600">Property</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Monthly Rent</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Paid</th>
                                                                <th className="text-right p-3 text-xs font-medium text-gray-600">Outstanding</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tenantReports.tenantPaymentHistory
                                                                .filter((t: any) => t.paymentSummary.outstandingBalance > 0)
                                                                .slice(0, 5)
                                                                .map((tenant: any) => (
                                                                    <tr key={tenant.tenantId} className="border-b border-gray-100">
                                                                        <td className="p-3 text-sm text-gray-900">{tenant.tenantName}</td>
                                                                        <td className="p-3 text-sm text-gray-600">{tenant.propertyName}</td>
                                                                        <td className="p-3 text-sm text-right text-gray-900">${tenant.monthlyRent?.toLocaleString()}</td>
                                                                        <td className="p-3 text-sm text-right text-green-600">${tenant.paymentSummary.totalPaid?.toLocaleString()}</td>
                                                                        <td className="p-3 text-sm text-right text-red-600 font-medium">${tenant.paymentSummary.outstandingBalance?.toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Document Compliance */}
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">📋 Document Compliance</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="text-sm text-gray-600 mb-2">Overall Compliance Rate</p>
                                                    <p className="text-3xl font-serif text-gray-900">{crossCuttingReports?.complianceRate || 0}%</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                                                        <div
                                                            className="bg-green-600 h-2.5 rounded-full"
                                                            style={{ width: `${crossCuttingReports?.complianceRate || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="text-sm text-gray-600 mb-3">Document Status</p>
                                                    <div className="space-y-3">
                                                        {tenantReports?.documentCompliance && (
                                                            <>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-gray-600">ID Verification</span>
                                                                    <span className="text-xs font-medium">
                                                                        {tenantReports.documentCompliance.filter((t: any) => t.documents.id).length} / {tenantReports.documentCompliance.length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-gray-600">Lease Agreement</span>
                                                                    <span className="text-xs font-medium">
                                                                        {tenantReports.documentCompliance.filter((t: any) => t.documents.leaseAgreement).length} / {tenantReports.documentCompliance.length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-gray-600">Income Proof</span>
                                                                    <span className="text-xs font-medium">
                                                                        {tenantReports.documentCompliance.filter((t: any) => t.documents.incomeProof).length} / {tenantReports.documentCompliance.length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-gray-600">Emergency Contact</span>
                                                                    <span className="text-xs font-medium">
                                                                        {tenantReports.documentCompliance.filter((t: any) => t.documents.emergencyContact).length} / {tenantReports.documentCompliance.length}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FINANCIAL REPORTS */}
                            {(selectedReportType === 'all' || selectedReportType === 'financial' || filteredReportCategories.includes('financial')) && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">💰</span>
                                            <h2 className="font-serif text-xl text-gray-900">Financial Reports</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Revenue tracking, payment methods, and late payments</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Financial Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-green-50 rounded-xl p-4">
                                                <p className="text-green-600 text-xs font-medium">Total Revenue</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">${financialReports?.summary?.totalRevenue?.toLocaleString() || 0}</p>
                                                <p className="text-xs text-gray-600 mt-1">From {consolidatedData.payments?.filter((p: any) => p.status?.toLowerCase() === 'paid').length || 0} payments</p>
                                            </div>
                                            <div className="bg-yellow-50 rounded-xl p-4">
                                                <p className="text-yellow-600 text-xs font-medium">Pending</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">${financialReports?.summary?.totalPending?.toLocaleString() || 0}</p>
                                                <p className="text-xs text-gray-600 mt-1">Awaiting payment</p>
                                            </div>
                                            <div className="bg-red-50 rounded-xl p-4">
                                                <p className="text-red-600 text-xs font-medium">Outstanding</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">${financialReports?.summary?.totalOverdue?.toLocaleString() || 0}</p>
                                                <p className="text-xs text-gray-600 mt-1">{financialReports?.summary?.latePaymentCount || 0} tenants behind</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <p className="text-blue-600 text-xs font-medium">Monthly Potential</p>
                                                <p className="text-2xl font-serif text-gray-900 mt-1">${propertyReports?.summary?.totalMonthlyRentPotential?.toLocaleString() || 0}</p>
                                                <p className="text-xs text-gray-600 mt-1">Expected monthly revenue</p>
                                            </div>
                                        </div>

                                        {/* Monthly Revenue Trend */}
                                        {financialReports?.monthlyRevenue && financialReports.monthlyRevenue.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-medium text-gray-900 mb-3">📊 Monthly Revenue Trend</h3>
                                                <div className="overflow-x-auto">
                                                    <div className="flex items-end space-x-6 min-w-max p-4 bg-gray-50 rounded-xl">
                                                        {financialReports.monthlyRevenue.map((month: any) => {
                                                            const maxRevenue = Math.max(...financialReports.monthlyRevenue.map((m: any) => m.paid))
                                                            const barHeight = maxRevenue > 0 ? (month.paid / maxRevenue) * 120 : 0

                                                            return (
                                                                <div key={month.month} className="flex flex-col items-center">
                                                                    <div className="relative flex items-end h-32">
                                                                        <div
                                                                            className="w-12 bg-[#876D4A] rounded-t-lg transition-all duration-500"
                                                                            style={{
                                                                                height: `${Math.max(20, barHeight)}px`,
                                                                                opacity: 0.9
                                                                            }}
                                                                        >
                                                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900 whitespace-nowrap">
                                                                                ${month.paid.toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs font-medium text-gray-700 mt-4">{month.month}</p>
                                                                    <p className="text-[10px] text-gray-500">{month.count} payments</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Method Usage & Late Payments */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {financialReports?.paymentMethodUsage && financialReports.paymentMethodUsage.length > 0 && (
                                                <div>
                                                    <h3 className="font-medium text-gray-900 mb-3">💳 Payment Method Usage</h3>
                                                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                                                        {financialReports.paymentMethodUsage.map((method: any) => (
                                                            <div key={method.method} className="flex items-center">
                                                                <span className="text-sm text-gray-700 w-32 font-medium">{method.method}</span>
                                                                <div className="flex-1 mx-4">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div
                                                                            className="bg-[#876D4A] h-2.5 rounded-full"
                                                                            style={{ width: `${method.percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-sm font-semibold text-gray-900">{method.percentage}%</span>
                                                                    <span className="text-xs text-gray-500 ml-1">({method.count})</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {financialReports?.latePayments && financialReports.latePayments.length > 0 && (
                                                <div>
                                                    <h3 className="font-medium text-gray-900 mb-3">⚠️ Outstanding Balances</h3>
                                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                        {financialReports.latePayments.slice(0, 5).map((payment: any) => (
                                                            <div key={payment.id} className="flex justify-between items-center py-3 border-b border-red-200 last:border-0">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{payment.tenantName}</p>
                                                                    <p className="text-xs text-gray-600">{payment.propertyName} • ${payment.monthlyRent.toLocaleString()}/mo</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-bold text-red-600">${payment.amount.toLocaleString()}</p>
                                                                    <p className="text-xs text-gray-600">Outstanding balance</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CROSS-CUTTING REPORTS */}
                            {(selectedReportType === 'all' || selectedReportType === 'cross' || filteredReportCategories.includes('cross')) && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">🔄</span>
                                            <h2 className="font-serif text-xl text-gray-900">Cross-Cutting Reports</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Integrated analytics across properties, tenants, and payments</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Top Revenue Properties & Forecast */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {crossCuttingReports?.topRevenueProperties && crossCuttingReports.topRevenueProperties.length > 0 && (
                                                <div>
                                                    <h3 className="font-medium text-gray-900 mb-3">🏆 Top Revenue Properties</h3>
                                                    <div className="space-y-3">
                                                        {crossCuttingReports.topRevenueProperties.slice(0, 5).map((property: any, index: number) => (
                                                            <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center space-x-3">
                                                                    <span className={`text-sm font-bold ${index === 0 ? 'text-yellow-600' :
                                                                        index === 1 ? 'text-gray-500' :
                                                                            index === 2 ? 'text-amber-700' : 'text-gray-600'
                                                                        }`}>
                                                                        #{index + 1}
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{property.name}</p>
                                                                        <p className="text-xs text-gray-600">{property.tenants} tenants • ${property.monthlyRentPotential.toLocaleString()}/mo potential</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm font-bold text-[#876D4A]">${property.revenue?.toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {crossCuttingReports?.revenueForecast && crossCuttingReports.revenueForecast.length > 0 && (
                                                <div>
                                                    <h3 className="font-medium text-gray-900 mb-3">📈 Revenue Forecast</h3>
                                                    <div className="space-y-4">
                                                        {crossCuttingReports.revenueForecast.map((forecast: any) => (
                                                            <div key={forecast.month} className="p-4 bg-gray-50 rounded-lg">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <p className="text-sm font-semibold text-gray-900">{forecast.month}</p>
                                                                    <p className="text-sm font-bold text-[#876D4A]">${forecast.expected?.toLocaleString()}</p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="text-xs text-gray-600 mr-2 w-16">Confidence:</span>
                                                                    <div className="flex-1">
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-green-600 h-2 rounded-full"
                                                                                style={{ width: `${forecast.confidence}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs font-medium text-gray-700 ml-2">{forecast.confidence}%</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lease Expiration Alerts */}
                                        {crossCuttingReports?.expiringLeases && crossCuttingReports.expiringLeases.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="font-medium text-gray-900 mb-3">🔔 Lease Expiration Alerts (Next 30 Days)</h3>
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {crossCuttingReports.expiringLeases.map((lease: any, index: number) => (
                                                            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{lease.tenantName}</p>
                                                                    <p className="text-xs text-gray-600">{lease.propertyName}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-bold text-amber-600">{lease.daysRemaining} days</p>
                                                                    <p className="text-xs text-gray-500">Ends {new Date(lease.leaseEnd).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Document Compliance Summary */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-[#f8f6f2] to-[#f0ede6] rounded-xl p-5 border border-gray-200">
                                                <h3 className="font-medium text-gray-900 mb-3">📄 Tenant Document Compliance</h3>
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <p className="text-4xl font-serif text-gray-900 mb-1">{crossCuttingReports?.complianceRate || 0}%</p>
                                                        <p className="text-sm text-gray-600">Overall compliance rate</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            {tenantReports?.documentCompliance?.filter((t: any) => t.complianceScore >= 100).length || 0} fully compliant
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {tenantReports?.documentCompliance?.filter((t: any) => t.complianceScore < 100 && t.complianceScore > 0).length || 0} partially compliant
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link href="/dashboard/reports/compliance" className="text-sm text-[#876D4A] hover:text-[#756045] font-medium transition-colors">
                                                        View detailed compliance report →
                                                    </Link>
                                                </div>
                                            </div>

                                            {crossCuttingReports?.topRevenueProperties && crossCuttingReports.topRevenueProperties.length > 0 && (
                                                <div className="bg-gradient-to-br from-[#f8f6f2] to-[#f0ede6] rounded-xl p-5 border border-gray-200">
                                                    <h3 className="font-medium text-gray-900 mb-2">📊 Portfolio Performance</h3>
                                                    <p className="text-sm text-gray-600 mb-2">Top performing property</p>
                                                    <p className="text-lg font-semibold text-gray-900">{crossCuttingReports.topRevenueProperties[0]?.name || 'N/A'}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <p className="text-sm text-gray-600">Total revenue</p>
                                                        <p className="text-lg font-bold text-[#876D4A]">
                                                            ${crossCuttingReports.topRevenueProperties[0]?.revenue?.toLocaleString() || 0}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p className="text-sm text-gray-600">Monthly potential</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ${crossCuttingReports.topRevenueProperties[0]?.monthlyRentPotential?.toLocaleString() || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Generate Reports */}
                        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="font-serif text-lg text-gray-900 mb-4">⚡ Quick Generate Reports</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    'Monthly Income Statement',
                                    'Occupancy Report',
                                    'Expense Breakdown',
                                    'Tenant Payment History',
                                    'Lease Expiration Report',
                                    'Tax Preparation Summary',
                                    'Portfolio Performance',
                                    'Document Compliance'
                                ].map((report, index) => (
                                    <button
                                        key={index}
                                        className="border border-[#876D4A] text-[#876D4A] py-3 px-2 rounded-lg hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm font-medium"
                                    >
                                        {report}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}