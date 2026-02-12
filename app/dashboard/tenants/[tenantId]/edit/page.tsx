// app/app/[companyId]/tenants/[tenantId]/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDeleteTenant, useEditTenant, useFetchOneTenant } from '@/hooks/useTenant'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from "sonner"
import Spinner from '@/components/Spinner'

interface TenantForm {
    // Personal Information
    firstName: string
    lastName: string
    email: string
    phone: string
    emergencyContactName: string
    emergencyContactPhone: string

    // Next of Kin Information
    nextOfKinName: string
    nextOfKinRelationship: string
    nextOfKinPhone: string
    nextOfKinEmail: string
    nextOfKinAddress: string

    // Property & Lease (Matches your DB structure)
    propertyId: string
    actualRent: number
    leaseStart: string
    leaseEnd: string
    status: 'active' | 'pending'

    // Additional Information
    occupation: string
    employer: string
    notes: string
}

export default function EditTenantPage() {
    usePageTitle('Edit Tenant - Denly')
    const params = useParams()
    const tenantId = params.tenantId as string

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const { data, isLoading } = useFetchOneTenant(tenantId)
    console.log(data)

    const { mutate: editMutate, isPending: isEditPending, error: editError } = useEditTenant()

    const { mutate: deleteMutate, isPending: deletePending, error: deleteError } = useDeleteTenant()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<TenantForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            leaseStart: '',
            leaseEnd: '',
            actualRent: 0,
            status: 'pending',
            // Next of Kin defaults
            nextOfKinName: '',
            nextOfKinRelationship: '',
            nextOfKinPhone: '',
            nextOfKinEmail: '',
            nextOfKinAddress: ''
        }
    })

    useEffect(() => {
        if (data) {
            // Format dates to YYYY-MM-DD for date picker
            const formatDateForInput = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                // Check if date is valid
                if (isNaN(date.getTime())) return '';

                // Format to YYYY-MM-DD
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            reset({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || '',
                emergencyContactName: data.emergencyContactName || '',
                emergencyContactPhone: data.emergencyContactPhone || '',
                leaseStart: formatDateForInput(data.leaseStart),
                leaseEnd: formatDateForInput(data.leaseEnd),
                actualRent: data.actualRent || 0,
                status: data.status || 'pending',
                // Next of Kin defaults
                nextOfKinName: data.nextOfKinName || '',
                nextOfKinRelationship: data.nextOfKinRelationship || '',
                nextOfKinPhone: data.nextOfKinPhone || '',
                nextOfKinEmail: data.nextOfKinEmail || '',
                nextOfKinAddress: data.nextOfKinAddress || ''
            });
        }
    }, [data, reset]);

    const onSubmit = async (data: TenantForm) => {
        console.log('📝 Tenant form submitted with data:', data)

        editMutate({ tenantId, data: data }, {
            onSuccess: (data) => {
                console.log(data)
                router.push(`/dashboard/tenants/${tenantId}`)
                toast('Tenant edited successfully', {
                    style: {
                        background: 'green',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
            },
            onError: (error: any) => {
                console.log(error)
                toast(error.message, {
                    style: {
                        background: 'red',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
            }
        })
    }

    const handleDelete = () => {
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        deleteMutate(tenantId, {
            onSuccess: (data) => {
                console.log(data)
                router.push(`/dashboard/tenants/`)
                toast('Tenant deleted successfully', {
                    style: {
                        background: 'green',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
                setShowDeleteModal(false)
            },
            onError: (error: any) => {
                console.log(error)
                toast(error.message, {
                    style: {
                        background: 'red',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
                setShowDeleteModal(false)
            }
        })
    }

    const cancelDelete = () => {
        setShowDeleteModal(false)
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={cancelDelete}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Delete Tenant
                        </h3>

                        <p className="text-sm text-gray-600 text-center mb-6">
                            Are you sure you want to delete <span className="font-semibold">{data?.firstName} {data?.lastName}</span>?
                            This action cannot be undone and all associated data will be permanently removed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={confirmDelete}
                                disabled={deletePending}
                                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-colors cursor-pointer text-sm font-medium flex items-center justify-center"
                            >
                                {deletePending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Yes, Delete Tenant'
                                )}
                            </button>
                            <button
                                onClick={cancelDelete}
                                disabled={deletePending}
                                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/dashboard/tenants" className="hover:text-[#876D4A] transition-colors">Tenants</Link>
                            <span>›</span>
                            <span>{data?.firstName} {data?.lastName}</span>
                            <span>›</span>
                            <span>Edit</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Edit Tenant</h1>
                        <p className="text-gray-600 text-sm">Update tenant information and contact details</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tenant Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                                    {/* Personal Information */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Personal Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                                <input
                                                    type="text"
                                                    {...register('firstName', {
                                                        required: 'First name is required',
                                                        minLength: {
                                                            value: 2,
                                                            message: 'First name must be at least 2 characters'
                                                        }
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.firstName ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Enter first name"
                                                />
                                                {errors.firstName && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                                <input
                                                    type="text"
                                                    {...register('lastName', {
                                                        required: 'Last name is required',
                                                        minLength: {
                                                            value: 2,
                                                            message: 'Last name must be at least 2 characters'
                                                        }
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.lastName ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Enter last name"
                                                />
                                                {errors.lastName && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                                <input
                                                    type="email"
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Invalid email address'
                                                        }
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.email ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Enter email address"
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    {...register('phone')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Emergency Contact</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                                <input
                                                    type="text"
                                                    {...register('emergencyContactName')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter emergency contact name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    {...register('emergencyContactPhone')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter emergency contact phone"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next of Kin Information */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Next of Kin Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    {...register('nextOfKinName')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter next of kin name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                                <select
                                                    {...register('nextOfKinRelationship')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm"
                                                >
                                                    <option value="">Select relationship</option>
                                                    <option value="Spouse">Spouse</option>
                                                    <option value="Parent">Parent</option>
                                                    <option value="Child">Child</option>
                                                    <option value="Sibling">Sibling</option>
                                                    <option value="Grandparent">Grandparent</option>
                                                    <option value="Friend">Friend</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    {...register('nextOfKinPhone')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    {...register('nextOfKinEmail')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <textarea
                                                    rows={2}
                                                    {...register('nextOfKinAddress')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter full address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lease Information */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Lease Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date *</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseStart', { required: 'Lease start date is required' })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.leaseStart ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.leaseStart && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.leaseStart.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date *</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseEnd', { required: 'Lease end date is required' })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.leaseEnd ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.leaseEnd && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.leaseEnd.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($) *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('actualRent', {
                                                        required: 'Monthly rent is required',
                                                        min: { value: 0, message: 'Rent must be positive' },
                                                        valueAsNumber: true
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.actualRent ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                    placeholder="0.00"
                                                />
                                                {errors.actualRent && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.actualRent.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                                <select
                                                    {...register('status', { required: 'Status is required' })}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={isEditPending || deletePending}
                                            className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            {isEditPending ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isEditPending || deletePending}
                                            className="border border-red-300 text-red-700 px-5 py-2 rounded-2xl hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            Delete Tenant
                                        </button>
                                        <div
                                            onClick={() => router.back()}
                                            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm text-center font-medium"
                                        >
                                            Cancel
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Property Information */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Property Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Current Property</p>
                                        <p className="font-medium text-gray-900 text-sm">{data?.property?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Property Rent</p>
                                        <p className="font-medium text-gray-900 text-sm">${data?.property?.monthlyRent}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Property Type</p>
                                        <p className="font-medium text-gray-900 text-sm">{data?.property?.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add this CSS to your global styles or component */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    )
}