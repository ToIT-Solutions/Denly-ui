import { addProperty, editProperty, fetchAllProperties, fetchOneProperty, deleteProperty } from "@/api/property";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export const useAddProperty = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: addProperty,
        onSuccess: (data) => {
            console.log(data)
            router.back()
            showSuccessToast("Property added successfully")
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useFetchAllProperties = () => {
    return useQuery({
        queryKey: ["allProperties"],
        queryFn: () => fetchAllProperties(),
    })
}

export const useFetchOneProperty = (propertyId: string) => {
    return useQuery({
        queryKey: ["Property", propertyId],
        queryFn: () => fetchOneProperty(propertyId),
        enabled: !!propertyId,
    })
}

export const useEditProperty = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) => editProperty(propertyId, data),
        onSuccess: (data, propertyId) => {
            console.log(data)
            showSuccessToast('Property edited successfully')
            router.push('/dashboard/properties')
            queryClient.invalidateQueries({ queryKey: ["Property", propertyId] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();
    const router = useRouter()

    return useMutation({
        mutationFn: (propertyId: string) => deleteProperty(propertyId),
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('Property deleted successfully')
            router.push('/dashboard/properties')
            queryClient.invalidateQueries({ queryKey: ["allProperties"] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}