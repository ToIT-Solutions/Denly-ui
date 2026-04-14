// secret-panel-88/layout.tsx
'use client'
import Sidebar from './components/Sidebar'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    // Don't show sidebar on login page
    const isLoginPage = pathname === '/secret-panel-88/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />

            {/* Main content area with dynamic margin based on sidebar state */}
            <main
                className={`transition-all duration-300 min-h-screen ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {children}
            </main>
        </div>
    )
}