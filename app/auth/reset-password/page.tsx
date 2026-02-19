// app/auth/reset-password/page.tsx
'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import logo from '@/public/img/logoWhite.png'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useParams, useSearchParams } from 'next/navigation'
import { useResetPassword } from '@/hooks/useAuth'

type ResetPasswordForm = {
    password: string
    confirmPassword: string
}

export default function ResetPasswordPage() {

    usePageTitle('Reset Password - Denly')

    const params = useSearchParams()
    const token = params.get('token')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        watch
    } = useForm<ResetPasswordForm>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })

    const [showAllErrors, setShowAllErrors] = useState(false)
    const password = watch('password')

    const { mutate, isPending } = useResetPassword()

    const onSubmit = async (data: ResetPasswordForm) => {
        console.log('📝 Reset password form submitted with data:', data)
        setShowAllErrors(true)
        // Add your logic here

        const payload = { ...data, token }
        console.log(payload)

        mutate(payload)
    }

    return (
        <>
            <div className="min-h-screen relative overflow-hidden">
                {/* Background Image with Darker Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                >
                    <div className="absolute inset-0 bg-[#876D4A]/70 backdrop-blur-[1px]"></div>
                </div>

                {/* Glass Morphism Container */}
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-white/1 to-white/8"></div>

                        <div className="relative z-10 p-8">
                            {/* Centered Logo */}
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center space-x-3 mb-3">
                                    <Image src={logo} alt='Denly Logo' className='w-29' />
                                </div>
                                <h1 className="text-2xl text-white mb-1 drop-shadow-sm">Reset Password</h1>
                                <p className="text-white/80 text-sm drop-shadow-sm">Enter your new password</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
                                        New Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            }
                                        })}
                                        onBlur={() => trigger('password')}
                                        className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.password ? 'border-red-600' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter new password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.password.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: value => value === password || 'Passwords do not match'
                                        })}
                                        onBlur={() => trigger('confirmPassword')}
                                        className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.confirmPassword ? 'border-red-600' : 'border-gray-300'
                                            }`}
                                        placeholder="Confirm new password"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.confirmPassword.message as string}
                                        </p>
                                    )}
                                </div>

                                {isSubmitting ?
                                    <Spinner />
                                    :
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#876D4A] text-white py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg text-sm cursor-pointer"
                                    >
                                        Reset Password
                                    </button>
                                }
                            </form>

                            <div className="mt-4 text-center">
                                <p className="text-white/80 text-sm drop-shadow-sm">
                                    Remember your password?{' '}
                                    <Link href="/auth/login" className="text-white hover:text-[#876D4A] hover:underline font-medium transition-colors drop-shadow-sm">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}