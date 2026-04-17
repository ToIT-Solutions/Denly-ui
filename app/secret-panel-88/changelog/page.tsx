// app/admin/changelog/page.jsx
'use client'
import { useFetchChangelogs } from '@/hooks/admin/useAdminChangelog'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/lib/dateFormatter'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChangelogPage() {
    usePageTitle('Changelog - Admin')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    // Mock changelog data - replace with API calls
    const [changelogs, setChangelogs] = useState([
        {
            id: 1,
            version: '2.1.0',
            date: '2024-01-15',
            title: 'Advanced Analytics Dashboard',
            changes: 'Added real-time analytics dashboard with property performance metrics\nImproved payment processing speed\nFixed mobile responsiveness issues',
            type: 'feature'
        },
        {
            id: 2,
            version: '2.0.5',
            date: '2024-01-10',
            title: 'Bug Fixes & Performance',
            changes: 'Fixed login issues on Safari\nImproved dashboard load times\nResolved payment gateway timeout errors',
            type: 'bugfix'
        },
        {
            id: 3,
            version: '2.0.0',
            date: '2024-01-01',
            title: 'Major Release - Tenant Management',
            changes: 'Complete tenant management system\nAutomated rent collection\nDocument storage for leases\nMobile app beta release',
            type: 'feature'
        }
    ])

    const { data, isLoading } = useFetchChangelogs()
    //console.log(data)

    const router = useRouter()

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature': return 'bg-green-900/50 text-green-400'
            case 'bugfix': return 'bg-red-900/50 text-red-400'
            case 'improvement': return 'bg-blue-900/50 text-blue-400'
            case 'security': return 'bg-yellow-900/50 text-yellow-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Changelog Manager</h1>
                    <p className="text-sm text-slate-400 mt-1">Track and manage version updates</p>
                </div>
                <Link
                    href={'/secret-panel-88/changelog/new'}
                    // onClick={() => router.push('/secret-panel-88/changelog/new')}
                    className="bg-amber-700 hover:bg-amber-950 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    New Release
                </Link>
            </div>


            {/* Changelogs List */}
            <div className="space-y-4">
                {data?.map((changelog: any) => (
                    <div key={changelog.id} onClick={() => router.push(`/secret-panel-88/changelog/${changelog.id}`)} className="bg-slate-900 rounded-lg border border-slate-800 p-6 hover:border-white hover:cursor-pointer transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getTypeColor(changelog.releaseType)}`}>
                                    {changelog.releaseType.charAt(0).toUpperCase() + changelog.releaseType.slice(1)}
                                </span>
                                <span className="text-lg font-semibold text-white">v{changelog.version}</span>
                                <span className="text-sm text-slate-400">{formatDate(changelog.createdAt)}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="text-slate-400 hover:text-amber-700 cursor-pointer transition-colors text-sm"
                                >
                                    Edit
                                </button>
                                {/* <button
                                    className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors text-sm"
                                >
                                    Delete
                                </button> */}
                            </div>
                        </div>
                        <h2 className="text-base font-medium text-white mb-2">{changelog.title}</h2>

                        <article className="markdown-body" style={{
                            all: 'initial',
                            display: 'block',
                            fontFamily: 'inherit',
                            color: 'inherit'
                        }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {changelog.content.slice(0, 200) + "..."}
                            </ReactMarkdown>
                        </article>
                    </div>
                ))}
            </div>
        </div>
    )
}