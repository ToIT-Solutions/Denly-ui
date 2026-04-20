// app/changelog/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import { useState } from 'react'
import logo from '@/public/img/logo.png'
import Footer from '@/components/Footer'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchPublicChangelogs } from '@/hooks/useChangelog'
import Spinner from '@/components/Spinner'



interface ChangelogEntry {
    id: string
    version: string
    title: string
    content: string
    releaseType: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
}

function getTypeColor(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return 'bg-green-100 text-green-800'
        case 'bugfix': return 'bg-red-100 text-red-800'
        case 'improvement': return 'bg-blue-100 text-blue-800'
        case 'security': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

function getTypeIcon(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return '✨'
        case 'bugfix': return '🐛'
        case 'improvement': return '⚡'
        case 'security': return '🔒'
        default: return '📝'
    }
}

function getTypeText(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return 'New Feature'
        case 'bugfix': return 'Bug Fix'
        case 'improvement': return 'Improvement'
        case 'security': return 'Security'
        default: return 'Update'
    }
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Markdown components configuration
const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-800 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
    li: ({ children }) => <li className="text-gray-600 text-sm">{children}</li>,
    p: ({ children }) => <p className="text-gray-600 text-sm mb-3 leading-relaxed">{children}</p>,
    code: ({ children, className }) => {
        const isInline = !className
        if (isInline) {
            return <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-700 text-xs">{children}</code>
        }
        return <code className="block bg-gray-100 p-3 rounded-lg text-amber-700 text-xs overflow-x-auto">{children}</code>
    },
    pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">{children}</pre>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-700 pl-4 italic text-gray-500">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} className="text-amber-700 hover:text-amber-800 underline">{children}</a>,
    strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
    table: ({ children }) => (
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200">
                {children}
            </table>
        </div>
    ),
    th: ({ children }) => <th className="border border-gray-200 px-3 py-2 text-left text-gray-800 bg-gray-50">{children}</th>,
    td: ({ children }) => <td className="border border-gray-200 px-3 py-2 text-gray-600">{children}</td>,
}

export default function ChangelogPage() {
    const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | null>(null)
    usePageTitle('Release Notes - Denly')

    // Filter only published entries and sort by date (newest first)
    // const publishedEntries: ChangelogEntry[] = entries
    //     .filter(entry => entry.isPublished)
    //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const { data: changelogs, isLoading, error } = useFetchPublicChangelogs()

    return (
        <div className="relative min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-4 sm:py-6">
                <div className="flex items-center justify-between flex-wrap">
                    <Link href="/" className="shrink-0">
                        <Image src={logo} alt="denly Logo" className="w-24 sm:w-28" />
                    </Link>
                    <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 items-center">
                        <Link href="/features" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Pricing</Link>
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-12 text-center">
                <h1 className="text-4xl sm:text-5xl font-serif text-gray-800 mb-4">
                    Release Notes
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    All the latest updates, improvements, and fixes to Denly.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Constantly improving</span>
                </div>
            </section>

            {/* Changelog Content - Two Column Layout on Desktop */}
            {isLoading ?
                <Spinner />
                :
                <div>
                    <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar - List of versions */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                                    <div className="p-4 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-800">Releases</h2>
                                        <p className="text-sm text-gray-500 mt-1">Select a version to view details</p>
                                    </div>
                                    <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {changelogs?.map((entry: any) => (
                                            <button
                                                key={entry.id}
                                                onClick={() => setSelectedEntry(entry)}
                                                className={`w-full cursor-pointer text-left p-4 transition-colors hover:bg-gray-50 ${selectedEntry?.id === entry.id ? 'bg-amber-50 border-l-4 border-l-[#876D4A]' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono font-bold text-gray-900">
                                                        v{entry.version}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(entry.releaseType)}`}>
                                                        {getTypeText(entry.releaseType)}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium text-gray-800 text-sm mb-1">
                                                    {entry.title}
                                                </h3>
                                                <time className="text-xs text-gray-400">
                                                    {formatDate(entry.createdAt)}
                                                </time>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content - Release Details */}
                            <div className="lg:col-span-3">
                                {selectedEntry ? (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        {/* Header Section */}
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedEntry.releaseType)}`}>
                                                        <span>{getTypeIcon(selectedEntry.releaseType)}</span>
                                                        <span>{getTypeText(selectedEntry.releaseType)}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                                        <span>●</span>
                                                        <span>Published</span>
                                                    </span>
                                                </div>
                                                <time className="text-sm text-gray-500">{formatDate(selectedEntry.createdAt)}</time>
                                            </div>

                                            <h2 className="text-2xl  font-bold text-gray-800 mb-1 mt-4">
                                                v{selectedEntry.version}: {selectedEntry.title}
                                            </h2>

                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span>📦</span>
                                                    <span>Version {selectedEntry.version}</span>
                                                </div>
                                                {/* <div className="flex items-center gap-1">
                                            <span>🆔</span>
                                            <span>ID: #{selectedEntry.id.slice(0, 8)}</span>
                                        </div> */}
                                            </div>
                                        </div>

                                        {/* Content Section with Markdown */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Release Notes:</h3>
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={markdownComponents}
                                                >
                                                    {selectedEntry.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                        {/* Meta Information */}
                                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Release Date:</span>
                                                    <p className="text-gray-800 mt-1 font-medium">{formatDate(selectedEntry.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Last Updated:</span>
                                                    <p className="text-gray-800 mt-1 font-medium">{formatDate(selectedEntry.updatedAt)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Release Type:</span>
                                                    <p className="text-gray-800 mt-1 font-medium capitalize">{selectedEntry.releaseType}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Version Code:</span>
                                                    <p className="text-gray-800 mt-1 font-mono">v{selectedEntry.version}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                                        <div className="text-6xl mb-4">📋</div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Release</h3>
                                        <p className="text-gray-500 text-sm">
                                            Choose a version from the list to view its release notes and details.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </section>

                    <Footer />

                </div>
            }
        </div>
    )
}