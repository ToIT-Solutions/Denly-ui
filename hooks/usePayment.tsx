import { addPayment, deletePayment, editPayment, fetchAllPayments, fetchOnePayment } from "@/api/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import type { PaymentData } from "@/api/payment";
import { clearPaymentIntent, preparePaymentIntent } from "@/lib/rentPaymentIntent";
import useAuthStore from "@/store/useAuthStore";

export const useAddPayment = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ data, scope, companyId, actorId }: {
            data: PaymentData; scope: string; companyId: string; actorId: string
        }) => {
            const intent = await preparePaymentIntent(scope, data);
            const { user: currentUser, token } = useAuthStore.getState();
            if (!token || currentUser?.id !== actorId || currentUser?.companyId !== companyId) {
                throw new Error("Your session changed. Reopen the original session to recover the pending payment.");
            }
            try {
                const result = await addPayment(data, intent.key, token);
                clearPaymentIntent(scope, intent.key);
                return result;
            } catch (error) {
                if (error instanceof Error && "status" in error && error.status === 400 &&
                    (!("code" in error) || error.code !== "INVALID_IDEMPOTENCY_KEY")) {
                    clearPaymentIntent(scope, intent.key);
                }
                throw error;
            }
        },
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
            showErrorToast(error.message)
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
