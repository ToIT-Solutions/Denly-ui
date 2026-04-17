import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { adminLogin, fetchAdminMe } from "@/api/admin/adminAuth";
import useAuthStore from '@/store/useAuthStore';

export const useAdminLogin = () => {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: (data: { email: string; password: string }) => adminLogin(data),
        onSuccess: (data) => {
            showSuccessToast('Welcome back admin')
            setUser(data)
            //console.log(data)
            router.push('/secret-panel-88/dashboard')
        },
        onError: (error: any) => {
            showErrorToast(error)
            router.push(`/auth/login`)
        }
    })
}

export const useFetchAdminMe = () => {
    return useQuery({
        queryKey: ["adminMe"],
        queryFn: () => fetchAdminMe(),
    })
}