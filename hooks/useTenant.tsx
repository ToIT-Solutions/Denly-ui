import { addTenant, deleteTenant, editTenant, fetchAllTenants, fetchOneTenant } from "@/api/tenant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";


export const useAddTenant = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: addTenant,
        onSuccess: (data) => {
            console.log(data)
            router.push(`/dashboard/tenants`)
            showSuccessToast('Tenant added successfully!')
        },
        onError: (error: any) => {
            showErrorToast(error)
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
    const router = useRouter()
    return useMutation({
        mutationFn: ({ tenantId, data }: { tenantId: string; data: any }) => editTenant(data, tenantId),
        onSuccess: (data, tenantId) => {
            console.log(data)
            showSuccessToast('Tenant edited successfully')
            queryClient.invalidateQueries({ queryKey: ["Tenant", tenantId] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useDeleteTenant = () => {
    const queryClient = useQueryClient();
    const router = useRouter()
    return useMutation({
        mutationFn: (tenantId: string) => deleteTenant(tenantId),
        onSuccess: (data) => {
            console.log(data)
            router.push(`/dashboard/tenants/`)
            showSuccessToast('Tenant deleted successfully')
            queryClient.invalidateQueries({ queryKey: ["allTenants"] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}