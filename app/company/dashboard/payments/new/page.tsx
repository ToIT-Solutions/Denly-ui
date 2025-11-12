// app/dashboard/payments/new/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function RecordPaymentPage() {
    usePageTitle('New Payment - Denly')

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data: any) => {
        console.log('Payment recorded:', data)
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/company/dashboard/payments" className="hover:text-[#876D4A] transition-colors">Payments</Link>
                            <span>›</span>
                            <span>Record Payment</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Record Payment</h1>
                        <p className="text-gray-600 text-sm">Enter payment details</p>
                    </div>

                    {/* Simple Payment Form */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Property */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property *
                                </label>
                                <input
                                    type="text"
                                    {...register('property', { required: 'Property is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                    placeholder="Enter property name"
                                />
                                {errors.property && (
                                    <p className="text-red-600 text-xs mt-1">{errors.property.message?.toString()}</p>
                                )}
                            </div>

                            {/* Tenant */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tenant *
                                </label>
                                <input
                                    type="text"
                                    {...register('tenant', { required: 'Tenant is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                    placeholder="Enter tenant name"
                                />
                                {errors.tenant && (
                                    <p className="text-red-600 text-xs mt-1">{errors.tenant.message?.toString()}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('amount', {
                                            required: 'Amount is required',
                                            min: { value: 0, message: 'Amount must be positive' }
                                        })}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-black placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-red-600 text-xs mt-1">{errors.amount.message?.toString()}</p>
                                )}
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Date *
                                </label>
                                <input
                                    type="date"
                                    {...register('paymentDate', { required: 'Payment date is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                                {errors.paymentDate && (
                                    <p className="text-red-600 text-xs mt-1">{errors.paymentDate.message?.toString()}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#876D4A] text-white rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium"
                                >
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}