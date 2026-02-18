// components/Navbar.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import logo from '@/public/img/logo.png'
import { CAN_INTERACT, CAN_VIEW_LOGS, CAN_VIEW_REPORTS } from '@/lib/roles'

export default function Navbar() {
    const pathname = usePathname()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const user = useAuthStore((state) => state.user)
    const userRole = user?.role
    // console.log(user)
    const clearUser = useAuthStore((state) => state.clearUser)
    const router = useRouter()

    const navigation = [
        { name: 'Properties', href: `/dashboard/properties` },
        { name: 'Tenants', href: `/dashboard/tenants` },
        { name: 'Payments', href: `/dashboard/payments` },
        { name: 'Reports', href: `/dashboard/reports` },
    ]

    const isActive = (href: string) => pathname === href

    function getInitials(name: string) {
        if (!name) return ''
        const namesArray = name.split(' ')
        const initials = namesArray.map((n) => n[0]?.toUpperCase()).join('')
        return initials.slice(0, 2)
    }

    const handleLogout = () => {
        clearUser()
        setIsLogoutModalOpen(false)
        router.push('/auth/login') // redirect after logout
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 z-50">
                <div className="flex items-center justify-between">
                    {/* Logo & Mobile Menu Button */}
                    <div className="flex items-center space-x-4 lg:space-x-16">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href={`/dashboard`} className="flex items-center space-x-3 cursor-pointer">
                            <Image src={logo} alt="denly Logo" className="w-23" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors cursor-pointer text-sm ${isActive(item.href)
                                    ? 'text-[#876D4A] border-b-2 border-[#876D4A] pb-1'
                                    : 'text-gray-600 hover:text-[#876D4A]'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* User & Actions */}
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        {/* Quick Action Buttons - Hidden on mobile */}

                        {CAN_INTERACT.includes(userRole) ?
                            <div className="hidden lg:flex items-center space-x-3">
                                <Link href={`/dashboard/payments/new`}>
                                    <button className="bg-[#876D4A] text-white px-4 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                        Record Payment
                                    </button>
                                </Link>

                                <Link href={`/dashboard/properties/add`}>
                                    <button className="border border-[#876D4A] text-[#876D4A] px-4 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                        Add Property
                                    </button>
                                </Link>
                            </div>
                            :
                            null}

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer focus:outline-none"
                            >
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-medium">
                                    {getInitials(user?.firstName + ' ' + user?.lastName)}
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 border-b pb-2 pt-2">
                                        <p className="text-sm font-medium text-black">
                                            {user?.firstName + ' ' + user?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.role}</p>
                                    </div>

                                    <Link
                                        href={`/dashboard/subscription/profile`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Profile Settings
                                    </Link>
                                    <Link
                                        href={`/dashboard/subscription/company`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Company Settings
                                    </Link>
                                    <Link
                                        href={`/dashboard/subscription/user-management`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        User Management
                                    </Link>
                                    <Link
                                        href={`/dashboard/subscription/billing`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Billing & Subscription
                                    </Link>

                                    {CAN_VIEW_LOGS.includes(userRole) ?
                                        <Link
                                            href={`/dashboard/subscription/logs`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Logs Activity
                                        </Link>
                                        :
                                        null}

                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                        onClick={() => {
                                            setIsLogoutModalOpen(true)
                                            setIsUserMenuOpen(false)
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm ${isActive(item.href)
                                        ? 'bg-[#876D4A] text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                            <Link href={`/dashboard/payments/new`}>
                                <button className="bg-[#876D4A] text-white px-4 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                    Record Payment
                                </button>
                            </Link>

                            <Link href={`/dashboard/properties/add`}>
                                <button className="border border-[#876D4A] text-[#876D4A] px-4 py-3 rounded-lg hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                    Add Property
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-serif text-gray-900 mb-2">Log out of account</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to logout??
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
