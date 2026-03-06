'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDeleteProperty, useEditProperty, useFetchOneProperty } from '@/hooks/useProperty'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import useAuthStore from '@/store/useAuthStore'

export default function EditPropertyPage() {
    usePageTitle('Edit Property - Denly')

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const params = useParams()
    const propertyId = params.propertyId as string

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isCannotDeleteModalOpen, setIsCannotDeleteModalOpen] = useState(false)

    const router = useRouter()

    const { data, isLoading, error } = useFetchOneProperty(propertyId)
    console.log(data)

    const { mutate: editMutate, isPending: isEditPending, error: editError } = useEditProperty()

    const { mutate: deleteMutate, isPending: isDeletePending, error: deletePending } = useDeleteProperty()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            propertyType: 'residential',
            type: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            // country: '',
            monthlyRent: 0,
            securityDeposit: 0,
            bedrooms: 0,
            bathrooms: 0,
            squareMeter: 0,
            status: '',
            description: '',
            maxTenants: 1,
            features: [] as string[],
            // Commercial fields
            businessType: '',
            leaseType: '',
            totalUnits: 0,
            parkingSpaces: 0,
        },
    })

    // Watch property type to conditionally show different fields
    const propertyType = watch('propertyType')
    const selectedFeatures = watch('features') || []

    // Features lists
    const residentialFeatures = ['Parking', 'Laundry', 'Borehole', 'Gym', 'Pool', 'Pet Friendly', 'Furnished', 'Air Conditioning', 'Balcony', 'Storage', 'Patio']
    const commercialFeatures = ['Parking', 'Elevator', 'Borehole', 'Security System', 'Conference Room', 'Reception Area', 'Kitchenette', 'Restrooms', 'Storage', 'Loading Dock', 'HVAC']

    // Handle property type change
    const handlePropertyTypeChange = (type: 'residential' | 'commercial') => {
        setValue('propertyType', type)
        // Reset type field when switching property type
        setValue('type', '')
    }

    useEffect(() => {
        if (userRole !== 'Owner' && userRole !== 'Manager') {
            return router.back()
        }

        if (data) {
            // Determine property type from the data
            const commercialTypes = ['office', 'retail', 'industrial', 'warehouse', 'mixed-use']
            const isCommercial = commercialTypes.includes(data.type)

            // Reset all form values with data from DB
            reset({
                name: data.name || '',
                propertyType: isCommercial ? 'commercial' : 'residential',
                type: data.type.toLowerCase() || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                zipCode: data.zipCode || '',
                // country: data.country || 'USA',
                monthlyRent: data.monthlyRent || 0,
                securityDeposit: data.securityDeposit || 0,
                bedrooms: data.bedrooms || 0,
                bathrooms: data.bathrooms || 0,
                squareMeter: data.squareMeter || 0,
                status: data.status.toLowerCase() || '',
                description: data.description || '',
                maxTenants: data.maxTenants || 1,
                features: data.features || [],
                // Commercial fields
                businessType: data.businessType || '',
                leaseType: data.leaseType || '',
                totalUnits: data.totalUnits || 0,
                parkingSpaces: data.parkingSpaces || 0,

            })
        }
    }, [data, reset, userRole, router])

    // Helper function to check if a feature is selected
    const isFeatureSelected = (feature: string) => {
        return selectedFeatures.includes(feature)
    }

    // Handle feature toggle
    const handleFeatureToggle = (feature: string, checked: boolean) => {
        const currentFeatures = selectedFeatures || []
        if (checked) {
            setValue('features', [...currentFeatures, feature])
        } else {
            setValue('features', currentFeatures.filter(f => f !== feature))
        }
    }

    const onSubmit = (data: any) => {
        console.log('Updated property:', data)

        const payload = {
            ...data,
            bedrooms: Number(data.bedrooms),
            bathrooms: Number(data.bathrooms),
            squareMeter: Number(data.squareMeter),
            maxTenants: Number(data.maxTenants),
            monthlyRent: Number(data.monthlyRent),
            securityDeposit: Number(data.securityDeposit),
            totalUnits: Number(data.totalUnits),
            parkingSpaces: Number(data.parkingSpaces),
        }

        editMutate({ propertyId, data: payload })
    }

    const handleDelete = () => {
        if (data?.tenants && data.tenants.length > 0) {
            // Cannot delete because there are active tenants
            setIsCannotDeleteModalOpen(true)
        } else {
            // Show normal confirmation modal
            setIsDeleteModalOpen(true)
        }
    }

    const confirmDelete = () => {
        deleteMutate(propertyId)
        setIsDeleteModalOpen(false)
    }

    // Determine max tenants limit based on property type
    const getMaxTenantsLimit = () => {
        if (propertyType === 'commercial') {
            return 50
        }
        return 20 // residential properties
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            {isLoading ?
                <Spinner />
                :
                <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                                <Link href="/dashboard/properties" className="hover:text-[#876D4A] transition-colors">Properties</Link>
                                <span>›</span>
                                <Link href={`/dashboard/properties/${data?.id}`} className="hover:text-[#876D4A] transition-colors">{data?.name}</Link>
                                <span>›</span>
                                <span>Edit</span>
                            </div>
                            <h1 className="text-2xl font-serif text-gray-900 mb-2">Edit Property</h1>
                            <p className="text-gray-600 text-sm">Update property details and information</p>
                        </div>

                        {/* Property Form */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Property Type Selection - Clickable */}
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-3">Property Category</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePropertyTypeChange('residential')}
                                            className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all text-left w-full ${propertyType === 'residential' ? 'border-[#876D4A] bg-[#876D4A]/5' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
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
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePropertyTypeChange('commercial')}
                                            className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all text-left w-full ${propertyType === 'commercial' ? 'border-[#876D4A] bg-[#876D4A]/5' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
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
                                        </button>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-4">Basic Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Property Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('name', { required: 'Property name is required' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black text-sm"
                                                value={watch('type')}
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
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('address', { required: 'Address is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                            placeholder="Enter street address"
                                        />
                                        {errors.address && (
                                            <p className="text-red-600 text-xs mt-1">{errors.address.message?.toString()}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('city', { required: 'City is required' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                placeholder="Enter ZIP code"
                                            />
                                            {errors.zipCode && (
                                                <p className="text-red-600 text-xs mt-1">{errors.zipCode.message?.toString()}</p>
                                            )}
                                        </div>

                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('country', { required: 'Country is required' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                placeholder="Enter country"
                                            />
                                            {errors.country && (
                                                <p className="text-red-600 text-xs mt-1">{errors.country.message?.toString()}</p>
                                            )}
                                        </div> */}
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
                                                    type="text"
                                                    {...register('bedrooms', {
                                                        min: { value: 0, message: 'Bedrooms cannot be negative' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.bedrooms && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.bedrooms.message?.toString()}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                                <input
                                                    type="text"
                                                    {...register('bathrooms', {
                                                        min: { value: 0, message: 'Bathrooms cannot be negative' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.bathrooms && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.bathrooms.message?.toString()}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Square Meter</label>
                                                <input
                                                    type="text"
                                                    {...register('squareMeter', {
                                                        min: { value: 0, message: 'Square Meter cannot be negative' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.squareMeter && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.squareMeter.message?.toString()}</p>
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black text-sm"
                                                    value={watch('businessType')}
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black text-sm"
                                                    value={watch('leaseType')}
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
                                                    type="text"
                                                    {...register('totalUnits', {
                                                        min: { value: 1, message: 'Must have at least 1 unit' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="1"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.totalUnits && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.totalUnits.message?.toString()}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces</label>
                                                <input
                                                    type="text"
                                                    {...register('parkingSpaces', {
                                                        min: { value: 0, message: 'Cannot be negative' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.parkingSpaces && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.parkingSpaces.message?.toString()}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Square Meter</label>
                                                <input
                                                    type="text"
                                                    {...register('squareMeter', {
                                                        min: { value: 0, message: 'Square Meter cannot be negative' },
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                />
                                                {errors.squareMeter && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.squareMeter.message?.toString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Financial Information */}
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-4">Financial Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Monthly Rent *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                                <input
                                                    type="text"
                                                    {...register('monthlyRent', {
                                                        required: 'Monthly rent is required',
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                        min: { value: 0, message: 'Rent must be positive' }
                                                    })}
                                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                    placeholder="0"
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
                                                    type="text"
                                                    step="0.01"
                                                    {...register('securityDeposit', {
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: 'Please enter a valid number'
                                                        },
                                                    })}
                                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                                    placeholder="0.00"
                                                />
                                                {errors.securityDeposit && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.securityDeposit.message?.toString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Max Tenants Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Number of Tenants *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('maxTenants', {
                                            required: 'Maximum tenants is required',
                                            pattern: {
                                                value: /^\d+$/,
                                                message: 'Please enter a valid number'
                                            },
                                            min: { value: 1, message: 'Must allow at least 1 tenant' },
                                            max: {
                                                value: getMaxTenantsLimit(),
                                                message: `Maximum tenants cannot exceed ${getMaxTenantsLimit()} for ${propertyType === 'commercial' ? 'commercial' : 'residential'} properties`
                                            },
                                        })}
                                        className={`w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm ${errors.maxTenants ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder={propertyType === 'commercial' ? "e.g., 10" : "e.g., 4"}
                                    />
                                    {errors.maxTenants && (
                                        <p className="text-red-600 text-xs mt-1">{errors.maxTenants.message?.toString()}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {propertyType === 'commercial'
                                            ? 'Maximum number of tenants/occupants for this commercial space'
                                            : 'Maximum number of tenants that can occupy this residential property'}
                                    </p>
                                </div>

                                {/* Features & Amenities */}
                                <div>
                                    <h2 className="font-medium text-gray-900 mb-4">Features & Amenities</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {(propertyType === 'residential' ? residentialFeatures : commercialFeatures).map((feature) => (
                                            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isFeatureSelected(feature)}
                                                    onChange={(e) => handleFeatureToggle(feature, e.target.checked)}
                                                    className="rounded border-gray-300 text-[#876D4A] focus:ring-[#876D4A] cursor-pointer w-4 h-4"
                                                />
                                                <span className="text-sm text-gray-700 cursor-pointer">{feature}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        {...register('status', { required: 'Status is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black text-sm"
                                        value={watch('status')}
                                    >
                                        <option value="active">Active</option>
                                        <option value="maintenance">Under Maintenance</option>
                                        <option value="construction">Under Construction</option>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] text-black placeholder-gray-400 text-sm"
                                        placeholder="Describe the property features, amenities, and any additional information..."
                                    />
                                </div>

                                {/* Form Actions */}
                                {isEditPending ?
                                    <Spinner />
                                    :
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="px-4 py-2 border border-red-300 text-red-700 rounded-2xl hover:bg-red-300 transition-colors text-sm font-medium cursor-pointer"
                                        >
                                            Delete Property
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors text-sm font-medium cursor-pointer"
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
                                }
                            </form>
                        </div>
                    </div>
                </div>
            }

            {/* Confirm Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[380px]">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">
                            Delete Property
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this property? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cannot Delete Modal */}
            {isCannotDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[380px]">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">
                            Cannot Delete Property
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            This property cannot be deleted because it has active tenants.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCannotDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-[#876D4A] hover:bg-[#756045] transition cursor-pointer"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}