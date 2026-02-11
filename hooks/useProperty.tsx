import { addProperty, editProperty, fetchAllProperties, fetchOneProperty, deleteProperty } from "@/api/property";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useAddProperty = () => {
    return useMutation({
        mutationFn: addProperty,
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useFetchAllProperties = (subscriptionId: string) => {
    return useQuery({
        queryKey: ["allProperties"],
        queryFn: () => fetchAllProperties(subscriptionId),
        enabled: !!subscriptionId,
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
    return useMutation({
        mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) => editProperty(propertyId, data),
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useDeleteProperty = () => {
    return useMutation({
        mutationFn: (propertyId: string) => deleteProperty(propertyId),
        onSuccess: (data) => {
            console.log(data)
        }
    })
}