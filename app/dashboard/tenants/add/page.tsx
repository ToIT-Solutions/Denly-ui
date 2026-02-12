'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'
import { useFetchAllProperties } from '@/hooks/useProperty'
import { useAddTenant } from '@/hooks/useTenant'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'
import { useState } from 'react'

interface Property {
    id: string;
    name: string;
    address: string;
    propertyType: string;
    monthlyRent: string;
    status: string;
}

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

interface DocumentFile {
    file: File;
    type: string;
    name: string;
    category: DocumentCategory;
    uploaded?: boolean;
}

enum DocumentCategory {
    IDENTIFICATION = 'identification',
    INCOME = 'income',
    LEASE = 'lease',
    EMPLOYMENT = 'employment',
    BANK = 'bank',
    OTHER = 'other'
}

interface CategoryConfig {
    id: DocumentCategory;
    label: string;
    description: string;
    accept: string;
    multiple: boolean;
    maxFiles?: number;
    required?: boolean;
    icon: React.ReactNode;
}

export default function AddTenantPage() {
    usePageTitle('Add Tenant - Denly')

    const router = useRouter()
    const { user } = useAuthStore()
    const slug = user?.companyId
    const [documents, setDocuments] = useState<DocumentFile[]>([])
    const [activeCategory, setActiveCategory] = useState<DocumentCategory>(DocumentCategory.IDENTIFICATION)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm<TenantForm>({
        defaultValues: {
            status: 'active'
        }
    })

    const { data: properties, isPending, error } = useFetchAllProperties()
    const { mutate, isPending: addPending } = useAddTenant()

    // Auto-fill rent when property is selected
    const watchPropertyId = watch('propertyId')

    // Update rent when property changes
    const updateRentFromProperty = () => {
        if (watchPropertyId && properties) {
            const selectedProperty = properties.find((prop: Property) => prop.id === watchPropertyId)
            if (selectedProperty) {
                setValue('actualRent', parseFloat(selectedProperty.monthlyRent) || 0)
            }
        }
    }

    // Category configurations
    const categoryConfigs: CategoryConfig[] = [
        {
            id: DocumentCategory.IDENTIFICATION,
            label: 'Identification Documents',
            description: 'Government-issued ID, passport, driver\'s license, etc.',
            accept: '.pdf,.jpg,.jpeg,.png',
            multiple: true,
            maxFiles: 3,
            required: true,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
            )
        },
        {
            id: DocumentCategory.INCOME,
            label: 'Proof of Income',
            description: 'Payslips, tax returns, employment contract, etc.',
            accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
            multiple: true,
            maxFiles: 6,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: DocumentCategory.LEASE,
            label: 'Lease Agreement',
            description: 'Signed lease agreement, addendums, etc.',
            accept: '.pdf,.doc,.docx',
            multiple: true,
            maxFiles: 2,
            required: true,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: DocumentCategory.EMPLOYMENT,
            label: 'Employment Verification',
            description: 'Employment letter, HR contact, work ID, etc.',
            accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
            multiple: true,
            maxFiles: 3,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: DocumentCategory.BANK,
            label: 'Bank Statements',
            description: 'Last 3-6 months bank statements',
            accept: '.pdf,.csv,.xls,.xlsx',
            multiple: true,
            maxFiles: 6,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4m-9 4v10" />
                </svg>
            )
        },
        {
            id: DocumentCategory.OTHER,
            label: 'Other Documents',
            description: 'References, guarantor forms, additional documents',
            accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
            multiple: true,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        }
    ]

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
        const files = e.target.files
        if (files) {
            const newDocuments = Array.from(files).map(file => ({
                file,
                type: file.type,
                name: file.name,
                category,
                uploaded: false
            }))
            setDocuments(prev => [...prev, ...newDocuments])
        }
        // Reset input
        e.target.value = ''
    }

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index))
    }

    const getDocumentsByCategory = (category: DocumentCategory) => {
        return documents.filter(doc => doc.category === category)
    }

    const getCategoryProgress = (category: DocumentCategory) => {
        const categoryDocs = getDocumentsByCategory(category)
        const config = categoryConfigs.find(c => c.id === category)
        if (config?.required && categoryDocs.length === 0) {
            return 'required'
        }
        if (config?.maxFiles && categoryDocs.length >= config.maxFiles) {
            return 'full'
        }
        return 'ok'
    }

    const onSubmit = async (formData: TenantForm) => {
        // Check required documents
        const missingRequired = categoryConfigs
            .filter(config => config.required)
            .filter(config => getDocumentsByCategory(config.id).length === 0)
            .map(config => config.label)

        if (missingRequired.length > 0) {
            toast.error(`Please upload required documents: ${missingRequired.join(', ')}`, {
                style: {
                    background: 'red',
                    border: 'none',
                    textAlign: "center",
                    justifyContent: "center",
                    color: "white"
                }
            })
            return
        }

        // Create FormData for file upload
        const formDataToSend = new FormData()

        // Append tenant data as JSON string
        const tenantData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactPhone: formData.emergencyContactPhone,
            nextOfKinName: formData.nextOfKinName,
            nextOfKinRelationship: formData.nextOfKinRelationship,
            nextOfKinPhone: formData.nextOfKinPhone,
            nextOfKinEmail: formData.nextOfKinEmail,
            nextOfKinAddress: formData.nextOfKinAddress,
            propertyId: formData.propertyId,
            actualRent: formData.actualRent,
            leaseStart: formData.leaseStart,
            leaseEnd: formData.leaseEnd,
            status: formData.status,
            occupation: formData.occupation,
            employer: formData.employer,
            notes: formData.notes
        }

        formDataToSend.append('data', JSON.stringify(tenantData))

        // Append all documents - Multer will find these in req.files
        documents.forEach((doc) => {
            formDataToSend.append('documents', doc.file)
        })

        // ✅ FIX: Send categories as a simple array in the SAME ORDER as files
        // This is the ONLY change needed to get categories on the backend
        const categories = documents.map(doc => doc.category)
        formDataToSend.append('categories', JSON.stringify(categories))

        console.log('Submitting with FormData:', {
            tenantData,
            documentsCount: documents.length,
            categories
        })

        mutate(formDataToSend, {
            onSuccess: () => {
                toast.success('Tenant added successfully!', {
                    style: {
                        background: 'green',
                        border: 'none',
                        textAlign: "center",
                        justifyContent: "center",
                        color: "white"
                    }
                })
                router.push(`/dashboard/tenants`)
            },
            onError: (error: any) => {
                console.log('Add tenant error:', error)
                toast.error(error.message || 'Failed to add tenant', {
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

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Link href={`/dashboard/tenants`} className="hover:text-[#876D4A] transition-colors">Tenants</Link>
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
                                            placeholder="0771 234 567"
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
                                            placeholder="0778 234 567"
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property * </label>
                                        <select
                                            {...register('propertyId', {
                                                required: 'Property selection is required',
                                                onChange: updateRentFromProperty
                                            })}
                                            className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.propertyId ? 'border-red-600' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select property</option>
                                            {properties?.map((property: Property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name} - ${property.monthlyRent}/month
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

                            {/* Categorized Document Upload Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-medium text-gray-900">Supporting Documents</h2>
                                    {documents.length > 0 && (
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                            {documents.length} file{documents.length !== 1 ? 's' : ''} uploaded
                                        </span>
                                    )}
                                </div>

                                {/* Category Navigation */}
                                <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
                                    {categoryConfigs.map((category) => {
                                        const docCount = getDocumentsByCategory(category.id).length
                                        const progress = getCategoryProgress(category.id)
                                        return (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`flex items-center space-x-2 px-3 py-2 rounded-2xl text-sm whitespace-nowrap transition-all ${activeCategory === category.id
                                                    ? 'bg-[#876D4A] text-white'
                                                    : progress === 'required'
                                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span className="w-4 h-4">{category.icon}</span>
                                                <span>{category.label}</span>
                                                {docCount > 0 && (
                                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeCategory === category.id
                                                        ? 'bg-white text-[#876D4A]'
                                                        : 'bg-gray-200 text-gray-700'
                                                        }`}>
                                                        {docCount}
                                                    </span>
                                                )}
                                                {progress === 'required' && (
                                                    <span className="ml-1 text-red-500">*</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Active Category Upload Area */}
                                {categoryConfigs.map((category) => {
                                    if (activeCategory !== category.id) return null
                                    const categoryDocs = getDocumentsByCategory(category.id)
                                    const remainingSlots = category.maxFiles ? category.maxFiles - categoryDocs.length : Infinity

                                    return (
                                        <div key={category.id} className="space-y-4">
                                            {/* Category Header */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                                                        <span className="mr-2">{category.icon}</span>
                                                        {category.label}
                                                        {category.required && (
                                                            <span className="ml-2 text-xs text-red-600">*Required</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                                                </div>
                                                {category.maxFiles && (
                                                    <span className="text-xs text-gray-500">
                                                        {categoryDocs.length} / {category.maxFiles} files
                                                    </span>
                                                )}
                                            </div>

                                            {/* Upload Area */}
                                            {remainingSlots > 0 && (
                                                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-[#876D4A] transition-colors">
                                                    <div className="flex flex-col items-center justify-center space-y-1">
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="text-xs text-gray-600">
                                                            Drop files here or <span className="text-[#876D4A] font-medium">browse</span>
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {category.accept.split(',').join(', ')} (Max: {category.maxFiles ? `${category.maxFiles} files` : 'unlimited'})
                                                        </p>
                                                        <input
                                                            type="file"
                                                            multiple={category.multiple}
                                                            accept={category.accept}
                                                            onChange={(e) => handleDocumentUpload(e, category.id)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Uploaded Files List for this Category */}
                                            {categoryDocs.length > 0 && (
                                                <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
                                                    <h4 className="text-xs font-medium text-gray-700 px-1">Uploaded Files</h4>
                                                    {categoryDocs.map((doc, index) => {
                                                        const docIndex = documents.findIndex(d => d === doc)
                                                        return (
                                                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100">
                                                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                                    {/* File Icon based on type */}
                                                                    <div className="shrink-0">
                                                                        {doc.type.includes('pdf') ? (
                                                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M4 18h12V6l-4-4H4v16zm2-6h8v2H6v-2zm0-3h8v2H6V9zm0-3h5v2H6V6z" />
                                                                            </svg>
                                                                        ) : doc.type.includes('image') ? (
                                                                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M4 18h12V6l-4-4H4v16z M8 9a2 2 0 100 4 2 2 0 000-4z" />
                                                                            </svg>
                                                                        ) : doc.type.includes('spreadsheet') || doc.type.includes('excel') || doc.type.includes('csv') ? (
                                                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M4 18h12V6l-4-4H4v16zm2-4h8v2H6v-2zm0-3h8v2H6v-2zm0-3h8v2H6V8zm0-3h5v2H6V5z" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M4 18h12V6l-4-4H4v16z" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    {/* File Name and Size */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs text-gray-900 truncate font-medium">{doc.name}</p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(doc.file.size / 1024).toFixed(1)} KB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {/* Remove Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeDocument(docIndex)}
                                                                    className="ml-2 shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Document Summary */}
                                {documents.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-xs text-gray-600">
                                                    Total: {documents.length} document{documents.length !== 1 ? 's' : ''} ready for upload
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setDocuments([])}
                                                className="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || addPending}
                                    className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium"
                                >
                                    {(isSubmitting || addPending) ? (
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
                                    href={`/${slug}/dashboard/tenants`}
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