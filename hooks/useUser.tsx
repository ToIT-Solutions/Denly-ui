import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { deleteUser, editUser, editUserRole, fetchAllUsers, fetchOneUser } from "@/api/user";


export const useFetchAllUsers = () => {
    return useQuery({
        queryKey: ["allUsers"],
        queryFn: () => fetchAllUsers(),
    })
}

export const useFetchOneUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchOneUser(userId),
        enabled: !!userId,
    })
}

export const useEditUser = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: any }) => editUser(userId, data),
        onSuccess: (data, userId) => {
            console.log(data)
            showSuccessToast('User edited successfully')
            // router.push('/dashboard/properties')
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}


export const useEditUserRole = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: any }) => editUserRole(userId, data),
        onSuccess: (data, userId) => {
            console.log(data)
            showSuccessToast('User role changed successfully')
            // router.push('/dashboard/properties')
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}


export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: (propertyId: string) => deleteUser(propertyId),
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('User deleted successfully')
            // router.push('/dashboard/properties')
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        },
        onError: (error: any) => {
            console.log(error)
            showErrorToast(error)
        }
    })
}
