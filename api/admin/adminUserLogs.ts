import { isAxiosError } from 'axios'
import { api } from '../axios'

// Keep the log response limited to the fields exposed by the admin endpoint.
export interface AdminUserLog {
    id: string
    companyId: string
    userId: string | null
    email: string | null
    action: string
    description: string | null
    status: string
    resourceType: string | null
    resourceId: string | null
    createdAt: string
    company: { id: string; name: string }
    user: { id: string; firstName: string; lastName: string; email: string } | null
}

export interface AdminUserLogsFilters {
    search: string
    companyId: string
    userId: string
    action: string
    status: string
    resourceType: string
    from: string
    to: string
    sort: 'asc' | 'desc'
    page: number
    limit: number
}

export interface AdminUserLogsResponse {
    logs: AdminUserLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Use the shared authenticated client and normalize API errors for the page.
export const fetchAdminUserLogs = async (filters: AdminUserLogsFilters, signal?: AbortSignal) => {
    try {
        const response = await api.get<AdminUserLogsResponse>('/v1/admin/user-logs', {
            params: filters,
            signal
        })
        return response.data
    } catch (error: unknown) {
        const message = isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error ? error.message : 'Unable to fetch user activity logs'
        throw new Error(message)
    }
}
