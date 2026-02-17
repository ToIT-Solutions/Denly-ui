import { getAllLogs } from "@/api/logs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchAllLogs = (page: number = 1) => {
    return useQuery({
        queryKey: ["allLogs", page],
        queryFn: () => getAllLogs(page),
    })
}