"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useForm } from 'react-hook-form'

interface CompanyFormData {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    taxId: string
    industry: string
}

export default function CompanyPage() {
    usePageTitle('Company Settings - Denly')

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CompanyFormData>({
        defaultValues: {
            name: 'Denly Properties',
            email: 'hello@denlyproperties.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business Ave, Suite 100',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'United States',
            taxId: '12-3456789',
            industry: 'Real Estate'
        }
    })

    const onSubmit = async (data: CompanyFormData) => {
        console.log('Form submitted:', data)
        // Here you would typically make an API call to save the data
    }

    const handleCancel = () => {
        reset()
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Company Settings</h1>
                        <p className="text-gray-600 text-sm">Manage your company information and preferences</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Company Information */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Company Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            {...register('name', {
                                                required: 'Company name is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Company name must be at least 2 characters'
                                                }
                                            })}
                                            className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^\+?[\d\s\-()]+$/,
                                                    message: 'Invalid phone number format'
                                                }
                                            })}
                                            className={`w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                            Industry
                                        </label>
                                        <input
                                            id="industry"
                                            type="text"
                                            {...register('industry')}
                                            className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Address Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address *
                                        </label>
                                        <input
                                            id="address"
                                            type="text"
                                            {...register('address', {
                                                required: 'Street address is required'
                                            })}
                                            className={`w-full border ${errors.address ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            {...register('city', {
                                                required: 'City is required'
                                            })}
                                            className={`w-full border ${errors.city ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State/Province *
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            {...register('state', {
                                                required: 'State/Province is required'
                                            })}
                                            className={`w-full border ${errors.state ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            id="zipCode"
                                            type="text"
                                            {...register('zipCode', {
                                                required: 'ZIP/Postal code is required',
                                                pattern: {
                                                    value: /^[A-Z0-9\-]+$/,
                                                    message: 'Invalid ZIP/Postal code format'
                                                }
                                            })}
                                            className={`w-full border ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.zipCode && (
                                            <p className="mt-1 text-xs text-red-600">{errors.zipCode.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country *
                                        </label>
                                        <input
                                            id="country"
                                            type="text"
                                            {...register('country', {
                                                required: 'Country is required'
                                            })}
                                            className={`w-full border ${errors.country ? 'border-red-300' : 'border-gray-300'
                                                } text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm`}
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tax ID
                                        </label>
                                        <input
                                            id="taxId"
                                            type="text"
                                            {...register('taxId')}
                                            className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-medium"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}