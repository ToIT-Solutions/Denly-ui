import { addPayment, deletePayment, editPayment, fetchAllPayments, fetchOnePayment } from "@/api/payment";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useAddPayment = () => {
    return useMutation({
        mutationFn: addPayment,
        onSuccess: (data) => {
            console.log(data)
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

export const useEditPayment = () => {
    return useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: string; data: any }) => editPayment(paymentId, data),
        onSuccess: (data) => {
            console.log(data)
        }
    })
}

export const useDeletePayment = () => {
    return useMutation({
        mutationFn: (paymentId: string) => deletePayment(paymentId),
        onSuccess: (data) => {
            console.log(data)
        }
    })
}