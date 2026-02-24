// app/app/[companyId]/tenants/[tenantId]/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDeleteTenant, useEditTenant, useFetchOneTenant } from '@/hooks/useTenant'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import useAuthStore from '@/store/useAuthStore'
import { CAN_EDIT } from '@/lib/roles'
import { useFetchAllProperties } from '@/hooks/useProperty'
import { useFetchAllPayments } from '@/hooks/usePayment' // You'll need this hook

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
    propertyId: string | null
    actualRent: number
    leaseStart: string
    leaseEnd: string
    status: 'active' | 'pending' | 'inactive'

    // Additional Information
    occupation: string
    employer: string
    notes: string
}

interface Payment {
    id: string
    amount: number
    dueDate: string
    paidDate: string | null
    status: 'paid' | 'pending' | 'overdue' | 'partial'
    month: string
    year: number
}

export default function EditTenantPage() {
    usePageTitle('Edit Tenant - Denly')

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const params = useParams()
    const tenantId = params.tenantId as string

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPropertyChangeWarning, setShowPropertyChangeWarning] = useState(false)
    const [propertyChangeData, setPropertyChangeData] = useState<{
        newPropertyId: string | null
        advancePayments: Payment[]
        leaseAdvanceMonths: number
        formData: TenantForm | null
    } | null>(null)

    const { data, isLoading } = useFetchOneTenant(tenantId)
    console.log(data)
    const { data: properties, isLoading: propertiesLoading } = useFetchAllProperties()
    const { data: payments } = useFetchAllPayments() // Fetch tenant's payment history

    const { mutate: editMutate, isPending: isEditPending, error: editError } = useEditTenant()
    const { mutate: deleteMutate, isPending: deletePending, error: deleteError } = useDeleteTenant()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
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
            propertyId: null,
            nextOfKinName: '',
            nextOfKinRelationship: '',
            nextOfKinPhone: '',
            nextOfKinEmail: '',
            nextOfKinAddress: ''
        }
    })

    const selectedPropertyId = watch('propertyId')


    useEffect(() => {
        if (!CAN_EDIT.includes(userRole)) {
            return router.back()
        }

        if (data) {
            const formatDateForInput = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
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
                propertyId: data.property?.id || null,
                nextOfKinName: data.nextOfKinName || '',
                nextOfKinRelationship: data.nextOfKinRelationship || '',
                nextOfKinPhone: data.nextOfKinPhone || '',
                nextOfKinEmail: data.nextOfKinEmail || '',
                nextOfKinAddress: data.nextOfKinAddress || ''
            });
        }
    }, [data, reset]);

    // Helper function to check for advance payments
    const checkAdvancePayments = (): Payment[] => {
        if (!payments || !data) return [];

        const currentDate = new Date();
        const advancePayments = payments.filter((payment: Payment) => {
            if (payment.status === 'paid' && payment.paidDate) {
                const dueDate = new Date(payment.dueDate);
                // Check if payment was made before the due date (advance payment)
                const paidDate = new Date(payment.paidDate);
                return paidDate < dueDate;
            }
            return false;
        });

        return advancePayments;
    };

    // Helper function to check for advance lease periods
    const checkAdvanceLease = (): number => {
        if (!data || !data.leaseStart || !data.leaseEnd) return 0;

        const leaseStart = new Date(data.leaseStart);
        const leaseEnd = new Date(data.leaseEnd);
        const currentDate = new Date();

        // Calculate total lease duration in months
        const totalMonths = (leaseEnd.getFullYear() - leaseStart.getFullYear()) * 12 +
            (leaseEnd.getMonth() - leaseStart.getMonth());

        // Calculate months elapsed
        const monthsElapsed = (currentDate.getFullYear() - leaseStart.getFullYear()) * 12 +
            (currentDate.getMonth() - leaseStart.getMonth());

        // Calculate remaining months
        const remainingMonths = totalMonths - monthsElapsed;

        return remainingMonths > 0 ? remainingMonths : 0;
    };

    // Check if property is being changed
    const isPropertyChanged = (newPropertyId: string | null): boolean => {
        const currentPropertyId = data?.property?.id || null;
        return currentPropertyId !== newPropertyId;
    };

    const onSubmit = async (formData: TenantForm) => {
        const formattedData = {
            ...formData,
            propertyId: formData.propertyId === "null" ? null : formData.propertyId,
            actualRent: Number(formData.actualRent)
        };

        // Check if property is being changed
        if (isPropertyChanged(formattedData.propertyId)) {
            const advancePayments = checkAdvancePayments();
            const advanceLeaseMonths = checkAdvanceLease();

            // If there are advance payments or advance lease, show warning
            if (advancePayments.length > 0 || advanceLeaseMonths > 0) {
                setPropertyChangeData({
                    newPropertyId: formattedData.propertyId,
                    advancePayments,
                    leaseAdvanceMonths: advanceLeaseMonths,
                    formData: formattedData
                });
                setShowPropertyChangeWarning(true);
                return;
            }
        }

        // No warnings, proceed with update
        executeUpdate(formattedData);
    };

    const executeUpdate = (formattedData: any) => {
        editMutate({ tenantId, data: formattedData }, {
            onSuccess: () => {
                router.push(`/dashboard/tenants/${tenantId}`);
            }
        });
    };

    const confirmPropertyChange = () => {
        if (propertyChangeData?.formData) {
            executeUpdate(propertyChangeData.formData);
        }
        setShowPropertyChangeWarning(false);
        setPropertyChangeData(null);
    };

    const cancelPropertyChange = () => {
        setShowPropertyChangeWarning(false);
        setPropertyChangeData(null);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutate(tenantId);
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={cancelDelete}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Tenant</h3>
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

            {/* Property Change Warning Modal */}
            {showPropertyChangeWarning && propertyChangeData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={cancelPropertyChange}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-fadeIn">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            ⚠️ Property Change Warning
                        </h3>

                        <p className="text-sm text-gray-600 text-center mb-4">
                            Changing the property assignment may affect advance payments and lease terms.
                        </p>

                        <div className="space-y-4 mb-6">
                            {/* Advance Payments Alert */}
                            {propertyChangeData.advancePayments.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Advance Payments Detected ({propertyChangeData.advancePayments.length})
                                    </h4>
                                    <p className="text-sm text-blue-700 mb-2">
                                        This tenant has made advance payments for the following months:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                        {propertyChangeData.advancePayments.map((payment, index) => (
                                            <li key={index}>
                                                {payment.month} {payment.year} - ${payment.amount} (paid on {new Date(payment.paidDate!).toLocaleDateString()})
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm text-blue-700 mt-2">
                                        Changing properties will require handling these advance payments appropriately.
                                    </p>
                                </div>
                            )}

                            {/* Advance Lease Alert */}
                            {propertyChangeData.leaseAdvanceMonths > 0 && (
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Advance Lease Term
                                    </h4>
                                    <p className="text-sm text-purple-700">
                                        This tenant has <span className="font-semibold">{propertyChangeData.leaseAdvanceMonths} month(s)</span> remaining on their current lease.
                                        Changing properties now may require lease amendments.
                                    </p>
                                </div>
                            )}

                            {/* Combined Warning */}
                            {propertyChangeData.advancePayments.length > 0 && propertyChangeData.leaseAdvanceMonths > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <h4 className="font-medium text-red-800 mb-2">⚠️ Important Consideration</h4>
                                    <p className="text-sm text-red-700">
                                        This tenant has both advance payments and remaining lease time.
                                        Consider discussing with them before making this change.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={confirmPropertyChange}
                                className="flex-1 bg-[#876D4A] text-white px-4 py-2.5 rounded-xl hover:bg-[#756045] transition-colors cursor-pointer text-sm font-medium"
                            >
                                Yes, Continue with Property Change
                            </button>
                            <button
                                onClick={cancelPropertyChange}
                                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
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

                                    {/* Property & Lease Information */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Property & Lease Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Property {!selectedPropertyId && <span className="text-gray-500 text-xs ml-1">(No property assigned)</span>}
                                                </label>
                                                <select
                                                    {...register('propertyId')}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm`}
                                                >
                                                    <option value="null">No Property (Tenant not in any property)</option>
                                                    {properties?.map((property: any) => (
                                                        <option key={property.id} value={property.id}>
                                                            {property.name} - {property.address} (${property.monthlyRent}/month)
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Select "No Property" if the tenant is moving out or hasn't been assigned yet
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date {selectedPropertyId && '*'}</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseStart', {
                                                        required: selectedPropertyId ? 'Lease start date is required when a property is assigned' : false
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.leaseStart ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.leaseStart && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.leaseStart.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date {selectedPropertyId && '*'}</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseEnd', {
                                                        required: selectedPropertyId ? 'Lease end date is required when a property is assigned' : false
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.leaseEnd ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.leaseEnd && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.leaseEnd.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
                                                <input
                                                    type="text"
                                                    {...register('actualRent', {
                                                        // required: selectedPropertyId ? 'Monthly rent is required when a property is assigned' : false,
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                        min: { value: 0, message: 'Rent must be positive' },
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.actualRent ? 'border-red-600' : 'border-gray-300'
                                                        }`}
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
                                    {isEditPending || deletePending ?
                                        <Spinner />
                                        :
                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDelete}
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
                                    }
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Property Information */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Current Property Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Current Property</p>
                                        <p className="font-medium text-gray-900 text-sm">{data?.property?.name || 'Not assigned'}</p>
                                    </div>
                                    {data?.property && (
                                        <>
                                            <div>
                                                <p className="text-xs text-gray-600">Property Rent</p>
                                                <p className="font-medium text-gray-900 text-sm">${data?.property?.monthlyRent}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Property Type</p>
                                                <p className="font-medium text-gray-900 text-sm">{data?.property?.type}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                                    Select "No Property" above to remove the tenant from their current property
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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