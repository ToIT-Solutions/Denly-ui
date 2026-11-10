import { useQuery } from '@tanstack/react-query'
import { AdminUserLogsFilters, fetchAdminUserLogs } from '@/api/admin/adminUserLogs'

// Separate cached results by administrator and by every server-side filter.
export const useFetchAdminUserLogs = (filters: AdminUserLogsFilters, userId: string | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ['adminUserLogs', userId, filters],
        queryFn: ({ signal }) => fetchAdminUserLogs(filters, signal),
        enabled,
        retry: false,
        gcTime: 0
    })
}
