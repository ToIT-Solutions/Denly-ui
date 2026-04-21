// secret-panel-88/components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

interface NavItem {
    href: string
    label: string
    icon: string
    description?: string
}

interface SidebarProps {
    onCollapseChange?: (isCollapsed: boolean) => void
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)

    const user = useAuthStore((state) => state.user)
    // //console.log(user)

    const clearUser = useAuthStore((state) => state.clearUser)
    const router = useRouter()

    const navItems: NavItem[] = [
        { href: '/secret-panel-88/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & stats' },
        { href: '/secret-panel-88/billing', label: 'Billing', icon: '💰', description: 'Revenue & subscriptions' },
        { href: '/secret-panel-88/users', label: 'Users', icon: '👥', description: 'Manage accounts' },
        { href: '/secret-panel-88/changelog', label: 'Changelog', icon: '📝', description: 'Version updates' },
        { href: '/secret-panel-88/user-logs', label: 'User Logs', icon: '📝', description: 'User logs' },
        { href: '/secret-panel-88/admin-logs', label: 'Admin Logs', icon: '📝', description: 'System logs' },
        // { href: '/secret-panel-88/properties', label: 'Properties', icon: '🏢', description: 'Manage listings' },
        // { href: '/secret-panel-88/reports', label: 'Reports', icon: '📈', description: 'Analytics & data' },
        // { href: '/secret-panel-88/settings', label: 'Settings', icon: '⚙️', description: 'System config' },
    ]

    // Load saved state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('adminSidebarCollapsed')
        if (savedState !== null) {
            const collapsed = JSON.parse(savedState)
            setIsCollapsed(collapsed)
            onCollapseChange?.(collapsed)
        }
    }, [onCollapseChange])

    // Check if mobile on mount and on resize
    useEffect(() => {
        const checkMobile = () => {
            const isMobileView = window.innerWidth < 768
            setIsMobile(isMobileView)
            if (isMobileView) {
                setIsCollapsed(true)
                onCollapseChange?.(true)
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [onCollapseChange])

    const toggleSidebar = (): void => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState))
        onCollapseChange?.(newState)
        if (isMobile) {
            setMobileOpen(!mobileOpen)
        }
    }

    const sidebarWidth = isCollapsed ? 'w-15' : 'w-64'
    const sidebarClass = isMobile
        ? `${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30`
        : `fixed left-0 top-0 h-full z-20`

    function getInitials(name: string) {
        if (!name) return ''
        const namesArray = name.split(' ')
        const initials = namesArray.map((n) => n[0]?.toUpperCase()).join('')
        return initials.slice(0, 2)
    }

    const handleLogout = () => {
        clearUser()
        // setIsLogoutModalOpen(false)
        router.push('/auth/login')
    }

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && !mobileOpen && (
                <button
                    onClick={() => setMobileOpen(true)}
                    className="fixed top-4 left-4 z-30 p-2 bg-slate-900 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                    aria-label="Open menu"
                >
                    ☰
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${sidebarClass} ${sidebarWidth} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shadow-xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-xl font-semibold text-white">Denly Admin</h2>
                            <p className="text-xs text-slate-500 mt-1">Management Portal</p>
                        </div>
                    )}
                    {isCollapsed && !isMobile && (
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto">
                            DA
                        </div>
                    )}
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? '→' : '←'}
                        </button>
                    )}
                    {isMobile && mobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setMobileOpen(false)}
                                    className={`block transition-all duration-200 group ${isActive
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-300 hover:bg-amber-800/50'
                                        } rounded-lg`}
                                >
                                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3`}>
                                        <span className="text-xl" aria-hidden="true">{item.icon}</span>
                                        {!isCollapsed && (
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{item.label}</div>
                                                {item.description && (
                                                    <div className="text-xs text-slate-300">{item.description}</div>
                                                )}
                                            </div>
                                        )}
                                        {isCollapsed && !isMobile && item.description && (
                                            <div className="absolute left-20 ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-lg">
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-xs text-slate-50">{item.description}</div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    {/* User Info */}
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {getInitials(user?.firstName + ' ' + user?.lastName)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{user?.firstName + ' ' + user?.lastName}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && !isMobile && (
                        <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {getInitials(user?.firstName + ' ' + user?.lastName)}
                            </div>
                        </div>
                    )}

                    {/* Settings & Logout */}
                    <Link
                        href="/secret-panel-88/settings"
                        onClick={() => isMobile && setMobileOpen(false)}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors`}
                        aria-label={isCollapsed ? 'Settings' : ''}
                    >
                        <span className="text-lg" aria-hidden="true">⚙️</span>
                        {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                    </Link>

                    <div

                        onClick={handleLogout}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} cursor-pointer px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors`}
                        aria-label={isCollapsed ? 'Logout' : ''}
                    >
                        <span className="text-lg" aria-hidden="true">🚪</span>
                        {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                    </div>
                </div>
            </aside>
        </>
    )
}