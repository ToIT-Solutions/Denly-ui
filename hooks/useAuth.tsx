import { login, signup } from '@/api/auth'
import { useMutation } from "@tanstack/react-query";


export const useSignup = () => {
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data)
        }
    })
}