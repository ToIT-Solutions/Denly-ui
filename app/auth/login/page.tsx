// app/auth/login/page.jsx
'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import logo from '@/public/img/logoWhite.png'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useLogin } from '@/hooks/useAuth'
import { toast } from "sonner"
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation'

interface LoginForm {
    email: string
    password: string
    rememberMe: boolean
}
export default function LoginPage() {

    usePageTitle('Login - Denly')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger
    } = useForm<LoginForm>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })

    const router = useRouter()

    const setUser = useAuthStore((state) => state.setUser)

    const [showAllErrors, setShowAllErrors] = useState(false)

    const { mutate, isPending, error } = useLogin()

    const onSubmit = async (data: LoginForm) => {
        console.log('📝 Login form submitted with data:', data)
        setShowAllErrors(true)

        mutate(data, {
            onSuccess: (data) => {
                console.log(data)
                setUser(data)
                router.push(`/dashboard`)
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

    return (
        <>

            <div className="min-h-screen relative overflow-hidden">
                {/* Background Image with Darker Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
                    }}
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
                                <h1 className="text-2xl text-white mb-1 drop-shadow-sm">Welcome Back</h1>
                                <p className="text-white/80 text-sm drop-shadow-sm">Sign in to your Denly account</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
                                        Email Address *
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
                                        className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.email ? 'border-red-600' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.email.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
                                        Password *
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
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.password.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('rememberMe')}
                                            className="rounded border-gray-300 bg-white text-[#876D4A] focus:ring-[#876D4A] w-3 h-3"
                                        />
                                        <span className="ml-2 text-white/80 drop-shadow-sm">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-white/80 hover:text-[#876D4A] hover:underline transition-colors drop-shadow-sm">
                                        Forgot password?
                                    </Link>
                                </div>

                                {isPending ?
                                    <Spinner />
                                    :
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#876D4A] text-white py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg text-sm cursor-pointer"
                                    >
                                        Log in
                                    </button>
                                }

                            </form>

                            <div className="mt-4 text-center">
                                <p className="text-white/80 text-sm drop-shadow-sm">
                                    Don't have an account?{' '}
                                    <Link href="/auth/signup" className="text-white hover:text-[#876D4A] hover:underline font-medium transition-colors drop-shadow-sm">
                                        Sign up
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