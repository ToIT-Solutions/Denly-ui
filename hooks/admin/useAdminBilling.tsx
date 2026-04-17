import { fetchFailedBilling, fetchPendingBilling, fetchBillingStats } from "@/api/admin/adminBilling";
import { useQuery } from "@tanstack/react-query";


// export const useFetchAllBilling = (status?: string) => {
//     return useQuery({
//         queryKey: ["adminBilling", status],
//         queryFn: () => fetchAllBilling(status),
//     })
// }

// export const useFetchFailedBilling = () => {
//     return useQuery({
//         queryKey: ["adminFailedBilling"],
//         queryFn: () => fetchFailedBilling(),
//     })
// }

// export const useFetchPendingBilling = () => {
//     return useQuery({
//         queryKey: ["adminPendingBilling"],
//         queryFn: () => fetchPendingBilling(),
//     })
// }

export const useFetchBillingStats = () => {
    return useQuery({
        queryKey: ["adminBillingStats"],
        queryFn: () => fetchBillingStats(),
    })
}