import { fetchPublicChangelogs } from "@/api/changelog";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchPublicChangelogs = () => {
    return useQuery({
        queryKey: ["publicChangelogs"],
        queryFn: () => fetchPublicChangelogs(),
    })
}