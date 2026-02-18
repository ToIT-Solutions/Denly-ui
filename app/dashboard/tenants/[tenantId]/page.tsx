// app/dashboard/tenants/[tenantId]/page.tsx
"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { useDocumentActions } from '@/hooks/useDocument'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchOneTenant } from '@/hooks/useTenant'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/api/axios' // Import api for the download endpoint
import useAuthStore from '@/store/useAuthStore'
import { CAN_EDIT } from '@/lib/roles'

export default function ViewTenantPage() {
    usePageTitle("Tenant Details - Denly")

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const params = useParams()
    const tenantId = params.tenantId as string

    const { data, isLoading } = useFetchOneTenant(tenantId)

    // Use the combined hook for document actions
    const {
        viewDocument,
        downloadDocument,
        isViewing,
        isDownloading,
        viewError,
        downloadError
    } = useDocumentActions()

    // Track which document is being acted upon
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

    // Document Type Mapping
    const documentTypeMap: Record<string, string> = {
        'bank': 'Bank Statement',
        'employment': 'Employment Verification',
        'lease': 'Lease Agreement',
        'identification': 'Government/National ID',
        'id': 'Government/National ID',
        'income': 'Proof of Income',
        'other': 'Other Document'
    }

    // Get file icon based on file extension or type
    const getFileIcon = (filename?: string, fileType?: string) => {
        if (!filename && !fileType) return '📄'

        const extension = filename?.split('.').pop()?.toLowerCase()

        if (extension === 'pdf' || fileType === 'pdf') return '📕'
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || fileType === 'image') return '🖼️'
        if (extension === 'doc' || extension === 'docx' || fileType === 'document') return '📘'
        if (extension === 'xls' || extension === 'xlsx' || fileType === 'spreadsheet') return '📗'
        if (extension === 'txt') return '📃'

        return '📄'
    }

    const handleViewDocument = async (documentId: string) => {
        try {
            setActiveDocumentId(documentId)
            await viewDocument(documentId)
        } catch (error) {
            console.error('Error viewing document:', error)
        } finally {
            setActiveDocumentId(null)
        }
    }

    const handleDownloadDocument = async (document: any) => {
        try {
            setActiveDocumentId(document.id)
            // Use the original filename if available, otherwise generate one
            const filename = document.fileName ||
                document.filename ||
                `${document.documentType || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`

            await downloadDocument({
                documentId: document.id,
                filename
            })
        } catch (error) {
            console.error('Error downloading document:', error)
        } finally {
            setActiveDocumentId(null)
        }
    }

    // Combine errors
    const documentError = viewError || downloadError

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            {isLoading ?
                <Spinner />
                :
                <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header with Back Button */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                                <Link href="/dashboard/tenants" className="hover:text-[#876D4A] transition-colors">Tenants</Link>
                                <span>›</span>
                                <span>{data?.firstName + ' ' + data?.lastName}</span>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-serif text-gray-900 mb-2">{data?.firstName + ' ' + data?.lastName}</h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs ${data?.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {data?.status}
                                        </span>
                                    </div>
                                </div>

                                {CAN_EDIT.includes(userRole) ?
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link href={`/dashboard/tenants/${tenantId}/edit`}>
                                            <button className="bg-white border border-[#876D4A] text-[#876D4A] px-5 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm w-full sm:w-auto font-medium">
                                                Edit Tenant
                                            </button>
                                        </Link>
                                    </div>
                                    :
                                    null}
                            </div>
                        </div>

                        {/* Document Error */}
                        {documentError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs text-red-600">{documentError.message}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Tenant Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <h2 className="font-medium text-gray-900 mb-4">Basic Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-600">Email</label>
                                            <p className="text-gray-900 text-sm">{data?.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Phone</label>
                                            <p className="text-gray-900 text-sm">{data?.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Property</label>
                                            <p className="text-gray-900 text-sm">{data?.property?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Address</label>
                                            <p className="text-gray-900 text-sm">{data?.property?.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lease Information Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <h2 className="font-medium text-gray-900 mb-4">Lease Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-600">Monthly Rent</label>
                                            <p className="text-xl font-semibold text-[#876D4A]">${data?.actualRent}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Rent Due Date</label>
                                            <p className="text-gray-900 text-sm">
                                                {data?.payments?.[0]?.dueDate
                                                    ? new Date(data.payments[0].dueDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : 'Not set'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Lease Start</label>
                                            <p className="text-gray-900 text-sm">
                                                {data?.leaseStart
                                                    ? new Date(data.leaseStart).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : 'Not set'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Lease End</label>
                                            <p className="text-gray-900 text-sm">
                                                {data?.leaseEnd
                                                    ? new Date(data.leaseEnd).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : 'Not set'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment History Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <h2 className="font-medium text-gray-900 mb-4">Payment History</h2>
                                    <div className="space-y-3">
                                        {data?.payments?.length > 0 ? (
                                            data.payments.map((payment: any) => (
                                                <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl">
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">${payment.amount}</p>
                                                        <p className="text-xs text-gray-600">
                                                            {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${payment.status?.toLowerCase() === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {payment.status}
                                                        </span>
                                                        <p className="text-xs text-gray-600 mt-1">{payment.paymentMethod || payment.method}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">No payment history available</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Side Cards */}
                            <div className="space-y-6">
                                {/* Emergency Contact Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                    <h2 className="font-medium text-gray-900 mb-3">Emergency Contact</h2>
                                    {data?.emergencyContactName || data?.emergencyContactPhone ? (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-gray-600">Name</label>
                                                <p className="text-gray-900 text-sm">{data?.emergencyContactName || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Phone</label>
                                                <p className="text-gray-900 text-sm">{data?.emergencyContactPhone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-2">No emergency contact provided</p>
                                    )}
                                </div>

                                {/* Documents Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="font-medium text-gray-900">Documents</h2>
                                        {data?.documents?.length > 0 && (
                                            <span className="text-xs text-gray-500">
                                                {data.documents.length} {data.documents.length === 1 ? 'document' : 'documents'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {data?.documents?.length > 0 ? (
                                            data.documents.map((document: any) => {
                                                const docType = document.documentType?.toLowerCase() || 'other'
                                                const displayName = documentTypeMap[docType] || document.documentType || 'Unknown Document'
                                                const isLoading = activeDocumentId === document.id && (isViewing || isDownloading)

                                                return (
                                                    <div
                                                        key={document.id}
                                                        className="flex items-center justify-between p-2 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                            <span className="text-sm shrink-0">
                                                                {getFileIcon(document.fileName || document.filename, document.fileType)}
                                                            </span>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-gray-900 text-xs truncate" title={displayName}>
                                                                    {displayName}
                                                                </span>
                                                                {document.fileName && (
                                                                    <span className="text-gray-400 text-[10px] truncate max-w-[150px]">
                                                                        {document.fileName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-1 shrink-0">
                                                            <button
                                                                onClick={() => handleViewDocument(document.id)}
                                                                disabled={isLoading}
                                                                className="text-[#876D4A] hover:text-[#756045] px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isLoading && activeDocumentId === document.id && isViewing ? (
                                                                    <span className="flex items-center">
                                                                        <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                        </svg>
                                                                        View
                                                                    </span>
                                                                ) : 'View'}
                                                            </button>

                                                            <button
                                                                onClick={() => handleDownloadDocument(document)}
                                                                disabled={isLoading}
                                                                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isLoading && activeDocumentId === document.id && isDownloading ? (
                                                                    <span className="flex items-center">
                                                                        <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                        </svg>
                                                                        DL
                                                                    </span>
                                                                ) : 'Download'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="text-center py-6">
                                                <div className="text-gray-400 text-3xl mb-2">📄</div>
                                                <p className="text-gray-500 text-xs">No documents uploaded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions Card */}
                                {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
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
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}