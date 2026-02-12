import { login, signup } from '@/api/auth'
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