import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/api/admin/adminDashboard";

export const useFetchAdminStats = () => {
    return useQuery({
        queryKey: ["adminStats"],
        queryFn: () => fetchAdminStats(),
    })
}