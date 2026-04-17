// app/admin/login/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminLogin } from '@/hooks/admin/useAdminAuth'
import Spinner from '@/components/Spinner'

interface AdminLoginForm {
    email: string
    password: string
}

export default function AdminLoginPage() {
    usePageTitle('Admin Login - Denly')
    const router = useRouter()
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger
    } = useForm<AdminLoginForm>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })

    const { mutate, isPending } = useAdminLogin()

    const onSubmit = async (data: AdminLoginForm) => {
        setError('')

        //console.log(data)
        mutate(data)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
                    <p className="text-sm text-gray-400 mt-1">Access the admin dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                onBlur={() => trigger('email')}
                                className={`w-full px-3 py-2 bg-gray-900 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 text-sm ${errors.email ? 'border-red-600' : 'border-gray-700'
                                    }`}
                            // placeholder="admin@denly.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
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
                                className={`w-full px-3 py-2 bg-gray-900 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 text-sm ${errors.password ? 'border-red-600' : 'border-gray-700'
                                    }`}
                            // placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        {isPending ? <Spinner /> :
                            <button
                                type="submit"
                                className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-900 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                Log in
                            </button>
                        }
                    </form>

                    {/* Simple Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <p className="text-center text-xs text-gray-500">
                            Secure admin access only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}