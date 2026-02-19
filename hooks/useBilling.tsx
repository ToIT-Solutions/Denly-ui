import { getAllPlans } from "@/api/billing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchAllPlans = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: () => getAllPlans(),
    })
}