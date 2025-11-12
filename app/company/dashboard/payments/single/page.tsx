"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ViewPaymentPage() {
    usePageTitle("Payment Details - Denly")
    const params = useParams()
    const paymentId = params.id

    // Mock data for a completed payment
    const payment = {
        id: 'PAY-2024-00314',
        tenant: {
            id: 1,
            name: 'John Smith',
            email: 'john@email.com',
            phone: '(555) 123-4567',
            property: 'Downtown Loft',
            unit: 'Apt 4B'
        },
        amount: 2400,
        dueDate: '2024-03-15',
        paidDate: '2024-03-14',
        processedDate: '2024-03-14',
        status: 'Completed',
        method: 'Bank Transfer',
        reference: 'TRX-789456123',
        bankReference: 'ACH-456789123',
        period: 'March 2024',
        type: 'Monthly Rent',
        lateFee: 0,
        description: 'Monthly rent payment for Downtown Loft - Apt 4B',
        receiptNumber: 'RC-2024-00314',
        createdAt: '2024-03-14 14:30:00',
        processedBy: 'Auto-Processing System'
    }

    const paymentTimeline = [
        {
            status: 'Initiated',
            date: '2024-03-14 14:30:00',
            description: 'Payment initiated by tenant via online portal',
            completed: true
        },
        {
            status: 'Processing',
            date: '2024-03-14 14:31:00',
            description: 'Payment processing started',
            completed: true
        },
        {
            status: 'Cleared',
            date: '2024-03-14 16:45:00',
            description: 'Funds cleared and verified',
            completed: true
        },
        {
            status: 'Completed',
            date: '2024-03-14 16:46:00',
            description: 'Payment successfully completed',
            completed: true
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="mb-6">
                        <Link href="/company/dashboard/payments" className="inline-flex items-center text-[#876D4A] hover:text-[#756045] transition-colors mb-4">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Payments
                        </Link>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Payment #{payment.id}</h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                        {payment.status}
                                    </span>
                                    <span className="text-gray-600 text-sm">{payment.type}</span>
                                    <span className="text-gray-600 text-sm">{payment.period}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="bg-white border border-[#876D4A] text-[#876D4A] px-6 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm w-full sm:w-auto">
                                    Download Receipt
                                </button>
                                <button className="bg-[#876D4A] text-white px-6 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm w-full sm:w-auto">
                                    Send Receipt
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Success Banner */}
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    Payment Successfully Completed
                                </h3>
                                <p className="text-sm text-green-700 mt-1">
                                    ${payment.amount} was received on {payment.paidDate} and has been processed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Payment Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Summary Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-serif text-gray-900 mb-6">Payment Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Monthly Rent</span>
                                        <span className="text-gray-900 font-medium">${payment.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Late Fee</span>
                                        <span className="text-green-600 font-medium">${payment.lateFee}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-900 font-medium">Total Amount</span>
                                        <span className="text-2xl font-semibold text-[#876D4A]">${payment.amount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Timeline Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-serif text-gray-900 mb-6">Payment Timeline</h2>
                                <div className="space-y-6">
                                    {paymentTimeline.map((step, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                                                }`}>
                                                {step.completed && (
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <span className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-700'
                                                        }`}>
                                                        {step.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">{step.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Side Cards */}
                        <div className="space-y-6">
                            {/* Payment Information Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-serif text-gray-900 mb-4">Payment Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Payment Method</label>
                                        <p className="text-gray-900 font-medium">{payment.method}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Reference Number</label>
                                        <p className="text-gray-900 font-mono text-sm">{payment.reference}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Bank Reference</label>
                                        <p className="text-gray-900 font-mono text-sm">{payment.bankReference}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Receipt Number</label>
                                        <p className="text-gray-900 font-mono text-sm">{payment.receiptNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Due Date</label>
                                        <p className="text-gray-900">{payment.dueDate}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Paid Date</label>
                                        <p className="text-gray-900 font-medium">{payment.paidDate}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Processed By</label>
                                        <p className="text-gray-900 text-sm">{payment.processedBy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tenant Information Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-serif text-gray-900 mb-4">Tenant Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-gray-600">Tenant</label>
                                        <p className="text-gray-900 font-medium">{payment.tenant.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Property</label>
                                        <p className="text-gray-900">{payment.tenant.property}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Unit</label>
                                        <p className="text-gray-900">{payment.tenant.unit}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Email</label>
                                        <p className="text-gray-900 text-sm">{payment.tenant.email}</p>
                                    </div>
                                </div>
                                <Link href={`/company/dashboard/tenants/${payment.tenant.id}`}>
                                    <button className="w-full mt-4 text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-sm text-center py-2 border border-[#876D4A] rounded-xl hover:bg-[#876D4A]">
                                        View Tenant Profile
                                    </button>
                                </Link>
                            </div>

                            {/* Payment Actions Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-serif text-gray-900 mb-4">Payment Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-xl hover:border-[#876D4A] hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                        Download Receipt
                                    </button>
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-xl hover:border-[#876D4A] hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                        Email Receipt to Tenant
                                    </button>
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-sm">
                                        Report Issue
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