'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import logoWhite from '@/public/img/logoWhite.png'
import toit from '@/public/img/toit.png'
import { useFetchPublicChangelogs } from '@/hooks/useChangelog'

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

// Markdown components configuration (matching the changelog page)
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

export default function Footer() {
    const [selectedVersion, setSelectedVersion] = useState<ChangelogEntry | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data } = useFetchPublicChangelogs()
    const latestVersion = data?.[0]

    const openModal = () => {
        if (latestVersion) {
            setSelectedVersion(latestVersion)
            setIsModalOpen(true)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedVersion(null)
    }

    return (
        <>
            <footer className="relative z-10 bg-[#1A1714] py-12 text-white">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Main Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Brand */}
                        <div className="col-span-2 lg:col-span-1">
                            <Link href={'/'} className="flex items-center space-x-3 mb-4">
                                <Image src={logoWhite} alt='denly Logo' className='w-24 sm:w-28' />
                            </Link>
                            <p className="text-gray-300 text-sm max-w-xs">
                                Simple, effective property management.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/features" className="text-gray-300 hover:text-[#876D4A] transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-gray-300 hover:text-[#876D4A] transition-colors">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/contact" className="text-gray-300 hover:text-[#876D4A] transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-gray-300 hover:text-[#876D4A] transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-gray-300 hover:text-[#876D4A] transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                        <p className="text-gray-400 text-sm">
                            <div className='flex'>
                                <p>© {new Date().getFullYear()} Denly. a product of</p>
                                <Link href={'https://toitsolutions.co.zw'} target='_blank'>
                                    <Image src={toit} alt='Toit Logo' className='ml-1 w-10 ' style={{ marginTop: '-15px' }} />
                                </Link>
                            </div>
                            <p> All rights reserved.</p>
                        </p>

                        <div className="flex flex-wrap justify-center sm:justify-end gap-4 items-center">
                            {latestVersion ? (
                                <>
                                    <button
                                        onClick={openModal}
                                        className="text-gray-400 hover:text-[#876D4A] transition-colors text-sm cursor-pointer hover:underline"
                                    >
                                        Version: {latestVersion.version}
                                    </button>
                                    {/* <span className="text-gray-600">|</span> */}
                                    {/* <Link
                                        href="/changelog"
                                        className="text-gray-400 hover:text-[#876D4A] transition-colors text-sm hover:underline"
                                    >
                                        View all release notes →
                                    </Link> */}
                                </>
                            ) : (
                                <span className="text-gray-500 text-sm"></span>
                            )}
                        </div>
                    </div>

                </div>
            </footer>

            {/* Modal - Full Release Notes */}
            {isModalOpen && selectedVersion && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedVersion.releaseType)}`}>
                                        <span>{getTypeIcon(selectedVersion.releaseType)}</span>
                                        <span>{getTypeText(selectedVersion.releaseType)}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                        <span>●</span>
                                        <span>Published</span>
                                    </span>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-800">
                                    v{selectedVersion.version}: {selectedVersion.title}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Released on {formatDate(selectedVersion.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Full Markdown Rendering */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="bg-gray-50 rounded-lg px-6 py-1">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {selectedVersion.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Close
                            </button>
                            <Link
                                href="/changelog"
                                onClick={closeModal}
                                className="px-4 py-2 bg-[#876D4A] text-white rounded-lg hover:bg-[#756045] transition-colors text-sm"
                            >
                                View All Release Notes →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}