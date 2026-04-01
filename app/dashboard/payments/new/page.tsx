'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllProperties } from '@/hooks/useProperty'
import { useAddPayment, useFetchOnePayment } from '@/hooks/usePayment'
import Spinner from '@/components/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'

interface Property {
    id: string
    name: string
    address: string
    propertyType: string
    monthlyRent: string
    status: string
    tenants?: Tenant[]
}

interface Tenant {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    actualRent?: number
}

interface PaymentFormData {
    // id?: string
    propertyId: string
    tenantId: string
    amountPaid: number
    paymentDate: string
    paymentMethod?: string
    notes?: string
    duration: number
}

export default function RecordPaymentPage() {
    usePageTitle('New Payment - Denly')

    const { data: propertyData, isPending: propertyPending } = useFetchAllProperties() as {
        data: Property[] | undefined
        isPending: boolean
    }


    const router = useRouter()
    const { mutate: paymentMutate, isPending } = useAddPayment()

    // const { data, isPending: dataPending } = useFetchOnePayment(id as string)
    // console.log(data)

    const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
    const [expectedAmount, setExpectedAmount] = useState<number | null>(null)

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PaymentFormData>()

    const watchedProperty = watch('propertyId')
    const watchedDuration = watch('duration')

    // Update tenants when property changes
    useEffect(() => {

        if (watchedProperty) {
            const selectedProp = propertyData?.find(p => p.id === watchedProperty)
            setAvailableTenants(selectedProp?.tenants || [])
            setValue('tenantId', '')
        } else {
            setAvailableTenants([])
        }
    }, [watchedProperty, propertyData, setValue])

    // Calculate expected amount
    useEffect(() => {
        if (watchedProperty && watchedDuration) {
            const selectedProp = propertyData?.find(p => p.id === watchedProperty)
            const monthlyRent = selectedProp?.tenants?.[0]?.actualRent || parseFloat(selectedProp?.monthlyRent || '0')
            const totalAmount = monthlyRent * watchedDuration
            setExpectedAmount(totalAmount)
            setValue('amountPaid', totalAmount)
        } else {
            setExpectedAmount(null)
        }
    }, [watchedProperty, watchedDuration, propertyData, setValue])

    const onSubmit: SubmitHandler<PaymentFormData> = (data) => {

        const payload: PaymentFormData = {
            ...data,
            amountPaid: Number(data.amountPaid),
        }

        paymentMutate(payload)
        // console.log(payload)
    }

    const months = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />
            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/dashboard/payments" className="hover:text-[#876D4A] transition-colors">Payments</Link>
                            <span>›</span>
                            <span>Record Payment</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Record Payment</h1>
                        <p className="text-gray-600 text-sm">Enter payment details</p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        {/* <div className='text-black'>You are about to record payment details for :-
                            <div className='text-black'>Name: {data?.tenant?.firstName + ' ' + data?.tenant?.lastName + ' '}</div>
                            <div className='text-black'>Property: {data?.property?.name} ({data?.property?.address})</div>
                            <div className='text-black'>Monthly Rent: ${data?.tenant?.actualRent} </div>
                            <div className='text-black'></div>
                        </div> */}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                            {/* Property*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                                <select
                                    {...register('propertyId', { required: 'Property is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                >
                                    <option value="">Select a property</option>
                                    {propertyData?.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - {p.address} | (${p.monthlyRent}/month)
                                        </option>
                                    ))}
                                </select>
                                {errors.propertyId && <p className="text-red-600 text-xs mt-1">{errors.propertyId.message}</p>}
                            </div>

                            {/* Tenant */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
                                <select
                                    {...register('tenantId', { required: 'Tenant is required' })}
                                    disabled={!watchedProperty}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                >
                                    <option value="">{watchedProperty ? 'Select a tenant' : 'Select a property first'}</option>
                                    {availableTenants.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.firstName} {t.lastName} | (${t.actualRent || '0'}/month)
                                        </option>
                                    ))}
                                </select>
                                {errors.tenantId && <p className="text-red-600 text-xs mt-1">{errors.tenantId.message}</p>}
                            </div>

                            {/* Duration */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Duration (Months) *</label>
                                <select
                                    {...register('duration', {
                                        required: 'Duration is required',
                                        min: { value: 1, message: 'Minimum 1 month' },
                                        max: { value: 12, message: 'Maximum 12 months' }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                >
                                    <option value="">Select duration</option>
                                    {months.map(m => (
                                        <option key={m} value={m}>{m} {m === 1 ? 'month' : 'months'}</option>
                                    ))}
                                </select>
                                {errors.duration && <p className="text-red-600 text-xs mt-1">{errors.duration.message}</p>}
                            </div>  */}

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)*</label>
                                <input
                                    type="text"
                                    {...register('amountPaid', { required: true, min: 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                    // value={expectedAmount || ''}
                                    onChange={(e) => setValue('amountPaid', Number(e.target.value))}
                                />
                                {/* {expectedAmount && (
                                    <p className="text-md text-orange-800 mt-1">
                                        Expected: ${expectedAmount.toFixed(2)}
                                    </p>
                                )} */}
                            </div>

                            {/* Payment Date */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                                <input
                                    type="date"
                                    {...register('paymentDate', { required: 'Payment date is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div> */}

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    {...register('paymentMethod')}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                >
                                    {/* <option value="">Not Paid</option> */}
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    {/* <option value="check">Check</option> */}
                                    {/* <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option> */}
                                    <option value="mobile_money">Mobile Money</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Notes</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-sm"
                                    placeholder="Optional notes"
                                />
                            </div>

                            {/* Actions */}
                            {isPending ? <Spinner /> :
                                <div className="flex space-x-3 pt-4">
                                    <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-[#876D4A] text-white rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer">Record Payment</button>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}