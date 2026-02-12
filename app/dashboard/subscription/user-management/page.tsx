"use client"
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function UserManagementPage() {
    usePageTitle('User Management - Denly')
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [userToRemove, setUserToRemove] = useState<any>(null)

    const users = [
        { id: 1, name: 'Alex Johnson', email: 'alex@denlyproperties.com', role: 'Owner', status: 'Active', lastActive: '2 hours ago' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah@denlyproperties.com', role: 'Manager', status: 'Active', lastActive: '1 day ago' },
        { id: 3, name: 'Mike Chen', email: 'mike@denlyproperties.com', role: 'Agent', status: 'Active', lastActive: '3 days ago' },
        { id: 4, name: 'Emily Davis', email: 'emily@denlyproperties.com', role: 'Viewer', status: 'Invited', lastActive: 'Not yet' },
    ]

    const roles = [
        { name: 'Owner', description: 'Full access to all features and settings' },
        { name: 'Manager', description: 'Can manage properties and users' },
        { name: 'Agent', description: 'Can manage assigned properties' },
        { name: 'Viewer', description: 'Read-only access to reports' },
    ]

    const openInviteModal = () => setIsInviteModalOpen(true)
    const closeInviteModal = () => setIsInviteModalOpen(false)

    const openRemoveModal = (user: any) => {
        setUserToRemove(user)
        setIsRemoveModalOpen(true)
    }

    const closeRemoveModal = () => {
        setUserToRemove(null)
        setIsRemoveModalOpen(false)
    }

    const handleInviteUser = (formData: any) => {
        console.log('Inviting user:', formData)
        // Add your invite logic here
        closeInviteModal()
    }

    const handleRemoveUser = () => {
        console.log('Removing user:', userToRemove)
        // Add your remove logic here
        closeRemoveModal()
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-20 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl font-serif text-gray-900 mb-2">User Management</h1>
                            <p className="text-gray-600 text-sm">Manage team members and their permissions</p>
                        </div>
                        <button
                            onClick={openInviteModal}
                            className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm w-fit font-medium"
                        >
                            Invite User
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Users List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="font-medium text-gray-900">Team Members</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-xs font-medium">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                                                        <p className="text-gray-600 text-xs">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900 text-sm">{user.role}</p>
                                                    <div className="flex items-center space-x-2 justify-end mt-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                        <p className="text-gray-600 text-xs">{user.lastActive}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                                                <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-xs">
                                                    Edit
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-xs">
                                                    Resend Invite
                                                </button>
                                                <button
                                                    onClick={() => openRemoveModal(user)}
                                                    className="text-red-600 hover:text-red-800 transition-colors cursor-pointer text-xs ml-auto"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Roles & Permissions */}
                        <div className="space-y-4">
                            {/* Roles */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h2 className="font-medium text-gray-900 mb-3">Roles & Permissions</h2>
                                <div className="space-y-3">
                                    {roles.map((role, index) => (
                                        <div key={index} className="p-2 rounded-lg border border-gray-200">
                                            <p className="font-medium text-gray-900 text-sm">{role.name}</p>
                                            <p className="text-gray-600 text-xs mt-1">{role.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 border border-[#876D4A] text-[#876D4A] py-2 rounded-lg hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-xs font-medium">
                                    Manage Roles
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h2 className="font-medium text-gray-900 mb-3">Team Overview</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-xs">Total Users</span>
                                        <span className="font-medium text-gray-900 text-sm">4</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-xs">Active</span>
                                        <span className="font-medium text-green-600 text-sm">3</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-xs">Pending</span>
                                        <span className="font-medium text-yellow-600 text-sm">1</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-xs">Seats Used</span>
                                        <span className="font-medium text-gray-900 text-sm">4/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite User Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="text-center">
                            <h3 className="text-lg font-serif text-gray-900 mb-2">Invite User</h3>
                            <p className="text-gray-600 text-sm mb-6">Send an invitation to join your team</p>

                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                handleInviteUser({
                                    email: formData.get('email'),
                                    role: formData.get('role')
                                })
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="colleague@company.com"
                                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Role</label>
                                    <select
                                        name="role"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm"
                                    >
                                        <option value="">Select a role</option>
                                        {roles.map((role) => (
                                            <option key={role.name} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeInviteModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#876D4A] text-white rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium"
                                    >
                                        Send Invite
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove User Modal */}
            {isRemoveModalOpen && userToRemove && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-serif text-gray-900 mb-2">Remove User</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to remove <strong>{userToRemove.name}</strong> from your team? This action cannot be undone.
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={closeRemoveModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemoveUser}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Remove User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}