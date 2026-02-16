'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/img/logoWhite.png'
import Spinner from '@/components/Spinner'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProcessInvite } from '@/hooks/useInvite'

interface InvitationForm {
    firstName: string
    lastName: string
    password: string
    confirmPassword: string
}

export default function InvitationSignupPage() {

    usePageTitle('Accept Invitation - Denly')

    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<InvitationForm>()

    const password = watch('password')

    const { mutate, isPending } = useProcessInvite()

    const onSubmit = (data: InvitationForm) => {
        if (!token) {
            toast.error("Invalid invitation link")
            return
        }

        const payload = { ...data, token }

        mutate(payload)
    }

    useEffect(() => {
        if (!token) {
            toast.error("Missing invitation token")
        }
    }, [token])

    return (
        <div className="min-h-screen relative overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2050&q=80")',
                }}
            >
                <div className="absolute inset-0 bg-[#876D4A]/70 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

                    <div className="relative z-10 p-6">

                        {/* Logo */}
                        <div className="text-center mb-4">
                            <Image src={logo} alt="Denly Logo" className="w-29 mx-auto mb-2" />
                            <h1 className="text-2xl text-white mb-1">
                                Complete Your Invitation
                            </h1>
                            <p className="text-white/80 text-sm">
                                Set up your account to join your team
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* First Name */}
                            <div>
                                <label className="block text-xs text-white mb-1">
                                    First Name *
                                </label>
                                <input
                                    {...register('firstName', {
                                        required: 'First name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Minimum 2 characters'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 bg-white rounded-2xl text-gray-900 outline-0 ${errors.firstName ? 'border border-red-600' : ''
                                        }`}
                                    placeholder='Enter your first name'
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-xs text-white mb-1">
                                    Last Name *
                                </label>
                                <input
                                    {...register('lastName', {
                                        required: 'Last name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Minimum 2 characters'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 bg-white rounded-2xl text-gray-900 outline-0 ${errors.lastName ? 'border border-red-600' : ''
                                        }`}
                                    placeholder='Enter your last name'
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs text-white mb-1">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 bg-white rounded-2xl text-gray-900 outline-0 ${errors.password ? 'border border-red-600' : ''
                                        }`}
                                    placeholder='Enter your password'
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs text-white mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value =>
                                            value === password || 'Passwords do not match'
                                    })}
                                    className={`w-full px-3 py-2 bg-white rounded-2xl text-gray-900 outline-0 ${errors.confirmPassword ? 'border border-red-600' : ''
                                        }`}
                                    placeholder='Re-enter your password'
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {isPending ?
                                <Spinner />
                                :
                                <button
                                    type="submit"
                                    className="w-full bg-[#876D4A] text-white py-2 mt-3 rounded-2xl hover:bg-[#756045] transition-colors font-medium shadow-lg cursor-pointer"
                                >
                                    Create Account
                                </button>
                            }
                        </form>

                        {isPending ?
                            null
                            :
                            <div className="mt-4 text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-white/80 text-sm hover:underline"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
