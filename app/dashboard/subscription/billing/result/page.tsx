// app/dashboard/subscription/billing/result/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import Navbar from '@/components/Navbar'
import { useFetchSubscriptionData } from '@/hooks/useSubscription'
import { useFetchBillingStatus } from '@/hooks/useBilling'
import { toast } from 'sonner'
import { formatDate } from '@/lib/dateFormatter'

type PaymentStatus = 'paid' | 'failed' | 'pending' | 'cancelled' | 'success'

export default function PaymentResultPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showDetails, setShowDetails] = useState(false)
    const [shouldShow404, setShouldShow404] = useState(false)
    const pollAttemptsRef = useRef(0)

    // Get status and other params
    const status = (searchParams.get('status') || 'pending') as PaymentStatus
    const errorCode = searchParams.get('error_code')
    const errorMessage = searchParams.get('message')

    const id = searchParams.get('bill') as string

    // Fetch billing status from your database
    const { data: billing, isPending: billingPending, refetch: refetchBilling } = useFetchBillingStatus(id)

    const { data: subscriptionData, refetch: refetchSubscription } = useFetchSubscriptionData()

    // Effect to handle polling the database for status updates
    useEffect(() => {
        let pollInterval: NodeJS.Timeout

        if (billing?.status === 'pending' && pollAttemptsRef.current < 10) {
            pollInterval = setInterval(() => {
                pollAttemptsRef.current += 1
                refetchBilling()

                // After 5 attempts, show a message if still pending
                // if (pollAttemptsRef.current === 5) {
                //     toast.info('Payment is taking longer than expected. We\'ll keep checking...', {
                //         duration: 5000,
                //     })
                // }
            }, 3000) // Poll every 3 seconds
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval)
            }
        }
    }, [billing?.status, refetchBilling])

    // Check if billing record exists
    useEffect(() => {
        if (!id) {
            toast.error("Invalid billing code")
            setShouldShow404(true)
            return
        }

        if (!billingPending) {
            if (!billing || billing.length === 0) {
                toast.error("Billing record not found")
                setShouldShow404(true)
            }
        }
    }, [id, billing, billingPending])

    if (shouldShow404) {
        notFound()
        return null
    }

    // Show nothing while checking initial billing record existence
    if (billingPending) {
        return null
    }

    const currentPlan = subscriptionData?.[0]?.subscriptionPlan

    // Success-specific content
    const successContent = {
        headerBg: 'from-green-500 to-emerald-500',
        icon: (
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        title: 'Payment Successful!',
        subtitle: 'Thank you for your payment. Your subscription is now active.',
        mainButtonText: 'Go to Billing Dashboard',
        mainButtonLink: '/dashboard/subscription/billing',
        showCountdown: true
    }

    // Pending-specific content
    const pendingContent = {
        headerBg: 'from-yellow-500 to-amber-500',
        icon: (
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Payment Processing',
        subtitle: 'Your payment is being processed. This may take a few minutes.',
        mainButtonText: 'Back to Billing',
        mainButtonLink: '/dashboard/subscription/billing',
        showCountdown: false
    }

    // Cancelled-specific content
    const cancelledContent = {
        headerBg: 'from-gray-500 to-gray-600',
        icon: (
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Payment Cancelled',
        subtitle: 'You cancelled the payment process.',
        mainButtonText: 'Try Again',
        mainButtonLink: billing?.planName ? `/dashboard/subscription/billing/pay?plan=${billing?.planName}` : '/dashboard/subscription/billing',
        showCountdown: false
    }

    // Failed-specific content and helpers
    const getErrorMessage = () => {
        switch (errorCode) {
            case 'insufficient_funds':
                return 'Your card has insufficient funds. Please use a different payment method or contact your bank.'
            case 'card_declined':
                return 'Your card was declined. Please check your card details or try a different card.'
            case 'expired_card':
                return 'Your card has expired. Please use a valid card.'
            case 'incorrect_cvc':
                return 'The CVC code you entered is incorrect. Please check and try again.'
            case 'processing_error':
                return 'There was an error processing your payment. Please try again.'
            case 'network_error':
                return 'A network error occurred. Please check your connection and try again.'
            case 'authentication_required':
                return 'Additional authentication is required. Please contact your bank.'
            default:
                return errorMessage || 'We couldn\'t process your payment. Please try again or use a different payment method.'
        }
    }

    const getErrorTitle = () => {
        switch (errorCode) {
            case 'insufficient_funds':
                return 'Insufficient Funds'
            case 'card_declined':
                return 'Card Declined'
            case 'expired_card':
                return 'Expired Card'
            case 'incorrect_cvc':
                return 'Invalid CVC'
            default:
                return 'Payment Failed'
        }
    }

    const failedContent = {
        headerBg: 'from-red-500 to-rose-500',
        icon: (
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        title: 'Payment Failed',
        subtitle: "We couldn't process your payment at this time.",
        mainButtonText: 'Try Again',
        mainButtonLink: billing?.planName ? `/dashboard/subscription/billing/pay?plan=${billing?.planName}` : '/dashboard/subscription/billing',
        showCountdown: false
    }

    const getContent = () => {
        switch (billing?.status) {
            case 'paid':
            case 'success':
                return successContent
            case 'failed':
                return failedContent
            case 'cancelled':
                return cancelledContent
            case 'pending':
            default:
                return pendingContent
        }
    }

    const content = getContent()

    const handleRetry = () => {
        if (billing?.planName) {
            router.push(`/dashboard/subscription/billing/pay?plan=${billing?.planName}`)
        } else {
            router.push('/dashboard/subscription/billing')
        }
    }

    // Troubleshooting tips for failed payments
    const troubleshootingTips = [
        { title: 'Check Your Card Details', description: 'Verify that all card information is entered correctly.' },
        { title: 'Try a Different Payment Method', description: 'Use a different card or try PayPal for your payment.' },
        { title: 'Contact Your Bank', description: 'Some banks block international or large transactions.' },
        { title: 'Check Your Balance', description: 'Ensure you have sufficient funds for this transaction.' }
    ]

    // Pending tips
    const pendingTips = [
        { title: 'Processing Time', description: 'Payments typically take 10 minutes to process.' },
        { title: 'Check Your Email', description: 'We\'ll send you a confirmation once the payment is complete.' },
        { title: 'Contact Support', description: 'If it takes longer than 20 minutes, please contact us.' }
    ]

    // Cancelled tips
    const cancelledTips = [
        { title: 'No Charges Applied', description: 'Your payment was cancelled and no charges have been made.' },
        { title: 'Try Again', description: 'You can start a new payment process whenever you\'re ready.' },
        { title: 'Different Plan', description: 'Consider trying a different plan that better suits your needs.' },
        { title: 'Need Help?', description: 'Contact our support team if you encountered any issues.' }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Main Result Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className={`bg-linear-to-r ${content.headerBg} p-6 text-center`}>
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                                {billing?.status === 'pending' ? (
                                    <svg className="w-10 h-10 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                ) : (
                                    content.icon
                                )}
                            </div>
                            <h1 className="text-2xl font-serif text-white mb-2">{content.title}</h1>
                            <p className={`text-sm ${billing?.status === 'paid' ? 'text-green-100' :
                                billing?.status === 'pending' ? 'text-yellow-100' :
                                    billing?.status === 'cancelled' ? 'text-gray-100' :
                                        'text-red-100'
                                }`}>
                                {content.subtitle}
                            </p>
                        </div>

                        <div className="p-8">
                            {/* Error Message Section (Failed only) */}
                            {billing?.status === 'failed' && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-red-800 mb-1">{getErrorTitle()}</h3>
                                            <p className="text-sm text-red-700">{getErrorMessage()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cancelled Message Section (Cancelled only) */}
                            {billing?.status === 'cancelled' && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800 mb-1">Payment Cancelled</h3>
                                            <p className="text-sm text-gray-700">
                                                You chose to cancel the payment process. No charges have been made to your account.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pending Message Section (Pending only) */}
                            {billing?.status === 'pending' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-yellow-800 mb-1">Payment Processing</h3>
                                            <p className="text-sm text-yellow-700">
                                                Your payment is being processed. This may take a few minutes.
                                                We'll update this page automatically once it's complete.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Details (Success only) */}
                            {(billing?.status === 'paid' || billing?.status === 'success') && (
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h2 className="font-medium text-gray-900 mb-4">Transaction Details</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Plan</span>
                                            <span className="text-sm font-medium text-gray-900 capitalize">
                                                {billing?.planName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Amount Paid</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                ${billing?.amount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Billing Period</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {billing?.billingPeriod}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Provider Reference</span>
                                            <span className="text-sm font-mono text-gray-900">
                                                {billing?.providerReference}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Date</span>
                                            <span className="text-sm text-gray-900">
                                                {formatDate(billing?.createdAt, 'long')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pending Transaction Details (Pending only) */}
                            {billing?.status === 'pending' && (
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h2 className="font-medium text-gray-900 mb-4">Payment Details</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Plan</span>
                                            <span className="text-sm font-medium text-gray-900 capitalize">
                                                {billing?.planName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Amount</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                ${billing?.amount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Initiated</span>
                                            <span className="text-sm text-gray-900">
                                                {formatDate(billing?.createdAt, 'long')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Troubleshooting Tips (Failed only) */}
                            {billing?.status === 'failed' && (
                                <div className="mb-6">
                                    <h2 className="font-medium text-gray-900 mb-3">Troubleshooting Tips</h2>
                                    <div className="space-y-3">
                                        {troubleshootingTips.map((tip, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                                                    <p className="text-xs text-gray-600">{tip.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pending Tips (Pending only) */}
                            {billing?.status === 'pending' && (
                                <div className="mb-6">
                                    <h2 className="font-medium text-gray-900 mb-3">What to Expect</h2>
                                    <div className="space-y-3">
                                        {pendingTips.map((tip, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                                                    <p className="text-xs text-gray-600">{tip.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancelled Tips (Cancelled only) */}
                            {billing?.status === 'cancelled' && (
                                <div className="mb-6">
                                    <h2 className="font-medium text-gray-900 mb-3">What's Next?</h2>
                                    <div className="space-y-3">
                                        {cancelledTips.map((tip, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                                                    <p className="text-xs text-gray-600">{tip.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* What's Next (Success only) */}
                            {(billing?.status === 'paid' || billing?.status === 'success') && (
                                <div className="mb-6">
                                    <h2 className="font-medium text-gray-900 mb-3">What's Next?</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Access Premium Features</p>
                                                <p className="text-xs text-gray-600">All premium features are now unlocked</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Invite Team Members</p>
                                                <p className="text-xs text-gray-600">Add your team to collaborate</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Explore New Features</p>
                                                <p className="text-xs text-gray-600">Check out what's new in your plan</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-xl">
                                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Check Your Email</p>
                                                <p className="text-xs text-gray-600">We've sent you a confirmation receipt</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Details Toggle (Failed only) */}
                            {billing?.status === 'failed' && errorCode && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                        {showDetails ? 'Hide' : 'Show'} technical details
                                    </button>

                                    {showDetails && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-mono text-gray-600 break-all">
                                                Error Code: {errorCode}<br />
                                                {errorMessage && `Message: ${errorMessage}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {(billing?.status === 'failed' || billing?.status === 'cancelled') ? (
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 px-4 py-2.5 bg-[#876D4A] text-white rounded-xl hover:bg-[#756045] transition-colors font-medium"
                                    >
                                        {content.mainButtonText}
                                    </button>
                                ) : (
                                    <Link
                                        href={content.mainButtonLink}
                                        className="flex-1 text-center px-4 py-2.5 bg-[#876D4A] text-white rounded-xl hover:bg-[#756045] transition-colors font-medium"
                                    >
                                        {content.mainButtonText}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Need help with your subscription? Contact our support team at{' '}
                            <a href="mailto:support@denly.com" className="text-[#876D4A] hover:underline">
                                support@denly.com
                            </a>
                        </p>
                    </div>

                    {/* Alternative Plans (Failed or Cancelled only) */}
                    {(billing?.status === 'failed' || billing?.status === 'cancelled') && (
                        <div className="mt-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <h3 className="font-medium text-gray-900 text-sm mb-2">Not ready to commit?</h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    You can continue using your current plan or explore other options.
                                </p>
                                <Link
                                    href="/dashboard/subscription/billing"
                                    className="text-sm text-[#876D4A] hover:text-[#756045] font-medium inline-flex items-center gap-1"
                                >
                                    View all plans
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}