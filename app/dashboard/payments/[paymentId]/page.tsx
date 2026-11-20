"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import DetailUnavailable from '@/components/DetailUnavailable'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchOnePayment } from '@/hooks/usePayment'
import { formatDate } from '@/lib/dateFormatter'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ViewPaymentPage() {
    usePageTitle('Payment Details - Denly')
    const { paymentId } = useParams<{ paymentId: string }>()
    const { data: payment, isLoading, error } = useFetchOnePayment(paymentId)

    // Show the authorized saved allocation; no provider settlement is implied.
    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />
            {isLoading ? <Spinner /> : error || !payment ? (
                <DetailUnavailable error={error} href="/dashboard/payments" label="Payments" />
            ) : (
                <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
                    <Link href="/dashboard/payments" className="text-[#876D4A] underline">Back to Payments</Link>
                    <h1 className="text-3xl font-serif text-gray-900 my-6">Payment Details</h1>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-600">Recorded rent allocation</p>
                        <p className="text-3xl text-[#876D4A] my-4">${formatMoney(payment.amountPaid)}</p>
                        <dl className="grid sm:grid-cols-2 gap-5 text-gray-900">
                            <div><dt className="text-gray-600">Receipt number</dt><dd className="break-all">{payment.receiptNumber}</dd></div>
                            <div><dt className="text-gray-600">Payment method</dt><dd>{payment.paymentMethod}</dd></div>
                            <div><dt className="text-gray-600">Payment date</dt><dd>{formatDate(payment.paymentDate, 'long')}</dd></div>
                            <div><dt className="text-gray-600">Recorded at</dt><dd>{formatDate(payment.createdAt, 'long')}</dd></div>
                            <div><dt className="text-gray-600">Tenant</dt><dd>{payment.tenant.firstName} {payment.tenant.lastName}</dd></div>
                            <div><dt className="text-gray-600">Property</dt><dd>{payment.rentLedger.property.name}</dd></div>
                            <div><dt className="text-gray-600">Rent period</dt><dd>{formatDate(payment.rentLedger.periodStart)} to {formatDate(payment.rentLedger.periodEnd)}</dd></div>
                            <div><dt className="text-gray-600">Payment ID</dt><dd className="break-all">{payment.id}</dd></div>
                        </dl>
                        <Link href={`/dashboard/tenants/${payment.tenantId}`} className="inline-block mt-6 text-[#876D4A] underline">View Tenant Profile</Link>
                    </div>
                </div>
            )}
        </div>
    )
}
