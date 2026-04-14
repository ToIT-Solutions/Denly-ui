import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { fetchChangelogs, createChangelog, updateChangelog, deleteChangelog } from "@/api/admin/adminChangelog";

export const useFetchChangelogs = () => {
    return useQuery({
        queryKey: ["adminChangelogs"],
        queryFn: () => fetchChangelogs(),
    })
}

export const useCreateChangelog = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: any) => createChangelog(data),
        onSuccess: () => {
            showSuccessToast('Changelog created successfully')
            queryClient.invalidateQueries({ queryKey: ["adminChangelogs"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useUpdateChangelog = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateChangelog(id, data),
        onSuccess: () => {
            showSuccessToast('Changelog updated successfully')
            queryClient.invalidateQueries({ queryKey: ["adminChangelogs"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useDeleteChangelog = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteChangelog(id),
        onSuccess: () => {
            showSuccessToast('Changelog deleted successfully')
            queryClient.invalidateQueries({ queryKey: ["adminChangelogs"] })
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}