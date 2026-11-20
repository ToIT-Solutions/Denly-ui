import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { deleteInvite, fetchAllInvites, inviteUser, processInvite, resendInvite } from "@/api/invite";


export const useFetchAllInvites = () => {
    return useQuery({
        queryKey: ["allInvites"],
        queryFn: () => fetchAllInvites(),
    })
}

export const useProcessInvite = () => {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: processInvite,
        onSuccess: (data) => {
            //console.log(data)
            setUser(data)
            showSuccessToast('Account created successfully')
            router.push(`/dashboard`)
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useInviteUser = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: (data: any) => inviteUser(data),
        onSuccess: (data) => {
            //console.log(data)
            showSuccessToast('Invitation sent successfully')
        },
        onError: (error: any) => {
            showErrorToast(error)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["allInvites"] })
    })
}

export const useResendInvite = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: (data: any) => resendInvite(data),
        onSuccess: (data) => {
            //console.log(data)
            showSuccessToast('Invitation resent successfully')
        },
        onError: (error: any) => {
            showErrorToast(error)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["allInvites"] })
    })
}

export const useDeleteInvite = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: (inviteId: any) => deleteInvite(inviteId),
        onSuccess: (data) => {
            //console.log(data)
            showSuccessToast('Invitation removed successfully')
            queryClient.invalidateQueries({ queryKey: ["allInvites"] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}
