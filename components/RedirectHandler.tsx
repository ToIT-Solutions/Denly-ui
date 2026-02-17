// components/RedirectHandler.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setRedirectFunction } from '@/lib/redirect'

export function RedirectHandler({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        setRedirectFunction(router.push)
    }, [router])

    return <>{children}</>
}