// app/app/[companyId]/properties/new/page.jsx
'use client'
import { useForm, useWatch } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAddProperty } from '@/hooks/useProperty'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'

interface PropertyForm {
    name: string
    propertyType: string,
    type: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    squareMeter: number
    monthlyRent: number
    features: string[]
    description: string

    // Conditional fields - only required based on propertyType
    bedrooms?: number
    bathrooms?: number
    businessType?: string
    leaseType?: string
    totalUnits?: number
    parkingSpaces?: number
}

export default function AddPropertyPage() {
    usePageTitle('Add Property - Denly')
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<PropertyForm>({
        defaultValues: {
            features: [],
            propertyType: 'residential'
        }
    })

    const router = useRouter()

    const { mutate, isPending, error } = useAddProperty()

    const propertyType = useWatch({
        control,
        name: 'propertyType'
    })

    const onSubmit = async (data: PropertyForm) => {
        console.log('📝 Property form submitted with data:', data)

        mutate(data, {
            onSuccess: (data) => {
                console.log(data)
                toast("Property added successfully", {
                    style: {
                        background: 'green',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
                router.back()
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

    const residentialFeatures = ['Parking', 'Laundry', 'Gym', 'Pool', 'Pet Friendly', 'Furnished', 'Air Conditioning', 'Balcony', 'Storage', 'Patio']
    const commercialFeatures = ['Parking', 'Elevator', 'Security System', 'Conference Room', 'Reception Area', 'Kitchenette', 'Restrooms', 'Storage', 'Loading Dock', 'HVAC']

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href="/properties" className="hover:text-[#876D4A] transition-colors">Properties</Link>
                            <span>›</span>
                            <span>Add New Property</span>
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Add New Property</h1>
                        <p className="text-gray-600 text-sm">Add a new property to your portfolio</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                            {/* Property Type Selection */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-3">Property Category</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <label className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all ${propertyType === 'residential' ? 'border-[#876D4A] bg-[#876D4A]/5' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            value="residential"
                                            {...register('propertyType')}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${propertyType === 'residential' ? 'border-[#876D4A]' : 'border-gray-300'
                                                }`}>
                                                {propertyType === 'residential' && <div className="w-2 h-2 bg-[#876D4A] rounded-full"></div>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">Residential</div>
                                                <div className="text-xs text-gray-600">Houses, apartments, flats</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all ${propertyType === 'commercial' ? 'border-[#876D4A] bg-[#876D4A]/5' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            value="commercial"
                                            {...register('propertyType')}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${propertyType === 'commercial' ? 'border-[#876D4A]' : 'border-gray-300'
                                                }`}>
                                                {propertyType === 'commercial' && <div className="w-2 h-2 bg-[#876D4A] rounded-full"></div>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">Commercial</div>
                                                <div className="text-xs text-gray-600">Offices, retail, industrial</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                                        <input
                                            type="text"
                                            {...register('name', { required: 'Property name is required' })}
                                            placeholder="e.g., Downtown Loft"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                                        <select
                                            {...register('type', { required: 'Property type is required' })}
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black ${errors.type ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select type</option>
                                            {propertyType === 'residential' ? (
                                                <>
                                                    <option value="apartment">Apartment</option>
                                                    <option value="house">House</option>
                                                    <option value="condo">Condo</option>
                                                    <option value="townhouse">Townhouse</option>
                                                    <option value="duplex">Duplex</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="office">Office Space</option>
                                                    <option value="retail">Retail</option>
                                                    <option value="industrial">Industrial</option>
                                                    <option value="warehouse">Warehouse</option>
                                                    <option value="mixed-use">Mixed-Use</option>
                                                </>
                                            )}
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <input
                                            type="text"
                                            {...register('address', { required: 'Address is required' })}
                                            placeholder="Street address"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            {...register('city', { required: 'City is required' })}
                                            placeholder="City"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                                        <input
                                            type="text"
                                            {...register('state', { required: 'State is required' })}
                                            placeholder="State"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.state ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code *</label>
                                        <input
                                            type="text"
                                            {...register('zipCode', {
                                                required: 'ZIP code is required',
                                                pattern: {
                                                    value: /^\d{5}(-\d{4})?$/,
                                                    message: 'Invalid ZIP code format'
                                                }
                                            })}
                                            placeholder="ZIP code"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.zipCode && (
                                            <p className="mt-1 text-xs text-red-600">{errors.zipCode.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                        <input
                                            type="text"
                                            {...register('country', { required: 'Country is required' })}
                                            placeholder="Country"
                                            className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.country ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Property Details - Residential */}
                            {propertyType === 'residential' && (
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-4">Residential Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                            <input
                                                type="number"
                                                {...register('bedrooms', {
                                                    min: { value: 0, message: 'Bedrooms cannot be negative' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                            {errors.bedrooms && (
                                                <p className="mt-1 text-xs text-red-600">{errors.bedrooms.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                {...register('bathrooms', {
                                                    min: { value: 0, message: 'Bathrooms cannot be negative' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                            {errors.bathrooms && (
                                                <p className="mt-1 text-xs text-red-600">{errors.bathrooms.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Square Meter</label>
                                            <input
                                                type="number"
                                                {...register('squareMeter', {
                                                    min: { value: 0, message: 'Square Meter cannot be negative' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                            {errors.squareMeter && (
                                                <p className="mt-1 text-xs text-red-600">{errors.squareMeter.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('monthlyRent', {
                                                    required: 'Monthly rent is required',
                                                    min: { value: 0, message: 'Rent must be positive' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0.00"
                                                className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.monthlyRent && (
                                                <p className="mt-1 text-xs text-red-600">{errors.monthlyRent.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Property Details - Commercial */}
                            {propertyType === 'commercial' && (
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-4">Commercial Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                            <select
                                                {...register('businessType')}
                                                className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black"
                                            >
                                                <option value="">Select business type</option>
                                                <option value="office">Office</option>
                                                <option value="retail">Retail</option>
                                                <option value="restaurant">Restaurant</option>
                                                <option value="industrial">Industrial</option>
                                                <option value="medical">Medical</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Type</label>
                                            <select
                                                {...register('leaseType')}
                                                className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black"
                                            >
                                                <option value="">Select lease type</option>
                                                <option value="gross">Gross Lease</option>
                                                <option value="net">Net Lease</option>
                                                <option value="triple-net">Triple Net (NNN)</option>
                                                <option value="modified-gross">Modified Gross</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                                            <input
                                                type="number"
                                                {...register('totalUnits', {
                                                    min: { value: 1, message: 'Must have at least 1 unit' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="1"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces</label>
                                            <input
                                                type="number"
                                                {...register('parkingSpaces', {
                                                    min: { value: 0, message: 'Cannot be negative' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Square Meter</label>
                                            <input
                                                type="number"
                                                {...register('squareMeter', {
                                                    min: { value: 0, message: 'Square Meter cannot be negative' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0"
                                                className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('monthlyRent', {
                                                    required: 'Monthly rent is required',
                                                    min: { value: 0, message: 'Rent must be positive' },
                                                    valueAsNumber: true
                                                })}
                                                placeholder="0.00"
                                                className={`w-full border rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.monthlyRent && (
                                                <p className="mt-1 text-xs text-red-600">{errors.monthlyRent.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Features & Amenities */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-4">Features & Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {(propertyType === 'residential' ? residentialFeatures : commercialFeatures).map((feature) => (
                                        <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={feature}
                                                {...register('features')}
                                                className="rounded border-gray-300 text-[#876D4A] focus:ring-[#876D4A] cursor-pointer w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700 cursor-pointer">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="font-medium text-gray-900 mb-3">Description</h2>
                                <textarea
                                    rows={3}
                                    {...register('description')}
                                    placeholder={
                                        propertyType === 'residential'
                                            ? "Describe the property, its features, neighborhood, and any important details..."
                                            : "Describe the commercial space, business suitability, location advantages, and any important details..."
                                    }
                                    className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors"
                                />
                            </div>

                            {/* Actions */}
                            {isPending ?
                                <Spinner /> :
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium"
                                    >
                                        {isSubmitting ? 'Adding Property...' : 'Add Property'}
                                    </button>
                                    <Link
                                        href="/company/dashboard/properties"
                                        className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm text-center font-medium"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}