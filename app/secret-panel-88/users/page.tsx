// secret-panel-88/users/page.tsx
'use client'
import { useFetchAllUsers } from '@/hooks/admin/useAdminUsers'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState } from 'react'
import { formatDate } from '@/lib/dateFormatter'
import useAuthStore from '@/store/useAuthStore'

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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const { data: usersData, isLoading, refetch } = useFetchAllUsers()

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
        console.log('Update role:', userId, newRole)
        // await updateUserRole(userId, newRole)
        refetch()
    }

    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        const userToUpdate = users.find(u => u.id === userId)
        if (userToUpdate?.role === 'Admin' && currentUserRole !== 'SuperAdmin') {
            alert('Cannot modify Admin users')
            return
        }
        if (isCurrentUser(userToUpdate!)) {
            alert('Cannot modify your own account status')
            return
        }
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
        console.log('Update status:', userId, newStatus)
        // await updateUserStatus(userId, newStatus)
        refetch()
    }

    const handleDeleteUser = async (userId: string) => {
        const userToDelete = users.find(u => u.id === userId)
        if (userToDelete?.role === 'Admin' && currentUserRole !== 'SuperAdmin') {
            alert('Cannot delete Admin users')
            return
        }
        if (isCurrentUser(userToDelete!)) {
            alert('Cannot delete your own account')
            return
        }
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            console.log('Delete user:', userId)
            // await deleteUser(userId)
            refetch()
        }
    }

    const handleSendResetEmail = (email: string) => {
        alert(`Password reset email sent to ${email}`)
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
            case 'Admin': return 'bg-purple-900/50 text-purple-400'
            case 'Owner': return 'bg-amber-900/50 text-amber-400'
            case 'Manager': return 'bg-blue-900/50 text-blue-400'
            case 'Agent': return 'bg-cyan-900/50 text-cyan-400'
            case 'Viewer': return 'bg-gray-900/50 text-gray-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    const getFullName = (user: User) => {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading users...</p>
                    </div>
                </div>
            </div>
        )
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
                                            {isAdminUser && currentUserRole !== 'SuperAdmin' ? (
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={!canEdit}
                                                    className={`bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 ${getRoleBadgeColor(user.role)} ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="Owner">Owner</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Agent">Agent</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleStatusToggle(user.id, user.status)}
                                                disabled={!canEdit}
                                                className={`inline-flex px-2 py-1 rounded text-xs font-medium transition-colors ${getStatusColor(user.status)} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                                            >
                                                {user.status || 'unknown'}
                                            </button>
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
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setShowEditModal(true)
                                                    }}
                                                    disabled={!canEdit}
                                                    className={`text-xs transition-colors ${canEdit ? 'text-amber-600 hover:text-amber-900' : 'text-slate-500 cursor-not-allowed'}`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleSendResetEmail(user.email)}
                                                    className="text-xs text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Reset PW
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={!canEdit}
                                                    className={`text-xs transition-colors ${canEdit ? 'text-red-500 hover:text-red-400' : 'text-slate-500 cursor-not-allowed'}`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
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
                                    defaultValue={selectedUser.firstName || ''}
                                    disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    defaultValue={selectedUser.lastName || ''}
                                    disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue={selectedUser.email}
                                    disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    disabled={selectedUser.role === 'Admin' && currentUserRole !== 'SuperAdmin'}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="Owner">Owner</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Agent">Agent</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                                <input
                                    type="text"
                                    defaultValue={selectedUser.company?.name || 'No Company'}
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
                            <div>
                                <button
                                    onClick={() => handleSendResetEmail(selectedUser.email)}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm transition-colors"
                                >
                                    Send Password Reset Email
                                </button>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-800 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-900 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Button - Floating Action Button */}
            <button className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-900 text-white p-4 rounded-full shadow-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    )
}