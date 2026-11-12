import { QueryClient } from '@tanstack/react-query'

// Cancel old queries before removing cached data when authentication changes.
export const clearSessionQueries = (queryClient: QueryClient) => {
    void queryClient.cancelQueries()
    queryClient.clear()
}
