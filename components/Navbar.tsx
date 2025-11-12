// components/Navbar.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/public/img/logo.png'
import Image from 'next/image'

export default function Navbar() {
    const pathname = usePathname()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigation = [
        // { name: 'Dashboard', href: '/company/dashboard' },
        { name: 'Properties', href: '/company/dashboard/properties' },
        { name: 'Tenants', href: '/company/dashboard/tenants' },
        { name: 'Payments', href: '/company/dashboard/payments' },
        { name: 'Reports', href: '/company/dashboard/reports' },
    ]

    const isActive = (href: string) => {
        return pathname === href
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 z-50">
            <div className="flex items-center justify-between">
                {/* Logo & Mobile Menu Button */}
                <div className="flex items-center space-x-4 lg:space-x-16">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/company/dashboard" className="flex items-center space-x-3 cursor-pointer">
                        <Image src={logo} alt='denly Logo' className='w-23' />
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
                    <div className="hidden lg:flex items-center space-x-3">
                        <Link href="/company/dashboard/payments/new">
                            <button className="bg-[#876D4A] text-white px-4 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                Record Payment
                            </button>
                        </Link>

                        <Link href="/company/dashboard/properties/add">
                            <button className="border border-[#876D4A] text-[#876D4A] px-4 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                Add Property
                            </button>
                        </Link>

                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex lg:hidden items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center space-x-2 lg:space-x-3 cursor-pointer focus:outline-none"
                        >
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#876D4A] rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-medium">
                                AJ
                            </div>
                            {/* Hide user info on mobile */}
                            {/* <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                                <p className="text-xs text-gray-600">Property Manager</p>
                            </div> */}
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 border-b pb-2 pt-2">
                                    <p className="text-sm font-medium text-black">Alex Johnson</p>
                                    <p className="text-xs text-gray-500">Property Manager</p>
                                </div>

                                <Link
                                    href="/company/dashboard/subscription/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    Profile Settings
                                </Link>
                                <Link
                                    href="/company/dashboard/subscription/company"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    Company Settings
                                </Link>
                                <Link
                                    href="/company/dashboard/subscription/user-management"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    User Management
                                </Link>
                                <Link
                                    href="/company/dashboard/subscription/billing"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    Billing & Subscription
                                </Link>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                    onClick={() => {
                                        /* Handle logout */
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
                    {/* Mobile Navigation */}
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

                    {/* Mobile Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                        <Link href="/company/dashboard/properties/add">
                            <button className="bg-[#876D4A] text-white px-4 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                Record Payment
                            </button>
                        </Link>

                        <Link href="/company/dashboard/properties/add">
                            <button className="border border-[#876D4A] text-[#876D4A] px-4 py-3 rounded-lg hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                Add Property
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}