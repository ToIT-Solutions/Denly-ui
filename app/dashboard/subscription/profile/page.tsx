// app/app/[companyId]/settings/profile/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'

interface ProfileForm {
    firstName: string
    lastName: string
    email: string
    phone: string
    timezone: string
    language: string
}

export default function ProfileSettingsPage() {
    usePageTitle('Profile Settings - Denly')
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ProfileForm>({
        defaultValues: {
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'alex.johnson@denlyproperties.com',
            phone: '+1 (555) 123-4567',
            timezone: 'Pacific Time (PT)',
            language: 'English'
        }
    })

    const onSubmit = (data: ProfileForm) => {
        console.log('📝 Profile form submitted with data:', data)
        // Handle form submission here
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Profile Settings</h1>
                        <p className="text-gray-600 text-sm">Manage your personal information and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Form */}
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
                                                    placeholder="Enter your first name"
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
                                                    placeholder="Enter your last name"
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
                                                    placeholder="Enter your email address"
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    {...register('phone')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black placeholder-gray-400 text-sm"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Property Manager"
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-black placeholder-gray-400 bg-gray-50 cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferences */}
                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Preferences</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                                <select
                                                    {...register('timezone')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm"
                                                >
                                                    <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                                                    <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                                                    <option value="Central Time (CT)">Central Time (CT)</option>
                                                    <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                                <select
                                                    {...register('language')}
                                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-black text-sm"
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                    <option value="German">German</option>
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
                                            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Profile Sidebar */}
                        <div className="space-y-4">
                            {/* Profile Photo */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Profile Photo</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-[#876D4A] rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        AJ
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-sm font-medium"
                                        >
                                            Upload New Photo
                                        </button>
                                        <p className="text-gray-600 text-xs mt-1">JPG, PNG or GIF, max 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Security</h3>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer"
                                    >
                                        <p className="font-medium text-gray-900 text-sm">Change Password</p>
                                        <p className="text-gray-600 text-xs">Update your password regularly</p>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer"
                                    >
                                        <p className="font-medium text-gray-900 text-sm">Two-Factor Authentication</p>
                                        <p className="text-gray-600 text-xs">Add an extra layer of security</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}