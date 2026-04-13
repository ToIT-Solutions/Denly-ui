import { fetchAllRentLedger, fetchOneRentLedger } from "@/api/rentLedger";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchAllRentLedger = () => {
    return useQuery({
        queryKey: ["allRentLedger"],
        queryFn: () => fetchAllRentLedger(),
    })
}

export const useFetchOneRentLedger = (tenantID: string) => {
    return useQuery({
        queryKey: ["rentLedger", tenantID],
        queryFn: () => fetchOneRentLedger(tenantID),
        enabled: !!tenantID,
    })
}