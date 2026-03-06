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
import { useFetchAllPayments } from '@/hooks/usePayment'
import { toast } from 'sonner'

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
    status: 'active' | 'pending' | 'inactive' | 'terminated'

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

interface Document {
    id: string
    name: string
    type: string
    category: DocumentCategory
    url: string
    size?: number
    uploadedAt: string
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

    // Document states
    const [existingDocuments, setExistingDocuments] = useState<Document[]>([])
    const [newDocuments, setNewDocuments] = useState<DocumentFile[]>([])
    const [documentsToDelete, setDocumentsToDelete] = useState<string[]>([])
    const [activeCategory, setActiveCategory] = useState<DocumentCategory>(DocumentCategory.IDENTIFICATION)

    const { data, isLoading } = useFetchOneTenant(tenantId)
    console.log(data)
    const { data: properties, isLoading: propertiesLoading } = useFetchAllProperties()
    const { data: payments } = useFetchAllPayments()

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
                nextOfKinAddress: data.nextOfKinAddress || '',
                occupation: data.occupation || '',
                employer: data.employer || '',
                notes: data.notes || ''
            });

            // Set existing documents
            if (data.documents) {
                setExistingDocuments(data.documents);
            }
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

    // Document handling functions
    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
        const files = e.target.files
        if (files) {
            const newDocs = Array.from(files).map(file => ({
                file,
                type: file.type,
                name: file.name,
                category,
                uploaded: false
            }))
            setNewDocuments(prev => [...prev, ...newDocs])
        }
        // Reset input
        e.target.value = ''
    }

    const removeExistingDocument = (documentId: string) => {
        setDocumentsToDelete(prev => [...prev, documentId])
        setExistingDocuments(prev => prev.filter(doc => doc.id !== documentId))
    }

    const removeNewDocument = (index: number) => {
        setNewDocuments(prev => prev.filter((_, i) => i !== index))
    }

    const getDocumentsByCategory = (category: DocumentCategory) => {
        const existing = existingDocuments.filter(doc => doc.category === category)
        const news = newDocuments.filter(doc => doc.category === category)
        return { existing, news }
    }

    const getCategoryProgress = (category: DocumentCategory) => {
        const { existing, news } = getDocumentsByCategory(category)
        const totalCount = existing.length + news.length
        const config = categoryConfigs.find(c => c.id === category)

        if (config?.required && totalCount === 0) {
            return 'required'
        }
        if (config?.maxFiles && totalCount >= config.maxFiles) {
            return 'full'
        }
        return 'ok'
    }

    const onSubmit = async (formData: TenantForm) => {
        // Check required documents
        const missingRequired = categoryConfigs
            .filter(config => config.required)
            .filter(config => {
                const { existing, news } = getDocumentsByCategory(config.id)
                return existing.length + news.length === 0
            })
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

    const executeUpdate = (formattedData: TenantForm) => {
        // Create FormData for file upload
        const formDataToSend = new FormData()

        // Append tenant data as JSON string
        const tenantData = {
            ...formattedData
        }

        formDataToSend.append('data', JSON.stringify(tenantData))

        // Append documents to delete
        if (documentsToDelete.length > 0) {
            formDataToSend.append('deleteDocuments', JSON.stringify(documentsToDelete))
        }

        // Append all new documents
        newDocuments.forEach((doc) => {
            formDataToSend.append('documents', doc.file)
        })

        // Append categories for new documents
        if (newDocuments.length > 0) {
            const categories = newDocuments.map(doc => doc.category)
            formDataToSend.append('categories', JSON.stringify(categories))
        }

        editMutate({ tenantId, data: formDataToSend }, {
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

    // Auto-fill rent when property is selected
    const updateRentFromProperty = () => {
        if (selectedPropertyId && properties) {
            const selectedProperty = properties.find((prop: any) => prop.id === selectedPropertyId)
            if (selectedProperty) {
                setValue('actualRent', parseFloat(selectedProperty.monthlyRent) || 0)
            }
        }
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) {
            return <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16zm2-6h8v2H6v-2zm0-3h8v2H6V9zm0-3h5v2H6V6z" />
            </svg>
        } else if (fileType.includes('image')) {
            return <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16z M8 9a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
        } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
            return <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16zm2-4h8v2H6v-2zm0-3h8v2H6v-2zm0-3h8v2H6V8zm0-3h5v2H6V5z" />
            </svg>
        } else {
            return <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16z" />
            </svg>
        }
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size'
        const kb = bytes / 1024
        if (kb < 1024) return `${kb.toFixed(1)} KB`
        const mb = kb / 1024
        return `${mb.toFixed(1)} MB`
    }

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
                                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors cursor-pointer text-sm font-medium"
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
                                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer text-sm font-medium"
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
                                                    value={watch('nextOfKinRelationship')}
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
                                                    {...register('propertyId', {
                                                        onChange: updateRentFromProperty
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm`}
                                                    value={watch('propertyId') || 'null'}
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date {selectedPropertyId && selectedPropertyId !== 'null' && '*'}</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseStart', {
                                                        required: selectedPropertyId && selectedPropertyId !== 'null' ? 'Lease start date is required when a property is assigned' : false
                                                    })}
                                                    className={`w-full border rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm ${errors.leaseStart ? 'border-red-600' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.leaseStart && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.leaseStart.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date {selectedPropertyId && selectedPropertyId !== 'null' && '*'}</label>
                                                <input
                                                    type="date"
                                                    {...register('leaseEnd', {
                                                        required: selectedPropertyId && selectedPropertyId !== 'null' ? 'Lease end date is required when a property is assigned' : false
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
                                                    value={watch('status')}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="terminated">Terminated</option>
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
                                            {(existingDocuments.length + newDocuments.length) > 0 && (
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                                    {existingDocuments.length + newDocuments.length} file{(existingDocuments.length + newDocuments.length) !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>

                                        {/* Category Navigation */}
                                        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
                                            {categoryConfigs.map((category) => {
                                                const { existing, news } = getDocumentsByCategory(category.id)
                                                const totalCount = existing.length + news.length
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
                                                        {totalCount > 0 && (
                                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeCategory === category.id
                                                                ? 'bg-white text-[#876D4A]'
                                                                : 'bg-gray-200 text-gray-700'
                                                                }`}>
                                                                {totalCount}
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
                                            const { existing, news } = getDocumentsByCategory(category.id)
                                            const totalCount = existing.length + news.length
                                            const remainingSlots = category.maxFiles ? category.maxFiles - totalCount : Infinity

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
                                                                {totalCount} / {category.maxFiles} files
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Existing Documents */}
                                                    {existing.length > 0 && (
                                                        <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
                                                            <h4 className="text-xs font-medium text-gray-700 px-1">Current Documents</h4>
                                                            {existing.map((doc) => (
                                                                <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100">
                                                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                                        {/* File Icon */}
                                                                        <div className="shrink-0">
                                                                            {getFileIcon(doc.type)}
                                                                        </div>
                                                                        {/* File Name and Size */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-xs text-gray-900 truncate font-medium">{doc.name}</p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                        {/* View Button */}
                                                                        <a
                                                                            href={doc.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="ml-2 shrink-0 text-gray-400 hover:text-[#876D4A] transition-colors"
                                                                            title="View document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </a>
                                                                        {/* Remove Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeExistingDocument(doc.id)}
                                                                            className="ml-1 shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                                                            title="Remove document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* New Documents (not yet uploaded) */}
                                                    {news.length > 0 && (
                                                        <div className="bg-blue-50 rounded-2xl p-3 space-y-2">
                                                            <h4 className="text-xs font-medium text-blue-700 px-1">New Documents (Ready to Upload)</h4>
                                                            {news.map((doc, index) => {
                                                                const docIndex = newDocuments.findIndex(d => d === doc)
                                                                return (
                                                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-xl border border-blue-100">
                                                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                                            {/* File Icon */}
                                                                            <div className="shrink-0">
                                                                                {getFileIcon(doc.type)}
                                                                            </div>
                                                                            {/* File Name and Size */}
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs text-gray-900 truncate font-medium">{doc.name}</p>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {(doc.file.size / 1024).toFixed(1)} KB
                                                                                </p>
                                                                            </div>
                                                                            {/* Remove Button */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeNewDocument(docIndex)}
                                                                                className="ml-2 shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}

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
                                                </div>
                                            )
                                        })}

                                        {/* Document Summary */}
                                        {(existingDocuments.length > 0 || newDocuments.length > 0) && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="text-xs text-gray-600">
                                                            Total: {existingDocuments.length + newDocuments.length} document{(existingDocuments.length + newDocuments.length) !== 1 ? 's' : ''}
                                                            {newDocuments.length > 0 && ` (${newDocuments.length} new ready to upload)`}
                                                            {documentsToDelete.length > 0 && ` (${documentsToDelete.length} marked for deletion)`}
                                                        </span>
                                                    </div>
                                                    {(newDocuments.length > 0 || documentsToDelete.length > 0) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNewDocuments([])
                                                                setDocumentsToDelete([])
                                                                // Reset existing documents from original data
                                                                if (data?.documents) {
                                                                    setExistingDocuments(data.documents)
                                                                }
                                                            }}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Reset document changes
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {(isEditPending || deletePending) ?
                                        <div className="flex justify-center py-4">
                                            <Spinner />
                                        </div>
                                        :
                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="border border-red-300 text-red-700 px-5 py-2 rounded-2xl hover:bg-red-300 disabled:opacity-50 transition-colors cursor-pointer text-sm font-medium"
                                            >
                                                Delete Tenant
                                            </button>
                                            <div
                                                onClick={() => router.back()}
                                                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-300 transition-colors cursor-pointer text-sm text-center font-medium"
                                            >
                                                Cancel
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm font-medium sm:ml-auto"
                                            >
                                                Save Changes
                                            </button>
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

                            {/* Document Summary Sidebar */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Document Summary</h3>
                                <div className="space-y-2">
                                    {categoryConfigs.map((category) => {
                                        const { existing, news } = getDocumentsByCategory(category.id)
                                        const totalCount = existing.length + news.length
                                        if (totalCount === 0) return null
                                        return (
                                            <div key={category.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">{category.icon}</span>
                                                    <span className="text-xs text-gray-600">{category.label}</span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-900">
                                                    {totalCount}
                                                    {news.length > 0 && <span className="text-blue-600 ml-1">(+{news.length})</span>}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    {existingDocuments.length === 0 && newDocuments.length === 0 && (
                                        <p className="text-xs text-gray-500 text-center py-2">No documents uploaded</p>
                                    )}
                                </div>
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