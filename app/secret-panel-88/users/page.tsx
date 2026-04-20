// secret-panel-88/users/page.tsx
'use client'
import { useFetchAllUsers, useUpdateUser } from '@/hooks/admin/useAdminUsers'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState } from 'react'
import { formatDate } from '@/lib/dateFormatter'
import useAuthStore from '@/store/useAuthStore'
import { AdminSpinner } from '@/components/Spinner'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
    createdAt: string
    lastLogin: string | null
    profileImageUrl: string | null
    companyId: string | null
    subscriptionId: string | null
    company?: {
        id: string
        name: string
        email: string
        phone: string
        address: string
    }
    subscription?: {
        id: string
        status: string
        planId: string
        currentPeriodStart: string
        currentPeriodEnd: string
    }
}

export default function UsersPage() {
    usePageTitle('User Management - Admin')

    const currentUser = useAuthStore((state) => state.user)
    const currentUserRole = currentUser?.role

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        status: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const { data: usersData, isLoading, refetch } = useFetchAllUsers()
    const { mutate: updateUser, isPending } = useUpdateUser()

    // Extract users array from response - handle both array and object responses
    const usersList = Array.isArray(usersData) ? usersData : usersData?.users || []
    const users: User[] = usersList

    // Role options based on current user's role
    const getAvailableRoles = () => {
        if (currentUserRole === 'Admin') {
            return ['Owner', 'Manager', 'Agent', 'Viewer']
        }
        // Super admin can assign any role including Admin
        return ['Admin', 'Owner', 'Manager', 'Agent', 'Viewer']
    }

    const roles = ['all', ...getAvailableRoles()]
    const statuses = ['all', 'active', 'inactive', 'suspended', 'pending']

    // Check if user can be edited (prevent editing admin if not super admin)
    const canEditUser = (user: User) => {
        if (user.role === 'Admin' && currentUserRole !== 'SuperAdmin') {
            return false
        }
        return true
    }

    // Check if current user is the one being edited
    const isCurrentUser = (user: User) => {
        return user.id === currentUser?.id
    }

    // Filter users
    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = selectedRole === 'all' || user.role === selectedRole
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
        return matchesSearch && matchesRole && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Stats
    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        admins: users.filter(u => u.role === 'Admin').length,
        owners: users.filter(u => u.role === 'Owner').length,
        managers: users.filter(u => u.role === 'Manager').length,
        agents: users.filter(u => u.role === 'Agent').length,
        viewers: users.filter(u => u.role === 'Viewer').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        pending: users.filter(u => u.status === 'pending').length,
        withSubscription: users.filter(u => u.subscriptionId).length,
        withoutSubscription: users.filter(u => !u.subscriptionId).length
    }

    // Actions
    const handleRoleChange = async (userId: string, newRole: string) => {
        const userToUpdate = users.find(u => u.id === userId)
        if (userToUpdate?.role === 'Admin' && currentUserRole !== 'SuperAdmin') {
            alert('Cannot modify Admin users')
            return
        }
        if (isCurrentUser(userToUpdate!)) {
            alert('Cannot change your own role')
            return
        }
        //console.log('Update role:', userId, newRole)
        // await updateUserRole(userId, newRole)
        refetch()
    }

    const handleStatusChange = async (userId: string, newStatus: string) => {
        const userToUpdate = users.find(u => u.id === userId)
        if (userToUpdate?.role === 'Admin' && currentUserRole !== 'SuperAdmin') {
            alert('Cannot modify Admin users')
            return
        }
        if (isCurrentUser(userToUpdate!)) {
            alert('Cannot modify your own account status')
            return
        }
        //console.log('Update status:', userId, newStatus)
        // await updateUserStatus(userId, newStatus)
        refetch()
    }

    const openEditModal = (user: User) => {
        setSelectedUser(user)
        setEditFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: user.role || 'Viewer',
            status: user.status || 'active'
        })
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        if (!selectedUser) return

        if (editFormData.role !== selectedUser.role) {
            await handleRoleChange(selectedUser.id, editFormData.role)
        }

        if (editFormData.status !== selectedUser.status) {
            await handleStatusChange(selectedUser.id, editFormData.status)
        }

        updateUser({ id: selectedUser.id, data: editFormData })

        setShowEditModal(false)
        refetch()
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedRole('all')
        setSelectedStatus('all')
        setCurrentPage(1)
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-900/50 text-green-400'
            case 'suspended': return 'bg-red-900/50 text-red-400'
            case 'pending': return 'bg-yellow-900/50 text-yellow-400'
            case 'inactive': return 'bg-gray-900/50 text-gray-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin':
                return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/20' // Legendary - Gold/Orange
            case 'Owner':
                return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20' // Epic - Purple
            case 'Manager':
                return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20' // Rare - Blue
            case 'Agent':
                return 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20' // Uncommon - Green
            case 'Viewer':
                return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20' // Common - Slate
            default:
                return 'bg-slate-800 text-slate-400'
        }
    }

    const getFullName = (user: User) => {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'
    }


    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-white">User Management</h1>
                <p className="text-sm text-slate-400 mt-1">Manage users, roles, subscriptions, and permissions</p>
                {currentUserRole !== 'SuperAdmin' && (
                    <p className="text-xs text-amber-600 mt-2">⚠️ Admin users cannot be modified</p>
                )}
            </div>

            {isLoading ?
                <AdminSpinner />
                :
                <div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">Total Users</p>
                                <span className="text-lg">👥</span>
                            </div>
                            <p className="text-2xl font-semibold text-white">{stats.total}</p>
                            <p className="text-xs text-slate-500 mt-2">All registered users</p>
                        </div>

                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">Active</p>
                                <span className="text-lg">✅</span>
                            </div>
                            <p className="text-2xl font-semibold text-green-500">{stats.active}</p>
                            <p className="text-xs text-slate-500 mt-2">{stats.total ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total</p>
                        </div>

                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">Admins</p>
                                <span className="text-lg">👑</span>
                            </div>
                            <p className="text-2xl font-semibold text-purple-500">{stats.admins}</p>
                            <p className="text-xs text-slate-500 mt-2">Platform managers</p>
                        </div>

                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">Owners</p>
                                <span className="text-lg">🏢</span>
                            </div>
                            <p className="text-2xl font-semibold text-amber-500">{stats.owners}</p>
                            <p className="text-xs text-slate-500 mt-2">Property owners</p>
                        </div>

                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">Managers</p>
                                <span className="text-lg">📊</span>
                            </div>
                            <p className="text-2xl font-semibold text-blue-500">{stats.managers}</p>
                            <p className="text-xs text-slate-500 mt-2">Property managers</p>
                        </div>

                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-400">With Subscription</p>
                                <span className="text-lg">💰</span>
                            </div>
                            <p className="text-2xl font-semibold text-amber-500">{stats.withSubscription}</p>
                            <p className="text-xs text-slate-500 mt-2">Active paying users</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role === 'all' ? 'All Roles' : role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800/50 border-b border-slate-800">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">User</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Email</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Company</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Role</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Subscription</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Join Date</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Last Login</th>
                                        <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {paginatedUsers.map((user) => {
                                        const isAdminUser = user.role === 'Admin'
                                        const isCurrentUserAccount = isCurrentUser(user)
                                        const canEdit = canEditUser(user) && !isCurrentUserAccount

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                            {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-sm font-medium text-white">
                                                            {getFullName(user)}
                                                            {isCurrentUserAccount && (
                                                                <span className="ml-2 text-xs text-amber-500">(You)</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">{user.email}</td>
                                                <td className="p-4 text-sm text-slate-400">{user.company?.name || '-'}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                                                        {user.status || 'unknown'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {user.subscriptionId ? (
                                                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-900/50 text-green-400">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400">
                                                            No Plan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {user.createdAt ? formatDate(user.createdAt, 'short') : 'Unknown'}
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {user.lastLogin ? formatDate(user.lastLogin, 'long') : 'Never'}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        disabled={!canEdit}
                                                        className={`text-xs cursor-pointer transition-colors ${canEdit ? 'text-amber-600 hover:text-amber-400' : 'text-slate-500 cursor-not-allowed'}`}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
                                <p className="text-slate-400 text-sm">Try adjusting your filters or search criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                                <p className="text-sm text-slate-400">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-white text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Modal */}
                    {showEditModal && selectedUser && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-md w-full">
                                <div className="p-5 border-b border-slate-800">
                                    <h2 className="text-lg font-medium text-white">Edit User</h2>
                                    <p className="text-sm text-slate-400 mt-1">Manage {getFullName(selectedUser)}'s account</p>
                                    {selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin' && (
                                        <p className="text-xs text-red-400 mt-2">⚠️ Admin users cannot be modified</p>
                                    )}
                                    {isCurrentUser(selectedUser) && (
                                        <p className="text-xs text-amber-400 mt-2">⚠️ You are editing your own account</p>
                                    )}
                                </div>
                                <div className="p-5 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.firstName}
                                            onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                                            disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.lastName}
                                            onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                                            disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                            disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                                        <select
                                            value={editFormData.role}
                                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                            disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {getAvailableRoles().map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                        <select
                                            value={editFormData.status}
                                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                            disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="pending">Pending</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                                        <input
                                            type="text"
                                            value={selectedUser.company?.name || 'No Company'}
                                            disabled
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Join Date</label>
                                        <input
                                            type="text"
                                            value={selectedUser.createdAt ? formatDate(selectedUser.createdAt, 'long') : 'Unknown'}
                                            disabled
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm"
                                        />
                                    </div>
                                </div>

                                {isPending ?
                                    <AdminSpinner />
                                    :
                                    <div className="p-5 border-t border-slate-800 flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-900 transition-colors cursor-pointer"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}