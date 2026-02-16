import { getAllLogs } from "@/api/logs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchAllLogs = () => {
    return useQuery({
        queryKey: ["allLogs"],
        queryFn: () => getAllLogs(),
    })
}