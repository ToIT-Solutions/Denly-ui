'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from 'sonner'
import NextNProgress from 'nextjs-progressbar'

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

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
