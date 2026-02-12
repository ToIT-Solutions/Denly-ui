import { addTenant, deleteTenant, editTenant, fetchAllTenants, fetchOneTenant } from "@/api/tenant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useAddTenant = () => {
    return useMutation({
        mutationFn: addTenant,
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useFetchAllTenants = () => {
    return useQuery({
        queryKey: ["allTenants"],
        queryFn: () => fetchAllTenants(),
    })
}

export const useFetchOneTenant = (tenantId: string) => {
    return useQuery({
        queryKey: ["Tenant", tenantId],
        queryFn: () => fetchOneTenant(tenantId),
        enabled: !!tenantId,
    })
}

export const useEditTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tenantId, data }: { tenantId: string; data: any }) => editTenant(data, tenantId),
        onSuccess: (data, tenantId) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ["Tenant", tenantId] });
        }
    })
}

export const useDeleteTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tenantId: string) => deleteTenant(tenantId),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ["allTenants"] });
        }
    })
}