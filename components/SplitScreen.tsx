// components/SplashScreen.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/public/img/logo.png';
import { BlockSpinner } from './Spinner';

export default function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        // Hide splash after 19 seconds
        const hideTimer = setTimeout(() => setVisible(false), 1900);

        const spinnerTimer = setTimeout(() => setShowSpinner(true), 400);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(spinnerTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-100">
            <Image
                alt="Denly logo"
                src={logo}
                className="w-68 h-28 mb-6 animate-fadeIn"
                priority
            />
            {showSpinner && (
                <div className="animate-fadeIn">
                    <BlockSpinner size='lg' />
                </div>
            )}
        </div>
    );
}
