"use client"
import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Spinner from '@/components/Spinner'
import { useFetchAllLogs } from '@/hooks/useLogs'
import { showErrorToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'

export default function LogsPage() {
    usePageTitle('Activity Logs - Denly')
    const [searchQuery, setSearchQuery] = useState('')
    const [actionFilter, setActionFilter] = useState<string>('all')
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')
    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const router = useRouter()

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role

    const { data, isLoading, error, isError } = useFetchAllLogs(currentPage)
    // console.log(error?.message)
    const logs = data?.logs || []
    const totalLogs = data?.total || 0
    const totalPages = data?.totalPages || 1
    const currentPageFromServer = data?.page || 1

    // Sync current page with server response
    useEffect(() => {
        if (userRole !== 'Owner') {
            router.back()
        }

        if (error) {
            showErrorToast(error?.message || error)
        }

        if (currentPageFromServer !== currentPage) {
            setCurrentPage(currentPageFromServer)
        }
    }, [currentPageFromServer, error])

    console.log(logs)

    // Get unique actions for filters (from current page data)
    const uniqueActions = useMemo(() => {
        if (!logs.length) return ['all']
        const actions = new Set(logs.map((log: any) => log.action))
        return ['all', ...Array.from(actions)] as string[]
    }, [logs])

    // Filter logs based on search, action, and date (client-side filtering)
    const filteredLogs = useMemo(() => {
        if (!logs.length) return []

        return logs.filter((log: any) => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                log.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.description?.toLowerCase().includes(searchQuery.toLowerCase())

            // Action filter
            const matchesAction = actionFilter === 'all' || log.action === actionFilter

            // Date filter
            let matchesDate = true
            const logDate = new Date(log.createdAt)
            const today = new Date()

            if (dateRange === 'today') {
                matchesDate = logDate.toDateString() === today.toDateString()
            } else if (dateRange === 'week') {
                const weekAgo = new Date(today)
                weekAgo.setDate(today.getDate() - 7)
                matchesDate = logDate >= weekAgo
            } else if (dateRange === 'month') {
                const monthAgo = new Date(today)
                monthAgo.setMonth(today.getMonth() - 1)
                matchesDate = logDate >= monthAgo
            }

            return matchesSearch && matchesAction && matchesDate
        })
    }, [logs, searchQuery, actionFilter, dateRange])

    // Get action color and icon
    const getActionStyles = (action: string) => {
        const actionLower = action?.toLowerCase() || ''

        if (actionLower.includes('delete') || actionLower.includes('remove')) {
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                badge: 'bg-red-100 text-red-800',
                icon: (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                )
            }
        }

        if (actionLower.includes('edit') || actionLower.includes('update') || actionLower.includes('modify')) {
            return {
                bg: 'bg-yellow-50',
                text: 'text-yellow-700',
                border: 'border-yellow-200',
                badge: 'bg-yellow-100 text-yellow-800',
                icon: (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                )
            }
        }

        if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('new')) {
            return {
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                badge: 'bg-green-100 text-green-800',
                icon: (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            }
        }

        // Default
        return {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200',
            badge: 'bg-gray-100 text-gray-800',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    }

    // Format date using toLocaleString
    const formatLogDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }

    // Format date for modal
    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const openLogModal = (log: any) => {
        setSelectedLog(log)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedLog(null)
    }

    const goToPage = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
                <Navbar />
                <div className="pt-24 flex justify-center items-center">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Activity Logs</h1>
                        <p className="text-gray-600 text-sm">Track all actions and changes across your portfolio</p>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by user, details..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm text-black"
                                    />
                                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Action Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm text-black"
                                >
                                    {uniqueActions.map((action) => (
                                        <option key={action} value={action}>
                                            {action === 'all' ? 'All Actions' : action}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm text-black"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Summary */}
                        {(searchQuery || actionFilter !== 'all' || dateRange !== 'all') && (
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <span className="font-medium">Active Filters:</span>
                                    {searchQuery && (
                                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                                            Search: "{searchQuery}"
                                        </span>
                                    )}
                                    {actionFilter !== 'all' && (
                                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                                            Action: {actionFilter}
                                        </span>
                                    )}
                                    {dateRange !== 'all' && (
                                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                                            Date: {dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setActionFilter('all')
                                        setDateRange('all')
                                    }}
                                    className="text-xs text-[#876D4A] hover:text-[#756045] font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logs Info */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                        </p>
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{filteredLogs.length} of {totalLogs} logs</span>
                        </p>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {filteredLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredLogs.map((log: any) => {
                                            const actionStyles = getActionStyles(log.action)

                                            return (
                                                <tr
                                                    key={log.id}
                                                    onClick={() => openLogModal(log)}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-6 h-6 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                                                                {log.email?.charAt(0)?.toUpperCase() || '?'}
                                                            </div>
                                                            <span className="text-sm text-gray-900">
                                                                {log.email || 'System'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${actionStyles.badge}`}>
                                                            <span>{actionStyles.icon}</span>
                                                            <span>{log.action}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-sm text-gray-700 truncate max-w-xs">
                                                            {log.description || log.details || 'No description'}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-sm text-gray-600 whitespace-nowrap">
                                                            {formatLogDate(log.createdAt)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">No logs found</h3>
                                <p className="text-gray-500 text-sm">
                                    {searchQuery || actionFilter !== 'all' || dateRange !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'No activity has been logged yet'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Previous
                                </button>

                                {/* Page numbers */}
                                <div className="flex space-x-1 ">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum = currentPage
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === pageNum
                                                    ? 'bg-[#876D4A] text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Log Details Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        ></div>

                        {/* Modal panel - centered */}
                        <div className="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-[10000]">
                            {/* Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-serif text-gray-900">Log Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                                {/* User Info */}
                                <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                                    <div className="w-10 h-10 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {selectedLog.user?.email?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {selectedLog.user?.email || 'System User'}
                                        </p>
                                        {selectedLog.user?.name && (
                                            <p className="text-sm text-gray-600">{selectedLog.user.name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Action</label>
                                    <div className="flex items-center space-x-2">
                                        {(() => {
                                            const styles = getActionStyles(selectedLog.action)
                                            return (
                                                <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${styles.badge}`}>
                                                    <span>{styles.icon}</span>
                                                    <span>{selectedLog.action}</span>
                                                </span>
                                            )
                                        })()}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                        {selectedLog.description || selectedLog.details || 'No description provided'}
                                    </p>
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Date & Time</label>
                                        <p className="text-gray-900 text-sm">{formatFullDate(selectedLog.createdAt)}</p>
                                    </div>
                                </div>

                                {/* IP Address & User Agent */}
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedLog.ipAddress && (
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">IP Address</label>
                                            <p className="text-gray-900 text-sm font-mono bg-gray-50 p-2 rounded-lg">
                                                {selectedLog.ipAddress}
                                            </p>
                                        </div>
                                    )}

                                    {selectedLog.userAgent && (
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">User Agent</label>
                                            <p className="text-gray-900 text-xs bg-gray-50 p-2 rounded-lg break-words">
                                                {selectedLog.userAgent}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Metadata/Changes */}
                                {(selectedLog.metadata || selectedLog.changes) && (
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Additional Data</label>
                                        <div className="bg-gray-50 p-3 rounded-lg overflow-x-auto">
                                            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                                {JSON.stringify(selectedLog.metadata || selectedLog.changes, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-[#876D4A] text-white rounded-lg hover:bg-[#756045] transition-colors text-sm font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}