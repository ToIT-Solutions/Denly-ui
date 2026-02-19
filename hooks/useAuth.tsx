import { forgotPassword, login, resetPassword, signup } from '@/api/auth'
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';


export const useSignup = () => {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            console.log(data)
            setUser(data)
            showSuccessToast('Account created successfully')
            router.push(`/dashboard`)
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}

export const useLogin = () => {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('You have logged in successfully')
            setUser(data)
            router.push(`/dashboard`)
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}

export const useForgotPassword = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('Your password reset request has been sent successfully, check your email')
            router.push(`/auth/login`)
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}

export const useResetPassword = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('You have successfully reset your password')
            router.push(`/auth/login`)
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}