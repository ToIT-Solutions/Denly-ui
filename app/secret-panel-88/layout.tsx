// secret-panel-88/layout.tsx
'use client'
import Sidebar from './components/Sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const router = useRouter()
    const token = useAuthStore(state => state.token)
    const user = useAuthStore(state => state.user)
    const [hydrated, setHydrated] = useState(false)
    const allowed = Boolean(token && ['Admin', 'Super_Admin'].includes(user?.role))

    // Don't show sidebar on login page
    const isLoginPage = pathname === '/secret-panel-88/login'

    // Wait for stored authentication, then protect every existing admin page consistently.
    useEffect(() => {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
        setHydrated(useAuthStore.persist.hasHydrated())
        return unsubscribe
    }, [])
    useEffect(() => {
        if (hydrated && !isLoginPage && !allowed) router.replace('/secret-panel-88/login')
    }, [hydrated, isLoginPage, allowed, router])

    if (isLoginPage) {
        return <>{children}</>
    }
    if (!hydrated || !allowed) return null

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
