// components/SplashScreen.tsx
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/img/logo.png';
import logoWhite from '@/public/img/logoWhite.png'; // Import white logo for dark mode
import { BlockAdminSpinner, BlockSpinner } from './Spinner';

export default function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [showSpinner, setShowSpinner] = useState(false);
    const pathname = usePathname();

    // Check if the path contains 'secret-panel'
    const isSecretPanel = pathname?.includes('secret-panel-88') ?? false;

    useEffect(() => {
        // Hide splash after 1.9 seconds
        const hideTimer = setTimeout(() => setVisible(false), 1900);
        const spinnerTimer = setTimeout(() => setShowSpinner(true), 400);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(spinnerTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center z-100 transition-colors duration-300 ${isSecretPanel ? 'bg-slate-950' : 'bg-white'
                }`}
        >
            <Image
                alt="Denly logo"
                src={isSecretPanel ? logoWhite : logo}
                className="w-68 h-28 mb-6 animate-fadeIn"
                priority
            />
            {showSpinner && (
                isSecretPanel ?
                    <div className="animate-fadeIn">
                        <BlockAdminSpinner size='lg' />
                    </div>
                    :
                    <div className="animate-fadeIn">
                        <BlockSpinner size='lg' />
                    </div>
            )}
        </div>
    );
}