"use client"
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'

interface TenantForm {
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
    // Property & Lease
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

export default function AddTenantPage() {
    usePageTitle('Add Tenant - Denly')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TenantForm>({
        defaultValues: {
            status: 'active'
        }
    })

    const onSubmit = async (data: TenantForm) => {
        console.log('📝 Add tenant form submitted with data:', data)
        // Handle form submission here
        // await fetch('/api/tenants', { method: 'POST', body: JSON.stringify(data) })
    }

    const properties = [
        { id: '1', name: 'Downtown Loft' },
        { id: '2', name: 'Garden Villa' },
        { id: '3', name: 'Urban Suite' },
        { id: '4', name: 'Riverside Apartment' },
    ]

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
                            <span>Add New Tenant</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Add New Tenant</h1>
                        <p className="text-gray-600 text-sm">Add a new tenant to your property</p>
                    </div>

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
                                            placeholder="John"
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.firstName ? 'border-red-600' : 'border-gray-300'
                                                }`}
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
                                            placeholder="Smith"
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.lastName ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                    <div>
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
                                            placeholder="john.smith@email.com"
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.email ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Phone number must be at least 10 digits'
                                                }
                                            })}
                                            placeholder="+1 (555) 123-4567"
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.phone ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                        <input
                                            type="text"
                                            {...register('emergencyContactName')}
                                            placeholder="Emergency contact name"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                                        <input
                                            type="tel"
                                            {...register('emergencyContactPhone')}
                                            placeholder="+1 (555) 987-6543"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
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
                                            placeholder="Next of kin full name"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
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
                                            placeholder="Next of kin phone number"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            {...register('nextOfKinEmail')}
                                            placeholder="Next of kin email address"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            rows={2}
                                            {...register('nextOfKinAddress')}
                                            placeholder="Next of kin full address"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Property Assignment */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Property Assignment</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                                        <select
                                            {...register('propertyId', { required: 'Property selection is required' })}
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.propertyId ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select property</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.propertyId && (
                                            <p className="mt-1 text-xs text-red-600">{errors.propertyId.message}</p>
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
                                            placeholder="0.00"
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm ${errors.actualRent ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.actualRent && (
                                            <p className="mt-1 text-xs text-red-600">{errors.actualRent.message}</p>
                                        )}
                                    </div>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            {...register('status')}
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm"
                                        >
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Additional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                        <input
                                            type="text"
                                            {...register('occupation')}
                                            placeholder="e.g., Software Engineer"
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                                        <input
                                            type="text"
                                            {...register('employer')}
                                            placeholder="e.g., Tech Company Inc."
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            rows={2}
                                            {...register('notes')}
                                            placeholder="Any additional notes about the tenant..."
                                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Documents</h2>
                                <div className="border-2 border-dashed border-gray-300 text-black placeholder-gray-400 rounded-2xl p-4 text-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        📄
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">Upload tenant documents</p>
                                    <p className="text-gray-500 text-xs mb-3">Lease agreement, ID, proof of income, etc.</p>
                                    <button
                                        type="button"
                                        className="border border-[#876D4A] text-[#876D4A] px-3 py-1.5 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm"
                                    >
                                        Choose Files
                                    </button>
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
                                            Adding Tenant...
                                        </span>
                                    ) : (
                                        'Add Tenant'
                                    )}
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
            </div>
        </div>
    )
}