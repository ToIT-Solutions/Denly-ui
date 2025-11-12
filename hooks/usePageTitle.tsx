// hooks/usePageTitle.js
'use client'
import { useEffect } from 'react'

export function usePageTitle(title: any) {
    useEffect(() => {
        if (title) {
            document.title = title
        }
    }, [title])
}