"use client"
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllUsers, useEditUserRole, useDeleteUser } from '@/hooks/useUser'
import { useDeleteInvite, useFetchAllInvites, useInviteUser, useResendInvite } from '@/hooks/useInvite'
import Spinner from '@/components/Spinner'

export default function UserManagementPage() {
    usePageTitle('User Management - Denly')
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [userToRemove, setUserToRemove] = useState<any>(null)
    const [userToRemoveId, setUserToRemoveId] = useState<any>(null)
    const [editingRole, setEditingRole] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<string>('')

    const { data, isLoading: isLoadingUsers, error } = useFetchAllUsers()
    const { data: invites, isLoading: isLoadingInvites } = useFetchAllInvites()
    const { mutate: updateRole, isPending: isUpdatingRole } = useEditUserRole()
    const { mutate: sendInvite, isPending: isSendingInvite } = useInviteUser()
    const { mutate: deleteInvite, isPending: isDeletingInvite } = useDeleteInvite()
    const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser()


    const roles = [
        { name: 'Owner', description: 'Full access to all features and settings' },
        { name: 'Manager', description: 'Can manage properties and users' },
        { name: 'Agent', description: 'Can manage assigned properties' },
        { name: 'Viewer', description: 'Read-only access to reports' },
    ]

    function getInitials(name: string) {
        if (!name) return ''
        const namesArray = name.split(' ')
        const initials = namesArray.map((n) => n[0]?.toUpperCase()).join('')
        return initials.slice(0, 2)
    }

    const openInviteModal = () => setIsInviteModalOpen(true)
    const closeInviteModal = () => setIsInviteModalOpen(false)

    const openRemoveModal = (user: any) => {
        setUserToRemove(user)
        setUserToRemoveId(user.id)
        setIsRemoveModalOpen(true)
    }

    const closeRemoveModal = () => {
        setUserToRemove(null)
        setIsRemoveModalOpen(false)
    }

    const handleInviteUser = (formData: any) => {
        console.log('Inviting user:', formData)
        // Add your invite logic here
        sendInvite(formData)
        closeInviteModal()
    }

    const handleRemoveUser = () => {
        closeRemoveModal()
        deleteUser(userToRemoveId)
    }

    const startRoleEdit = (userId: string, currentRole: string) => {
        setEditingRole(userId)
        setSelectedRole(currentRole)
    }

    const cancelRoleEdit = () => {
        setEditingRole(null)
        setSelectedRole('')
    }

    const saveRoleChange = (userId: string) => {
        updateRole({ userId, data: { role: selectedRole } })
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

                    {isLoadingUsers ?
                        <Spinner />
                        :
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Users List */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-200">
                                        <h2 className="font-medium text-gray-900">Team Members</h2>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {data?.map((user: any) => (
                                            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                {/* Main Row - User Info and Role */}
                                                <div className="flex items-start justify-between">
                                                    {/* Left side - User info */}
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                                            {getInitials(user.firstName + ' ' + user.lastName)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{user.firstName + ' ' + user.lastName}</p>
                                                            <p className="text-gray-600 text-xs">{user.email}</p>
                                                        </div>
                                                    </div>

                                                    {/* Right side - Role (always right-aligned) */}
                                                    <div className="flex flex-col items-end">
                                                        {editingRole === user.id ? (
                                                            /* Edit Mode - Dropdown and buttons */
                                                            <div className="flex flex-col items-end space-y-2 text-black">
                                                                <select
                                                                    value={selectedRole}
                                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                                    className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#876D4A] w-40"
                                                                    disabled={isUpdatingRole}
                                                                >
                                                                    {roles.map((role) => (
                                                                        <option key={role.name} value={role.name}>{role.name}</option>
                                                                    ))}
                                                                </select>

                                                                {isUpdatingRole ?
                                                                    <Spinner />
                                                                    :
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => saveRoleChange(user.id)}
                                                                            disabled={isUpdatingRole || selectedRole === user.role}
                                                                            className="cursor-pointer text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={cancelRoleEdit}
                                                                            disabled={isUpdatingRole}
                                                                            className="cursor-pointer text-gray-600 hover:text-gray-800 text-xs disabled:opacity-50 px-2 py-1"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                }
                                                            </div>
                                                        ) : (
                                                            /* View Mode - Role and Edit Pencil (right-aligned) */
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-medium text-gray-900 text-sm">{user.role}</p>
                                                                <button
                                                                    onClick={() => startRoleEdit(user.id, user.role)}
                                                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100"
                                                                    title="Edit role"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Last Login - Always below role */}
                                                        <div className="flex items-center space-x-1 mt-1">
                                                            <span className="text-gray-400 text-[10px]">Last login:</span>
                                                            <p className="text-gray-500 text-[10px]">
                                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-Gb', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                }) : 'Never'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons - Separated below */}
                                                <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-100">
                                                    <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-xs font-medium">
                                                        Edit Profile
                                                    </button>
                                                    {user.status === 'Invited' && (
                                                        <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-xs font-medium">
                                                            Resend Invite
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openRemoveModal(user)}
                                                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer text-xs font-medium ml-auto"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {invites?.length > 0 ?
                                    isLoadingInvites ?
                                        <Spinner /> :
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
                                            <div className="p-4 border-b border-gray-200">
                                                <h2 className="font-medium text-gray-900">Invites</h2>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {invites?.invites?.map((user: any) => (
                                                    <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                        {/* Main Row - User Info and Role */}
                                                        <div className="flex items-start justify-between">
                                                            {/* Left side - User info */}
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                                                    {getInitials(user.email)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900 text-sm">{user.email}</p>
                                                                </div>
                                                            </div>

                                                            {/* Right side - Role (always right-aligned) */}
                                                            <div className="flex flex-col items-end">

                                                                {/* Last Login - Always below role */}
                                                                <div className="flex items-center space-x-1 mt-1">
                                                                    <span className="text-gray-400 text-[10px]">Invitation Sent:</span>
                                                                    <p className="text-gray-500 text-[10px]">
                                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-Gb', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) : 'Never'}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center space-x-1 mt-1">
                                                                    <span className="text-gray-400 text-[10px]">Invitation Expires:</span>
                                                                    <p className="text-gray-500 text-[10px]">
                                                                        {user.expiresAt ? new Date(user.expiresAt).toLocaleDateString('en-Gb', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) : 'Never'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons - Separated below */}
                                                        <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-100">
                                                            <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-xs font-medium">
                                                                Resend Invite
                                                            </button>
                                                            <button
                                                                onClick={() => openRemoveModal(user)}
                                                                className="text-red-600 hover:text-red-800 transition-colors cursor-pointer text-xs font-medium ml-auto"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    :
                                    null}
                            </div>

                            {/* Roles & Permissions Sidebar - unchanged */}
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
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                    <h2 className="font-medium text-gray-900 mb-3">Team Overview</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-xs">Total Users</span>
                                            <span className="font-medium text-gray-900 text-sm">{data?.length + invites?.invites.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-xs">Active</span>
                                            <span className="font-medium text-green-600 text-sm">
                                                {data?.length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-xs">Pending</span>
                                            <span className="font-medium text-yellow-600 text-sm">
                                                {invites?.invites.length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-xs">Seats Used</span>
                                            <span className="font-medium text-gray-900 text-sm">{data?.length}/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    }


                </div>
            </div>

            {/* Invite User Modal - unchanged */}
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
                                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#876D4A] focus:border-transparent text-sm cursor-pointer"
                                    >
                                        <option value="">Select a role</option>
                                        {roles.map((role) => (
                                            <option key={role.name} value={role.name} className='cursor-pointer'>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {isSendingInvite ?
                                    <Spinner />
                                    :

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeInviteModal}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium "
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-[#876D4A] text-white rounded-2xl hover:bg-[#756045] transition-colors text-sm font-medium cursor-pointer"
                                        >
                                            Send Invite
                                        </button>
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove User Modal - unchanged */}
            {isRemoveModalOpen && userToRemove && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-serif text-gray-900 mb-2">Remove User</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to remove <strong>{userToRemove.firstName} {userToRemove.lastName}</strong> from your team? This action cannot be undone.
                            </p>

                            {isDeletingInvite ?
                                <Spinner />
                                :

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
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}