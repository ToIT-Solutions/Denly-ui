// app/auth/signup/page.jsx
'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import logo from '@/public/img/logo.png'
import Image from 'next/image'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useSignup } from '@/hooks/useAuth'
import { toast } from "sonner"
import Spinner from '@/components/Spinner'

interface SignupForm {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    company?: string
    terms: boolean
}

export default function SignupPage() {

    usePageTitle('Signup - Denly')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger
    } = useForm<SignupForm>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })

    const [showAllErrors, setShowAllErrors] = useState(false)
    const [serverError, setserverError] = useState<string | null>(null)

    const { mutate, isPending, error } = useSignup()

    const onSubmit = async (data: SignupForm) => {
        console.log('📝 Form submitted with data:', data)
        setShowAllErrors(true)

        mutate(data, {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (error: any) => {
                console.log(error)
                toast('An error occured trying to create your account', {
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

    const password = watch('password')

    // Simplified helper function - show error when there's an error AND (form submitted OR field was blurred with error)
    const shouldShowError = (fieldName: keyof SignupForm) => {
        return !!errors[fieldName] && showAllErrors
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image with Darker Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80")',
                    // backgroundImage: 'url("https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=2050&q=80")',
                }}
            >
                <div className="absolute inset-0 bg-[#876D4A]/70 backdrop-blur-[1px]"></div>
            </div>

            {/* Glass Morphism Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-white/1 to-white/4"></div>

                    <div className="relative z-10 p-6">
                        {/* Centered Logo */}
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Image src={logo} alt='Denly Logo' className='w-29' />
                            </div>
                            <h1 className="text-2xl text-white mb-1 drop-shadow-sm">Create Your Account</h1>
                            <p className="text-white/80 text-sm drop-shadow-sm">Start managing your properties with Denly</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="firstName" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        {...register('firstName', {
                                            required: 'First name is required',
                                            minLength: {
                                                value: 3,
                                                message: 'First name must be at least 3 characters'
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: 'First name must be less than 20 characters'
                                            },
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: 'First name can only contain letters and spaces'
                                            }
                                        })}
                                        onBlur={() => trigger('firstName')}
                                        className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.firstName ? 'border-red-600' : 'border-gray-300'
                                            }`}
                                        placeholder="First name"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.firstName.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        {...register('lastName', {
                                            required: 'Last name is required',
                                            minLength: {
                                                value: 4,
                                                message: 'Last name must be at least 4 characters'
                                            },
                                            maxLength: {
                                                value: 30,
                                                message: 'Last name must be less than 30 characters'
                                            },
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: 'Last name can only contain letters and spaces'
                                            }
                                        })}
                                        onBlur={() => trigger('lastName')}
                                        className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.lastName ? 'border-red-600' : 'border-gray-300'
                                            }`}
                                        placeholder="Last name"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                            {errors.lastName.message as string}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
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
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                        {errors.email.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
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
                                        },
                                        // pattern: {
                                        //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                        //     message: 'Password must include uppercase, lowercase, number, and special character'
                                        // }
                                    })}
                                    onBlur={() => trigger('password')}
                                    className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.password ? 'border-red-600' : 'border-gray-300'
                                        }`}
                                    placeholder="Create a password"
                                />
                                {errors.password ? (
                                    <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                        {errors.password.message as string}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-white/70 drop-shadow-sm">
                                        Must be 8+ characters with uppercase, lowercase, number, and special character
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
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
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                        {errors.confirmPassword.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Company Name */}
                            {/* <div>
                                <label htmlFor="company" className="block text-xs font-medium text-white mb-1 drop-shadow-sm">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    {...register('company', {
                                        maxLength: {
                                            value: 100,
                                            message: 'Company name must be less than 100 characters'
                                        }
                                    })}
                                    onBlur={() => trigger('company')}
                                    className={`w-full px-3 py-2 bg-white/90 border rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#876D4A] focus:border-[#876D4A] transition-all text-sm outline-0 ${errors.company ? 'border-red-600' : 'border-gray-300'
                                        }`}
                                    placeholder="Your company name (optional)"
                                />
                                {errors.company && (
                                    <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                        {errors.company.message as string}
                                    </p>
                                )}
                            </div> */}

                            {/* Terms Agreement */}
                            <div>
                                <label className="flex items-start text-sm">
                                    <input
                                        type="checkbox"
                                        {...register('terms', {
                                            required: 'You must accept the terms and privacy policy'
                                        })}
                                        className="rounded border-gray-300 bg-white accent-[#876D4A] text-[#876D4A] focus:ring-[#876D4A] mt-0.5 w-3 h-3"
                                    />
                                    <span className="ml-2 text-white/80 drop-shadow-sm">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-white hover:text-[#876D4A] hover:underline transition-colors">
                                            Terms
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy-policy" className="text-white hover:text-[#876D4A] hover:underline transition-colors">
                                            Privacy Policy
                                        </Link>
                                        *
                                    </span>
                                </label>
                                {errors.terms && (
                                    <p className="mt-1 text-xs text-red-600 drop-shadow-sm">
                                        {errors.terms.message as string}
                                    </p>
                                )}
                            </div>


                            {isPending ?
                                <div className='text-center'>
                                    <Spinner />
                                </div>
                                :
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#876D4A] text-white py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg text-sm cursor-pointer"
                                >
                                    Create Account
                                </button>
                            }

                        </form>

                        <div className="mt-3 text-center">
                            <p className="text-white/80 text-sm drop-shadow-sm">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-white hover:text-[#876D4A] hover:underline font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}