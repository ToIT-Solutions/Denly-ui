// secret-panel-88/users/page.tsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState } from 'react'

interface User {
    id: number
    name: string
    email: string
    plan: string
    role: string
    status: 'active' | 'suspended' | 'pending'
    joinDate: string
    properties: number
    lastLogin: string
    avatar?: string
}

export default function UsersPage() {
    usePageTitle('User Management - Admin')

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPlan, setSelectedPlan] = useState('all')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Mock user data - replace with your API calls
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            plan: 'Pro',
            role: 'user',
            status: 'active',
            joinDate: '2024-01-01',
            properties: 3,
            lastLogin: '2024-01-15 10:30 AM'
        },
        {
            id: 2,
            name: 'Sarah Smith',
            email: 'sarah@example.com',
            plan: 'Business',
            role: 'admin',
            status: 'active',
            joinDate: '2023-12-15',
            properties: 12,
            lastLogin: '2024-01-15 09:15 AM'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            plan: 'Basic',
            role: 'user',
            status: 'suspended',
            joinDate: '2024-01-10',
            properties: 1,
            lastLogin: '2024-01-14 02:20 PM'
        },
        {
            id: 4,
            name: 'Emily Brown',
            email: 'emily@example.com',
            plan: 'Pro',
            role: 'moderator',
            status: 'active',
            joinDate: '2023-11-20',
            properties: 5,
            lastLogin: '2024-01-15 11:45 AM'
        },
        {
            id: 5,
            name: 'Chris Wilson',
            email: 'chris@example.com',
            plan: 'Basic',
            role: 'user',
            status: 'pending',
            joinDate: '2024-01-14',
            properties: 0,
            lastLogin: 'Never'
        },
        {
            id: 6,
            name: 'Jessica Lee',
            email: 'jessica@example.com',
            plan: 'Business',
            role: 'user',
            status: 'active',
            joinDate: '2023-10-05',
            properties: 8,
            lastLogin: '2024-01-15 08:30 AM'
        },
        {
            id: 7,
            name: 'David Chen',
            email: 'david@example.com',
            plan: 'Pro',
            role: 'moderator',
            status: 'active',
            joinDate: '2023-09-12',
            properties: 6,
            lastLogin: '2024-01-14 04:15 PM'
        },
        {
            id: 8,
            name: 'Amanda Garcia',
            email: 'amanda@example.com',
            plan: 'Basic',
            role: 'user',
            status: 'suspended',
            joinDate: '2024-01-05',
            properties: 2,
            lastLogin: '2024-01-10 01:20 PM'
        }
    ])

    const plans = ['all', 'Basic', 'Pro', 'Business']
    const roles = ['all', 'user', 'moderator', 'admin']
    const statuses = ['all', 'active', 'suspended', 'pending']

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
        const matchesRole = selectedRole === 'all' || user.role === selectedRole
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
        return matchesSearch && matchesPlan && matchesRole && matchesStatus
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
        admins: users.filter(u => u.role === 'admin').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        pending: users.filter(u => u.status === 'pending').length,
        totalProperties: users.reduce((sum, u) => sum + u.properties, 0)
    }

    // Actions
    const handleRoleChange = (userId: number, newRole: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ))
    }

    const handlePlanChange = (userId: number, newPlan: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, plan: newPlan } : user
        ))
    }

    const handleStatusToggle = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
                : user
        ))
    }

    const handleDeleteUser = (userId: number) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(users.filter(user => user.id !== userId))
        }
    }

    const handleSendResetEmail = (email: string) => {
        // API call to send password reset email
        alert(`Password reset email sent to ${email}`)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedPlan('all')
        setSelectedRole('all')
        setSelectedStatus('all')
        setCurrentPage(1)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-900/50 text-green-400'
            case 'suspended': return 'bg-red-900/50 text-red-400'
            case 'pending': return 'bg-yellow-900/50 text-yellow-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-900/50 text-purple-400'
            case 'moderator': return 'bg-blue-900/50 text-blue-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-white">User Management</h1>
                <p className="text-sm text-slate-400 mt-1">Manage users, roles, subscriptions, and permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Total Users</p>
                        <span className="text-lg">👥</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{stats.total}</p>
                    <p className="text-xs text-slate-500 mt-2">Across all plans</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Active</p>
                        <span className="text-lg">✅</span>
                    </div>
                    <p className="text-2xl font-semibold text-green-500">{stats.active}</p>
                    <p className="text-xs text-slate-500 mt-2">{((stats.active / stats.total) * 100).toFixed(1)}% of total</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Admins</p>
                        <span className="text-lg">👑</span>
                    </div>
                    <p className="text-2xl font-semibold text-[#876D4A]">{stats.admins}</p>
                    <p className="text-xs text-slate-500 mt-2">Platform managers</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Suspended</p>
                        <span className="text-lg">🚫</span>
                    </div>
                    <p className="text-2xl font-semibold text-red-500">{stats.suspended}</p>
                    <p className="text-xs text-slate-500 mt-2">Need review</p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">Properties</p>
                        <span className="text-lg">🏢</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{stats.totalProperties}</p>
                    <p className="text-xs text-slate-500 mt-2">Total managed</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Subscription Plan</label>
                        <select
                            value={selectedPlan}
                            onChange={(e) => {
                                setSelectedPlan(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                        >
                            {plans.map(plan => (
                                <option key={plan} value={plan}>
                                    {plan === 'all' ? 'All Plans' : plan}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
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
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Plan</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Role</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Properties</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Join Date</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Last Login</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={user.plan}
                                            onChange={(e) => handlePlanChange(user.id, e.target.value)}
                                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                        >
                                            <option value="Basic">Basic</option>
                                            <option value="Pro">Pro</option>
                                            <option value="Business">Business</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] ${getRoleBadgeColor(user.role)}`}
                                        >
                                            <option value="user">User</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleStatusToggle(user.id)}
                                            className={`inline-flex px-2 py-1 rounded text-xs font-medium transition-colors ${getStatusColor(user.status)} hover:opacity-80`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-white">{user.properties}</td>
                                    <td className="p-4 text-sm text-slate-400">{user.joinDate}</td>
                                    <td className="p-4 text-sm text-slate-400">{user.lastLogin}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setShowEditModal(true)
                                                }}
                                                className="text-xs text-amber-600 hover:text-amber-900 transition-colors"
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
                                                className="text-xs text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                            <p className="text-sm text-slate-400 mt-1">Manage {selectedUser.name}'s account</p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={selectedUser.name}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue={selectedUser.email}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Plan</label>
                                <select
                                    defaultValue={selectedUser.plan}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Join Date</label>
                                <input
                                    type="text"
                                    value={selectedUser.joinDate}
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