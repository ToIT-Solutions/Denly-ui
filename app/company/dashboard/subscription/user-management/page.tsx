"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function UserManagementPage() {
    usePageTitle('User Management - Denly')
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
                        <button className="bg-[#876D4A] text-white px-5 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm w-fit font-medium">
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
                                                <button className="text-red-600 hover:text-red-800 transition-colors cursor-pointer text-xs ml-auto">
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
        </div>
    )
}