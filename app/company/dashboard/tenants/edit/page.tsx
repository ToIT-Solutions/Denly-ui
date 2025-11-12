// app/app/[companyId]/tenants/[tenantId]/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'

interface TenantForm {
    firstName: string
    lastName: string
    email: string
    phone: string
    emergencyContactName: string
    emergencyContactPhone: string
    leaseStart: string
    leaseEnd: string
    actualRent: number
    status: 'active' | 'pending' | 'inactive'
    // Next of Kin Information
    nextOfKinName: string
    nextOfKinRelationship: string
    nextOfKinPhone: string
    nextOfKinEmail: string
    nextOfKinAddress: string
}

export default function EditTenantPage() {
    usePageTitle('Edit Tenant - Denly')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TenantForm>({
        defaultValues: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567',
            emergencyContactName: 'Mike Johnson',
            emergencyContactPhone: '+1 (555) 987-6543',
            leaseStart: '2024-01-01',
            leaseEnd: '2024-12-31',
            actualRent: 2400,
            status: 'active',
            // Next of Kin defaults
            nextOfKinName: 'Robert Johnson',
            nextOfKinRelationship: 'Father',
            nextOfKinPhone: '+1 (555) 246-8135',
            nextOfKinEmail: 'robert.johnson@email.com',
            nextOfKinAddress: '456 Oak Avenue, Seattle, WA 98101'
        }
    })

    const onSubmit = async (data: TenantForm) => {
        console.log('📝 Tenant form submitted with data:', data)
        // Handle form submission here
        // await fetch(`/api/tenants/${tenantId}`, { method: 'PUT', body: JSON.stringify(data) })
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
            console.log('Deleting tenant...')
            // Handle delete logic
            // await fetch(`/api/tenants/${tenantId}`, { method: 'DELETE' })
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/company/dashboard/tenants" className="hover:text-[#876D4A] transition-colors">Tenants</Link>
                            <span>›</span>
                            <span>Sarah Johnson</span>
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
                                            disabled={isSubmitting}
                                            className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="border border-red-300 text-red-700 px-5 py-2 rounded-2xl hover:bg-red-50 transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            Delete Tenant
                                        </button>
                                        <Link
                                            href="/tenants"
                                            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm text-center font-medium"
                                        >
                                            Cancel
                                        </Link>
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
                                        <p className="font-medium text-gray-900 text-sm">Downtown Loft</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Property Rent</p>
                                        <p className="font-medium text-gray-900 text-sm">$2,400</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Lease Duration</p>
                                        <p className="font-medium text-gray-900 text-sm">12 months</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Property Type</p>
                                        <p className="font-medium text-gray-900 text-sm">Apartment</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Summary */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Contact Summary</h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Emergency Contact</p>
                                        <p className="font-medium text-gray-900 text-sm">Mike Johnson</p>
                                        <p className="text-xs text-gray-600">+1 (555) 987-6543</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Next of Kin</p>
                                        <p className="font-medium text-gray-900 text-sm">Robert Johnson</p>
                                        <p className="text-xs text-gray-600">Father • +1 (555) 246-8135</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Recent Payments</h3>
                                <div className="space-y-2">
                                    {[
                                        { month: 'January 2024', amount: '$2,400', status: 'Paid' },
                                        { month: 'December 2023', amount: '$2,400', status: 'Paid' },
                                        { month: 'November 2023', amount: '$2,400', status: 'Paid' },
                                    ].map((payment, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{payment.month}</p>
                                                <p className="text-xs text-gray-600">{payment.status}</p>
                                            </div>
                                            <p className="text-sm font-medium text-[#876D4A]">{payment.amount}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 text-center text-[#876D4A] hover:text-[#756045] transition-colors text-xs font-medium">
                                    View Full Payment History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}