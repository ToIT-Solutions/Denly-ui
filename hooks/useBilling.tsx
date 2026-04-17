import { createBilling, fetchAllBilling, fetchBillingStatus, fetchPaynowPoll } from "@/api/billing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";


export const useCreatePayment = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (data: any) => createBilling(data),
        onSuccess: (data) => {
            //console.log(data)
            router.push(data.redirectUrl)
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useFetchAllBilling = () => {
    return useQuery({
        queryKey: ["allBilling"],
        queryFn: () => fetchAllBilling(),
    })
}

export const useFetchBillingStatus = (billingId: string) => {
    return useQuery({
        queryKey: ["billing", billingId],
        queryFn: () => fetchBillingStatus(billingId),
        enabled: !!billingId,
    })
}

export const useFetchPaynowPoll = (billingId: string) => {
    return useQuery({
        queryKey: ["poll", billingId],
        queryFn: () => fetchPaynowPoll(billingId),
        enabled: !!billingId,
    })
}