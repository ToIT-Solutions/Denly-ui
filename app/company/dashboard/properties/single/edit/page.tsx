// app/app/[companyId]/properties/[id]/page.jsx
'use client'

import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditPropertyPage() {

    const router = useRouter()
    usePageTitle('Edit Property - Denly')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: 'Downtown Loft',
            type: 'apartment',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            monthlyRent: 2400,
            securityDeposit: 2400,
            bedrooms: 2,
            bathrooms: 1,
            squareFeet: 950,
            status: 'active',
            description: 'Beautiful downtown loft with great views and modern amenities.'
        }
    })

    const onSubmit = (data: any) => {
        console.log('Updated property:', data)
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            console.log('Deleting property...')
            window.location.href = '/app/company-id/properties'
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
                            <Link href="/company/dashboard/properties" className="hover:text-[#876D4A] transition-colors">Properties</Link>
                            <span>›</span>
                            <span>Property Name</span>
                            <span>›</span>
                            <span>Edit</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Edit Property</h1>
                        <p className="text-gray-600 text-sm">Update property details and information</p>
                    </div>

                    {/* Property Form */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Property name is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="Enter property name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-xs mt-1">{errors.name.message?.toString()}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type *
                                    </label>
                                    <select
                                        {...register('type', { required: 'Property type is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black text-sm"
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="condo">Condo</option>
                                        <option value="townhouse">Townhouse</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    {...register('address', { required: 'Address is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                    placeholder="Enter street address"
                                />
                                {errors.address && (
                                    <p className="text-red-600 text-xs mt-1">{errors.address.message?.toString()}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('city', { required: 'City is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="Enter city"
                                    />
                                    {errors.city && (
                                        <p className="text-red-600 text-xs mt-1">{errors.city.message?.toString()}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('state', { required: 'State is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="Enter state"
                                    />
                                    {errors.state && (
                                        <p className="text-red-600 text-xs mt-1">{errors.state.message?.toString()}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('zipCode', {
                                            required: 'ZIP code is required',
                                            pattern: {
                                                value: /^\d{5}(-\d{4})?$/,
                                                message: 'Invalid ZIP code format'
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="Enter ZIP code"
                                    />
                                    {errors.zipCode && (
                                        <p className="text-red-600 text-xs mt-1">{errors.zipCode.message?.toString()}</p>
                                    )}
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Monthly Rent *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('monthlyRent', {
                                                required: 'Monthly rent is required',
                                                min: { value: 0, message: 'Rent must be positive' }
                                            })}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.monthlyRent && (
                                        <p className="text-red-600 text-xs mt-1">{errors.monthlyRent.message?.toString()}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Security Deposit
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('securityDeposit')}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        {...register('bedrooms')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        {...register('bathrooms')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Square Feet
                                    </label>
                                    <input
                                        type="number"
                                        {...register('squareFeet')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    {...register('status', { required: 'Status is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black text-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="maintenance">Under Maintenance</option>
                                    <option value="vacant">Vacant</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    {...register('description')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-black placeholder-gray-400 text-sm"
                                    placeholder="Describe the property features, amenities, and any additional information..."
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-2xl hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Delete Property
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#876D4A] text-white rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium cursor-pointer sm:ml-auto"
                                >
                                    Update Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}