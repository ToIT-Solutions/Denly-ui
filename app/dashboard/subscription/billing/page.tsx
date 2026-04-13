"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { useFetchAllBilling } from '@/hooks/useBilling'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllProperties } from '@/hooks/useProperty'
import { useFetchSubscriptionData, useFetchSubscriptionPlans } from '@/hooks/useSubscription'
import { formatDate } from '@/lib/dateFormatter'
import { CAN_EDIT } from '@/lib/roles'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'

export default function BillingPage() {
    usePageTitle('Billing & Subscription - Denly')

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const params = useSearchParams()
    const subState = params.get('state')
    // console.log(subState)

    const { data, isLoading, error } = useFetchSubscriptionData()
    const refinedData = data?.[0]
    // console.log(refinedData)

    const { data: propertyData } = useFetchAllProperties()

    const { data: subPlan, isLoading: loadingPlans, error: plansError } = useFetchSubscriptionPlans()
    // console.log(subPlan)

    const { data: billing, isLoading: loadingBilling } = useFetchAllBilling()
    // console.log(billing)



    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            {/* {subState === 'no-sub' ?
                null
                : */}
            <Navbar />
            {/* } */}

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Billing & Subscription (Beta)</h1>
                        <p className="text-gray-600 text-sm">Manage your subscription and payment methods</p>
                    </div>

                    {subState === 'no-sub' ?
                        <div className=" mb-3">
                            {/* Current Plan & Billing Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-red-300 rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <p className='text-black text-center font-semibold text-xl'>
                                        Your subscription has expired, you need to pay now to continue to manage your properties
                                    </p>
                                </div>
                            </div>
                        </div>
                        : null}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Plan & Billing Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Plan Card */}
                            {isLoading ?
                                <Spinner />
                                :
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div>
                                            <h2 className="font-medium text-gray-900 mb-2">Current Plan</h2>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl font-bold text-gray-900">{refinedData?.subscriptionPlan?.name}</span>
                                                <span className={`px-2 py-1 ${refinedData?.status === 'active' ? 'bg-green-100 text-green-800' : refinedData?.status === 'expired' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}  rounded-full text-xs font-medium`}>
                                                    {refinedData?.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-0 text-right">
                                            <div className="text-2xl font-bold text-gray-900">${refinedData?.subscriptionPlan?.priceMonthly}
                                            </div>
                                            <p className="text-md text-gray-600">Next billing:
                                                <span></span>{formatDate(refinedData?.currentPeriodEnd)}
                                            </p>
                                        </div>
                                    </div>

                                    {refinedData?.subscriptionPlan ?
                                        <div className="border-t border-gray-200 pt-4 mb-2">
                                            <h3 className="font-medium text-gray-900 mb-3">Plan Features</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {refinedData?.subscriptionPlan?.features.map((feature: any, index: any) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-gray-700 text-xs">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        :
                                        null}

                                    {/* <div className="border-t border-gray-200 pt-4 flex space-x-3">
                                        <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-300 transition-colors text-xs font-medium">
                                            Cancel Subscription
                                        </button>
                                        <button className="px-3 py-2 bg-[#876D4A] text-white rounded-lg hover:bg-[#756045] transition-colors text-xs font-medium">
                                            Upgrade Plan
                                        </button>
                                    </div> */}
                                </div>
                            }

                            {/* Future Plans */}
                            {billing && billing.length > 0 && (
                                (() => {
                                    const now = new Date();
                                    const futureBills = billing.filter((b: any) =>
                                        b.status === "success" && new Date(b.startDate) > now
                                    );

                                    if (futureBills.length === 0) return null;

                                    return (
                                        <div className="relative p-1 mb-6 rounded-xl"
                                            style={{ background: 'linear-gradient(90deg, #FDE8C5, #F5A55D, #876D4A)' }}>
                                            <div className="bg-white rounded-lg p-4 border border-transparent shadow-lg">
                                                <h2 className="font-semibold text-xl text-gray-900 mb-4">Future Subscription Plan(s)</h2>
                                                <div className="space-y-3">
                                                    {futureBills.map((b: any) => (
                                                        <div key={b.id} className="p-3 rounded-lg border-l-4 border-orange-400 bg-orange-50 shadow-sm">
                                                            <p className="text-md text-gray-800 font-semibold">Subscription Plan: {b.planName}</p>
                                                            <p className="text-md text-gray-700">
                                                                <span className='font-bold'>Amount:</span> ${Number(b.amount)}
                                                            </p>
                                                            <p className="text-md text-gray-700">
                                                                <span className='font-bold'>Starts:</span> {formatDate(b.startDate)} | <span className='font-bold'>Ends:</span>  {formatDate(b.dueDate)}
                                                            </p>
                                                            <p className="text-md text-gray-700">
                                                                <span className='font-bold'>Billing Period:</span>  {b.billingPeriod}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            )}

                            {/* Payment Method */}
                            {/* <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <h2 className="font-medium text-gray-900 mb-4">Payment Method</h2>

                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                                            <span className="text-gray-600 text-xs font-medium">VISA</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">•••• {paymentMethod.last4}</p>
                                            <p className="text-xs text-gray-600">Expires {paymentMethod.expiry}</p>
                                        </div>
                                    </div>
                                    <button className="text-[#876D4A] hover:text-[#756045] transition-colors text-xs font-medium">
                                        Edit
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-700 text-xs">
                                        + Add Payment Method
                                    </button>
                                </div>
                            </div> */}

                            {/* Billing History */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <h2 className="font-medium text-gray-900 mb-4 ">Billing History</h2>

                                <div className="space-y-3">
                                    {billing?.map((billing: any) => (
                                        <Link href={`/dashboard/subscription/billing/result?bill=${billing.id}`} key={billing.id} className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#876D4A] hover:bg-gray-100  rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 text-md">Date: {formatDate(billing.createdAt, 'long')}</p>
                                                <p className="text-md text-gray-700">Subscription Plan: {billing.planName}</p>
                                                <p className="text-md text-gray-700">Billing Period: {billing.billingPeriod}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900 text-sm">${Number(billing.amount)}</p>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${billing.status === "pending"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : billing.status === "paid" || billing.status === "success"
                                                            ? "bg-green-100 text-green-800"
                                                            : billing.status === "error"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-gray-200 text-gray-800" // fallback
                                                        }`}
                                                >
                                                    {billing.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs">
                                    View Full Billing History
                                </button> */}
                            </div>
                        </div>

                        {/* Available Plans */}
                        <div className="space-y-4">
                            <h2 className="font-medium text-gray-900 mb-3">Available Plans</h2>

                            {loadingPlans ?
                                <Spinner />
                                :
                                subPlan?.map((plan: any) => (
                                    <div key={plan.id} className={`bg-white rounded-xl p-4 border-2 ${plan.isPopular ? 'border-[#876D4A]' : 'border-gray-200'} shadow-sm relative`}>
                                        {plan.isPopular && (
                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-[#876D4A] text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-4">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1">{plan.name}</h3>
                                            <div className="flex items-baseline justify-center space-x-1">
                                                <span className="text-xl font-bold text-gray-900">${plan.priceMonthly}</span>
                                                <span className="text-gray-600 text-sm">/month</span>
                                            </div>
                                            <p className="text-gray-600 text-xs mt-1">{plan.description}</p>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 text-xs">Up to {plan?.maxProperties} properties</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 text-xs">Up to {plan?.maxUsers} users</span>
                                            </div>
                                            {plan?.features?.map((feature: any, featureIndex: any) => (
                                                <div key={featureIndex} className="flex items-center space-x-2">
                                                    <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-gray-700 text-xs">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {CAN_EDIT.includes(userRole) ? (
                                            plan.name === 'Free Trial' ? null :
                                                <Link href={`/dashboard/subscription/billing/pay?plan=${plan.name.toLowerCase()}`}>
                                                    <div className={`w-full py-2 rounded-lg transition-colors text-xs text-center font-medium cursor-pointer ${refinedData?.planId === plan.id
                                                        ? 'bg-[#876D4A] text-white hover:bg-[#584935]'
                                                        : 'border border-[#876D4A] text-[#876D4A] hover:bg-[#876D4A] hover:text-white'
                                                        }`}>
                                                        {refinedData?.planId === plan.id ? 'Current Plan' : 'Switch to ' + plan.name}
                                                    </div>
                                                </Link>
                                        ) : null
                                        }
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <h2 className="font-medium text-gray-900 mb-4">Usage Statistics</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">{propertyData?.length || 0}</div>
                                <div className="text-sm text-gray-600">Properties Used</div>
                                <div className="text-sm text-gray-600">of {refinedData?.subscriptionPlan?.maxProperties} available</div>
                            </div>
                            {/* <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">24</div>
                                <div className="text-sm text-gray-600">Active Tenants</div>
                                <div className="text-sm text-gray-500">unlimited</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">156</div>
                                <div className="text-sm text-gray-600">Payments Processed</div>
                                <div className="text-sm text-gray-500">this month</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 mb-1">42%</div>
                                <div className="text-sm text-gray-600">Storage Used</div>
                                <div className="text-sm text-gray-500">of 10GB</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}