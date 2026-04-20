import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { fetchChangelogs, fetchOneChangelog, createChangelog, updateChangelog, deleteChangelog } from "@/api/admin/adminChangelog";
import { useRouter } from "next/navigation";

export const useFetchChangelogs = () => {
    return useQuery({
        queryKey: ["adminChangelogs"],
        queryFn: () => fetchChangelogs(),
    })
}

export const useFetchOneChangelog = (id: string) => {
    return useQuery({
        queryKey: ["adminChangelog", id],
        queryFn: () => fetchOneChangelog(id),
        enabled: !!id,
    })
}

export const useCreateChangelog = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (data: any) => createChangelog(data),
        onSuccess: () => {
            showSuccessToast('Changelog created successfully')
            queryClient.invalidateQueries({ queryKey: ["adminChangelogs"] })
            router.push('/secret-panel-88/changelog')
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

export const useDeleteChangelog = (id: string) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: () => deleteChangelog(id),
        onSuccess: () => {
            showSuccessToast('Changelog deleted successfully')
            queryClient.invalidateQueries({ queryKey: ["adminChangelogs"] })
            router.push('/secret-panel-88/changelog')
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}