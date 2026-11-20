'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { clearSessionQueries } from '@/lib/sessionCache';
import { Toaster } from 'sonner'
import NextNProgress from 'nextjs-progressbar'

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    // Clear all company/admin caches for logout, replacement tokens and account changes.
    useEffect(() => {
        const unsubscribe = useAuthStore.subscribe((state, previous) => {
            if (state.token !== previous.token || state.user?.id !== previous.user?.id) clearSessionQueries(queryClient)
        })
        const refreshSession = (event: StorageEvent) => {
            if (event.key === 'auth-storage' || event.key === null) void useAuthStore.persist.rehydrate()
        }
        window.addEventListener('storage', refreshSession)
        return () => {
            unsubscribe()
            window.removeEventListener('storage', refreshSession)
        }
    }, [queryClient])

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="bottom-center" richColors />
            <NextNProgress
                color="#876D4A"
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
                showOnShallow={true}
            />
            {children}
        </QueryClientProvider>
    );
}
