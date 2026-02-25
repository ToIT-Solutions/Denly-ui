'use client'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useEditUser } from '@/hooks/useUser'
import useAuthStore from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { useChangePassword } from '@/hooks/useAuth'

interface UserData {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'owner' | 'manager' | 'agent' | 'viewer';
    status?: 'active' | 'invited' | 'suspended';
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfileSettingsPage() {
    usePageTitle('Profile Settings - Denly')

    const user = useAuthStore((state) => state.user)

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UserData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        }
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        watch: watchPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting }
    } = useForm<PasswordData>()

    const newPasswordValue = watchPassword("newPassword")

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            })
        }
    }, [reset, user])

    const { mutate, isPending } = useEditUser()
    const { mutate: passwordMutate, isPending: passwordPending } = useChangePassword()

    const onSubmit = (data: UserData) => {
        mutate({ userId: user.id, data })
    }

    const onChangePassword = (data: PasswordData) => {

        const payload = {
            ...data,
            userId: user.id
        }
        // console.log("Change password payload:", payload)
        passwordMutate(payload)
        resetPasswordForm()
        setIsPasswordModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">

                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Profile Settings</h1>
                        <p className="text-gray-600 text-sm">Manage your personal information and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Profile Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                                    <div>
                                        <h2 className="font-medium text-gray-900 mb-4">Personal Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                                <input
                                                    type="text"
                                                    {...register('firstName', { required: 'First name is required' })}
                                                    className={`w-full border rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] ${errors.firstName ? 'border-red-600' : 'border-gray-300'}`}
                                                />
                                                {errors.firstName && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                                <input
                                                    type="text"
                                                    {...register('lastName', { required: 'Last name is required' })}
                                                    className={`w-full border rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] ${errors.lastName ? 'border-red-600' : 'border-gray-300'}`}
                                                />
                                                {errors.lastName && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                                <input
                                                    type="email"
                                                    {...register('email', { required: 'Email is required' })}
                                                    className={`w-full border rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] ${errors.email ? 'border-red-600' : 'border-gray-300'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isPending ? (
                                        <Spinner />
                                    ) : (
                                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium cursor-pointer"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Security</h3>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer"
                                >
                                    <p className="font-medium text-gray-900 text-sm">Change Password</p>
                                    <p className="text-gray-600 text-xs">Update your password</p>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 🔥 CHANGE PASSWORD MODAL */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">

                        <h2 className="text-lg font-semibold mb-4 text-gray-900">
                            Change Password
                        </h2>

                        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password *
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A]"
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {passwordErrors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Minimum 6 characters' }
                                    })}
                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Retype Password *
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value =>
                                            value === newPasswordValue || 'Passwords do not match'
                                    })}
                                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A]"
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {passwordErrors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-5 py-2 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-300 text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isPasswordSubmitting}
                                    className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Change Password
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}