"use client"
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Spinner from '@/components/Spinner'
import { useFetchAllLogs } from '@/hooks/useLogs'

export default function LogsPage() {
    usePageTitle('Activity Logs - Denly')
    const [searchQuery, setSearchQuery] = useState('')
    const [actionFilter, setActionFilter] = useState<string>('all')
    const [entityFilter, setEntityFilter] = useState<string>('all')
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')
    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data, isLoading, error } = useFetchAllLogs()
    const logs = data?.logs
    console.log(logs)

    // Get unique actions and entities for filters
    const uniqueActions = useMemo(() => {
        if (!logs) return ['all']
        const actions = new Set(logs.map((log: any) => log.action))
        return ['all', ...Array.from(actions)] as string[]
    }, [logs])

    const uniqueEntities = useMemo(() => {
        if (!logs) return ['all']
        const entities = new Set(logs.map((log: any) => log.entity))
        return ['all', ...Array.from(entities)] as string[]
    }, [logs])

    // Filter logs based on search, action, entity, and date
    const filteredLogs = useMemo(() => {
        if (!logs) return []

        return logs.filter((log: any) => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.description?.toLowerCase().includes(searchQuery.toLowerCase())

            // Action filter
            const matchesAction = actionFilter === 'all' || log.action === actionFilter

            // Entity filter
            const matchesEntity = entityFilter === 'all' || log.entity === entityFilter

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

            return matchesSearch && matchesAction && matchesEntity && matchesDate
        })
    }, [logs, searchQuery, actionFilter, entityFilter, dateRange])

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

    // Get entity icon
    const getEntityIcon = (entity: string) => {
        const entityLower = entity?.toLowerCase() || ''

        if (entityLower.includes('property')) {
            return '🏢'
        }
        if (entityLower.includes('tenant')) {
            return '👤'
        }
        if (entityLower.includes('payment')) {
            return '💰'
        }
        if (entityLower.includes('user') || entityLower.includes('team')) {
            return '👥'
        }
        if (entityLower.includes('document')) {
            return '📄'
        }
        if (entityLower.includes('company')) {
            return '🏛️'
        }
        if (entityLower.includes('subscription')) {
            return '📦'
        }
        return '📋'
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by user, entity, details..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                >
                                    {uniqueActions.map((action) => (
                                        <option key={action} value={action}>
                                            {action === 'all' ? 'All Actions' : action}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Entity Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Entity Type</label>
                                <select
                                    value={entityFilter}
                                    onChange={(e) => setEntityFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                >
                                    {uniqueEntities.map((entity) => (
                                        <option key={entity} value={entity}>
                                            {entity === 'all' ? 'All Entities' : entity}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Summary */}
                        {(searchQuery || actionFilter !== 'all' || entityFilter !== 'all' || dateRange !== 'all') && (
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
                                    {entityFilter !== 'all' && (
                                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                                            Entity: {entityFilter}
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
                                        setEntityFilter('all')
                                        setDateRange('all')
                                    }}
                                    className="text-xs text-[#876D4A] hover:text-[#756045] font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logs Count */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{logs?.length || 0}</span> logs
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Entity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredLogs.map((log: any) => {
                                            const actionStyles = getActionStyles(log.action)
                                            const entityIcon = getEntityIcon(log.entity)

                                            return (
                                                <tr
                                                    key={log.id}
                                                    onClick={() => openLogModal(log)}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-6 h-6 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                                                                {log.user?.name?.charAt(0) || log.user?.email?.charAt(0) || 'S'}
                                                            </div>
                                                            <span className="text-sm text-gray-900">
                                                                {log.user?.name || log.user?.email || 'System'}
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
                                                        <span className="inline-flex items-center space-x-1 text-sm text-gray-700">
                                                            <span>{entityIcon}</span>
                                                            <span>{log.entity}</span>
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
                                    {searchQuery || actionFilter !== 'all' || entityFilter !== 'all' || dateRange !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'No activity has been logged yet'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                const csvContent = filteredLogs.map((log: any) =>
                                    `${log.createdAt},${log.user?.name || 'System'},${log.action},${log.entity},${log.description || log.details}`
                                ).join('\n')

                                const blob = new Blob([csvContent], { type: 'text/csv' })
                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
                                a.click()
                            }}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Export Logs</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Details Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 z-100 overflow-y-auto" >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
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
                            <div className="px-6 py-4 space-y-4">
                                {/* User Info */}
                                <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                                    <div className="w-10 h-10 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {selectedLog.user?.name?.charAt(0) || selectedLog.user?.email?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {selectedLog.user?.name || selectedLog.user?.email || 'System'}
                                        </p>
                                        {selectedLog.user?.email && selectedLog.user?.name && (
                                            <p className="text-sm text-gray-600">{selectedLog.user.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action & Entity */}
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Entity</label>
                                        <div className="flex items-center space-x-2">
                                            <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                                                <span>{getEntityIcon(selectedLog.entity)}</span>
                                                <span>{selectedLog.entity}</span>
                                            </span>
                                            {selectedLog.entityId && (
                                                <span className="text-xs text-gray-500">ID: {selectedLog.entityId}</span>
                                            )}
                                        </div>
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
                                    {selectedLog.ipAddress && (
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">IP Address</label>
                                            <p className="text-gray-900 text-sm font-mono">{selectedLog.ipAddress}</p>
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