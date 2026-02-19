import { getSubscriptionData, getSubscriptionPlans } from "@/api/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchSubscriptionData = () => {
    return useQuery({
        queryKey: ["plan"],
        queryFn: () => getSubscriptionData(),
    })
}

export const useFetchSubscriptionPlans = () => {
    return useQuery({
        queryKey: ["allPlans"],
        queryFn: () => getSubscriptionPlans(),
    })
}