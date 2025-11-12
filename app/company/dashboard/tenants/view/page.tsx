"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ViewTenantPage() {
    usePageTitle("Tenant Details - Denly")
    const params = useParams()
    const tenantId = params.id

    // Mock data - in real app, you'd fetch this based on tenantId
    const tenant = {
        id: 1,
        name: 'John Smith',
        email: 'john@email.com',
        phone: '(555) 123-4567',
        property: 'Downtown Loft',
        address: '123 Main St, New York, NY 10001',
        rent: 2400,
        rentDueDate: '15th of each month',
        leaseStart: '2024-01-01',
        leaseEnd: '2024-12-31',
        status: 'Current',
        emergencyContact: {
            name: 'Jane Smith',
            phone: '(555) 987-6543',
            relationship: 'Spouse'
        },
        documents: ['Lease Agreement', 'ID Verification', 'Insurance Certificate']
    }

    const paymentHistory = [
        { date: '2024-03-15', amount: 2400, status: 'Paid', method: 'Bank Transfer' },
        { date: '2024-02-15', amount: 2400, status: 'Paid', method: 'Bank Transfer' },
        { date: '2024-01-15', amount: 2400, status: 'Paid', method: 'Credit Card' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/company/dashboard/tenants" className="hover:text-[#876D4A] transition-colors">Tenants</Link>
                            <span>›</span>
                            <span>John Smith</span>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-serif text-gray-900 mb-2">{tenant.name}</h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs ${tenant.status === 'Current'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {tenant.status}
                                    </span>
                                    <span className="text-gray-600 text-xs">Tenant ID: #{tenant.id}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href={`/company/dashboard/tenants/${tenantId}/edit`}>
                                    <button className="bg-white border border-[#876D4A] text-[#876D4A] px-5 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm w-full sm:w-auto font-medium">
                                        Edit Tenant
                                    </button>
                                </Link>
                                {/* <button className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm w-full sm:w-auto font-medium">
                                    Send Message
                                </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Tenant Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-medium text-gray-900 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-600">Email</label>
                                        <p className="text-gray-900 text-sm">{tenant.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Phone</label>
                                        <p className="text-gray-900 text-sm">{tenant.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Property</label>
                                        <p className="text-gray-900 text-sm">{tenant.property}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Address</label>
                                        <p className="text-gray-900 text-sm">{tenant.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Lease Information Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-medium text-gray-900 mb-4">Lease Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-600">Monthly Rent</label>
                                        <p className="text-xl font-semibold text-[#876D4A]">${tenant.rent}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Rent Due Date</label>
                                        <p className="text-gray-900 text-sm">{tenant.rentDueDate}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Lease Start</label>
                                        <p className="text-gray-900 text-sm">{tenant.leaseStart}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Lease End</label>
                                        <p className="text-gray-900 text-sm">{tenant.leaseEnd}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-medium text-gray-900 mb-4">Payment History</h2>
                                <div className="space-y-3">
                                    {paymentHistory.map((payment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">${payment.amount}</p>
                                                <p className="text-xs text-gray-600">{payment.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                                <p className="text-xs text-gray-600 mt-1">{payment.method}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Side Cards */}
                        <div className="space-y-6">
                            {/* Emergency Contact Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h2 className="font-medium text-gray-900 mb-3">Emergency Contact</h2>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-600">Name</label>
                                        <p className="text-gray-900 text-sm">{tenant.emergencyContact.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Phone</label>
                                        <p className="text-gray-900 text-sm">{tenant.emergencyContact.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Relationship</label>
                                        <p className="text-gray-900 text-sm">{tenant.emergencyContact.relationship}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h2 className="font-medium text-gray-900 mb-3">Documents</h2>
                                <div className="space-y-2">
                                    {tenant.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border border-gray-100 rounded-2xl">
                                            <span className="text-gray-900 text-xs">{doc}</span>
                                            <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-xs">
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 border-2 border-dashed border-gray-300 text-gray-600 py-2 rounded-2xl hover:border-[#876D4A] hover:text-[#876D4A] transition-colors cursor-pointer text-xs">
                                    + Upload New Document
                                </button>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h2 className="font-medium text-gray-900 mb-3">Quick Actions</h2>
                                <div className="space-y-2">
                                    <button className="w-full text-left p-2 border border-gray-200 rounded-2xl hover:border-[#876D4A] hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-xs">
                                        Record Payment
                                    </button>
                                    <button className="w-full text-left p-2 border border-gray-200 rounded-2xl hover:border-[#876D4A] hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-xs">
                                        Send Reminder
                                    </button>
                                    <button className="w-full text-left p-2 border border-gray-200 rounded-2xl hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-xs">
                                        Terminate Lease
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}