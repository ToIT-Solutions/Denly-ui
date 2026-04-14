import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { fetchAllUsers, updateUserRole, updateUserStatus } from "@/api/admin/adminUsers";

export const useFetchAllUsers = () => {
    return useQuery({
        queryKey: ["adminUsers"],
        queryFn: () => fetchAllUsers(),
    })
}

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) => updateUserRole(id, role),
        onSuccess: () => {
            showSuccessToast('User role updated successfully')
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => updateUserStatus(id, status),
        onSuccess: () => {
            showSuccessToast('User status updated successfully')
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}