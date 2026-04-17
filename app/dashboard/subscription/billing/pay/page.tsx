// app/dashboard/subscription/billing/pay/page.tsx
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchSubscriptionPlans } from '@/hooks/useSubscription'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import PayNow from '@/public/img/payNow.svg'
import Image from 'next/image'
import { useCreatePayment } from '@/hooks/useBilling'

export default function PaymentPage() {
    usePageTitle('Complete Payment - Denly')

    const searchParams = useSearchParams()
    const router = useRouter()
    const planName = searchParams.get('plan')?.toLowerCase()

    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

    // Form states
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')

    const { data: plans, isLoading, error } = useFetchSubscriptionPlans()
    const { mutate, isPending } = useCreatePayment()
    // //console.log(plans)

    // Find the selected plan
    const selectedPlan = plans?.find(
        (plan: any) => plan.name.toLowerCase() === planName
    )

    const selectedPlanId = plans?.find(
        (plan: any) => plan.name.toLowerCase() === planName
    )

    // //console.log(selectedPlanId?.id) //id that will then be sent to the backend

    const handlePayment = () => {
        const data = {
            planId: selectedPlanId?.id,
            billingCycle: billingCycle
        }

        mutate(data)
        // //console.log(data)
    }

    // If plan not found, show error
    if (!isLoading && !selectedPlan && planName) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
                <Navbar />
                <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-serif text-gray-900 mb-2">Plan Not Found</h2>
                            <p className="text-gray-600 mb-6">The subscription plan you're looking for doesn't exist.</p>
                            <Link
                                href="/dashboard/subscription/billing"
                                className="inline-block px-6 py-2 bg-[#876D4A] text-white rounded-lg hover:bg-[#756045] transition-colors"
                            >
                                Return to Billing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Format price
    const getPrice = () => {
        if (!selectedPlan) return 0
        return billingCycle === 'monthly'
            ? selectedPlan.priceMonthly
            : selectedPlan.priceYearly
    }

    const getTotal = () => {
        return getPrice()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false)
            // Redirect to success page or billing page
            router.push('/dashboard/subscription/billing?payment=success')
        }, 2000)

        // Here you would integrate with your payment gateway (Stripe, etc.)
        // const paymentData = {
        //     planId: selectedPlan.id,
        //     planName: selectedPlan.name,
        //     amount: getTotal(),
        //     billingCycle,
        //     paymentMethod,
        //     cardDetails: {
        //         last4: cardNumber.slice(-4),
        //         cardName,
        //         expiry: expiryDate
        //     }
        // }
        // await processPayment(paymentData)
    }

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    // Format expiry date (MM/YY)
    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '')
        }
        return v
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
                <Navbar />
                <div className="pt-32 flex justify-center">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/dashboard/subscription/billing" className="hover:text-[#876D4A] transition-colors">
                                Billing
                            </Link>
                            <span>›</span>
                            <span>Complete Payment</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Complete Payment</h1>
                        <p className="text-gray-600 text-sm">Review your plan and complete the payment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h2 className="font-medium text-gray-900 mb-6">Payment Details</h2>

                                {/* Billing Cycle Toggle */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Billing Cycle
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === 'monthly'
                                                ? 'bg-[#876D4A] text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBillingCycle('yearly')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === 'yearly'
                                                ? 'bg-[#876D4A] text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Yearly
                                            {/* {selectedPlan && (
                                                <span className="ml-1 text-xs">
                                                    (Save ${selectedPlan.priceYearly - selectedPlan.priceMonthly * 12})
                                                </span>
                                            )} */}
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                {/* <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('card')}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'card'
                                                ? 'bg-[#876D4A] text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Credit Card
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'paypal'
                                                ? 'bg-[#876D4A] text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.067 8.478c.492.88.556 2.014.3 3.037-.324 1.296-1.203 2.252-2.263 2.668-.855.336-1.84.34-2.744.143-.355-.077-.706-.171-1.057-.266-.408-.111-.81-.225-1.214-.263-.443-.042-.872.022-1.292.134-.69.183-1.354.51-1.992.891-.272.164-.538.334-.805.503-.089.057-.178.113-.267.17-.191.122-.382.244-.577.363-.126.077-.253.153-.382.228-.07.041-.141.08-.212.119-.078.043-.157.085-.236.127-.122.064-.246.126-.371.186-.134.065-.27.127-.407.187-.124.054-.25.105-.376.153-.193.074-.389.139-.586.199-.115.035-.231.066-.347.093-.125.03-.251.054-.377.073-.26.04-.523.061-.786.062-.266.001-.533-.019-.799-.059-.027-.004-.054-.009-.081-.014-.248-.041-.492-.101-.732-.179-.047-.015-.093-.032-.14-.049-.094-.034-.187-.071-.279-.109-.089-.037-.177-.076-.264-.117-.073-.035-.145-.072-.217-.11-.11-.057-.219-.117-.326-.18-.083-.05-.165-.101-.245-.154-.108-.07-.214-.143-.317-.219-.077-.056-.152-.114-.226-.174-.11-.088-.217-.18-.32-.276-.078-.073-.153-.148-.226-.226-.102-.109-.2-.222-.292-.34-.067-.084-.132-.17-.194-.259-.096-.139-.185-.283-.267-.432-.062-.112-.119-.227-.172-.345-.048-.107-.092-.217-.133-.329-.056-.154-.103-.313-.141-.476-.023-.1-.043-.2-.059-.302-.022-.139-.038-.28-.049-.422-.006-.068-.009-.136-.011-.204-.001-.038-.001-.076 0-.114.001-.044.003-.087.006-.13.015-.188.042-.374.081-.558.016-.075.034-.149.053-.222.024-.089.051-.177.08-.265.046-.138.099-.273.159-.406.029-.064.06-.127.092-.19.05-.099.104-.196.16-.291.055-.094.113-.186.173-.277.069-.104.141-.205.216-.304.08-.106.163-.21.249-.311.109-.129.223-.253.342-.373.059-.06.119-.118.18-.176.119-.113.243-.22.371-.323.058-.047.117-.092.176-.136.133-.099.27-.192.41-.28.057-.036.115-.07.173-.104.133-.078.27-.15.409-.217.054-.026.109-.05.164-.074.142-.062.286-.118.432-.168.059-.02.118-.038.177-.056.144-.042.29-.077.438-.105.069-.013.138-.024.207-.034.142-.02.285-.033.428-.04.033-.002.066-.002.099-.002.164.002.328.016.49.042.104.017.207.037.31.06.167.036.332.08.495.133.078.025.156.052.233.081.13.05.259.104.385.162.06.027.12.056.179.086.115.058.228.12.339.185.06.035.12.072.179.11.111.07.22.144.327.221.064.046.127.094.188.143.103.083.202.17.299.26.067.062.132.126.195.192.101.106.196.217.286.333.058.075.113.152.166.23.07.104.135.21.195.319.05.09.096.182.139.275.048.104.091.21.129.318.035.098.066.197.092.297.04.154.068.312.083.471.008.082.013.164.014.246.001.047.001.094 0 .141-.002.045-.005.089-.009.134-.01.101-.027.201-.049.3-.016.073-.035.146-.057.218-.04.13-.09.257-.147.381-.028.062-.058.124-.09.184-.056.108-.117.213-.182.316-.055.087-.113.172-.173.256-.088.123-.182.241-.281.355-.062.071-.126.14-.192.207-.103.103-.211.2-.323.292-.06.049-.121.097-.183.143-.102.075-.207.146-.315.213-.074.047-.15.091-.227.133-.096.053-.194.102-.294.148-.085.039-.172.074-.26.106-.113.041-.228.075-.345.104-.107.026-.216.045-.326.058-.122.014-.246.019-.37.015z" />
                                            </svg>
                                            PayPal
                                        </button>
                                    </div>
                                </div> */}

                                {/* Card Details Form */}
                                {/* {paymentMethod === 'card' && (
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                                    placeholder="123"
                                                    maxLength={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                )} */}

                                {/* PayPal Info */}
                                {paymentMethod === 'paypal' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-blue-800 font-medium mb-1">Pay with PayPal</p>
                                                <p className="text-xs text-blue-600">
                                                    You will be redirected to PayPal to complete your payment securely.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-24">
                                <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>

                                {/* Plan Details */}
                                <div className="border-b border-gray-200 pb-4 mb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedPlan?.name}</p>
                                            <p className="text-xs text-gray-600">{selectedPlan?.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${getPrice()}</p>
                                            <p className="text-xs text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
                                        </div>
                                    </div>

                                    {/* Features Preview */}
                                    <div className="space-y-1 mt-3">
                                        {selectedPlan?.features?.slice(0, 12).map((feature: string, index: number) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-xs text-gray-600">{feature}</span>
                                            </div>
                                        ))}
                                        {selectedPlan?.features?.length > 12 && (
                                            <p className="text-xs text-gray-500 mt-1">+{selectedPlan.features.length - 12} more features</p>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">${getPrice()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">$0.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between font-medium">
                                            <span className="text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-[#876D4A]">${getTotal()}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {billingCycle === 'monthly'
                                                ? 'Billed monthly'
                                                : 'Billed annually'}
                                        </p>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                {/* <button
                                    onClick={handleSubmit}
                                    disabled={isProcessing || (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvv))}
                                    className="w-full py-3 bg-[#876D4A] text-white rounded-xl hover:bg-[#756045] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay $${getTotal()}`
                                    )}
                                </button> */}

                                <Image src={PayNow} alt='PayNow Button' className='mt-2 cursor-pointer mx-auto' onClick={handlePayment} />

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    By completing this payment, you agree to our Terms of Service and Privacy Policy.
                                </p>

                                {/* Secure Payment Badge */}
                                {/* <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Secure payment powered by Stripe</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}