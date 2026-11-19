import { addPayment, deletePayment, editPayment, fetchAllPayments, fetchOnePayment } from "@/api/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export const useAddPayment = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addPayment,
        retry: false,
        onSuccess: (data) => {
            // Refresh payment history, balances and summaries after the committed allocation.
            for (const key of ["allPayments", "Payment", "allRentLedger", "rentLedger", "companyStats", "Tenant", "allTenants", "Property", "allProperties"]) {
                queryClient.invalidateQueries({ queryKey: [key] })
            }
            router.push('/dashboard/payments')
            showSuccessToast(data.unusedAmount > 0
                ? `Payment added successfully. $${data.unusedAmount.toFixed(2)} was not applied or stored.`
                : 'Payment added successfully')
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    })
}

export const useFetchAllPayments = () => {
    return useQuery({
        queryKey: ["allPayments"],
        queryFn: () => fetchAllPayments(),
    })
}

export const useFetchOnePayment = (paymentId: string) => {
    return useQuery({
        queryKey: ["Payment", paymentId],
        queryFn: () => fetchOnePayment(paymentId),
        enabled: !!paymentId,
    })
}

// export const useEditPayment = () => {
//     return useMutation({
//         mutationFn: ({ paymentId, data }: { paymentId: string; data: any }) => editPayment(paymentId, data),
//         onSuccess: (data) => {
//             //console.log(data)
//         }
//     })
// }

// export const useDeletePayment = () => {
//     return useMutation({
//         mutationFn: (paymentId: string) => deletePayment(paymentId),
//         onSuccess: (data) => {
//             //console.log(data)
//         }
//     })
// }
