import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { editCompanyData, fetchCompanyData, fetchCompanyStats } from "@/api/company";

interface CompanyData {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    taxId: string
    industry: string
}

export const useFetchCompanyData = () => {
    return useQuery({
        queryKey: ["companyData"],
        queryFn: () => fetchCompanyData(),
    })
}

export const useEditCompany = () => {
    const queryClient = useQueryClient();
    const router = useRouter()
    return useMutation({
        mutationFn: (data: CompanyData) => editCompanyData(data),
        onSuccess: (data) => {
            console.log(data)
            showSuccessToast('Company edited successfully')
            // router.push('/subscription/company')
            queryClient.invalidateQueries({ queryKey: ["companyData"] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useFetchCompanyStats = () => {
    return useQuery({
        queryKey: ["companyStats"],
        queryFn: () => fetchCompanyStats(),
    })
}