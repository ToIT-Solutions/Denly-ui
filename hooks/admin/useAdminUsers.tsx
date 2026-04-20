import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { fetchAllUsers, updateUser } from "@/api/admin/adminUsers";

export const useFetchAllUsers = () => {
    return useQuery({
        queryKey: ["adminUsers"],
        queryFn: () => fetchAllUsers(),
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateUser(id, data),
        onSuccess: () => {
            showSuccessToast('User updated successfully')
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}