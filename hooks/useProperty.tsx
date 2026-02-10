import { addProperty } from "@/api/property";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useAddProperty = () => {
    return useMutation({
        mutationFn: addProperty,
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useFetchAllProperties = () => {
    return useQuery({
        queryKey: ["allProperties"],
    })
}

export const useFetchOneProperty = (propertyId: string) => {
    return useQuery({
        queryKey: ["Property", propertyId],
    })
}