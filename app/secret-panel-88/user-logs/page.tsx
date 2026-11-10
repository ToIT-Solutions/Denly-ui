'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminUserLogsFilters } from '@/api/admin/adminUserLogs'
import { useFetchAdminUserLogs } from '@/hooks/admin/useAdminUserLogs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AdminSpinner } from '@/components/Spinner'
import { formatDate } from '@/lib/dateFormatter'
import useAuthStore from '@/store/useAuthStore'

const defaultFilters: AdminUserLogsFilters = {
    search: '', companyId: '', userId: '', action: '', status: '',
    resourceType: '', from: '', to: '', sort: 'desc', page: 1, limit: 20
}

export default function UserLogsPage() {
    usePageTitle('User Activity Logs - Admin')

    const router = useRouter()
    const token = useAuthStore((state) => state.token)
    const user = useAuthStore((state) => state.user)
    const [hasHydrated, setHasHydrated] = useState(false)
    const [draftFilters, setDraftFilters] = useState(defaultFilters)
    const [filters, setFilters] = useState(defaultFilters)
    const [validationError, setValidationError] = useState('')
    const isAdmin = !!token && ['Admin', 'Super_Admin'].includes(user?.role)

    // Wait for persisted authentication before redirecting or requesting logs.
    useEffect(() => {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true))
        setHasHydrated(useAuthStore.persist.hasHydrated())
        return unsubscribe
    }, [])

    useEffect(() => {
        if (hasHydrated && !isAdmin) router.replace('/secret-panel-88/login')
    }, [hasHydrated, isAdmin, router])

    const { data, isLoading, isFetching, isError, error, refetch } = useFetchAdminUserLogs(
        filters, user?.id, hasHydrated && isAdmin
    )

    // Apply filters together so typing does not send an API request per keystroke.
    const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (draftFilters.from && draftFilters.to && draftFilters.from > draftFilters.to) {
            setValidationError('Start date must not be after end date.')
            return
        }
        setValidationError('')
        setFilters({ ...draftFilters, page: 1 })
    }

    const handleResetFilters = () => {
        setValidationError('')
        setDraftFilters(defaultFilters)
        setFilters(defaultFilters)
    }

    if (!hasHydrated || !isAdmin) {
        return <div className="p-8" role="status" aria-label="Checking admin access"><AdminSpinner /></div>
    }

    const inputClass = 'w-full mt-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500'
    const totalPages = data?.totalPages || 0

    return (
        <div className="p-4 md:p-6 text-slate-300">
            {/* Match the existing admin page headings and controls. */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-white">User Activity Logs</h1>
                    <p className="text-sm text-slate-400 mt-1">Recorded user activity across all companies</p>
                </div>
                <button onClick={() => refetch()} disabled={isFetching}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50">
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Filters are submitted to the server rather than applied to one page of data. */}
            <form onSubmit={handleApplyFilters} className="bg-slate-900 rounded-lg border border-slate-800 p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <label className="text-sm">Search user or company
                        <input className={inputClass} maxLength={200} value={draftFilters.search} placeholder="Name or email"
                            onChange={(event) => setDraftFilters({ ...draftFilters, search: event.target.value })} />
                    </label>
                    <label className="text-sm">Company ID
                        <input className={inputClass} maxLength={200} value={draftFilters.companyId} placeholder="All companies"
                            onChange={(event) => setDraftFilters({ ...draftFilters, companyId: event.target.value })} />
                    </label>
                    <label className="text-sm">User ID
                        <input className={inputClass} maxLength={200} value={draftFilters.userId} placeholder="All users"
                            onChange={(event) => setDraftFilters({ ...draftFilters, userId: event.target.value })} />
                    </label>
                    <label className="text-sm">Action
                        <input className={inputClass} maxLength={200} value={draftFilters.action} placeholder="e.g. LOGIN or CREATE_PROPERTY"
                            onChange={(event) => setDraftFilters({ ...draftFilters, action: event.target.value })} />
                    </label>
                    <label className="text-sm">Status
                        <select className={inputClass} value={draftFilters.status}
                            onChange={(event) => setDraftFilters({ ...draftFilters, status: event.target.value })}>
                            <option value="">All statuses</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                            <option value="error">Error</option>
                        </select>
                    </label>
                    <label className="text-sm">Resource type
                        <input className={inputClass} maxLength={200} value={draftFilters.resourceType} placeholder="e.g. Property or User"
                            onChange={(event) => setDraftFilters({ ...draftFilters, resourceType: event.target.value })} />
                    </label>
                    <label className="text-sm">From date (UTC)
                        <input type="date" className={inputClass} value={draftFilters.from}
                            onChange={(event) => setDraftFilters({ ...draftFilters, from: event.target.value })} />
                    </label>
                    <label className="text-sm">To date (UTC)
                        <input type="date" className={inputClass} value={draftFilters.to}
                            onChange={(event) => setDraftFilters({ ...draftFilters, to: event.target.value })} />
                    </label>
                    <label className="text-sm">Sort by time
                        <select className={inputClass} value={draftFilters.sort}
                            onChange={(event) => setDraftFilters({ ...draftFilters, sort: event.target.value as 'asc' | 'desc' })}>
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>
                    <label className="text-sm">Rows per page
                        <select className={inputClass} value={draftFilters.limit}
                            onChange={(event) => setDraftFilters({ ...draftFilters, limit: Number(event.target.value) })}>
                            {[10, 20, 50, 100].map((limit) => <option key={limit} value={limit}>{limit}</option>)}
                        </select>
                    </label>
                </div>
                {validationError && <p role="alert" className="text-red-400 text-sm mt-3">{validationError}</p>}
                <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-sm">Apply filters</button>
                    <button type="button" onClick={handleResetFilters} className="border border-slate-700 rounded-lg px-4 py-2 text-sm hover:bg-slate-800">Reset</button>
                </div>
            </form>

            {/* Render stored descriptions as plain text and keep internal error details private. */}
            {isLoading ? <div className="p-8" role="status" aria-label="Loading user logs"><AdminSpinner /></div>
                : isError ? <div role="alert" className="bg-slate-900 border border-red-900 rounded-lg p-4">
                    <p className="text-red-400">{error.message || 'Unable to load activity logs.'}</p>
                    <button onClick={() => refetch()} className="mt-3 text-amber-500 hover:underline">Try again</button>
                </div>
                    : data && <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden" aria-busy={isFetching}>
                        <p className="px-4 py-3 text-sm text-slate-400" aria-live="polite">{data.total} matching {data.total === 1 ? 'log' : 'logs'}</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
                                    <tr>{['Time', 'User', 'Company', 'Action', 'Resource', 'Status', 'Description'].map((title) => <th key={title} scope="col" className="px-4 py-3">{title}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {data.logs.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No activity logs found. Try changing your filters.</td></tr>
                                        : data.logs.map((log) => <tr key={log.id} className="hover:bg-slate-800/50 align-top">
                                            <td className="px-4 py-3 whitespace-nowrap"><time dateTime={log.createdAt} title={log.createdAt}>{formatDate(log.createdAt, 'long')}</time></td>
                                            <td className="px-4 py-3"><p className="text-white">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Deleted or unavailable user'}</p><p className="text-xs text-slate-400">{log.email || log.user?.email || '—'}</p><p className="text-xs text-slate-500 break-all">{log.userId}</p></td>
                                            <td className="px-4 py-3"><p className="text-white">{log.company.name}</p><p className="text-xs text-slate-500 break-all">{log.companyId}</p></td>
                                            <td className="px-4 py-3">{log.action}</td>
                                            <td className="px-4 py-3"><p>{log.resourceType || '—'}</p><p className="text-xs text-slate-500 break-all">{log.resourceId}</p></td>
                                            <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-1 text-xs ${log.status === 'success' ? 'bg-green-900/50 text-green-400' : log.status === 'failed' || log.status === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-slate-800 text-slate-400'}`}>{log.status}</span></td>
                                            <td className="px-4 py-3 min-w-48 max-w-sm break-words">{log.description || '—'}</td>
                                        </tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-slate-800 text-sm">
                            <p className="text-slate-400">Page {filters.page} of {Math.max(1, totalPages)}</p>
                            <div className="flex gap-2">
                                <button disabled={isFetching || filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-40">Previous</button>
                                <button disabled={isFetching || filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-40">Next</button>
                            </div>
                        </div>
                    </div>}
            <p className="text-xs text-slate-500 mt-4">This view shows recorded events, not a complete audit trail. Dates in filters use UTC; timestamps display in your local timezone.</p>
        </div>
    )
}
